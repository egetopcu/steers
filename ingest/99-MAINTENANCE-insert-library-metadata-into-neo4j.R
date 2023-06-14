#' This whole thing is f***ed.
#' 
#' We're scraping together different bits of info, and duct-taping them onto each other. 
#' In this episode, I'll be taking data provided by the library, and since the ingest
#' database was corrupted, and IBM Watson is refusing to let me re-run the scripts, we're
#' attaching the library data to a previous intermediate csv-export.
#' 
#' This script assumes the following:
#'  - a (fresh) Neo4J database generated from a CSV export without tutor information (`39-import-data.cypher`)
#'  - a postgresql database containing tutor information generated from:
#'    - tutor data extracted from a library data dump (`01b-library-data.R`)
#'    - UTwente people API metadata (`06-tutors_people.py`)
#' 
#' Using this data, it attempts to:
#'  - add Tutors to the Neo4J database
#'  - link Tutors to Essays
#'
#' This will also be an opportunity to use a Neo4J database directly in R, using a community 
#' driver.
#' 
#' NOTE: I realise halfway in that we should just create another .csv in the import
#' folder, and re-enable/refactor tutor imports in the import cypher query.
#' Oh well, I'm now doing this.

here::i_am("99-MAINTENANCE-insert-library-metadata-into-neo4j.R")
library(here)
library(tidyverse)
library(neo4r)
library(dotenv) # make secrets from `.env` available
library(RPostgres)

con <- DBI::dbConnect(
  RPostgres::Postgres(),
  host = "localhost",
  dbname = "postgres",
  port = 5432,
  user = "postgres",
  password = Sys.getenv("POSTGRES_PASSWORD")
)

# get data from postgres
tutors <- tbl(con, "tutor")
tutor_essay_links <- tbl(con, "essaytutor")

# neo4r doesn't seem to want to connect?
library(neo2R)
graph <- startGraph(
  "http://localhost:7474",
  username = Sys.getenv("NEO4J_USER"), 
  password = Sys.getenv("NEO4J_PASSWORD"),
  .opts = list(ssl_verifypeer=0),
  importPath = "./db/import/"
)

# create indices
cypher(graph, 'CREATE INDEX FOR (t:Tutor) ON (t.id)')
cypher(graph, 'CREATE FULLTEXT INDEX FOR (t:Tutor) ON EACH [t.name]')

# import tutors (note that this creates a temp file and calls cypher import from queries under the hood)
import_from_df(
  graph, 
  prepCql(
    "MERGE (t:Tutor {id: toInteger(row.id)})",
    "SET t.name = row.name",
    "SET t.surname = row.surname",
    "SET t.prefix = row.prefix",
    "SET t.initials = row.initials",
    "SET t.titles = row.titles",
    "SET t.contact_id = row.contact_id",
    "SET t.mail = row.email"
  ),
  toImport = tutors %>% collect(),
  by = 100
)

import_from_df(
  graph,
  prepCql(
    "MATCH (e:Essay {id: toInteger(row.essay_id)})",
    "MATCH (t:Tutor {id: toInteger(row.tutor_id)})",
    "MERGE (e)-[r:TUTORED_BY]->(t)"
  ),
  toImport = tutor_essay_links %>% collect(),
  by = 500
)



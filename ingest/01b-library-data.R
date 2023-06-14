library(here)
library(tidyverse)
library(readxl)

here::i_am("ingest/01b-library-data.R")

# read in library-supplied data
library <-
  read_excel(
   here("data/BMS_project_STEERS_20230523.xlsx"),
    skip = 2,
    col_types = c(
      "numeric",
      # item id
      "skip",
      # item type
      "text",
      # faculty
      "text",
      # department
      "text",
      # subject (comma separated)
      "text",
      # programme
      "text",
      # keywords (expanded?)
      "text",
      # level
      "text",
      # tutor type
      "text",
      # tutor name
      "text",
      # client country
      "text",
      # client department
      "text",
      # client organization
      "text",
      # client place
      "text",
      # title
      "text",
      # author name
      "text",
      # language
      "text",
      # abstract
      "text"     # pdf url
    )
  )

# we're in the annoying situation that we have already obtained
# meta-data based on the scraped results, and now have to combine
# data from the library.

# Under normal circumstances, library data _should_ probably be our
# primary source, as it includes all data available through scraping
# except, oddly, publication date?
# It also includes more detailed fields covering client country/place,
# department and organization name.
# Library data is also the sole source of supervisor names and affiliations.

# We'll try to do our best to merge the two data sets here.

# split out keywords, supervisors, and clients into separate resources
keywords <- library %>%
  distinct(`Item ID`, Keywords) %>%
  filter(!is.na(Keywords)) %>%
  transmute(essay_id = `Item ID`,
            name = Keywords %>% stringr::str_to_lower())

subjects <- library %>%
  filter(!is.na(Subject)) %>%
  distinct(`Item ID`, Subject) %>%
  transmute(essay_id = `Item ID`,
            name = Subject)

lib_tutors <- library %>%
  filter(`Tutor Type` != "external",!is.na(`Tutor Name`)) %>%
  distinct(`Item ID`, `Tutor Name`) %>%
  transmute(essay_id = `Item ID`,
            name = `Tutor Name`)

clients <- library %>%
  filter(!is.na(`Clients Organization`)) %>%
  select(`Item ID`, starts_with("Clients")) %>%
  distinct() %>%
  rowwise() %>%
  transmute(
    essay_id = `Item ID`,
    name = `Clients Organization`,
    label = glue::glue_collapse(na.omit(
      c(`Clients Organization`, `Clients Place`, `Clients Country`)
    ), sep = ", ")
  ) %>% filter(label %>% stringr::str_detect(","))


# set up ingest DB connection ---------------------------------------------
# make sure the DB is running: `docker compose ps` to check,
# `docker compose up db` to start the postgres db container (neo4j is irrelevant here)
library(dplyr)

con <- DBI::dbConnect(
  RPostgres::Postgres(),
  host = "localhost",
  dbname = "postgres",
  port = 5432,
  user = "postgres",
  password = rstudioapi::askForPassword("local postgres ingest DB password")
)

# # add keywords as topics
# topics <- tbl(con, "topic")
# essay_topic_join <- tbl(con, "essaytopic")
# categories <- tbl(con, "category")
# essay_category_join <- tbl(con, "essaycategory")
essays <- tbl(con, "essay")
essay_ids <- essays %>% pull(id)


# # attach keyword(s) as topics ---------------------------------------------

# # helper function to create a topic if it does not yet exist, and add it to the
# # correct essays
# handle_topic <- function(label, data, method) {
#   topic <- topics %>%
#     filter(name == label) %>%
#     head(1) %>%
#     collect()
  
#   if (topic %>% nrow() == 0) {
#     # create new topic
#     rows_append(topics,
#                 tibble(name = label),
#                 copy = TRUE,
#                 in_place = TRUE)
    
#     # grab newly created row (because it isnt returned?)
#     topic <- topics %>%
#       filter(name == label) %>%
#       head(1) %>%
#       collect()
#   }
  
#   # insert links
#   links = tibble(
#     essay_id = data$essay_id,
#     topic_id = topic$id,
#     method = method
#   ) %>%
#     filter(essay_id %in% essay_ids) # library data includes some outdated versions
  
#   rows_upsert(essay_topic_join,
#               links,
#               by = c("essay_id", "topic_id", "method"),
#               copy = TRUE,
#               in_place = TRUE)
# }


# keywords %>%
#   nest_by(name) %>%
#   rename(label = name) %>%
#   purrr::pwalk(handle_topic, method = "library keywords", .progress = TRUE)



# # attach subject(s) as categories -----------------------------------------

# handle_category <- function(label, data, method) {
#   category <- categories %>%
#     filter(name == label) %>%
#     head(1) %>%
#     collect()
  
#   if (category %>% nrow() == 0) {
#     # create new topic
#     rows_append(categories,
#                 tibble(name = label),
#                 copy = TRUE,
#                 in_place = TRUE)
    
#     # grab newly created row (because it isnt returned?)
#     category <- categories %>%
#       filter(name == label) %>%
#       head(1) %>%
#       collect()
#   }
  
#   # insert links
#   links = tibble(
#     essay_id = data$essay_id,
#     category_id = category$id,
#     method = method
#   ) %>%
#     filter(essay_id %in% essay_ids) # library data includes some outdated versions
  
#   rows_upsert(essay_category_join,
#               links,
#               by = c("essay_id", "category_id", "method"),
#               copy = TRUE,
#               in_place = TRUE)
# }

# subjects %>%
#   nest_by(name) %>%
#   rename(label = name) %>%
#   purrr::pwalk(handle_category, method = "library subjects", .progress = TRUE)


# disambiguate supervisors ------------------------------------------------
title_patterns <-
  c(
    "prof",
    "dr",
    "dra",
    "phd",
    "mr",
    "ir",
    "pdeng",
    "mba",
    "msc",
    "mphil",
    "llm",
    "eng",
    "drs",
    "bsc",
    "ing"
  ) %>%
  paste0("\\b", ., "\\b\\.?", collapse = "|")

prefix_patterns <-
  c("van", "de", "der", "den", "ter", "ten", "von", "le", "la", "san") %>%
  paste0("(\\s|$)", collapse = "|")

remove_patterns <-
  c("/", "researcher", "lecturer", "\\(", "\\)") %>%
  paste(collapse = "|")

extract_pattern <- function(str, pattern, sep = " ") {
  stringr::str_extract_all(str, pattern) %>%
    unlist() %>%
    purrr::map(stringr::str_trim) %>%
    paste0(collapse = sep)
}

normalized_tutors <- lib_tutors %>%
  mutate(
    name = stringr::str_to_lower(name),
    parts = stringr::str_split(name, ", ", simplify = TRUE),
    surname = parts[, 1] %>% stringr::str_to_title(),
    name_and_titles = parts[, 2] %>% 
      stringr::str_replace_all(remove_patterns, " ") %>% 
      stringr::str_squish(),
    titles = stringr::str_extract_all(name_and_titles, title_patterns) %>% 
      purrr::map(stringr::str_remove_all, pattern = "\\.") %>% 
      purrr::map_chr(paste0, ".", collapse = " ") %>%
      stringr::str_replace("^\\.", ""),
    prefixes = stringr::str_extract_all(name_and_titles, prefix_patterns) %>% 
      purrr::map_chr(paste0, collapse = " "),
    initials = name_and_titles %>% 
      stringr::str_remove_all(title_patterns) %>% 
      stringr::str_remove_all(prefix_patterns) %>% 
      stringr::str_squish() %>% 
      stringr::str_extract_all("\\b[a-z]") %>%
      purrr::map_chr(paste0, ".", collapse = "") %>%
      stringr::str_to_upper()
  ) %>%
  transmute(
    essay_id, 
    # original_name = name,
    surname, 
    prefix = prefixes,
    initials,
    titles,
    name=glue::glue("{surname}, {initials} {prefixes}") %>% 
      stringr::str_squish() 
  ) %>%
  filter(stringr::str_length(name) >= 6) %>%
  group_by(name) %>%
  mutate(id = cur_group_id()) %>%
  arrange(name, essay_id %>% desc())

unique_tutors <- normalized_tutors %>%
  summarize(across(-essay_id, first))
tutor_essay_links <- normalized_tutors %>%
  ungroup() %>%
  transmute(
    tutor_id = id,
    essay_id
  )
  

tutors_table <- tbl(con, "tutor")
essay_tutor_join <- tbl(con, "essaytutor")

handle_tutor <- function(id, surname, prefix, initials, titles, name, essay_ids) {
  # cat(id, name, "\n")
  # insert tutor
  rows_upsert(tutors_table, tibble(id, surname, prefix, initials, titles, name), by = c("id"), copy = TRUE, in_place = TRUE)
  # insert tutor-essay links
  # Note that we have manually set tutor_ids, so no need to fetch tutor again
  # rows_append(essay_tutor_join, tibble(essay_id = essay_ids %>% unlist(), tutor_id = id), copy = TRUE, in_place = TRUE)
}

unique_tutors %>%
  # filter(essay_id %in% essay_ids) %>%
  # nest(essay_ids = essay_id) %>%
  # mutate(id = row_number()) %>%
  purrr::pwalk(handle_tutor, .progress = TRUE)

rows_insert(
  essay_tutor_join,
  tutor_essay_links,
  by = c("tutor_id", "essay_id"),
  conflict = "ignore",
  copy = TRUE,
  in_place = TRUE
)

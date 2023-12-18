library(tidyverse)
library(here)
library(readxl)

here::i_am("ingest/07-process_and_export.R")

data_dir = here("ingest/db/import")

# read in 'raw' data
essays = read_csv(here(data_dir, "essay.csv"))
clients = read_csv(here(data_dir, "client.csv"))
topics = read_csv(here(data_dir, "topic.csv"))
categories = read_csv(here(data_dir, "category.csv"))

# group clients that have the same resolved name and give them a new identifier
clients_clean <- clients %>%
  mutate(label = if_else(is.na(url), name, coalesce(label, name))) %>%
  group_by(label) %>%
  fill(google_id, wikidata_id, url, .direction = "downup") %>%
  reframe(
    new_id = cur_group_id(),
    old_id = id,
    google_id = first(google_id),
    wikidata_id = first(wikidata_id),
    url = first(url),
    freq = n()
  )

clients_mapping <- clients_clean %>% distinct(new_id, old_id)
clients_deduplicated <- clients_clean %>%
  distinct(new_id, .keep_all = TRUE) %>%
  transmute(id = new_id,
            name = label,
            google_id,
            wikidata_id,
            url,
            freq)
write_csv(clients_deduplicated, here(data_dir, "client.csv"))


# re-map essay client id's
essays_remapped_clients <- essays %>%
  left_join(clients_mapping,
            by = join_by(client == old_id)) %>%
  mutate(client = new_id,
         new_id = NULL)
write_csv(essays_remapped_clients, here(data_dir, "essay.csv"))

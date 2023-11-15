# Data ingestion "pipeline" for STEERS

This folder contains the assorted scripts that, combined, form the ad-hoc data ingestion pipeline.

Roughly speaking, ingestion happens in the following phases;

  1. Raw data, obtained from...
     1. A library data dump 
     2. Scraping essays.utwente.nl / Atom RSS feed
     3. [OAI2 API](#oai2-api)
     4. [(future) documents API](#future-eprints-replacement)
  2. Global preprocessing
     1. Translate Dutch/German sources to English
  3. Feature extraction
     1. Categories
        1. IBM Watson NLP
        2. OpenAI ChatGPT zero-shot classification
     2. Topics
        1. IBM Watson NLP (topics, entities, concepts)
        2. SpaCy, PyATE, PyTextRank (topics, entities, keyphrases)
        3. OpenAI ChatGPT zero-shot topic extraction
  4. Feature disambiguation/enrichment
     1. Tutors 
        1. UT People API (https://people.utwente.nl/peoplepagesopenapi/)
        2. ((UT research information system (OAI API, https://ris.utwente.nl/ws/api/524/api-docs/documentation/Content/Topics/CT_OAIService.htm)))
     2. Clients
        1. Wikidata
        2. Google Places API
  5. Feature selection
     1. Identify and select high quality features
     2. Dump features in CSV format
  6. Database ingestion
     1. Ingest (new) features into Neo4J database

## Requirements

Overall goals/requirements for the data pipeline; 

 - As much as possible, data ingestion should be automated and continuous, requiring minimal intervention
   - (for now, data will be provided as a JSON file, hopefully in the future this will be replaced with an API)
 - Feature quality should be continuously monitored, with issues immediately flagged to an admin
 - The pipeline should attempt to gracefully recover from network errors, retrying before failing

Feature extraction, disambiguation, and enrichment should be modular;
 
 - the pipeline should be agnostic to the specific implementations of extraction, etc. 
 - for example, the feature extraction step could take a list of functions that implement specific methods, with a common signature (e.g., `extract_topics(abstract_text) -> List(str)`, and similar for the other tasks). 
 - implementation of extraction methods can be left to the supervisor, as this often requires significant domain knowledge. 
 

## Appendices
(these are mostly notes to self...)

### OAI2 API
Er is een OAI2 API met metadata in verschillende formaten, waaronder:
https://essay.utwente.nl/cgi/oai2?verb=ListRecords&metadataPrefix=ut_oai_dc
https://essay.utwente.nl/cgi/oai2?verb=ListRecords&metadataPrefix=nl_didl
https://essay.utwente.nl/cgi/oai2?verb=ListRecords&metadataPrefix=rdf

Het is een XML gebaseerd protocol:
http://www.openarchives.org/OAI/openarchivesprotocol.html
Je ziet het als HTML in je browser vanwege een XSL stylesheet.

### Future EPrints replacement
EPrints gaat vervangen worden, geen idee of er dan nog een API op zal zitten.

Voor vragen over de inhoud van de repository kun je het beste contact opnemen met:
Functioneel beheer L&A (LISA) functioneelbeheer-la@utwente.nl

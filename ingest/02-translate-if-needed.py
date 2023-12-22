""" 
Given new essays, determine the current language of the summary, and if non-English, translate to English.

- open 'clean' essay data
- determine current language of summary [SpaCY/Google Cloud/Watson]
  - store two-letter ISO code for language as `lang`
  - if `en`:
    - copy summary to `summary_en`
  - otherwise
    - translate summary to English [Google Cloud/Watson]
    - store translated summary as `summary_en`
- update essays file/database to include `lang` and `summary_en`
- log results, source languages, number of translations
"""
import os
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from ibm_watson import LanguageTranslatorV3
from neo4j import GraphDatabase

import dotenv
dotenv.load_dotenv()
print(os.getenv("LANGUAGE_TRANSLATOR_IAM_APIKEY")) 
print(os.getenv("LANGUAGE_TRANSLATOR_URL"))

authenticator = IAMAuthenticator(os.environ["LANGUAGE_TRANSLATOR_IAM_APIKEY"])
language_translator = LanguageTranslatorV3(
    version='2023-01-05',
    authenticator=authenticator
)
language_translator.set_service_url(os.environ["LANGUAGE_TRANSLATOR_URL"])

neo4j_uri = "bolt://localhost:7687"
neo4j_user = "neo4j"  
neo4j_password = "password"  
neo4j_driver = GraphDatabase.driver(neo4j_uri, auth=(neo4j_user, neo4j_password))

def fetch_essays():
    essays = []
    with neo4j_driver.session() as session:
        cypher_query = """
        MATCH (e:Essay)
        RETURN e.id AS id, e.creators AS creators, e.date AS date, 
               e.description AS description, e.identifier AS identifier, 
               e.title AS title, e.type AS type
        """
        result = session.run(cypher_query)
        for record in result:
            essays.append({
                'id': record['id'],
                'creators': record['creators'],
                'date': record['date'],
                'description': record['description'],
                'identifier': record['identifier'],
                'title': record['title'],
                'type': record['type']
            })
    return essays

def update_essay_in_neo4j(essay_id, lang, description_en):
    with neo4j_driver.session() as session:
        cypher_query = """
        MATCH (e:Essay {id: $essay_id})
        SET e.lang = $lang, e.description_en = $description_en
        RETURN e
        """
        session.run(cypher_query, essay_id=essay_id, lang=lang, description_en=description_en)

def detect_and_translate(description):
    detected_lang = language_translator.identify(description).get_result()
    lang_code = detected_lang['languages'][0]['language']

    if lang_code != 'en':
        translation = language_translator.translate(
            text=description,
            model_id=f'{lang_code}-en').get_result()
        translated_description = translation['translations'][0]['translation']
    else:
        translated_description = description
    
    return lang_code, translated_description

def process_essays():
    essays = fetch_essays()
    log_info = {'total': 0, 'translations': 0, 'source_languages': set()}

    for essay in essays:
        lang, description_en = detect_and_translate(essay['description'])
        update_essay_in_neo4j(essay['id'], lang, description_en)

        log_info['total'] += 1
        if lang != 'en':
            log_info['translations'] += 1
            log_info['source_languages'].add(lang)

    return log_info

log_results = process_essays()
neo4j_driver.close()
print(log_results)
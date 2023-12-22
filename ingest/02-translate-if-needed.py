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
import dotenv
dotenv.load_dotenv()

import os
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from ibm_watson import LanguageTranslatorV3
from neo4j import GraphDatabase


neo4j_uri = "bolt://localhost:7008"
neo4j_user = ""
neo4j_password = ""

authenticator = IAMAuthenticator(os.environ["LANGUAGE_TRANSLATOR_IAM_APIKEY"])
language_translator = LanguageTranslatorV3(
    version='2023-01-05',
    authenticator=authenticator
)
language_translator.set_service_url(os.environ["LANGUAGE_TRANSLATOR_URL"])

neo4j_driver = GraphDatabase.driver(neo4j_uri, auth=(neo4j_user, neo4j_password))

def update_essay_in_neo4j(essay_id, lang, summary_en):
    with neo4j_driver.session() as session:
        cypher_query = """
        MATCH (e:Essay {id: $essay_id})
        SET e.lang = $lang, e.summary_en = $summary_en
        RETURN e
        """
        session.run(cypher_query, essay_id=essay_id, lang=lang, summary_en=summary_en)

def detect_and_translate(summary):
    detected_lang = language_translator.identify(summary).get_result()
    lang_code = detected_lang['languages'][0]['language']

    if lang_code != 'en':
        translation = language_translator.translate(
            text=summary,
            model_id=f'{lang_code}-en').get_result()
        translated_summary = translation['translations'][0]['translation']
    else:
        translated_summary = summary
    
    return lang_code, translated_summary

def process_essays():
    #essays =
    log_info = {'total': 0, 'translations': 0, 'source_languages': set()}

    for essay in essays:
        lang, summary_en = detect_and_translate(essay['summary'])
        update_essay_in_neo4j(essay['id'], lang, summary_en)

        log_info['total'] += 1
        if lang != 'en':
            log_info['translations'] += 1
            log_info['source_languages'].add(lang)

    return log_info

log_results = process_essays()
neo4j_driver.close()
print(log_results)


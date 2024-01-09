""" 
Using (translated) essay summaries, query the Watson Cloud API to obtain related concepts and entities, to use as topics.

- open essay file/database
- open/create keyword file/database
- open/create essay-keyword file/database
- create Watson API connection object
- for each essay:
    - query Watson for a list of concepts and entities
    - for each concept, entity: 
        - create keyword in keyword file if not exists, with (at least) the following properties:
        (note that multiple keywords with the same text can exists for different sources!)
            - keyword
            - source: "Watson <topic|entity>"        
        - create essay-keyword relation
- store/update keyword and essay-keyword relation files/databases

"""
import dotenv
dotenv.load_dotenv()


from neo4j import GraphDatabase
from ibm_watson import NaturalLanguageUnderstandingV1
from ibm_watson.natural_language_understanding_v1 import Features, ConceptsOptions, EntitiesOptions
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
import os

watson_api_key = os.getenv("WATSON_API_KEY")
watson_url = os.getenv("WATSON_URL")
neo4j_uri = "bolt://localhost:7687"
neo4j_user = "neo4j"
neo4j_password = "password"

authenticator = IAMAuthenticator(watson_api_key)
natural_language_understanding = NaturalLanguageUnderstandingV1(
    version='2023-01-01',
    authenticator=authenticator
)
natural_language_understanding.set_service_url(watson_url)

neo4j_driver = GraphDatabase.driver(neo4j_uri, auth=(neo4j_user, neo4j_password))

def fetch_essays():
    with neo4j_driver.session() as session:
        return session.run("MATCH (e:Essay) RETURN e.identifier AS id, e.description_en AS description")

def add_keyword(tx, keyword, source):
    result = tx.run("MERGE (k:Keyword {keyword: $keyword, source: $source}) RETURN k", keyword=keyword, source=source)
    return result.single()[0]

def create_essay_keyword_relation(tx, essay_id, keyword_node):
    tx.run("MATCH (e:Essay {identifier: $essay_id}), (k:Keyword) "
           "WHERE ID(k) = $keyword_id "
           "MERGE (e)-[:HAS_KEYWORD]->(k)",
           essay_id=essay_id, keyword_id=keyword_node.id)

def query_watson_for_topics(description):
    response = natural_language_understanding.analyze(
        text=description,
        features=Features(
            concepts=ConceptsOptions(limit=3),
            entities=EntitiesOptions(limit=3)
        )).get_result()

    topics = []
    for concept in response['concepts']:
        topics.append(concept['text'])
    for entity in response['entities']:
        topics.append(entity['type'])

    return topics

def process_essays():
    essays = fetch_essays()
    with neo4j_driver.session() as session:
        for essay in essays:
            topics = query_watson_for_topics(essay['description'])
            for topic in topics:
                keyword_node = session.write_transaction(add_keyword, topic, "Watson topic/entity")
                session.write_transaction(create_essay_keyword_relation, essay['id'], keyword_node)

process_essays()
neo4j_driver.close()
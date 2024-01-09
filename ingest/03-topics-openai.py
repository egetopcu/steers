""" 
Using (translated) essay summaries, query the OpenAI API to generate related topics. 

- open essay file/database
- open/create keyword file/database
- open/create essay-keyword file/database
- create OpenAI connection object
- for each essay:
    - query OpenAI for a list of topics
    - if not a well-formed list, repeat
    - for each topic: 
        - create keyword in keyword file if not exists, with (at least) the following properties:
        (note that multiple keywords with the same text can exists for different sources!)
            - keyword
            - source: "OpenAI <model>"        
        - create essay-keyword relation
- store/update keyword and essay-keyword relation files/databases

"""
from dotenv import load_dotenv
load_dotenv(".env")

from neo4j import GraphDatabase
import openai
import os

openai.api_key = os.getenv("OPENAI_API_KEY")
neo4j_uri = "bolt://localhost:7687"
neo4j_user = "neo4j"
neo4j_password = "password"

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

def query_openai_for_topics(description):
    response = openai.Completion.create(
        model="text-davinci-003", 
        prompt=f"List the topics related to this summary: {description}",
        max_tokens=50
    )
    return response.choices[0].text.strip().split('\n') 
def process_essays():
    essays = fetch_essays()
    with neo4j_driver.session() as session:
        for essay in essays:
            topics = query_openai_for_topics(essay['description'])
            for topic in topics:
                keyword_node = session.write_transaction(add_keyword, topic, "OpenAI text-davinci-003")
                session.write_transaction(create_essay_keyword_relation, essay['id'], keyword_node)

process_essays()
neo4j_driver.close()
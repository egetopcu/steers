""" 
Using (translated) essay summaries, query the OpenAI API to generate related categories. 

- open essay file/database
- open/create category file/database
- open/create essay-category file/database
- create OpenAI connection object
- for each essay:
    - query OpenAI for a list of categories
    - if not a well-formed list, repeat
    - for each category: 
        - create category in category file if not exists, with (at least) the following properties:
        (note that multiple categories with the same text can exists for different sources!)
            - category
            - source: "OpenAI <model>"        
        - create essay-category relation
- store/update category and essay-category relation files/databases

"""
from dotenv import load_dotenv
load_dotenv(".env")

import openai
from neo4j import GraphDatabase
import os


openai.api_key = os.getenv("OPENAI_API_KEY")
neo4j_uri = "bolt://localhost:7687"
neo4j_user = "neo4j"
neo4j_password = "password"


neo4j_driver = GraphDatabase.driver(neo4j_uri, auth=(neo4j_user, neo4j_password))

def fetch_essays():
    with neo4j_driver.session() as session:
        return session.run("MATCH (e:Essay) RETURN e.identifier AS id, e.description_en AS description")

def add_category(tx, category, source):
    result = tx.run("MERGE (c:Category {category: $category, source: $source}) RETURN c", category=category, source=source)
    return result.single()[0]

def create_essay_category_relation(tx, essay_id, category_node):
    tx.run("MATCH (e:Essay {identifier: $essay_id}), (c:Category) "
           "WHERE ID(c) = $category_id "
           "MERGE (e)-[:BELONGS_TO_CATEGORY]->(c)",
           essay_id=essay_id, category_id=category_node.id)

def query_openai_for_categories(description):
    response = openai.Completion.create(
        model="text-davinci-003",  
        prompt=f"List the categories related to this summary: {description}",
        max_tokens=50
    )
    return response.choices[0].text.strip().split('\n')  

def process_essays():
    essays = fetch_essays()
    with neo4j_driver.session() as session:
        for essay in essays:
            categories = query_openai_for_categories(essay['description'])
            for category in categories:
                category_node = session.write_transaction(add_category, category, "OpenAI text-davinci-003")
                session.write_transaction(create_essay_category_relation, essay['id'], category_node)

process_essays()
neo4j_driver.close()

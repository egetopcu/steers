""" 
Take any subjects used in the OAI API, and create categories. Use a separate table to track
the many-to-many relations between essays and categories.

- open 'raw' file/database
- open essay file/database
- open/create category file/database
- open/create essay-category file/database
- for each subject in the `raw` data:
    - create category in category file if not exists, with (at least) the following properties:
      (note that multiple categories with the same text can exists for different sources!)
        - category: subject
        - source: "library"        
    - create essay-category relation
- store/update category and essay-category relation files/databases

"""

from neo4j import GraphDatabase
import os

neo4j_uri = "bolt://localhost:7687"
neo4j_user = "neo4j"
neo4j_password = "password"

neo4j_driver = GraphDatabase.driver(neo4j_uri, auth=(neo4j_user, neo4j_password))

def fetch_raw_data():
    with neo4j_driver.session() as session:
        return session.run("MATCH (e:RawEssay) RETURN e.identifier AS id, e.subject AS subject")

def add_category(tx, category):
    result = tx.run("MERGE (c:Category {category: $category, source: 'library'}) RETURN c", category=category)
    return result.single()[0]

def create_essay_category_relation(tx, essay_id, category_node):
    tx.run("MATCH (e:Essay {identifier: $essay_id}), (c:Category) "
           "WHERE ID(c) = $category_id "
           "MERGE (e)-[:BELONGS_TO_CATEGORY]->(c)",
           essay_id=essay_id, category_id=category_node.id)

def process_raw_data():
    raw_data = fetch_raw_data()
    with neo4j_driver.session() as session:
        for record in raw_data:
            category_node = session.write_transaction(add_category, record['subject'])
            session.write_transaction(create_essay_category_relation, record['id'], category_node)

process_raw_data()
neo4j_driver.close()

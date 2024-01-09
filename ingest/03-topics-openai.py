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

import openai
from py2neo import Graph, Node, Relationship
from neo4j import GraphDatabase

openai.api_key = os.getenv("OPENAI_APIKEY")

def query_openai_for_topics(description):
    try:
        response = openai.Completion.create(
            engine="text-davinci-002",
            prompt=f"Generate topics related to the following essay description: {description}",
            max_tokens=50,  
            n=5,
            stop=None,
            temperature=0.7,
        )

        topics = [choice['text'] for choice in response['choices']]
        return topics

    except Exception as e:
        print(f"Error querying OpenAI API: {str(e)}")
        return []

neo4j_uri = "bolt://localhost:7687"
neo4j_user = "neo4j"
neo4j_password = "password"
graph = Graph(neo4j_uri, auth=(neo4j_user, neo4j_password))

cypher_query = """
MATCH (e:Essay)
RETURN e.id AS id, e.description_en AS description_en
"""
result = graph.run(cypher_query)

def create_or_update_keyword_and_relations(essay_data, topics):
    for topic in topics:
        keyword_node = Node("Keyword", keyword=topic, source="OpenAI")

        existing_keyword = graph.nodes.match("Keyword", keyword=topic).first()
        if existing_keyword:
            keyword_node = existing_keyword
        else:
            graph.create(keyword_node)

        relation = Relationship(essay_data['node'], "MENTIONS", keyword_node)
        graph.create(relation)

for record in result:
    essay_data = {'id': record['id'], 'description_en': record['description_en']}
    essay_data['node'] = graph.nodes.match("Essay", id=essay_data['id']).first()

    topics = query_openai_for_topics(essay_data['description_en'])
    
    create_or_update_keyword_and_relations(essay_data, topics)

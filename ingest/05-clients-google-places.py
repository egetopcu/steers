""" 
Attach Google Places API metadata to clients to help identify and disambiguate clients. 

Client/host organization names and locations are provided in an open text field, leading to many similar descriptions for the same clients. Using additional metadata, we can attempt to identify, disambiguate, and/or resolve clients to entities.

- open 'raw' file/database
- open/create client file/database
- create Google Cloud API connection object
- for each client:
    - query Google Places API for the client name and location
    - using the top result, if any, update the client
        - add `google_places_name` field
        - add `google_places_id` field
- store/update category and essay-category relation files/databases

"""
from dotenv import load_dotenv
load_dotenv(".env")

import os
import googlemaps
from neo4j import GraphDatabase

google_api_key = os.getenv("GOOGLE_CLOUD_API_KEY")
neo4j_uri = "bolt://localhost:7687"
neo4j_user = "neo4j"
neo4j_password = "password"

gmaps = googlemaps.Client(key=google_api_key)
neo4j_driver = GraphDatabase.driver(neo4j_uri, auth=(neo4j_user, neo4j_password))

def fetch_clients():
    with neo4j_driver.session() as session:
        return session.run("MATCH (c:Client) RETURN c.identifier AS id, c.name AS name, c.location AS location")

def update_client_with_google_places_data(tx, client_id, places_data):
    tx.run("MATCH (c:Client {identifier: $client_id}) "
           "SET c.google_places_name = $places_name, c.google_places_id = $places_id",
           client_id=client_id, 
           places_name=places_data.get('name'), 
           places_id=places_data.get('place_id'))

def query_google_places(name, location):
    result = gmaps.places(query=f"{name} {location}")
    if result['status'] == 'OK' and result['results']:
        return result['results'][0] 
    return None

def process_clients():
    clients = fetch_clients()
    with neo4j_driver.session() as session:
        for client in clients:
            places_data = query_google_places(client['name'], client['location'])
            if places_data:
                session.write_transaction(update_client_with_google_places_data, client['id'], places_data)

process_clients()
neo4j_driver.close()

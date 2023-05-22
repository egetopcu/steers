from database import *
import requests
import os
from dotenv import load_dotenv
load_dotenv()

api_url_search = "https://maps.googleapis.com/maps/api/place/textsearch/json"
api_url_details = "https://maps.googleapis.com/maps/api/place/details/json"
api_key = os.getenv("GOOGLE_MAPS_APIKEY")

def search_google(client): 
    params = {
        "query": client,
        "key": api_key
    }
    response = requests.get(api_url_search, params=params)
    results = response.json()["results"]

    if not results:
        return None
    
    google_id = results[0]["place_id"]
    params = {
        "place_id": google_id,
        "fields": "name,website",
        "key": api_key
    }
    response = requests.get(api_url_details, params=params)
    details = response.json()["result"]

    return {
        "name": client,
        "label": details.get("name"),
        "url": details.get("website"),
        "google_id": google_id
    }


for index, client in enumerate(Client.select().iterator()):
    if client.google_id:
        continue

    google_result = search_google(client.name)
    
    print(f"[{index}]: {client.name}")
    if google_result:
        client.label = google_result.get("label")
        client.google_id = google_result.get("google_id")
        if google_result["url"]:
            client.url = google_result["url"]
        print(f"  🕵 {google_result.get('label')}, {google_result.get('url')}")

    client.save()

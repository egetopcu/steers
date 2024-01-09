""" 
Fetch new essays from the University of Twente essays OAI API.

- obtain all new essays since a given date
- write 'raw' essays to intermediate file/database
- create file/database for 'clean' essay data, with (at least) these properties:
    - identifier (as used by OAI API)
    - author
    - date of publication
    - title
    - summary
- log results, number of new essays

"""
from sickle import Sickle
import xml.etree.ElementTree as ET
import json
from neo4j import GraphDatabase


from xml.etree import ElementTree as ET

def parse_xml_record(record):
    namespaces = {
        'oai_dc': 'http://www.openarchives.org/OAI/2.0/oai_dc/',
        'dc': 'http://purl.org/dc/elements/1.1/'
    }

    try:
        # Assuming record.raw_xml is the property/method that gives you the raw XML string
        raw_xml = record.raw_xml if hasattr(record, 'raw_xml') else str(record)
        tree = ET.ElementTree(ET.fromstring(raw_xml.encode('utf-8')))
        root = tree.getroot()
        metadata = root.find('.//{http://www.openarchives.org/OAI/2.0/}metadata')

        if metadata is not None:
            dc = metadata.find('.//oai_dc:dc', namespaces)
            if dc is not None:
                data = {
                    'title': dc.findtext('dc:title', namespaces=namespaces),
                    'author': [creator.text for creator in dc.findall('dc:creator', namespaces=namespaces)],
                    'subject': dc.findtext('dc:subject', namespaces=namespaces),
                    'description': dc.findtext('dc:description', namespaces=namespaces),
                    'date': dc.findtext('dc:date', namespaces=namespaces),
                    'type': dc.findtext('dc:type', namespaces=namespaces),
                    'format': dc.findtext('dc:format', namespaces=namespaces),
                    'identifier': dc.findtext('dc:identifier', namespaces=namespaces),
                    'source': dc.findtext('dc:source', namespaces=namespaces),
                    'language': dc.findtext('dc:language', namespaces=namespaces)
                }
                return data

    except ET.ParseError as e:
        print(f"Error parsing XML for record: {e}")
        print(record)
    except Exception as e:
        print(f"Unexpected error: {e}")
        print(record)

    return None


def fetch_new_essays(base_url):
    sickle_client = Sickle(base_url)
    try:
        records = sickle_client.ListRecords(**params)
    except Exception as e:
        print(f"Error fetching records: {e}")
        return []

    essays = []
    for record in records:
        print("Processing record:")
        print(record.raw)
        parsed_data = parse_xml_record(record)
        if parsed_data:
            essays.append(parsed_data)
        else:
            print("Failed to parse record, see raw XML above.")

    return essays

def save_to_neo4j(essays, uri, user, password):
    driver = GraphDatabase.driver(uri, auth=(user, password))

    def add_essay(tx, essay):
        tx.run("CREATE (e:Essay {title: $title, author: $author, subject: $subject, "
               "description: $description, date: $date, type: $type, format: $format, "
               "identifier: $identifier, source: $source, language: $language})",
               title=essay.get('title'),
               author=essay.get('author'),
               subject=essay.get('subject'),
               description=essay.get('description'),
               date=essay.get('date'),
               type=essay.get('type'),
               format=essay.get('format'),
               identifier=essay.get('identifier'),
               source=essay.get('source'),
               language=essay.get('language'))

    with driver.session() as session:
        for essay in essays:
            session.write_transaction(add_essay, essay)

    driver.close()

params = {
    "metadataPrefix": "oai_dc",
    "from": "2023-12-01T00:00:00Z"
}

base_url = 'https://essay.utwente.nl/cgi/oai2'
new_essays = fetch_new_essays(base_url)

# Neo4j connection details
neo4j_uri = "bolt://localhost:7687"
neo4j_user = "neo4j"
neo4j_password = "password"

save_to_neo4j(new_essays, neo4j_uri, neo4j_user, neo4j_password)

print("Essays have been fetched and saved to Neo4j.")
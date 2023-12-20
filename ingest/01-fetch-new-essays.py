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

def parse_xml_record(record):
    namespaces = {'oai_dc': 'http://purl.org/dc/elements/1.1/'}
    try:
        tree = ET.ElementTree(ET.fromstring(record.raw.encode('utf-8')))
        root = tree.getroot()
        metadata = root.find('.//{http://www.openarchives.org/OAI/2.0/}metadata')

        if metadata is not None:
            dc = metadata.find('.//oai_dc:dc', namespaces)
            if dc is not None:
                data = {
                   'title': dc.findtext('oai_dc:title', namespaces=namespaces),
                    'creator': dc.findtext('oai_dc:creator', namespaces=namespaces),
                    'subject': dc.findtext('oai_dc:subject', namespaces=namespaces),
                    'description': dc.findtext('oai_dc:description', namespaces=namespaces),
                    'date': dc.findtext('oai_dc:date', namespaces=namespaces),
                    'type': dc.findtext('oai_dc:type', namespaces=namespaces),
                    'format': dc.findtext('oai_dc:format', namespaces=namespaces),
                    'identifier': dc.findtext('oai_dc:identifier', namespaces=namespaces),
                    'source': dc.findtext('oai_dc:source', namespaces=namespaces),
                    'language': dc.findtext('oai_dc:language', namespaces=namespaces)
                }
                return data
    except ET.ParseError:
        print("Error parsing XML for record:")
        print(record.raw)
    except Exception as e:
        print(f"Unexpected error: {e}")
        print(record.raw)

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

def save_to_json(essays, file_path):
    with open(file_path, 'w') as file:
        json.dump(essays, file, indent=4)

params = {
    "metadataPrefix": "oai_dc",
    # example time, ideally, you’d use the timestamp from the previous API response
    "from": "2023-12-01T00:00:00Z"
}


base_url = 'https://essay.utwente.nl/cgi/oai2'

new_essays = fetch_new_essays(base_url)

save_to_json(new_essays, 'utwente_essays.json')

print("Essays have been fetched and saved.")

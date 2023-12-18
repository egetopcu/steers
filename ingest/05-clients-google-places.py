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

""" 
Attach WikiData metadata to clients to help identify and disambiguate clients. 

Client/host organization names and locations are provided in an open text field, leading to many similar descriptions for the same clients. Using additional metadata, we can attempt to identify, disambiguate, and/or resolve clients to entities.

- open 'raw' file/database
- open/create client file/database
- create WikiData connection object
- for each client:
    - query WikiData for the client name and location
    - using the top result, if any, update the client
        - add `wikidata_name` field
        - add `wikidata_id` field
- store/update category and essay-category relation files/databases

"""

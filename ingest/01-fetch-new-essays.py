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

""" 
Using (translated) essay summaries, query the Watson Cloud API to obtain related concepts and entities, to use as topics.

- open essay file/database
- open/create keyword file/database
- open/create essay-keyword file/database
- create Watson API connection object
- for each essay:
    - query Watson for a list of concepts and entities
    - for each concept, entity: 
        - create keyword in keyword file if not exists, with (at least) the following properties:
        (note that multiple keywords with the same text can exists for different sources!)
            - keyword
            - source: "Watson <topic|entity>"        
        - create essay-keyword relation
- store/update keyword and essay-keyword relation files/databases

"""

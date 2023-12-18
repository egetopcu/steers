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

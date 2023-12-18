""" 
Using (translated) essay summaries, obtain keyphrases (topics) using SpaCY and topicrank. 

(NOTE: I'm not sure this method is useful, leave it for last.)

- open essay file/database
- open/create keyword file/database
- open/create essay-keyword file/database
- create SpaCY/TopicRank pipeline
- for each essay:
    - obtain topics with a rank > X (TODO: determine best threshold X)
    - for each topic: 
        - create keyword in keyword file if not exists, with (at least) the following properties:
        (note that multiple keywords with the same text can exists for different sources!)
            - keyword
            - source: "spacy topicrank"        
        - create essay-keyword relation
- store/update keyword and essay-keyword relation files/databases

"""

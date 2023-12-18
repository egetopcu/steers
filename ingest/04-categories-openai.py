""" 
Using (translated) essay summaries, query the OpenAI API to generate related categories. 

- open essay file/database
- open/create category file/database
- open/create essay-category file/database
- create OpenAI connection object
- for each essay:
    - query OpenAI for a list of categories
    - if not a well-formed list, repeat
    - for each category: 
        - create category in category file if not exists, with (at least) the following properties:
        (note that multiple categories with the same text can exists for different sources!)
            - category
            - source: "OpenAI <model>"        
        - create essay-category relation
- store/update category and essay-category relation files/databases

"""

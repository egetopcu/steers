""" 
Take any keywords used in the OAI API, and create keywords. Use a separate table to track
the many-to-many relations between essays and keywords.

- open 'raw' file/database
- open essay file/database
- open/create keyword file/database
- open/create essay-keyword file/database
- for each keyword in the `raw` data:
    - create keyword in keyword file if not exists, with (at least) the following properties:
      (note that multiple keywords with the same text can exists for different sources!)
        - keyword
        - source: "library"        
    - create essay-keyword relation
- store/update keyword and essay-keyword relation files/databases

"""

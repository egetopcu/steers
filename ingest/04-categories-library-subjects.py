""" 
Take any subjects used in the OAI API, and create categories. Use a separate table to track
the many-to-many relations between essays and categories.

- open 'raw' file/database
- open essay file/database
- open/create category file/database
- open/create essay-category file/database
- for each subject in the `raw` data:
    - create category in category file if not exists, with (at least) the following properties:
      (note that multiple categories with the same text can exists for different sources!)
        - category: subject
        - source: "library"        
    - create essay-category relation
- store/update category and essay-category relation files/databases

"""

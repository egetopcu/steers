""" 
Given new essays, determine the current language of the summary, and if non-English, translate to English.

- open 'clean' essay data
- determine current language of summary [SpaCY/Google Cloud/Watson]
  - store two-letter ISO code for language as `lang`
  - if `en`:
    - copy summary to `summary_en`
  - otherwise
    - translate summary to English [Google Cloud/Watson]
    - store translated summary as `summary_en`
- update essays file/database to include `lang` and `summary_en`
- log results, source languages, number of translations
"""

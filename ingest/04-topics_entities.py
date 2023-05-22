import spacy
from database import *

pipeline = spacy.load("en_core_web_sm")

for essay_index, essay in enumerate(Essay.select().iterator()):
    if essay.language == "xx" or essay.summary_en is None:
        continue

    print(f"[{essay_index + 1}]", essay.title[:120])
    parsed = pipeline(essay.summary_en)

    for index, entity in enumerate(parsed.ents):
        if not entity.label_ in ["PERSON", "NORP", "FAC", "ORG", "GPE", "LOC", "PRODUCT", "EVENT", "LAW"]:
            continue

        topic, _ = Topic.get_or_create(name=entity.text.lower())
        EssayTopic.get_or_create(
            essay=essay,
            topic=topic,
            method="spacy entity",
        )
        print("    ", entity.text, ", ", entity.label_, sep = "")

    print("\n")
        
    
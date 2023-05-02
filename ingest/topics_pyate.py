import spacy
from pyate.term_extraction_pipeline import TermExtractionPipeline
from database import *

pipeline = spacy.load("en_core_web_md")
pipeline.add_pipe("combo_basic")


for essay_index, essay in enumerate(Essay.select().iterator()):
    # if EssayTopic.get_or_none(EssayTopic.essay==essay, EssayTopic.method=="spacy biasedtextrank"):
    #     print(".", end="", flush=True)
    #     continue

    if essay.language == "xx" or essay.summary_en is None:
        print("!", end="", flush=True)
        continue

    print(f"[{essay_index + 1}]", essay.title[:120])
    parsed = pipeline(essay.summary_en.lower())

    for phrase, rank in parsed._.combo_basic.sort_values().head(5).items():
        topic, _ = Topic.get_or_create(name=phrase)
        link, created = EssayTopic.get_or_create(
            essay=essay,
            topic=topic,
            method="spacy combo_basic",
            defaults={'rank': rank}
        )
        print("    ", phrase, "\t+" if created else "")

    print("\n")
        

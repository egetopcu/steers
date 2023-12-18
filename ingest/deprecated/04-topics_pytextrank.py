import spacy
import pytextrank
from database import *

@spacy.registry.misc("articles_scrubber")
def articles_scrubber():
    def scrubber_func(phrase) -> str:
        while len(phrase) and phrase[0].pos_ in ["DET", "PRON"]:
            phrase = phrase[1:]
            
        return phrase
    return scrubber_func

pipeline = spacy.load("en_core_web_md")
pipeline.add_pipe("biasedtextrank", config={"scrubber": {"@misc": "articles_scrubber"}})

for essay_index, essay in enumerate(Essay.select().iterator()):
    # if EssayTopic.get_or_none(EssayTopic.essay==essay, EssayTopic.method=="spacy biasedtextrank"):
    #     print(".", end="", flush=True)
    #     continue

    if essay.language == "xx" or essay.summary_en is None:
        print("!", end="", flush=True)
        continue

    print(f"[{essay_index + 1}]", essay.title[:120])
    parsed = pipeline(essay.summary_en.lower())

    for index, phrase in enumerate(parsed._.phrases[:10]):
        if str(phrase.text) in ["research", "thesis"]:
            continue

        if len(phrase.text) > 4 or len(str(phrase.text)) < 3 or len(str(phrase.text)) > 64:
            continue

        if index >= 5 and phrase.rank < 0.1:
            break

        topic, _ = Topic.get_or_create(name=phrase.text)
        link, created = EssayTopic.get_or_create(
            essay=essay,
            topic=topic,
            method="spacy biasedtextrank",
            defaults={'rank': phrase.rank}
        )
        print("    ", phrase.text, "\t+" if created else "")

    print("\n")
        
    
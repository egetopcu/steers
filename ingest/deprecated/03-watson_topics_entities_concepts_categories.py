import dotenv
dotenv.load_dotenv()

from database import *

import json
import os
from ibm_watson import NaturalLanguageUnderstandingV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from ibm_watson.natural_language_understanding_v1 \
    import Features, KeywordsOptions, EntitiesOptions, ConceptsOptions, CategoriesOptions

authenticator = IAMAuthenticator(os.environ["NATURAL_LANGUAGE_UNDERSTANDING_IAM_APIKEY"])
natural_language_understanding = NaturalLanguageUnderstandingV1(
    version='2022-04-07',
    authenticator=authenticator
)

natural_language_understanding.set_service_url(os.environ["NATURAL_LANGUAGE_UNDERSTANDING_URL"])

for essay_index, essay in enumerate(Essay.select().iterator()):
    if essay.language == "xx" or essay.summary_en is None:
        continue

    if EssayCategory.get_or_none(EssayCategory.essay==essay):
        print(".", end="", flush=True)
        # already scraped
        continue

    print(f"[{essay_index + 1}]", essay.title[:120])
    result = natural_language_understanding.analyze(
        text=essay.summary_en,
        language="en",
        features=Features(
            keywords=KeywordsOptions(limit=10),
            entities=EntitiesOptions(limit=10),
            concepts=ConceptsOptions(limit=10),
            categories=CategoriesOptions(limit=3)
        )).get_result()

    print("  keywords")
    for index, keyphrase in enumerate(result["keywords"]):
        topic, created = Topic.get_or_create(name=keyphrase["text"].lower())
        link, _ = EssayTopic.get_or_create(
            essay=essay,
            topic=topic,
            method="watson keywords",
            defaults={'rank': keyphrase["relevance"]}
        )
        print("  + " if created else "    ", keyphrase["text"], sep = "")
    
    
    print("  entities")
    for index, entity in enumerate(result["entities"]):
        if not entity["type"] in ["Facility", "GeographicFeature", "Hashtag", "Location", "Organization", "Person"]:
            continue 
        
        topic, created = Topic.get_or_create(name=entity["text"].lower())
        link, _ = EssayTopic.get_or_create(
            essay=essay,
            topic=topic,
            method="watson entities",
            defaults={'rank': entity["relevance"] * entity["confidence"]}
        )
        print("  + " if created else "    ", entity["text"], ", ", entity["type"], sep = "")

    print("  concepts")
    for index, concept in enumerate(result["concepts"]):
        topic, created = Topic.get_or_create(name=concept["text"].lower())
        link, _ = EssayTopic.get_or_create(
            essay=essay,
            topic=topic,
            method="watson concepts",
            defaults={'rank': concept["relevance"]}
        )
        print("  + " if created else "    ", concept["text"], sep = "")

    print("  categories")
    for index, category in enumerate(result["categories"]):
        parent = None
        for label in category["label"].strip("/").split("/"):

            categoryRecord, created = Category.get_or_create(name=label, parent=parent)
            parent = categoryRecord

            link, _ = EssayCategory.get_or_create(
                essay=essay,
                category=categoryRecord,
                method="watson categories",
                defaults={'rank': category["score"]}
            )
            
            print("  + " if created else "    ", label, sep = "")

    print("\n")
        
from dotenv import load_dotenv
load_dotenv("credentials.env")

from database import *
import openai
from openai.error import RateLimitError
from types import List
import os
import random
import backoff

openai.api_key = os.getenv("OPENAI_APIKEY")

# prepare topic getter with exponential backoff baked in
@backoff.on_exception(backoff.expo, RateLimitError)
def get_topics(essay: Essay) -> List[str]:
    result = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a topic extraction engine. When you get a message, you will reply with a comma-separated list of up to 8 topics and concepts that are most relevant to that message."},
            {"role": "user", "content": essay.summary_en }
        ]
    )
    return [c.lower().strip(" ,.!?:;") for c in result["choices"][0]["message"]["content"].split(",")]


for essay_index, essay in enumerate(Essay.select().iterator()):
    if essay.language == "xx" or essay.summary_en is None or len(essay.summary_en) < 50:
        continue

    if random.random() > 0.05: # only for a random subset of ~5%
        continue

    print(f"[{essay_index + 1}]", essay.title[:120])

    print("  openai tuned completions:")
    completion_result = openai.Completion.create(
        model="curie:ft-university-of-twente:topics-2023-05-03-12-48-41",
        prompt=essay.summary_en + "\n\n###\n\n",
        stop=[" END"],
        max_tokens=64
    )
    
    topics = completion_result["choices"][0]["text"].split(", ")

    for index, label in enumerate(topics):
        label = label.lower().strip(" .!,?:;")
        
        topic, created = Topic.get_or_create(name=label.lower())
        link, _ = EssayTopic.get_or_create(
            essay=essay,
            topic=topic,
            method="openai curie:ft-university-of-twente:topics-2023-05-03-12-48-41",
        )
        print("  + " if created else "    ", label, sep = "")

    print("  openai chatGPT completions:")
    chat_result = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a topic extraction engine. When you get a message, you will reply with a comma-separated list of topics and concepts that are most relevant to that message."},
            {"role": "user", "content": essay.summary_en }
        ]
    )
    topics = chat_result["choices"][0]["message"]["content"].split(",")
    for index, label in enumerate(topics):
        label = label.lower().strip(" .!,?:;")
        
        topic, created = Topic.get_or_create(name=label)
        link, _ = EssayTopic.get_or_create(
            essay=essay,
            topic=topic,
            method="openai gpt-3.5-turbo",
        )
        print("  + " if created else "    ", label, sep = "")

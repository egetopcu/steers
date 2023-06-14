from database import *
import csv
from peewee import JOIN, fn, Model
from os import path

# output path
out_dir = "db/import"

# write all essays
print("Essays...")
with open(path.join(out_dir, "essay.csv"), "w+", encoding="utf-8") as f:
    writer = csv.DictWriter(f, ["id", "client", "faculty", "programme", "title", "author", "date", "summary_en"])
    writer.writeheader()

    for essay in Essay.select(Essay.id, Essay.client, Essay.faculty, Essay.programme, Essay.title, Essay.author, Essay.date, Essay.summary_en).dicts().iterator():
        writer.writerow(essay)


# write all clients
print("Clients...")    
with open(path.join(out_dir, "client.csv"), "w+", encoding="utf-8") as f:
    writer = csv.DictWriter(f, ["id", "name", "freq", "label", "google_id", "wikidata_id", "url"])
    writer.writeheader()

    for client in (Client
                    .select(Client.id, Client.name, fn.COUNT(Essay.id).alias("freq"), Client.label, Client.google_id, Client.wikidata_id, Client.url)
                    .join(Essay, JOIN.INNER)
                    .group_by(Client.id, Client.name)
                    .dicts()
                    .iterator()):
        writer.writerow(client)

# write all faculties
print("Faculties...")
with open(path.join(out_dir, "faculty.csv"), "w+", encoding="utf-8") as f:
    writer = csv.DictWriter(f, ["id", "name", "freq"])
    writer.writeheader()

    for faculty in (Faculty
                        .select(Faculty.id, Faculty.name, fn.COUNT(Essay.id).alias("freq"))
                        .join(Essay, JOIN.INNER)
                        .group_by(Faculty.id, Faculty.name)
                        .dicts()
                        .iterator()):
        writer.writerow(faculty)

# write all programmes
print("Programmes...")
with open(path.join(out_dir, "programme.csv"), "w+", encoding="utf-8") as f:
    writer = csv.DictWriter(f, ["id", "name", "freq"])
    writer.writeheader()

    for programme in (Programme
                        .select(Programme.id, Programme.name, fn.COUNT(Essay.id).alias("freq"))
                        .join(Essay, JOIN.INNER)
                        .group_by(Programme.id, Programme.name)
                        .dicts()
                        .iterator()):
        writer.writerow(programme)

# write topics for selected method(s)
print("Topics...")
methods = ["spacy topicrank", "watson concepts", "watson entities", "openai gpt-3.5-turbo", "library keywords"]
with open(path.join(out_dir, "topic.csv"), "w+", encoding="utf-8") as f:
    writer = csv.DictWriter(f, ["id", "name", "freq"])
    writer.writeheader()

    count_alias = fn.COUNT(fn.DISTINCT(EssayTopic.essay)).alias("freq")
    inner_query = (Topic
            .select(Topic.id, Topic.name, count_alias)
            .join(EssayTopic, JOIN.INNER)
            .where(EssayTopic.method.in_(methods), (EssayTopic.method != "watson concepts") | (EssayTopic.rank > 0.8))
            .group_by(Topic.id, Topic.name))
    query = (Topic
            .select(inner_query.c.id, inner_query.c.name, inner_query.c.freq)
            .from_(inner_query)
            .where(inner_query.c.freq > 10))

    for topic in query.dicts().iterator():
        writer.writerow(topic)

# write link table for selected methods/topics
print("EssayTopics...")
with open(path.join(out_dir, "essaytopic.csv"), "w+", encoding="utf-8") as f:
    writer = csv.DictWriter(f, ["essay", "topic"])
    writer.writeheader()

    for link in (EssayTopic
                    .select(EssayTopic.essay, EssayTopic.topic)
                    .join(query, JOIN.INNER, on = query.c.id == EssayTopic.topic)
                    .where(EssayTopic.method.in_(methods))
                    .group_by(EssayTopic.essay, EssayTopic.topic)
                    .dicts()
                    .iterator()):
        writer.writerow(link)

# write categories for selected method(s)
print("Categories...")
methods = ["openai gpt-3.5-turbo", "library subjects"]
with open(path.join(out_dir, "category.csv"), "w+", encoding="utf-8") as f:
    writer = csv.DictWriter(f, ["id", "name", "parent", "freq"])
    writer.writeheader()

    freq_alias = fn.COUNT(fn.DISTINCT(EssayCategory.essay)).alias("freq")
    inner_query = (Category
                        .select(Category.id, Category.name, Category.parent.alias("parent"), freq_alias)
                        .join(EssayCategory, JOIN.INNER)
                        .where(EssayCategory.method.in_(methods))
                        .group_by(Category.id, Category.name, Category.parent))
    
    query = (Category
                .select(inner_query.c.id, inner_query.c.name, inner_query.c.parent, inner_query.c.freq)
                .from_(inner_query)
                .where(inner_query.c.freq > 10))
    
    for category in query.dicts().iterator():
        writer.writerow(category)

# and the links 
print("EssayCategories...")
with open(path.join(out_dir, "essaycategory.csv"), "w+", encoding="utf-8") as f:
    writer = csv.DictWriter(f, ["essay", "category"])
    writer.writeheader()

    for link in (EssayCategory
                    .select(EssayCategory.essay, EssayCategory.category)
                    .join(query, JOIN.INNER, on = query.c.id == EssayCategory.category)
                    .where(EssayCategory.method.in_(methods))
                    .group_by(EssayCategory.essay, EssayCategory.category)
                    .dicts().iterator()):
        writer.writerow(link)

# TODO: write tutors, essaytutor links

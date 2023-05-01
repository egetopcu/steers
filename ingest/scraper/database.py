import os
from os import path
from peewee import (
    SqliteDatabase,
    # PostgresqlDatabase,
    Model,
    AutoField,
    CharField,
    TextField,
    DateField,
    ForeignKeyField,
    IntegerField,
    BooleanField,
    CompositeKey,
)


DB_FILE = path.normpath(path.join(path.dirname(__file__), "../essays-ingest.db"))
print(DB_FILE)
db: SqliteDatabase = SqliteDatabase(DB_FILE)
# db: PostgresqlDatabase = PostgresqlDatabase(
#     "steers",
#     user="postgres",
#     password=os.environ.get("POSTGRES_PASSWORD"),
#     host="localhost",
#     port=os.environ.get("POSTGRES_HOST_PORT"),
# )


class BaseModel(Model):
    class Meta:
        database = db


class Client(BaseModel):
    id = AutoField()
    name = CharField()


class Faculty(BaseModel):
    id = AutoField()
    name = CharField()


class Programme(BaseModel):
    id = AutoField()
    name = CharField()
    code = IntegerField(null=True)


class Topic(BaseModel):
    id = AutoField()
    name = CharField()
    source = CharField()
    type = CharField(null=True)
    code = CharField(null=True)


class Category(BaseModel):
    id = AutoField()
    name = CharField()
    source = CharField()
    parent = ForeignKeyField("self", backref="children", null=True)


class Essay(BaseModel):
    id = IntegerField(primary_key=True)
    title = CharField()
    author = CharField()
    date = DateField()
    type = CharField(null=True)
    restricted = BooleanField(default=False)
    summary = TextField(null=True)
    abstract = TextField(null=True)
    language = TextField(null=True)
    summary_en = TextField(null=True)
    scraped_watson = BooleanField(null=True)
    scraped_meaningcloud = BooleanField(null=True)
    client = ForeignKeyField(Client, backref="essays", null=True)
    faculty = ForeignKeyField(Faculty, backref="essays", null=True)
    programme = ForeignKeyField(Programme, backref="essays", null=True)


class Tutor(BaseModel):
    id = AutoField()
    resolved_id_anna = IntegerField(index=True, null=True)


class TutorNames(BaseModel):
    id = AutoField()
    name = CharField()
    tutor = ForeignKeyField(Tutor, backref="names", null=True)


class EssayTutor(BaseModel):
    essay = ForeignKeyField(Essay, backref="tutors")
    tutor = ForeignKeyField(Tutor, backref="essays")

    class Meta:
        primary_key = CompositeKey("essay", "tutor")


class EssayTopic(BaseModel):
    essay = ForeignKeyField(Essay)
    topic = ForeignKeyField(Topic)

    class Meta:
        primary_key = CompositeKey("essay", "topic")


class EssayCategory(BaseModel):
    essay = ForeignKeyField(Essay)
    category = ForeignKeyField(Category)

    class Meta:
        primary_key = CompositeKey("essay", "category")


def create_tables():
    db.create_tables(
        [
            Client,
            Faculty,
            Programme,
            Topic,
            Category,
            Tutor,
            Essay,
            EssayTopic,
            EssayCategory,
            EssayTutor,
            TutorNames,
        ]
    )


def clear_db():
    db.drop_tables(
        [
            Client,
            Faculty,
            Programme,
            Topic,
            Category,
            Tutor,
            Essay,
            EssayTopic,
            EssayCategory,
            EssayTutor,
            TutorNames,
        ]
    )

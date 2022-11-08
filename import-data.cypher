:auto 
MATCH (n) 
CALL { 
    WITH n
    DETACH DELETE n 
} IN TRANSACTIONS OF 1000 ROWS;

CREATE INDEX client_index IF NOT EXISTS FOR (client:Client) ON (client.id);
CREATE TEXT INDEX client_name_index IF NOT EXISTS FOR (client:Client) ON (client.name);
:auto USING PERIODIC COMMIT 500
LOAD CSV WITH HEADERS FROM "file:///client.csv" AS row
MERGE (client:Client {id: toInteger(row.id), name: row.name, freq: toInteger(row.n) })
RETURN count(client);

CREATE INDEX faculty_index IF NOT EXISTS FOR (faculty:Faculty) ON (faculty.id);
CREATE TEXT INDEX faculty_name_index IF NOT EXISTS FOR (faculty:Faculty) ON (faculty.name);
:auto USING PERIODIC COMMIT 500
LOAD CSV WITH HEADERS FROM "file:///faculty.csv" AS row
MERGE (faculty:Faculty {id: toInteger(row.id) , name: row.name})
RETURN COUNT(faculty);

CREATE INDEX programme_index IF NOT EXISTS FOR (programme:Programme) ON (programme.id);
CREATE TEXT INDEX programme_name_index IF NOT EXISTS FOR (programme:Programme) ON (programme.name);
:auto USING PERIODIC COMMIT 500
LOAD CSV WITH HEADERS FROM "file:///programme.csv" AS row
MERGE (programme:Programme {id: toInteger(row.id) , name: row.name, freq: toInteger(row.n) })
RETURN COUNT(programme);

CREATE INDEX category_index IF NOT EXISTS FOR (category:Category) ON (category.id);
CREATE TEXT INDEX category_name_index IF NOT EXISTS FOR (category:Category) ON (category.name);
:auto USING PERIODIC COMMIT 500
LOAD CSV WITH HEADERS FROM "file:///category.csv" AS row
MERGE (category:Category {id: toInteger(row.id) , name: row.name, freq: toInteger(row.n) })
SET category.parent_id = CASE trim(row.parent_id) WHEN "" then null ELSE toInteger(row.parent_id) END;

CREATE INDEX topic_index IF NOT EXISTS FOR (topic:Topic) ON (topic.id);
CREATE TEXT INDEX topic_name_index IF NOT EXISTS FOR (topic:Topic) ON (topic.name);
:auto USING PERIODIC COMMIT 500
LOAD CSV WITH HEADERS FROM "file:///topic.csv" AS row
MERGE (topic:Topic {id: toInteger(row.id) , name: row.name, freq: toInteger(row.n) })
SET topic.name = row.name;

CREATE INDEX essay_index IF NOT EXISTS FOR (essay:Essay) ON (essay.id);
CREATE FULLTEXT INDEX essay_fulltext_index IF NOT EXISTS FOR (essay:Essay) ON EACH [essay.title, essay.summary, essay.summary_en];
:auto USING PERIODIC COMMIT 500
LOAD CSV WITH HEADERS FROM "file:///essay.csv" AS row
MERGE (essay:Essay {id: toInteger(row.id) })
SET essay.title = row.title
SET essay.author = row.author
SET essay.date = date(datetime(row.date))
SET essay.type = row.type
SET essay.restricted = coalesce(toBoolean(row.restricted), FALSE)
SET essay.summary = CASE trim(row.summary) WHEN "" THEN null ELSE row.summary END
SET essay.abstract = CASE trim(row.abstract) WHEN "" THEN null ELSE row.abstract END
SET essay.summary_en = CASE trim(row.summary_en) WHEN "" THEN null ELSE row.summary_en END;

CREATE INDEX tutor_index IF NOT EXISTS FOR (tutor:Tutor) ON (tutor.id);
CREATE FULLTEXT INDEX tutor_fulltext_index IF NOT EXISTS FOR (tutor:Tutor) ON EACH [tutor.name];
:auto USING PERIODIC COMMIT 500
LOAD CSV WITH HEADERS FROM "file:///tutor.csv" AS row
MERGE (tutor:Tutor {id: toInteger(row.id) })
SET tutor.name = row.name
SET tutor.mail = row.contactId;

:auto USING PERIODIC COMMIT 500
LOAD CSV WITH HEADERS FROM "file:///essaytutor.csv" AS row
MATCH (essay:Essay {id: toInteger(row.essay_id)})
MATCH (tutor:Tutor {id: toInteger(row.topic_id)})
MERGE (essay)-[:TUTORED_BY]->(tutor);

:auto USING PERIODIC COMMIT 500
LOAD CSV WITH HEADERS FROM "file:///essaytopic.csv" AS row
MATCH (essay:Essay {id: toInteger(row.essay_id)})
MATCH (topic:Topic {id: toInteger(row.topic_id)})
MERGE (essay)-[:HAS_TOPIC]->(topic);

:auto USING PERIODIC COMMIT 500
LOAD CSV WITH HEADERS FROM "file:///essaycategory.csv" AS row
MATCH (essay:Essay {id: toInteger(row.essay_id)})
MATCH (category:Category {id: toInteger(row.category_id)})
MERGE (essay)-[:IN_CATEGORY]->(category);

MATCH (category:Category) WHERE category.parent_id IS NOT NULL
MATCH (parent:Category {id: category.parent_id})
MERGE (category)-[:IN_CATEGORY]->(parent);

:auto USING PERIODIC COMMIT 500
LOAD CSV WITH HEADERS FROM "file:///essay.csv" AS row
MATCH (essay:Essay {id: toInteger(row.id) })

WITH essay, row
MATCH (faculty:Faculty {id: toInteger(row.faculty_id)})
MERGE (essay)-[:AT_LOCATION]->(faculty)

WITH essay, row
MATCH (programme:Programme {id: toInteger(row.programme_id)})
MERGE (essay)-[:AT_LOCATION]->(programme)

WITH essay, row 
WHERE trim(row.client_id) <> ""
MATCH (client:Client {id: toInteger(row.client_id)})
MERGE (essay)-[:AT_LOCATION]->(client);

:auto USING PERIODIC COMMIT 500
LOAD CSV WITH HEADERS FROM "file:///essaycategory.csv" AS row
MATCH (essay:Essay {id: toInteger(row.essay_id)})
MATCH (category:Category {id: toInteger(row.category_id)})
MERGE (essay)-[:IN_CATEGORY]->(category);

MATCH (category:Category) WHERE category.parent_id IS NOT NULL
MATCH (parent:Category { id: category.parent_id})
MERGE (category)-[:IN_CATEGORY]->(parent);

// :auto 
// LOAD CSV WITH HEADERS FROM "file:///essay.csv" AS row
// MATCH (essay:Essay {id: toInteger(row.id) })--(other)
// WITH essay, collect(DISTINCT other) as others
// CALL {
//     WITH others
//     FOREACH (a in others|
//     FOREACH (b in others|
//     FOREACH (x in CASE WHEN a <> b THEN [1] ELSE [] END|
//         MERGE (a)-[r:RELATED_TO]-(b)
//         ON CREATE SET r.weight = 0
//         SET r.weight = r.weight + 1
//         )))
// } IN TRANSACTIONS OF 1 ROWS;
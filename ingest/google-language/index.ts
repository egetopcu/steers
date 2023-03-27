import { config } from "dotenv";
config({ path: "../.env" });

import language from "@google-cloud/language";
import neo4j, { Node, Session } from "neo4j-driver";

const db = neo4j.driver(
    process.env.NEO4J_URI!,
    neo4j.auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PASSWORD!),
    { disableLosslessIntegers: true }
);
const client = new language.LanguageServiceClient();

async function getTopics_Google(text: string) {
    const [response, request] = await client.analyzeEntities({
        document: { content: text, type: "PLAIN_TEXT" },
    });

    if (!response.entities) {
        console.log({ response });
        return;
    }

    return response.entities
        .filter((entity) => entity.salience && entity.salience >= 0.05)
        .sort((a, b) => (b.salience ?? 0) - (a.salience ?? 0))
        .slice(0, 10);
}

async function getThesis() {
    const session = db.session();
    const { summary, records } = await session.run(
        "MATCH (essay:Essay)--(topic:Topic) WITH essay, collect(topic) as topics WHERE size(topics) < 2 RETURN essay, topics LIMIT 2"
    );

    for (const record of records) {
        const essay = record.toObject().essay.properties;
        if (essay.summary === "NA") essay.summary = undefined;
        if (essay.summary === "") essay.summary = undefined;

        const topics = await getTopics_Google(essay.summary ?? essay.abstract);
        if (!topics) {
            continue;
        }

        console.log(`${essay.title}:`);

        for (const topic of topics) {
            const { records: topic_records } = await session.run(
                "MERGE (topic:Topic {name: $topic_name}) ON CREATE SET topic.freq = 1, topic.id = ID(topic) RETURN topic LIMIT 1",
                { topic_name: topic.name }
            );
            const topic_data = topic_records[0].toObject().topic.properties;
            console.log(topic_records[0]);
            console.log({ topic_data });

            const { records: relation_records } = await session.run(
                `MERGE (essay:Essay {id: $essay_id})-[:HAS_TOPIC]->(topic:Topic {id: $topic_id})
                ON MATCH SET topic.freq = topic.freq + 1 
                RETURN topic, essay`,
                {
                    essay_id: essay.id,
                    topic_id:
                        topic_data.id ??
                        topic_records[0].toObject().topic.identity,
                }
            );

            console.log(` - ${topic.name} (${topic_data.freq})`);

            // console.log({ essay: essay_data.id, topic_data });
        }
    }

    await session.close();
}

getThesis().then(() => db.close());

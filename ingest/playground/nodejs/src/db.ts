import neo4j, { Session } from "neo4j-driver";
import type { EssayData, TopicData } from "@bdsi-utwente/steers-common";


const db = neo4j.driver(
    process.env.NEO4J_URI!,
    neo4j.auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PASSWORD!),
    { disableLosslessIntegers: true }
);

export function getSession(): Session {
    return db.session();
}

export async function getEssays(session: Session): Promise<EssayData[]>  {
    const { records } = await session.run(
        "MATCH (essay:Essay)--(topic:Topic) WITH essay, collect(topic) as topics WHERE size(topics) < 2 RETURN essay LIMIT 100"
    );

    return records.map(record => record.toObject().essay.properties);
}

export async function addTopic(session: Session, essay: EssayData, topic: TopicData) {
    await session.run("MERGE (:Essay {id: $essay_id})-[:HAS_TOPIC]->(:Topic {id: $topic_id})", { essay_id: essay.id, topic_id: topic.id })
} 

export async function findOrCreateTopic(session: Session, name: string): Promise<TopicData> {
    const { records } = await session.run("MERGE (topic:Topic {name: $topic_name}) ON CREATE SET topic.freq = 1, topic.id = ID(topic) ON MATCH SET topic.freq = topic.freq + 1 RETURN topic LIMIT 1", { topic_name: name});

    return records[0].toObject().topic.properties;
}

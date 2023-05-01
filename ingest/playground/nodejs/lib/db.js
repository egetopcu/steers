"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOrCreateTopic = exports.addTopic = exports.getEssays = exports.getSession = void 0;
const neo4j_driver_1 = __importDefault(require("neo4j-driver"));
const db = neo4j_driver_1.default.driver(process.env.NEO4J_URI, neo4j_driver_1.default.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD), { disableLosslessIntegers: true });
function getSession() {
    return db.session();
}
exports.getSession = getSession;
async function getEssays(session) {
    const { records } = await session.run("MATCH (essay:Essay)--(topic:Topic) WITH essay, collect(topic) as topics WHERE size(topics) < 2 RETURN essay LIMIT 100");
    return records.map(record => record.toObject().essay.properties);
}
exports.getEssays = getEssays;
async function addTopic(session, essay, topic) {
    await session.run("MERGE (:Essay {id: $essay_id})-[:HAS_TOPIC]->(:Topic {id: $topic_id})", { essay_id: essay.id, topic_id: topic.id });
}
exports.addTopic = addTopic;
async function findOrCreateTopic(session, name) {
    const { records } = await session.run("MERGE (topic:Topic {name: $topic_name}) ON CREATE SET topic.freq = 1, topic.id = ID(topic) ON MATCH SET topic.freq = topic.freq + 1 RETURN topic LIMIT 1", { topic_name: name });
    return records[0].toObject().topic.properties;
}
exports.findOrCreateTopic = findOrCreateTopic;

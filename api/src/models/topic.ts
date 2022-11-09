import { IdType, QueryData, TopicData } from "@steers/common";
import { Session, int } from "neo4j-driver";
import { buildRelatedQuery } from "./utils";

export class Topic {
    public id: IdType;
    public name: string;

    constructor(record: TopicData) {
        this.id = record.id;
        this.name = record.name;
    }
}

export function related(session: Session, query: QueryData): Promise<Topic[]> {
    const query_string = buildRelatedQuery("Topic", query);
    const query_data = {
        ...query,
        limit: int(query.limit ?? 100),
    };
    return session.run(query_string, query_data).then((result) => {
        const topics = result.records.map((record) => {
            const { resource, ...properties } = record.toObject();
            return {
                ...new Topic(resource.properties),
                ...properties,
            };
        });

        console.log({ results: topics.length });

        return topics;
    });
}

import { int, Session } from "neo4j-driver";
import { IdType, QueryData, TutorData } from "@steers/common";
import { buildRelatedQuery } from "./utils";

export class Tutor {
    public id: IdType;
    public name: string;
    public mail?: string;

    constructor(record: TutorData) {
        this.id = record.id;
        this.name = record.name;
        this.mail = record.mail;
    }
}

export async function related(session: Session, query: QueryData) {
    const query_string = buildRelatedQuery("Tutor", query, {
        // required: { where: ["resource.mail <> 'NA'"] },
    });
    const query_data = {
        ...query,
        limit: int(query.limit ?? 100),
    };
    return await session.run(query_string, query_data).then((result) => {
        const tutors = result.records.map((record) => {
            const { resource, ...properties } = record.toObject();
            return {
                ...new Tutor(resource.properties),
                ...properties,
            };
        });
        console.log({ results: tutors.length });
        return tutors;
    });
}

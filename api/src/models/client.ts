import { int, Session } from "neo4j-driver";
import { ClientData, QueryData } from "@steers/common";
import { buildRelatedQuery } from "./utils";

export class Client {
    public id: string | number;
    public name: string;
    constructor(record: ClientData) {
        this.id = record.id;
        this.name = record.name;
    }
}

export async function related(session: Session, query: QueryData) {
    const query_data = {
        ...query,
        limit: int(query.limit ?? 100),
    };
    const query_string = buildRelatedQuery("Client", query);
    return await session.run(query_string, query_data).then((result) => {
        const categories = result.records.map((record) => {
            const { category, ...properties } = record.toObject();
            return {
                ...new Client(record.get("resource").properties),
                ...properties,
            };
        });
        console.log({ results: categories.length });
        return categories;
    });
}

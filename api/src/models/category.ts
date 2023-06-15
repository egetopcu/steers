import { CategoryData, IdType } from "@bdsi-utwente/steers-common";
import { int, Session } from "neo4j-driver";
import { buildRelatedQuery } from "./utils";
import type { QueryData } from "@bdsi-utwente/steers-common";

export class Category {
    public id: IdType;
    public name: string;
    public parent_id?: IdType;

    constructor(record: CategoryData) {
        this.id = record.id;
        this.name = record.name;
        this.parent_id = record.parent_id;
    }
}

export async function related(session: Session, query: QueryData) {
    const query_string = buildRelatedQuery("Category", query);
    const query_data = {
        ...query,
        limit: int(query.limit ?? 100),
    };
    return await session.run(query_string, query_data).then((result) => {
        const categories = result.records.map((record) => {
            const { resource, ...properties } = record.toObject();
            return {
                ...new Category(resource.properties),
                ...properties,
            };
        });
        console.log({ results: categories.length });
        return categories;
    });
}

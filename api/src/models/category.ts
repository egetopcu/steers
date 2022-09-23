import { Session } from "neo4j-driver";
import { RelatableQuery, _connected_query } from "./utils";
import * as Essays from "./essay";

export interface CategoryData {
    id: string;
    name: string;
    parent_id?: string;
}

export class Category {
    public id: string;
    public name: string;
    public parent_id?: string;

    constructor(record: CategoryData) {
        this.id = record.id;
        this.name = record.name;
        this.parent_id = record.parent_id;
    }
}

export const searchableAttributes = ["id", "name", "parent_id"] as const;

export async function findMany(
    session: Session,
    query: Partial<Pick<CategoryData, typeof searchableAttributes[number]>>
): Promise<Category[]> {
    let query_string = `MATCH (category:Category)`;
    let where_clauses = [];
    for (const key of searchableAttributes) {
        if (query[key]) {
            where_clauses.push(`category.${key} = $${key}`);
        }
    }
    if (where_clauses.length > 0) {
        query_string += ` WHERE ${where_clauses.join(" AND ")}`;
    }
    query_string += ` RETURN category`;

    console.log({ query_string, query });

    return await session.run(query_string, query).then((result) => {
        const categories = result.records.map((record) => {
            return new Category(record.get("category").properties);
        });
        return categories;
    });
}

export async function getRelated(session: Session, query: RelatableQuery) {
    const essays = await Essays.getRelated(session, query);
    const essay_ids = essays.map((essay) => essay.id);

    const query_string = [
        "MATCH (category:Category)--(essay:Essay)",
        "WHERE essay.id IN $essay_ids",
        "RETURN DISTINCT category",
    ].join(" ");

    console.log({ query, essay_ids, query_string });

    return await session.run(query_string, { essay_ids }).then((result) => {
        const categories = result.records.map((record) => {
            return new Category(record.get("category").properties);
        });
        return categories;
    });
}

export async function getConnected(session: Session, id: string) {
    const query_string = _connected_query("Category");
    console.log({ query_string, id });

    return await session.run(query_string, { id }).then((result) => {
        return result.records[0].entries;
    });
}

export async function filter(
    session: Session,
    filter: string,
    programme: string
) {
    filter = `(?i).*${filter}.*`;
    const query_string = [
      "MATCH (category:Category)--(e:Essay)--(:Programme { id: $programme })",
      "WHERE category.name =~ $filter",
      "RETURN category, count(e) AS weight",
      "ORDER BY weight DESC, category.name ASC",
    ].join(" ");

    console.log({ query_string, filter, programme });

    return await session
        .run(query_string, { filter, programme })
        .then((result) => {
            console.log({ results: result.records.length });

            const categories = result.records.map((record) => {
                return new Category(record.get("category").properties);
            });
            return categories;
        });
}

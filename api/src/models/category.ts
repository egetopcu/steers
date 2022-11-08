import { CategoryData, IdType } from "@steers/common";
import { Session } from "neo4j-driver";
import { buildClause, buildQuery } from "./utils";

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

export const searchableAttributes = ["id", "name", "parent_id"] as const;

export async function filter(
    session: Session,
    filter: string,
    programme: number,
    categories: number[]
) {
    const clauses = [];
    const return_fields: [string, ...string[]] = [
        "category",
        "tf",
        "df",
        "relevance",
    ];
    clauses.push(
        buildClause("MATCH", [
            "(category:Category)--(e:Essay)--(:Programme { id: $programme })",
        ])
    );

    if (filter) {
        filter = `(?i).*${filter}.*`;
        clauses.push(buildClause("WHERE", ["category.name =~ $filter"]));
    }

    clauses.push(
        buildClause("WITH", [
            "category",
            "toFloat(count(e)) as tf",
            "toFloat(category.freq) as df",
            "toFloat(count(e))/toFloat(category.freq) * sqrt(category.freq) as relevance",
        ])
    );

    if (categories?.length) {
        clauses.push(
            buildClause("OPTIONAL MATCH", [
                "(category)--(e:Essay)--(other:Category)",
            ]),
            buildClause("WHERE", ["other.id IN $categories"], " AND "),
            buildClause("WITH", [
                ...return_fields,
                "toFloat(count(distinct(e))) as rf",
                "toFloat(count(distinct(e)))/df * sqrt((other.freq + category.freq)/2) as similarity",
            ])
        );
        return_fields.push("rf", "similarity");
    }

    clauses.push(buildClause("RETURN", return_fields));
    clauses.push(
        buildClause("ORDER BY", ["relevance DESC", "category.name ASC"])
    );
    const query_string = clauses.join(" ");

    console.log({ query_string, filter, programme, categories });

    return await session
        .run(query_string, { filter, programme, categories })
        .then((result) => {
            const categories = result.records.map((record) => {
                const { category, ...properties } = record.toObject();
                return {
                    ...new Category(record.get("category").properties),
                    ...properties,
                };
            });

            return categories;
        });
}

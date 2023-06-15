import { int, Integer, Session } from "neo4j-driver";
import { IdType, ProgrammeData } from "@bdsi-utwente/steers-common";
import { QueryData } from "../../../common/lib/types";

export class Programme {
    public id: IdType;
    public name: string;

    constructor(record: ProgrammeData) {
        this.id = record.id;
        this.name = record.name;
    }
}

export const searchableAttributes = ["id", "name"] as const;

export async function related(session: Session, query: QueryData) {
    let { filter, sort, limit: limit_numeric } = query;
    let limit: Integer | undefined = undefined;

    const query_clauses = ["MATCH (programme:Programme)"];
    if (filter) {
        query_clauses.push("WHERE programme.name =~ $filter");
    }
    query_clauses.push("RETURN programme");
    if (sort) {
        sort = sort.replace(/[^a-z \.]/gi, "");
        query_clauses.push(`ORDER BY ${sort}`);
    }
    if (limit_numeric) {
        limit = int(limit_numeric);
        query_clauses.push("LIMIT $limit");
    }

    const query_string = query_clauses.join(" ");
    const query_data = { filter, sort, limit };

    console.log({ query_string, query_data });

    return await session.run(query_string, query_data).then((result) => {
        console.log({ results: result.records.length });

        const programmes = result.records.map((record) => {
            return new Programme(record.get("programme").properties);
        });
        return programmes;
    });
}

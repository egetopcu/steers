import { Session } from "neo4j-driver";
import { IdType, ProgrammeData } from "@steers/common";

export class Programme {
    public id: IdType;
    public name: string;

    constructor(record: ProgrammeData) {
        this.id = record.id;
        this.name = record.name;
    }
}

export const searchableAttributes = ["id", "name"] as const;

export async function related(session: Session, filter: string) {
    const query_string = [
        "MATCH (programme:Programme)",
        "WHERE programme.name =~ $filter",
        "RETURN programme",
    ].join(" ");

    console.log({ query_string, filter });

    return await session
        .run(query_string, { filter: `(?i).*${filter}.*` })
        .then((result) => {
            console.log({ results: result.records.length });

            const programmes = result.records.map((record) => {
                return new Programme(record.get("programme").properties);
            });
            return programmes;
        });
}

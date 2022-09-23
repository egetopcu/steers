import { Session } from "neo4j-driver";

export interface ProgrammeData {
    id: number;
    name: string;
    code: string;
}

export class Programme {
    public id: number;
    public name: string;
    public code: string;

    constructor(record: ProgrammeData) {
        this.id = record.id;
        this.name = record.name;
        this.code = record.code;
    }
}

export const searchableAttributes = ["id", "name"] as const;

export async function filter(session: Session, filter: string) {
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

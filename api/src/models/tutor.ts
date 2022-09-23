import _ from "lodash";
import { Session } from "neo4j-driver";

export interface TutorData {
    id: number;
    names: string[];
}

export class Tutor {
    public id: number;

    constructor(record: TutorData) {
        this.id = record.id;
    }
}

export async function getById(session: Session, id: number): Promise<Tutor> {
    const query = [
        "MATCH (t:Tutor {id: $tutorId})<-[:KNOWN_AS]-(n:Name)",
        "RETURN t AS tutor, COLLECT(DISTINCT n.name) AS names",
    ].join("\n");

    const result = await session.readTransaction((tx) =>
        tx.run(query, { tutorId: id })
    );
    if (!_.isEmpty(result.records)) {
        const names = result.records[0].get("names");
        const tutor = result.records[0].get("tutor");
        return new Tutor({ id: tutor.id, names });
    } else {
        throw {
            message: "Tutor not found",
            status: 404,
        };
    }
}

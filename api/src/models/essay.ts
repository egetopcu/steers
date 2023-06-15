import {
    IdType,
    QueryData,
    EssayData,
    ProgrammeData,
    TutorData,
    ClientData,
    CategoryData,
    TopicData,
} from "@bdsi-utwente/steers-common";
import { Session } from "neo4j-driver";
import { buildClause } from "./utils";
import { Programme } from "./programme";
import { Category } from "./category";
import { Client } from "./client";
import { Topic } from "./topic";
import { Tutor } from "./tutor";

interface ExtendedEssayData {
    programme: Record<ProgrammeData>;
    categories: Record<CategoryData>[];
    topics: Record<TopicData>[];
    tutors: Record<TutorData>[];
    clients: Record<ClientData>[];
}

type Record<Data> = {
    identity: number;
    labels: string[];
    properties: Data;
    elementId: IdType;
};

export class Essay {
    public id: IdType;
    public author: string;
    public title: string;
    public abstract: string;
    public date: Date;

    public programme?: Programme; // this really _should_ be required, but we have some essays without it set?
    public categories: Category[];
    public topics: Topic[];
    public tutors: Tutor[];
    public clients: Client[];

    constructor(
        record: EssayData,
        { programme, categories, topics, tutors, clients }: ExtendedEssayData
    ) {
        this.id = record.id;
        this.title = record.title;
        this.author = record.author;
        this.abstract = record.summary_en ?? record.abstract ?? "";
        this.date = record.date.toStandardDate();

        this.programme = programme
            ? new Programme(programme.properties)
            : undefined;
        this.categories = categories?.map(
            (category) => new Category(category.properties)
        );
        this.topics = topics?.map((topic) => new Topic(topic.properties));
        this.tutors = tutors?.map((tutor) => new Tutor(tutor.properties));
        this.clients = clients?.map((client) => new Client(client.properties));
    }
}

export function related(session: Session, query: QueryData): Promise<Essay[]> {
    // query helpers are built for resources connected through essays, so we can't use those.
    // We'll have to implement the Essay methods from scratch, but they should be much simpler.
    const match_clauses = [`(essay:Essay)`];
    const where_clauses = [];

    // for each field in the required query, add a where clause
    if (query.required?.categories?.length) {
        match_clauses.push(`(essay)-[:IN_CATEGORY]->(category:Category)`);
        where_clauses.push(`category.id IN $required.categories`);
    }

    if (query.required?.clients?.length) {
        match_clauses.push(`(essay)-[:AT_LOCATION]->(client:Client)`);
        where_clauses.push(`client.id IN $required.clients`);
    }

    if (query.required?.programme) {
        match_clauses.push(
            `(essay)-[:AT_LOCATION]->(programme:Programme { id: $required.programme })`
        );
    }

    if (query.required?.topics?.length) {
        match_clauses.push(`(essay)-[:HAS_TOPIC]->(topic:Topic)`);
        where_clauses.push(`topic.id IN $required.topics`);
    }

    if (query.required?.tutors?.length) {
        match_clauses.push(`(essay)-[:TUTORED_BY]->(tutor:Tutor)`);
        where_clauses.push(`tutor.id IN $required.tutors`);
    }

    const query_string = [
        buildClause(`MATCH`, match_clauses),
        buildClause(`WHERE`, where_clauses, " AND "),
        "WITH essay",
        "LIMIT 50",
        buildClause(
            `OPTIONAL MATCH`,
            [
                "(essay)-[:AT_LOCATION]->(programme:Programme)",
                "(essay)-[:IN_CATEGORY]->(category:Category)",
                "(essay)-[:HAS_TOPIC]->(topic:Topic)",
                "(essay)-[:TUTORED_BY]->(tutor:Tutor)",
                "(essay)-[:AT_LOCATION]->(client:Client)",
            ],
            "\nOPTIONAL MATCH "
        ),
        buildClause(`RETURN`, [
            "essay",
            "programme",
            "collect(distinct category) as categories",
            "collect(distinct topic) as topics",
            "collect(distinct tutor) as tutors",
            "collect(distinct client) as clients",
        ]),
    ].join("\n");

    console.log(query_string);

    const query_data = { required: query.required };
    return session.run(query_string, query_data).then((result) => {
        const essays = result.records.map((record) => {
            // console.log(JSON.stringify(record.toObject(), null, 2));
            const { essay, ...properties } = record.toObject();
            return {
                ...new Essay(essay.properties, properties as any),
            };
        });

        return essays;
    });
}

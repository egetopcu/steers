import _ from "lodash";
import { Date, Record, Session } from "neo4j-driver";
import { Category, CategoryData } from "./category";
import { Client, ClientData } from "./client";
import { Faculty, FacultyData } from "./faculty";
import { Programme, ProgrammeData } from "./programme";
import { Topic, TopicData } from "./topic";
import { Tutor, TutorData } from "./tutor";
import {
    relatableProperties,
    relatablePropertyLabel,
    RelatableQuery,
} from "./utils";

export interface EssayData {
    id: number;
    title: string;
    author: string;
    date: Date;
    type: string;
    language?: string;
    abstract?: string;
    summary_en?: string;
    restricted: boolean;
    scraped_watson: boolean;
    scraped_meaningcloud: boolean;
}

export type EssayRecord = Record<{
    essay: { properties: EssayData };
    faculty?: FacultyData;
    programme?: ProgrammeData;
    tutors?: TutorData[];
    topics?: TopicData[];
    categories?: CategoryData[];
    client?: ClientData;
}>;

export class Essay implements EssayData {
    public id: number;
    public title: string;
    public author: string;
    public date: Date;
    public type: string;
    public language?: string;
    public abstract?: string;
    public summary_en?: string;
    public restricted: boolean = false;
    public scraped_watson: boolean = false;
    public scraped_meaningcloud: boolean = false;
    public faculty?: Faculty;
    public programme?: Programme;
    public topics?: Topic[];
    public categories?: Category[];
    public tutors?: Tutor[];
    public client?: Client;

    constructor(record: EssayRecord) {
        const essay = record.get("essay").properties;

        this.id = essay.id;
        this.title = essay.title;
        this.author = essay.author;
        this.date = essay.date;
        this.type = essay.type;
        this.language = essay.language;
        this.abstract = essay.abstract;
        this.summary_en = essay.summary_en;
        this.restricted = essay.restricted;
        this.scraped_watson = essay.scraped_watson;
        this.scraped_meaningcloud = essay.scraped_meaningcloud;

        if (record.has("faculty")) {
            this.faculty = new Faculty(record.get("faculty")!);
        }
        if (record.has("programme")) {
            this.programme = new Programme(record.get("programme")!);
        }
        if (record.has("topics")) {
            this.topics = record
                .get("topics")!
                .map((topic) => new Topic(topic));
        }

        if (record.has("categories")) {
            this.categories = record
                .get("categories")!
                .map((category) => new Category(category));
        }

        if (record.has("tutors")) {
            this.tutors = record
                .get("tutors")!
                .map((tutor) => new Tutor(tutor));
        }

        if (record.has("client")) {
            this.client = new Client(record.get("client")!);
        }
    }
}

export async function getById(session: Session, id: string): Promise<Essay> {
    const query = [
        "MATCH (essay:Essay {id: $essayId})",
        "MATCH (essay)-[:HOSTED_BY]->(faculty:Faculty)",
        "MATCH (essay)-[:HOSTED_BY]->(programme:Programme)",
        "MATCH (essay)-[:SUPERVISED_BY]->(tutor:Tutor)",
        "MATCH (essay)-[:HAS_TOPIC]->(topic:Topic)",
        "OPTIONAL MATCH (essay)-[:HAS_CATEGORY]->(category:Category)",
        "OPTIONAL MATCH (essay)-[:HOSTED_BY]->(client:Client)",
        "WITH DISTINCT essay, client, faculty, programme, tutor, topic, category",
        "RETURN DISTINCT essay, client, faculty, programme,",
        "collect(DISTINCT tutor) as tutors,",
        "collect(DISTINCT topic) as topics,",
        "collect(DISTINCT category) as categories",
    ].join("\n");

    const result = await session.readTransaction((tx) =>
        tx.run(query, { essayId: id })
    );
    if (!_.isEmpty(result.records)) {
        const record = result.records[0] as EssayRecord;
        return new Essay(record);
    } else {
        throw {
            status: 404,
            message: `Essay not found`,
        };
    }
}

export async function getRelated(session: Session, query: RelatableQuery) {
    let query_string = `MATCH (essay:Essay)`;
    let match_clauses = [];
    let where_clauses = [];
    let with_properties = [];

    for (const key of relatableProperties) {
        if (query[key]) {
            if (Array.isArray(query[key])) {
                match_clauses.push(
                    `OPTIONAL MATCH (essay)--(${key}:${relatablePropertyLabel[key]}) WHERE ${key}.id IN $${key}`
                );
                where_clauses.push(`${key}_count >= ${query[key]!.length}`);
                with_properties.push(`count(${key}) as ${key}_count`);
            } else {
                where_clauses.push(
                    `EXISTS { MATCH (essay)--(${key}:${relatablePropertyLabel[key]} {id: $${key}})}`
                );
            }
        }
    }
    if (match_clauses.length > 0) {
        query_string += "\n" + match_clauses.join("\n");
        query_string += `\nWITH essay, ${with_properties.join(", ")}`;
    }
    if (where_clauses.length > 0) {
        query_string += `\nWHERE ${where_clauses.join("\n AND ")}`;
    } else {
        throw {
            message: "No valid query parameters provided",
            status: 400,
        };
    }

    query_string += `\nRETURN DISTINCT essay`;

    console.log(query_string, { query });

    const result = await session.readTransaction((tx) =>
        tx.run(query_string, query)
    );
    if (!_.isEmpty(result.records)) {
        const records = result.records as EssayRecord[];
        console.log({ count: records.length });

        return _.map(records, (r) => new Essay(r));
    } else {
        return [];
    }
}

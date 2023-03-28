import _ from "lodash";
import { Date, Record, Session } from "neo4j-driver";
import { Category } from "./category";
import { Client } from "./client";
import { Faculty } from "./faculty";
import { Programme } from "./programme";
import { Topic } from "./topic";
import { Tutor } from "./tutor";
import { IdType } from "../../../common/src/types";

import {
    Node,
    EssayData,
    FacultyData,
    ProgrammeData,
    TutorData,
    TopicData,
    CategoryData,
    ClientData,
} from "@steers/common";

export type EssayRecord = Record<{
    essay: Node<EssayData>;
    faculty?: Node<FacultyData>;
    programme?: Node<ProgrammeData>;
    tutors?: Node<TutorData>[];
    topics?: Node<TopicData>[];
    categories?: Node<CategoryData>[];
    client?: Node<ClientData>;
}>;

export class Essay implements EssayData {
    public id: IdType;
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

        if (record.has("faculty") && record.get("faculty")) {
            this.faculty = new Faculty(record.get("faculty")!.properties);
        }

        if (record.has("programme") && record.get("programme")) {
            this.programme = new Programme(record.get("programme")!.properties);
        }

        if (record.has("client") && record.get("client")) {
            this.client = new Client(record.get("client")!.properties);
        }

        if (record.has("topics")) {
            this.topics = record
                .get("topics")!
                .map((topic) => new Topic(topic.properties));
        }

        if (record.has("categories")) {
            this.categories = record
                .get("categories")!
                .map((category) => new Category(category.properties));
        }

        if (record.has("tutors")) {
            this.tutors = record
                .get("tutors")!
                .map((tutor) => new Tutor(tutor.properties));
        }
    }
}

export async function filter(
  session: Session,
  programme: number,
  categories: number[],
  tutors: number[],
  topics: number[],
  client: number
): Promise<Essay[]> {
  const query = {
    programme,
    categories,
    tutors,
    topics,
    client,
  };

  const match_clauses = ["(essay:Essay)"];
  const optional_match_clauses = [];
  const where_clauses = [];
  const return_clauses = [
    "DISTINCT essay",
    "programme",
    "collect(DISTINCT category) as categories",
    "client",
    // "collect(DISTINCT tutor) as tutors",
    "collect(DISTINCT topic) as topics",
  ];

  match_clauses.push("(essay)--(programme:Programme)");
  if (programme) {
    where_clauses.push("programme.id = $programme");
  }
  //   else {
  //     optional_match_clauses.push("(essay)--(programme:Programme)");
  //   }

  if (categories && categories.length > 0) {
    match_clauses.push("(essay)--(category:Category)");
    if (Array.isArray(categories)) {
      where_clauses.push("category.id IN $categories");
    } else {
      where_clauses.push("category.id = $categories");
    }
  } else {
    optional_match_clauses.push("(essay)--(category:Category)");
  }

  if (client) {
    match_clauses.push("(essay)--(client:Client { id: $client })");
  } else {
    optional_match_clauses.push("(essay)--(client:Client)");
  }

  //   if (tutors && tutors.length > 0) {
  //     if (Array.isArray(tutors)) {
  //       where_clauses.push("tutor.id IN $tutors");
  //     } else {
  //       where_clauses.push("tutor.id = $tutors");
  //     }
  //     match_clauses.push("(essay)--(tutor:Tutor)")
  //   } else {
  //     optional_match_clauses.push("(essay)--(tutor:Tutor)")
  //   }

  if (topics && topics.length > 0) {
    match_clauses.push("(essay)--(topic:Topic)");
    if (Array.isArray(topics)) {
      where_clauses.push("topic.id IN $topics");
    } else {
      where_clauses.push("topic.id = $topics");
    }
  } else {
    optional_match_clauses.push("(essay)--(topic:Topic)");
  }

  let query_string = `MATCH ${match_clauses.join(", ")}\n`;

  if (where_clauses.length > 0) {
    query_string += `WHERE ${where_clauses.join(" AND ")}\n`;
  }

  query_string += `OPTIONAL MATCH ${optional_match_clauses.join(", ")}\n`;
  query_string += `RETURN ${return_clauses.join(", ")}\n`;
  query_string += `LIMIT 100`;

  console.log({ query_string, query });

  return session.readTransaction(async (tx) => {
    const result = (await tx.run(query_string, query)) as unknown as {
      records: EssayRecord[];
    };

    const essays = result.records.map((record) => {
      return new Essay(record);
    });
    console.log({ results: essays?.length });
    return essays;
  });
}

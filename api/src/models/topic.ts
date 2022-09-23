import { Session } from "neo4j-driver";

export interface TopicData {
    id: number;
    name: string;
    source: string;
    type?: string;
    code?: string;
}

export class Topic {
    public id: number;
    public name: string;
    public source: string;
    public type?: string;
    public code?: string;

    constructor(record: TopicData) {
        this.id = record.id;
        this.name = record.name;
        this.source = record.source;
        this.type = record.type;
        this.code = record.code;
    }
}

export function filter(
    session: Session,
    filter: string,
    programme: string,
    categories: string[],
    client: string,
    tutors: string[] = []
): Promise<Topic[]> {
    filter = `(?i).*${filter}.*`;
    const query = {
        filter,
        programme,
        categories,
        client,
        tutors,
    };

    const match_clauses = ["(topic:Topic)--(essay:Essay)"];
    const where_clauses = ["topic.name =~ $filter"];

    if (categories && categories.length > 0) {
      match_clauses.push("(category:Category)");
      if (Array.isArray(categories)) {
        where_clauses.push("category.id IN $categories");
      } else {
        where_clauses.push("category.id = $categories");
      }
      where_clauses.push("(essay)--(category)");
    }

    if (client && client !== "") {
      match_clauses.push("(client:Client { id: $client })");
      where_clauses.push("(essay)--(client)");
    }

    if (tutors && tutors.length > 0) {
      match_clauses.push("(tutor:Tutor)");
      if (Array.isArray(tutors)) {
        where_clauses.push("tutor.id IN $tutors");
      } else {
        where_clauses.push("tutor.id = $tutors");
      }
      where_clauses.push("(essay)--(tutor)");
    }

    const query_string =
      "MATCH " +
      match_clauses.join(", ") +
      "\n" +
      "WHERE " +
      where_clauses.join(" AND ") +
      "\n" +
      "RETURN topic, COUNT(essay) AS relevance\n" +
      "ORDER BY relevance DESC, topic.name ASC\n" +
      "LIMIT 100";

    console.log({ query_string, query });

    return session.readTransaction(async (tx) => {
      const result = await tx.run(query_string, query);
      const topics = result.records.map((record) => {
        return new Topic(record.get("topic").properties);
      });
      console.log({ results: topics?.length });
      return topics;
    });
}

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

    const query_string = [
      "CALL {",
      "MATCH (topic:Topic)--(e:Essay)--(:Programme { id: $programme })",
      "WHERE topic.name =~ $filter",
    ];

    const match_clauses = ["(topic:Topic)--(essay:Essay)"];
    const where_clauses = ["topic.name =~ $filter"];

    let any_join = false;
    if (categories && categories.length > 0) {
      any_join = true;
      query_string.push(
        "RETURN topic, COUNT(e) AS weight",
        "UNION ALL",
        "MATCH (topic:Topic)--(e:Essay)--(category:Category)",
        "WHERE topic.name =~ $filter"
      );
      if (Array.isArray(categories)) {
        query_string.push("AND category.id IN $categories");
      } else {
        query_string.push("AND category.id = $categories");
      }
    }
    if (client && client !== "") {
      any_join = true;
      query_string.push(
        "RETURN topic, COUNT(e) AS weight",
        "UNION ALL",
        "MATCH (topic:Topic)--(e:Essay)--(client:Client)",
        "WHERE topic.name =~ $filter",
        "AND client.id = $client"
      );
    }
    if (tutors && tutors.length > 0) {
      any_join = true;
      query_string.push(
        "RETURN topic, COUNT(e) AS weight",
        "UNION ALL",
        "MATCH (topic:Topic)--(e:Essay)--(tutor:Tutor)",
        "WHERE topic.name =~ $filter"
      );
      if (Array.isArray(tutors)) {
        query_string.push("AND tutor.id IN $tutors");
      } else {
        query_string.push("AND tutor.id = $tutors");
      }
    }

    query_string.push(
      any_join ? "RETURN topic, COUNT(e) AS weight" : "",
      "}", // end of CALL,
      "RETURN topic, SUM(weight) AS weight",
      "ORDER BY weight DESC, topic.name ASC",
      "LIMIT 100"
    );

    console.log(query_string.join("\n"));
    console.log({ query });

    return session.readTransaction(async (tx) => {
      const result = await tx.run(query_string.join(" "), query);
      const topics = result.records.map((record) => {
        return new Topic(record.get("topic").properties);
      });
      console.log({ results: topics?.length });
      return topics;
    });
}

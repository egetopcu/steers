import { IdType, TopicData } from "@steers/common";
import { Session } from "neo4j-driver";

export class Topic {
  public id: IdType;
  public name: string;

  constructor(record: TopicData) {
    this.id = record.id;
    this.name = record.name;
  }
}

export function filter(
  session: Session,
  filter: string,
  programme: number,
  categories: number[],
  client: number,
  tutors: number[] = []
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
    if (Array.isArray(categories)) {
      match_clauses.push("(essay)--(category:Category)");
      where_clauses.push("category.id IN $categories");
    } else {
      match_clauses.push("(essay)--(category:Category { id: $categories })");
    }
  }

  if (client) {
    match_clauses.push("(essay)--(Client { id: $client })");
  }

  if (programme) {
    match_clauses.push("(essay)--(programme:Programme { id: $programme })");
  }

  if (tutors && tutors.length > 0) {
    if (Array.isArray(tutors)) {
      match_clauses.push("(essay)--(tutor:Tutor)");
      where_clauses.push("tutor.id IN $tutors");
    } else {
      match_clauses.push("(essay)--(tutor:Tutor { id: $tutors })");
    }
  }

  const query_string =
    "MATCH " +
    match_clauses.join(", ") +
    "\n" +
    "WHERE " +
    where_clauses.join(" AND ") +
    "\n" +
    "RETURN topic, (toFloat(count(essay)) / topic.freq) * sqrt(topic.freq) AS relevance\n" +
    "ORDER BY relevance DESC, topic.name ASC\n" +
    "LIMIT 100";

  console.log(query_string, { query });

  return session.readTransaction(async (tx) => {
    const result = await tx.run(query_string, query);
    const topics = result.records.map((record) => {
      return { ...new Topic(record.get("topic").properties), relevance: record.get("relevance") }
    });
    console.log({ results: topics?.length });
    return topics;
  });
}

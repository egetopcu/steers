import { Session } from "neo4j-driver";
import { ClientData } from "@steers/common";

export class Client {
  public id: string | number;
  public name: string;
  constructor(record: ClientData) {
    this.id = record.id;
    this.name = record.name;
  }
}

export function filter(
  session: Session,
  filter: string,
  programme: number,
  categories: number[],
  topics: number[] = [],
  tutors: number[] = []
): Promise<Client[]> {
  filter = `(?i).*${filter}.*`;
  const query = {
    filter,
    programme,
    categories,
    topics,
    tutors,
  };

  const query_string = [
    "CALL {",
    "MATCH (client:Client)--(e:Essay)--(:Programme { id: $programme })",
    "WHERE client.name =~ $filter",
  ];

  let any_join = false;
  if (categories && categories.length > 0) {
    any_join = true;
    query_string.push(
      "RETURN client, COUNT(e) AS weight",
      "UNION ALL",
      "MATCH (client:Client)--(e:Essay)--(category:Category)",
      "WHERE client.name =~ $filter"
    );
    if (Array.isArray(categories)) {
      query_string.push("AND category.id IN $categories");
    } else {
      query_string.push("AND category.id = $categories");
    }
  }
  if (topics && topics.length > 0) {
    any_join = true;
    query_string.push(
      "RETURN client, COUNT(e) AS weight",
      "UNION ALL",
      "MATCH (client:Client)--(e:Essay)--(topic:Topic)",
      "WHERE client.name =~ $filter"
    );
    if (Array.isArray(topics)) {
      query_string.push("AND topic.id IN $topics");
    } else {
      query_string.push("AND topic.id = $topics");
    }
  }
  if (tutors && tutors.length > 0) {
    any_join = true;
    query_string.push(
      "RETURN client, COUNT(e) AS weight",
      "UNION ALL",
      "MATCH (client:Client)--(e:Essay)--(tutor:Tutor)",
      "WHERE client.name =~ $filter"
    );
    if (Array.isArray(tutors)) {
      query_string.push("AND tutor.id IN $tutors");
    } else {
      query_string.push("AND tutor.id = $tutors");
    }
  }

  query_string.push(
    any_join ? "RETURN client, COUNT(e) AS weight" : "",
    "}", // end of CALL,
    "RETURN client, SUM(weight) AS weight",
    "ORDER BY weight DESC, client.name ASC"
  );

  console.log(query_string.join("\n"));
  console.log({ query });

  return session.readTransaction(async (tx) => {
    const result = await tx.run(query_string.join(" "), query);
    const clients = result.records.map((record) => {
      return new Client(record.get("client").properties);
    });
    console.log({ results: clients?.length });
    return clients;
  });
}

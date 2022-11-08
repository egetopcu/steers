import { int, Session } from "neo4j-driver";
import { IdType, TutorData } from "@steers/common";
import { buildClause } from "./utils";

export class Tutor {
  public id: IdType;
  public name: string;
  public mail?: string;

  constructor(record: TutorData) {
    this.id = record.id;
    this.name = record.name;
    this.mail = record.mail;
  }
}

export async function related(
  session: Session,
  filter: string,
  programme: number,
  categories: number[],
  topics: number[],
  tutors: number[],
  clients: number[],
  sort?: string,
  limit: number = 100
) {
  const query = {
    filter: `(?i).*${filter}.*`,
    programme,
    categories,
    clients,
    tutors,
    topics,
    sort,
    limit: int(Math.min(limit, 100)),
  };

  const clauses = [];
  const return_fields: string[] = ["tutor", "relevance", "tf", "df"];

  clauses.push(
    buildClause("MATCH", [
      "(tutor:Tutor)--(e:Essay)--(:Programme { id: $programme })",
    ])
  );

  const where_expressions: string[] = ["tutor.mail <> 'NA'"];

  if (filter) {
    filter = `(?i).*${filter}.*`;
    where_expressions.push("tutor.name =~ $filter");
  }

  clauses.push(
    buildClause("WHERE", where_expressions, " AND "),
    buildClause("WITH", [
      "tutor",
      "toFloat(count(e)) as tf",
      "toFloat(tutor.freq) as df",
      "toFloat(count(e))/toFloat(tutor.freq) * sqrt(tutor.freq) as relevance",
    ]),
    "ORDER BY relevance DESC",
    "LIMIT 500"
  );

  // category, client, tutors and topics are optionally
  // matched (similarity score).
  const similarity_match_expressions: string[] = [
    "(tutor)--(essay:Essay)--(selected)",
  ];
  const similarity_filter_expressions: string[] = [];

  if (categories?.length) {
    similarity_filter_expressions.push(
      "(selected:Category AND selected.id IN $categories)"
    );
  }

  if (topics?.length) {
    similarity_filter_expressions.push(
      "(selected:Topic AND selected.id IN $topics)"
    );
  }

  if (clients?.length) {
    similarity_filter_expressions.push(
      "(selected:Client AND selected.id IN $clients)"
    );
  }

  if (tutors?.length) {
    similarity_filter_expressions.push(
      "(selected:Tutor AND selected.id IN $tutors)"
    );
  }

  if (similarity_filter_expressions.length > 0) {
    clauses.push(
      buildClause("OPTIONAL MATCH", similarity_match_expressions),
      buildClause("WHERE", similarity_filter_expressions, " OR "),
      buildClause("WITH", [
        ...return_fields,
        "toFloat(count(essay)) as rf",
        "toFloat(count(essay))/df * sqrt(tutor.freq) as similarity",
      ])
    );
    return_fields.push("rf", "similarity");
  }

  if (!sort) {
    if (similarity_filter_expressions.length > 0) {
      sort = "relevance * similarity DESC";
    } else {
      sort = "relevance DESC";
    }
  }

  clauses.push(
    buildClause("RETURN", return_fields),
    buildClause("ORDER BY", [sort.replace("[^a-zA-Z ]", "")]),
    "LIMIT $limit"
  );

  const query_string = clauses.join(" ");

  console.log(query_string, { query });

  return session.run(query_string, query).then((result) => {
    return result.records.map((record) => {
      const { tutor, ...properties } = record.toObject();
      return {
        ...new Tutor(record.get("tutor").properties),
        ...properties,
      };
    });
  });
}

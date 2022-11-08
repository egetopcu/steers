import { CategoryData, IdType } from "@steers/common";
import { int, Session } from "neo4j-driver";
import { buildClause, buildQuery, IQueryData } from "./utils";

export class Category {
  public id: IdType;
  public name: string;
  public parent_id?: IdType;

  constructor(record: CategoryData) {
    this.id = record.id;
    this.name = record.name;
    this.parent_id = record.parent_id;
  }
}

export const searchableAttributes = ["id", "name", "parent_id"] as const;

export async function related(
  session: Session,
  { required, optional, sort, limit, filter }: IQueryData
) {
  const clauses = [];
  const return_fields: [string, ...string[]] = [
    "category",
    "tf",
    "df",
    "relevance",
  ];

  const required_match_expressions: string[] = [
    "(category:Category)--(essay:Essay)",
  ];
  const required_where_expressions: string[] = [];

  if (filter) {
    filter = `(?i).*${filter}.*`;
    required_where_expressions.push("category.name =~ $filter");
  }

  if (required?.programme) {
    required_match_expressions.push(
      "(essay)--(:Programme {id: $required.programme })"
    );
  }

  if (required?.categories?.length) {
    required_match_expressions.push("(essay)--(category:Category)");
    required_where_expressions.push("category.id IN $required.categories");
  }

  if (required?.topics?.length) {
    required_match_expressions.push("(essay)--(topic:Topic)");
    required_where_expressions.push("topic.id IN $required.topics");
  }

  if (required?.tutors?.length) {
    required_match_expressions.push("(essay)--(tutor:Tutor)");
    required_where_expressions.push("tutor.id IN $required.tutors");
  }

  if (required?.clients?.length) {
    required_match_expressions.push("(essay)--(client:Client)");
    required_where_expressions.push("client.id IN $required.clients");
  }

  clauses.push(buildClause("MATCH", required_match_expressions));
  if (required_where_expressions.length) {
    clauses.push(buildClause("WHERE", required_where_expressions, " AND "));
  }

  clauses.push(
    buildClause("WITH", [
      "category",
      "toFloat(count(essay)) as tf",
      "toFloat(category.freq) as df",
      "toFloat(count(essay))/toFloat(category.freq) * sqrt(category.freq) as relevance",
    ])
  );

  const optional_match_expressions: string[] = [
    "(category)--(essay:Essay)--(selected)",
  ];
  const optional_where_expressions: string[] = [];

  if (optional?.programme) {
    optional_where_expressions.push(
      "(selected:Programme and selected.id == $optional.programme)"
    );
  }

  if (optional?.categories?.length) {
    optional_where_expressions.push(
      "(selected:Category AND selected.id IN $optional.categories)"
    );
  }

  if (optional?.topics?.length) {
    optional_where_expressions.push(
      "(selected:Topic AND selected.id IN $optional.topics)"
    );
  }

  if (optional?.tutors?.length) {
    optional_where_expressions.push(
      "(selected:Tutor AND selected.id IN $optional.tutors)"
    );
  }

  if (optional?.clients?.length) {
    optional_where_expressions.push(
      "(selected:Client AND selected.id IN $optional.clients)"
    );
  }

  if (optional_where_expressions.length > 0) {
    clauses.push(
      buildClause("OPTIONAL MATCH", optional_match_expressions),
      buildClause("WHERE", optional_where_expressions, " OR "),
      buildClause("WITH", [
        ...return_fields,
        "toFloat(count(essay)) as rf",
        "toFloat(count(essay))/df * sqrt(tutor.freq) as similarity",
      ])
    );
    return_fields.push("rf", "similarity");
  }

  if (!sort) {
    if (optional_where_expressions.length > 0) {
      sort = "relevance * similarity DESC";
    } else {
      sort = "relevance DESC";
    }
  }

  limit = Math.min(limit ?? 100, 100);

  clauses.push(
    buildClause("RETURN", return_fields),
    buildClause("ORDER BY", [sort.replace("[^a-zA-Z ]", "")]),
    "LIMIT $limit"
  );

  const query_string = clauses.join(" ");
  const query = {
    required,
    optional,
    filter,
    limit: int(limit),
  };

  console.log(query_string, "\n", JSON.stringify({ query }, null, 2));

  return await session.run(query_string, query).then((result) => {
    const categories = result.records.map((record) => {
      const { category, ...properties } = record.toObject();
      return {
        ...new Category(record.get("category").properties),
        ...properties,
      };
    });

    return categories;
  });
}

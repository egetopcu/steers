import { CategoryData, IdType } from "@steers/common";
import { Session } from "neo4j-driver";
import { buildQuery } from "./utils";

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

export async function filter(
  session: Session,
  filter: string,
  programme: number,
  categories: number[]
) {
  filter = `(?i).*${filter}.*`;

  const match = [
    "(category:Category)--(e:Essay)--(:Programme { id: $programme })",
  ];
  const optional_match = [];
  const where = ["category.name =~ $filter"];
  const return_ = [
    "category",
    "(toFloat(count(e)) / category.freq)*sqrt(category.freq) AS relevance",
    "count(e) as n",
    "category.freq as f",
  ];
  const order_by = ["relevance DESC, category.name ASC"];

  if (categories?.length) {
    optional_match.push("(other_category:Category)--(e:Essay)");
    where.push("other_category.id IN $categories");
  }

  const query_string = buildQuery({
    match,
    where,
    optional_match,
    return_,
    order_by,
  });

  console.log({ query_string, filter, programme, categories });

  return await session
    .run(query_string, { filter, programme, categories })
    .then((result) => {
      const categories = result.records.map((record) => {
        return {
          ...new Category(record.get("category").properties),
          relevance: record.get("relevance"),
          frequency: record.get("f"),
          count: record.get("n"),
        };
      });

      return categories;
    });
}

import { CategoryData, IdType } from "@steers/common";
import { Session } from "neo4j-driver";

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
  programme: number
) {
  filter = `(?i).*${filter}.*`;
  const query_string = [
    "MATCH (category:Category)--(e:Essay)--(:Programme { id: $programme })",
    "WHERE category.name =~ $filter",
    "RETURN category, toFloat(count(e) * count(e)) / category.freq AS relevance, count(e) as n, category.freq as f",
    "ORDER BY relevance DESC, category.name ASC",
  ].join(" ");

  console.log({ query_string, filter, programme });

  return await session
    .run(query_string, { filter, programme })
    .then((result) => {
      const categories = result.records.map((record) => {
        return {
          ... new Category(record.get("category").properties),
          relevance: record.get("relevance"),
        };
      });

      return categories;
    });
}

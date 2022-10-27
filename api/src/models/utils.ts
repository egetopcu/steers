export function parseQueryArray(q: undefined | string | string[]): number[] {
  switch (typeof q) {
    case "string":
      return [parseInt(q)];
    case "object": // array
      return q.map((e) => parseInt(e));
    case "undefined":
      return [];
  }
}

export function parseQuery(q: undefined | string | string[]): number {
  switch (typeof q) {
    case "string":
      return parseInt(q);
    case "object": // array
      console.warn("unexpected array in query parameter", q);
      return q.map((e) => parseInt(e))[0];
    case "undefined":
      return 0;
  }
}

type AtLeastOne<T> = [T, ...T[]];

interface IQueryClauses {
  match: Array<string>;
  where: Array<string>;
  return_: Array<string>;

  order_by?: Array<string>;
  optional_match?: Array<string>;
}

function hasAtLeastOne<T>(arr: T[] | undefined): arr is AtLeastOne<T> {
  return typeof arr !== "undefined" && arr.length >= 1;
}

function buildQueryPart(keyword: string, clauses: AtLeastOne<string>, sep: string = ", "){
  return keyword + " " + clauses.join(sep)
}

export function buildQuery({ match, where, return_, order_by, optional_match}: IQueryClauses) {
    if (!hasAtLeastOne(match)){
      throw new Error("query requires at least one MATCH clause")
    }
    if (!hasAtLeastOne(return_)){
      throw new Error("query requires at least one RETURN clause")
    }

    const parts = [
      buildQueryPart("MATCH", match),
    ]

    if (hasAtLeastOne(optional_match)){
      parts.push(buildQueryPart("OPTIONAL MATCH", optional_match))
    }

    if (hasAtLeastOne(where)){
      parts.push(buildQueryPart("WHERE", where, " AND "))
    }

    parts.push(buildQueryPart("RETURN", return_))
    
    if(hasAtLeastOne(order_by)){
      parts.push(buildQueryPart("ORDER BY", order_by))
    }

    return parts.join("\n")
};
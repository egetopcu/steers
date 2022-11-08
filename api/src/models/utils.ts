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

export type AtLeastOne<T> = [T, ...T[]];

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

export function buildClause(
    keyword: string,
    clauses: string[],
    sep: string = ", "
) {
    if (clauses.length == 0) {
        console.warn(`empty ${keyword} clause`);

        return "";
    }
    return keyword + " " + clauses.join(sep);
}

export function buildQuery({
    match,
    where,
    return_,
    order_by,
    optional_match,
}: IQueryClauses) {
    if (!hasAtLeastOne(match)) {
        throw new Error("query requires at least one MATCH clause");
    }
    if (!hasAtLeastOne(return_)) {
        throw new Error("query requires at least one RETURN clause");
    }

    const parts = [buildClause("MATCH", match)];

    if (hasAtLeastOne(optional_match)) {
        parts.push(buildClause("OPTIONAL MATCH", optional_match));
    }

    if (hasAtLeastOne(where)) {
        parts.push(buildClause("WHERE", where, " AND "));
    }

    parts.push(buildClause("RETURN", return_));

    if (hasAtLeastOne(order_by)) {
        parts.push(buildClause("ORDER BY", order_by));
    }

    return parts.join("\n");
}

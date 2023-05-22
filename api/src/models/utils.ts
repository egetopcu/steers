import { QueryData } from "@steers/common";

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

export function buildRelatedQuery(
    resource: string,
    query: QueryData,
    additional_expressions?: {
        required?: { match?: string[]; where?: string[] };
        optional?: { match?: string[]; where?: string[] };
    }
) {
    const clauses = [];
    const return_fields: [string, ...string[]] = [
        "resource",
        "tf",
        "df",
        "relevance",
    ];

    const required_match_expressions: string[] = [
        `(resource:${resource})--(essay:Essay)`,
        ...(additional_expressions?.required?.match ?? []),
    ];
    const required_where_expressions: string[] = [
        ...(additional_expressions?.required?.where ?? []),
    ];

    if (query.filter) {
        query.filter = `(?i).*${query.filter}.*`;
        required_where_expressions.push("resource.name =~ $filter");
    }

    if (query.required?.programme) {
        required_match_expressions.push(
            "(essay)--(:Programme {id: $required.programme })"
        );
    }

    if (query.required?.categories?.length) {
        required_match_expressions.push("(essay)--(category:Category)");
        required_where_expressions.push("category.id IN $required.categories");
        if (resource === "Category") {
            required_where_expressions.push(
                "NOT resource.id IN $required.categories"
            );
        }
    }

    if (query.required?.topics?.length) {
        required_match_expressions.push("(essay)--(topic:Topic)");
        required_where_expressions.push("topic.id IN $required.topics");
        if (resource === "Topic") {
            required_where_expressions.push(
                "NOT resource.id IN $required.topics"
            );
        }
    }

    if (query.required?.tutors?.length) {
        required_match_expressions.push("(essay)--(tutor:Tutor)");
        required_where_expressions.push("tutor.id IN $required.tutors");
        if (resource === "Tutor") {
            required_where_expressions.push(
                "NOT resource.id IN $required.tutors"
            );
        }
    }

    if (query.required?.clients?.length) {
        required_match_expressions.push("(essay)--(client:Client)");
        required_where_expressions.push("client.id IN $required.clients");
        if (resource === "Client") {
            required_where_expressions.push(
                "NOT resource.id IN $required.clients"
            );
        }
    }

    clauses.push(buildClause("MATCH", required_match_expressions));
    if (required_where_expressions.length) {
        clauses.push(buildClause("WHERE", required_where_expressions, " AND "));
    }

    const scope_limit = Math.min((query.limit ?? 100) * 10, 500);
    clauses.push(
        buildClause("WITH", [
            "resource",
            "toFloat(count(essay)) as tf",
            "toFloat(resource.freq) as df",
            "toFloat(count(essay))/toFloat(resource.freq) * log(resource.freq) as relevance",
        ]),
        "ORDER BY relevance DESC",
        buildClause("LIMIT", [scope_limit.toString()])
    );

    const optional_match_expressions: string[] = [
        "(resource)--(essay:Essay)--(selected)",
        ...(additional_expressions?.optional?.match ?? []),
    ];
    const optional_where_expressions: string[] = [
        ...(additional_expressions?.optional?.where ?? []),
    ];

    if (query.optional?.programme) {
        optional_where_expressions.push(
            "(selected:Programme and selected.id = $optional.programme)"
        );
    }

    if (query.optional?.categories?.length) {
        let expressions = [
            "selected:Category",
            "selected.id IN $optional.categories",
        ];

        // if (resource === "Category") {
        //     expressions.push("NOT resource.id IN $optional.categories");
        // }

        optional_where_expressions.push(`(${expressions.join(" AND ")})`);
    }

    if (query.optional?.topics?.length) {
        let expressions = ["selected:Topic", "selected.id IN $optional.topics"];

        // if (resource === "Topic") {
        //     expressions.push("NOT resource.id IN $optional.topics");
        // }

        optional_where_expressions.push(`(${expressions.join(" AND ")})`);
    }

    if (query.optional?.tutors?.length) {
        let expressions = ["selected:Tutor", "selected.id IN $optional.tutors"];

        // if (resource === "Tutor") {
        //     expressions.push("NOT resource.id IN $optional.tutors");
        // }

        optional_where_expressions.push(`(${expressions.join(" AND ")})`);
    }

    if (query.optional?.clients?.length) {
        let expressions = [
            "selected:Client",
            "selected.id IN $optional.clients",
        ];

        // if (resource === "Client") {
        //     expressions.push("NOT resource.id IN $optional.clients");
        // }

        optional_where_expressions.push(`(${expressions.join(" AND ")})`);
    }

    if (optional_where_expressions.length > 0) {
        clauses.push(
            buildClause("OPTIONAL MATCH", optional_match_expressions),
            buildClause("WHERE", optional_where_expressions, " OR "),
            buildClause("WITH", [
                ...return_fields,
                "toFloat(count(essay)) as rf",
                "toFloat(count(essay))/df * log(resource.freq) as similarity",
            ]) //,
            // buildClause("WHERE", ["similarity > 0"])
        );
        return_fields.push("rf", "similarity");
    }

    if (!query.sort) {
        if (optional_where_expressions.length > 0) {
            query.sort = "relevance * similarity DESC";
        } else {
            query.sort = "relevance DESC";
        }
    }

    clauses.push(
        buildClause("RETURN", return_fields),
        buildClause("ORDER BY", [query.sort.replace("[^a-zA-Z ]", "")]),
        "LIMIT $limit"
    );

    const query_string = clauses.join(" ");
    // if (resource == "Tutor") {
    console.log({ resource, query, query_string });
    // }
    return query_string;
}

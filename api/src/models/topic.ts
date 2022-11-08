import { IdType, TopicData } from "@steers/common";
import { Session, int } from "neo4j-driver";
import { AtLeastOne, buildClause } from "./utils";

export class Topic {
    public id: IdType;
    public name: string;

    constructor(record: TopicData) {
        this.id = record.id;
        this.name = record.name;
    }
}

export function related(
    session: Session,
    filter: string,
    programme: number,
    categories: number[],
    client: number,
    tutors: number[] = [],
    topics: number[] = [],
    sort: string = "relevance DESC",
    limit: number = 100
): Promise<Topic[]> {
    const query = {
        filter: `(?i).*${filter}.*`,
        programme,
        categories,
        client,
        tutors,
        topics,
        sort,
        limit: int(Math.min(limit, 100)),
    };

    // initial topics are filtered based on their connection to
    // category, programme and search filter (relevance score).
    const match_expressions: AtLeastOne<string> = [
        "(topic:Topic)--(essay:Essay)",
    ];
    const filter_expressions = [];

    // keeps track of variables created in filter and similarity
    // matches
    const return_expressions: string[] = ["topic", "tf", "df", "relevance"];

    if (filter && filter !== "") {
        filter_expressions.push("topic.name =~ $filter");
    }

    // aggregate finished clauses
    const clauses = [];

    if (categories && categories.length > 0) {
        if (Array.isArray(categories)) {
            match_expressions.push("(essay)--(category:Category)");
            filter_expressions.push("category.id IN $categories");
        } else {
            match_expressions.push(
                "(essay)--(category:Category { id: $categories })"
            );
        }
    }

    if (programme) {
        match_expressions.push(
            "(essay)--(programme:Programme { id: $programme })"
        );
    }

    clauses.push(
        buildClause("MATCH", match_expressions),
        buildClause("WHERE", filter_expressions, " AND "),
        buildClause("WITH", [
            "topic",
            "toFloat(count(essay)) AS tf",
            "toFloat(topic.freq) as df",
            "toFloat(count(essay))/toFloat(topic.freq) * sqrt(topic.freq) as relevance",
        ]),
        // dramatically speeds up following optional matches
        "ORDER BY relevance DESC",
        "LIMIT 500"
    );

    // client, tutors and other selected topics are optionally
    // matched (similarity score).
    const similarity_match_expressions: string[] = [
        "(topic)--(essay:Essay)--(selected)",
    ];
    const similarity_filter_expressions: string[] = [];

    if (client) {
        similarity_filter_expressions.push(
            "(selected:Client AND selected.id = $client)"
        );
    }

    if (tutors?.length) {
        similarity_filter_expressions.push(
            "(selected:Tutor AND selected.id IN $tutors)"
        );
    }

    if (topics?.length) {
        similarity_filter_expressions.push(
            "(selected:Topic AND selected.id IN $topics)"
        );
    }

    if (similarity_filter_expressions.length > 0) {
        clauses.push(
            buildClause("OPTIONAL MATCH", similarity_match_expressions),
            buildClause("WHERE", similarity_filter_expressions, " OR "),
            buildClause("WITH", [
                ...return_expressions,
                "toFloat(count(essay)) as rf",
                "toFloat(count(essay))/df * sqrt(topic.freq) as similarity",
            ])
        );
        return_expressions.push("rf", "similarity");
    }

    clauses.push(
        buildClause("RETURN", return_expressions),
        buildClause("ORDER BY", [sort.replace("[^a-zA-Z ]", "")]),
        "LIMIT $limit"
    );

    const query_string = clauses.join(" ");

    console.log(query_string, { query });

    return session.run(query_string, query).then((result) => {
        return result.records.map((record) => {
            const { topic, ...properties } = record.toObject();
            return {
                ...new Topic(record.get("topic").properties),
                ...properties,
            };
        });
    });
}

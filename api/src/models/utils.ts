export const relatableProperties = [
    "tutors",
    "clients",
    "programmes",
    "categories",
    "topics",
] as const;
export const relatablePropertyLabel = {
    tutors: "Tutor",
    clients: "Client",
    programmes: "Programme",
    categories: "Category",
    topics: "Topic",
} as const;
export type RelatableProperty = typeof relatableProperties[number];
export type RelatableQuery = Partial<
    Record<RelatableProperty, string[] | string>
>;

export function _connected_query_part(node: string, label: string) {
    return `MATCH (${node})--(:Essay)--(${label.toLowerCase()}:${label})`;
}

export function _connected_query(label: string) {
    const node = label.toLowerCase();
    const others = relatableProperties.filter(
        (property) =>
            relatablePropertyLabel[property] !== label && property !== "topics"
    );

    let query_string = [`MATCH (${node}:${label} {id: $id})`];

    for (const other of others) {
        const other_label = relatablePropertyLabel[other];
        if (other_label !== label) {
            query_string.push(_connected_query_part(node, other_label));
        }
    }

    query_string.push(
        `RETURN ${others
            .map(
                (other) =>
                    `collect(DISTINCT ${relatablePropertyLabel[
                        other
                    ].toLowerCase()}) as ${other}`
            )
            .join(", ")}`
    );

    console.log(query_string.join("\n"));
    return "";
    return query_string.join("\n");
}

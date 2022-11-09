import type {
    CategoryData,
    ClientData,
    EssayData,
    ProgrammeData,
    QueryData,
    TopicData,
    TutorData,
} from "@steers/common";

const API_BASE = "http://localhost:3000";

export async function getCategories(query: QueryData): Promise<CategoryData[]> {
    const url = new URL("categories", API_BASE);
    console.log(query);
    return await fetch(url, {
        method: "POST",
        body: JSON.stringify(query),
        headers: { "Content-Type": "application/json" },
    }).then((result) => result.json());
}

export async function getProgrammes(
    query: QueryData
): Promise<ProgrammeData[]> {
    const url = new URL("programmes", API_BASE);
    return await fetch(url, {
        method: "POST",
        body: JSON.stringify(query),
        headers: { "Content-Type": "application/json" },
    }).then((result) => result.json());
}

export async function getClients(query: QueryData): Promise<ClientData[]> {
    const url = new URL("clients", API_BASE);
    return await fetch(url, {
        method: "POST",
        body: JSON.stringify(query),
        headers: { "Content-Type": "application/json" },
    }).then((result) => result.json());
}

export async function getTutors(query: QueryData): Promise<TutorData[]> {
    const url = new URL("tutors", API_BASE);
    return await fetch(url, {
        method: "POST",
        body: JSON.stringify(query),
        headers: { "Content-Type": "application/json" },
    }).then((result) => result.json());
}

export async function getTopics(query: QueryData): Promise<TopicData[]> {
    const url = new URL("topics", API_BASE);
    return await fetch(url, {
        method: "POST",
        body: JSON.stringify(query),
        headers: { "Content-Type": "application/json" },
    }).then((result) => result.json());
}

export async function getEssays(query: QueryData): Promise<
    (EssayData &
        Partial<{
            client: ClientData;
            topics: TopicData[];
            programme: ProgrammeData;
            categories: CategoryData[];
            tutors: TutorData[];
        }>)[]
> {
    const url = new URL("essays", API_BASE);
    return await fetch(url, {
        method: "POST",
        body: JSON.stringify(query),
        headers: { "Content-Type": "application/json" },
    }).then((result) => result.json());
}

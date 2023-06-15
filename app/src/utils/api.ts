import type {
    CategoryData,
    ClientData,
    EssayData,
    ProgrammeData,
    QueryData,
    TopicData,
    TutorData,
} from "@bdsi-utwente/steers-common";

const API_BASE = "http://localhost:3000/";
// const API_BASE = "https://steers-api.home.karel-kroeze.nl/";

async function getResource(path: string, query: QueryData): Promise<any[]> {
    const url = new URL(path, API_BASE);
    console.log({ resource: path, url: url.toString(), query });
    return await fetch(url, {
        method: "POST",
        body: JSON.stringify(query),
        headers: { "Content-Type": "application/json" },
    }).then((result) => result.json());
}

export async function getCategories(query: QueryData): Promise<CategoryData[]> {
    return getResource("categories", query);
}

export async function getProgrammes(
    query: QueryData
): Promise<ProgrammeData[]> {
    return getResource("programmes", query);
}

export async function getClients(query: QueryData): Promise<ClientData[]> {
    return getResource("clients", query);
}

export async function getTutors(query: QueryData): Promise<TutorData[]> {
    return getResource("tutors", query);
}

export async function getTopics(query: QueryData): Promise<TopicData[]> {
    return getResource("topics", query);
}

export async function getEssays(
    query: QueryData,
): Promise<EssayData[]> {
    return getResource("essays", query);
}

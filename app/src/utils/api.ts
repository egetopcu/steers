import type { SelectChoices } from "./types";

const API_BASE = "http://localhost:3000";

export async function getCategories(filter: string, programme: string) {
    const url = new URL("categories", API_BASE);
    url.searchParams.set("q", filter);
    url.searchParams.set("programme", programme);

    const categories: Record<string, string>[] = await fetch(
        url.toString()
    ).then((result) => result.json());
    return categories.map((c) => ({ value: c.id, label: c.name }));
}

export async function getProgrammes(filter: string): Promise<SelectChoices> {
    const url = new URL("programmes", API_BASE);
    url.searchParams.set("q", filter);

    const programmes: Record<string, string>[] = await fetch(
        url.toString()
    ).then((result) => result.json());
    return programmes
        .map((p) => ({ value: p.id, label: p.name }))
        .sort((a, b) => a.label.localeCompare(b.label));
}

export async function getClients(
    filter: string,
    programme: string,
    categories: string[],
    topics: string[],
    tutors: string[]
): Promise<SelectChoices> {
    const url = new URL("clients", API_BASE);
    url.searchParams.set("q", filter);
    url.searchParams.set("programme", programme);
    for (const category of categories) {
        url.searchParams.append("categories", category);
    }
    for (const topic of topics) {
        url.searchParams.append("topics", topic);
    }
    for (const tutor of tutors) {
        url.searchParams.append("tutors", tutor);
    }

    const clients: Record<string, string>[] = await fetch(url.toString()).then(
        (result) => result.json()
    );

    return clients.map((c) => ({
        value: c.id,
        label: c.name,
    }));
}

export async function getTutors(
    filter: string,
    programme: string,
    categories: string[],
    topics: string[],
    client: string
): Promise<SelectChoices> {
    return [];
}

export async function getTopics(
    filter: string,
    programme: string,
    categories: string[],
    tutors: string[],
    client: string
): Promise<SelectChoices> {
    const url = new URL("topics", API_BASE);
    url.searchParams.set("q", filter);
    url.searchParams.set("programme", programme);
    for (const category of categories) {
        url.searchParams.append("categories", category);
    }
    for (const tutor of tutors) {
        url.searchParams.append("tutors", tutor);
    }
    if (client) {
        url.searchParams.set("client", client);
    }

    const topics: Record<string, string>[] = await fetch(url.toString()).then(
        (result) => result.json()
    );

    return topics.map((t) => ({
      ...t,
      value: t.id,
      label: t.name,
    }));
}

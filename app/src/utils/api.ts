import type {
    CategoryData,
    ClientData,
    EssayData,
    ProgrammeData,
    TopicData,
    TutorData,
} from "@steers/common";
import type { IQuery } from "../stores";

const API_BASE = "http://localhost:3000";

const EMPTY_QUERY: IQuery = {
  categories: [],
  clients: [],
  topics: [],
  tutors: [],
};

export async function getCategories(
  filter: string,
  query: Partial<IQuery>
): Promise<TutorData[]> {
  const url = new URL("categories", API_BASE);
  url.searchParams.set("q", filter);

  query = Object.assign({}, EMPTY_QUERY, query);

  if (query.programme) {
    url.searchParams.set("programme", query.programme.id.toString());
  }

  for (const category of query.categories) {
    url.searchParams.append("categories", category.id.toString());
  }
  for (const tutor of query.tutors) {
    url.searchParams.append("tutors", tutor.id.toString());
  }
  for (const client of query.clients) {
    url.searchParams.append("clients", client.id.toString());
  }
  for (const topic of query.topics) {
    url.searchParams.append("topics", topic.id.toString());
  }

  return await fetch(url.toString()).then((result) => result.json());
}

export async function getProgrammes(filter: string): Promise<ProgrammeData[]> {
  const url = new URL("programmes", API_BASE);
  url.searchParams.set("q", filter);

  return await fetch(url.toString()).then((result) => result.json());
}

export async function getClients(
  filter: string,
  programme: string,
  categories: string[],
  topics: string[],
  tutors: string[]
): Promise<ClientData[]> {
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

  return await fetch(url.toString()).then((result) => result.json());
}

export async function getTutors(
  filter: string,
  query: IQuery
): Promise<TutorData[]> {
  const url = new URL("tutors", API_BASE);
  url.searchParams.set("q", filter);

  if (query.programme) {
    url.searchParams.set("programme", query.programme.id.toString());
  }

  for (const category of query.categories) {
    url.searchParams.append("categories", category.id.toString());
  }
  for (const tutor of query.tutors) {
    url.searchParams.append("tutors", tutor.id.toString());
  }
  for (const client of query.clients) {
    url.searchParams.append("clients", client.id.toString());
  }
  for (const topic of query.topics) {
    url.searchParams.append("topics", topic.id.toString());
  }

  return await fetch(url.toString()).then((result) => result.json());
}

export async function getTopics(
    filter: string,
    query: IQuery
): Promise<TopicData[]> {
    const url = new URL("topics", API_BASE);
    url.searchParams.set("q", filter);
    url.searchParams.set("programme", query.programme.id.toString());

    for (const category of query.categories) {
        url.searchParams.append("categories", category.id.toString());
    }
    for (const tutor of query.tutors) {
        url.searchParams.append("tutors", tutor.id.toString());
    }
    for (const client of query.clients) {
        url.searchParams.append("clients", client.id.toString());
    }
    for (const topic of query.topics) {
        url.searchParams.append("topics", topic.id.toString());
    }

    return await fetch(url.toString()).then((result) => result.json());
}

export async function getEssays(
    programme: string,
    categories: string[],
    topics: string[],
    tutors: string[],
    client: string
): Promise<
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
    for (const topic of topics) {
        url.searchParams.append("topics", topic);
    }

    return await fetch(url.toString()).then((result) => result.json());
}

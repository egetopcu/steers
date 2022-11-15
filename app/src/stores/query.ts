import type {
    ClientData,
    ProgrammeData,
    TopicData,
    TutorData,
    CategoryData,
} from "@steers/common";
import { writable } from "svelte/store";

export interface IQuery {
    programme?: ProgrammeData;
    categories?: CategoryData[];
    tutors?: TutorData[];
    topics?: TopicData[];
    clients?: ClientData[];

    goal?: "supervisor" | "topic" | "host";
}

const EMPTY_QUERY: IQuery = {};

const TEST_QUERY: IQuery = {
    programme: {
        id: 14,
        name: "Psychology BSc",

        df: 42,
        tf: 42,
        relevance: 42,
    },
    categories: [
        {
            id: 41,
            name: "brain and nervous system disorders",
            parent_id: 5,
            relevance: 9.88838950049907,
            df: 405,
            tf: 199,
        },
    ],
    tutors: [],
    topics: [],
    clients: [],
};

export const query = writable<IQuery>(TEST_QUERY);

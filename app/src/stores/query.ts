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
  categories: CategoryData[];
  goal?: "supervisor" | "topic" | "host";
  tutors: TutorData[];
  topics: TopicData[];
  clients: ClientData[];
}

const EMPTY_QUERY = {
  programme: undefined,
  categories: [],
  goal: undefined,
  tutors: [],
  topics: [],
  clients: [],
};

const TEST_QUERY = {
  programme: {
    id: 14,
    name: "Psychology BSc",
  },
  categories: [
    {
      id: 41,
      name: "brain and nervous system disorders",
      parent_id: 5,
      relevance: 9.88838950049907,
      frequency: 405,
      count: 199,
    },
  ],
  tutors: [],
  topics: [],
  clients: [],
};

export const query = writable<IQuery>(TEST_QUERY);

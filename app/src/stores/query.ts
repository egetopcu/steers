import { writable } from "svelte/store";

interface IQuery {
  programme?: number;
  categories: number[];
  goal?: "supervisor" | "topic" | "host";
  tutors: number[];
  topics: number[];
  clients: number[];
}

export const query = writable<IQuery>({
  programme: undefined,
  categories: [],
  goal: undefined,
  tutors: [],
  topics: [],
  clients: [],
});

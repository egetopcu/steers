import { writable } from "svelte/store";

export interface BreadcrumbData {
  path: string;
  label: string;
}

export const breadcrumbs = writable<BreadcrumbData[]>([]);

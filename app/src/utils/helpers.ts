import type { BaseData, IdType } from "@bdsi-utwente/steers-common";
import type { SelectChoice, SelectChoices } from "./types";

export type StringKeys<T extends {}> = {
  [K in keyof T]-?: T[K] extends string ? K : never;
}[keyof T];

export function getChoice<D extends { id: IdType } = BaseData>(
  data: D,
  labelKey: StringKeys<D> | ((el: D) => string) = "name" as any
): SelectChoice {
  if (typeof labelKey === "function") {
    return { label: labelKey(data), value: data.id.toString() };
  } else {
    return { label: data[labelKey] as any, value: data.id.toString() };
  }
}

export function mapChoices<D extends { id: IdType } = BaseData>(
  collection: D[],
  labelKey: StringKeys<D> | ((el: D) => string) = "name" as any
): SelectChoices {
  return collection.map((element) => getChoice(element, labelKey));
}

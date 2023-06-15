import { FacultyData, IdType } from "@bdsi-utwente/steers-common";

export class Faculty {
  id: IdType;
  name: string;

  constructor(record: FacultyData) {
    this.id = record.id;
    this.name = record.name;
  }
}

import _ from "lodash";
import { Session } from "neo4j-driver";
import { IdType, TutorData } from "@steers/common";

export class Tutor {
  public id: IdType;

  constructor(record: TutorData) {
    this.id = record.id;
  }
}

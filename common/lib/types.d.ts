import { Node as Neo4JNode, Integer, Date } from "neo4j-driver";
export declare type Properties = {
  [key: string]: any;
};
export declare type IdType = number;
export declare type Node<P extends Properties = Properties> = Neo4JNode<
  Integer,
  P
>;
export interface BaseData {
  id: IdType;
  name: string;
}
export interface CategoryData extends BaseData {
  parent_id?: IdType;
}
export interface ClientData extends BaseData {}
export interface FacultyData extends BaseData {}
export interface ProgrammeData extends BaseData {
  code: string;
}
export interface TopicData extends BaseData {}
export interface TutorData {
  id: IdType;
  names: string[];
}
export interface EssayData {
  id: IdType;
  author: string;
  title: string;
  date: Date;
  type: string;
  language?: string;
  abstract?: string;
  summary_en?: string;
  restricted: boolean;
}

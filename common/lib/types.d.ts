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
export interface RelevanceData {
    tf: number;
    df: number;
    relevance: number;

    rf?: number;
    similarity?: number;
}
export interface CategoryData extends BaseData, RelevanceData {
    parent_id?: IdType;
}
export interface ClientData extends BaseData, RelevanceData {}
export interface FacultyData extends BaseData {}
export interface ProgrammeData extends BaseData {
    code?: string;
}
export interface TopicData extends BaseData, RelevanceData {}
export interface TutorData extends RelevanceData {
    id: IdType;
    name: string;
    email?: string;
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

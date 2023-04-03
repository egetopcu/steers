import { Node as Neo4JNode, Integer, Date } from "neo4j-driver";

export type Properties = { [key: string]: any };
export type IdType = string | number;

export type Node<P extends Properties = Properties> = Neo4JNode<Integer, P>;

export interface BaseData {
    id: IdType;
    name: string;
}

export interface RelatedData {
    tf: number;
    df: number;
    relevance: number;

    rf?: number;
    similarity?: number;
}

export interface CategoryData extends BaseData, RelatedData {
    parent_id?: IdType;
}

export interface ClientData extends BaseData, RelatedData {}
export interface FacultyData extends BaseData, RelatedData {}
export interface ProgrammeData extends BaseData, RelatedData {}

export interface TopicData extends BaseData, RelatedData {}
export interface TutorData extends BaseData, RelatedData {
    mail: string;
}

export type ResourceData<T extends RelatedData> = Omit<T, keyof RelatedData>;

export interface EssayData extends BaseData {
    author: string;
    title: string;
    date: Date;
    abstract: string;

    programme?: ResourceData<ProgrammeData>;
    categories: ResourceData<CategoryData>[];
    topics: ResourceData<TopicData>[];
    tutors: ResourceData<TutorData>[];
    clients: ResourceData<ClientData>[];
}

export interface QueryData {
    required?: {
        programme?: IdType;
        categories?: IdType[];
        topics?: IdType[];
        tutors?: IdType[];
        clients?: IdType[];
    };
    optional?: {
        programme?: IdType;
        categories?: IdType[];
        topics?: IdType[];
        tutors?: IdType[];
        clients?: IdType[];
    };
    filter?: string;
    sort?: string;
    limit?: number;
}

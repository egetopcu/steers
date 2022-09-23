export interface FacultyData {
    id: number;
    name: string;
}
export class Faculty {
    id: number;
    name: string;

    constructor(record: FacultyData) {
        this.id = record.id;
        this.name = record.name;
    }
}

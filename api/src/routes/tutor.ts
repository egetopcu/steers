import { RequestHandler } from "express";
import * as Tutors from "../models/tutor";

export const related: RequestHandler = async (req, res, next) => {
    try {
        const related_tutors = await Tutors.related(
            req.neo4j_session,
            req.body
        );
        res.json(related_tutors);
    } catch (error) {
        next(error);
    }
};

import { RequestHandler } from "express";
import * as Topics from "../models/topic";

export const related: RequestHandler = async (req, res, next) => {
    try {
        const related_topics = await Topics.related(
            req.neo4j_session,
            req.body
        );
        res.json(related_topics);
    } catch (error) {
        next(error);
    }
};

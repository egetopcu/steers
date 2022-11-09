import { RequestHandler } from "express";
import * as Topics from "../models/topic";
import { parseQuery, parseQueryArray } from "../models/utils";

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

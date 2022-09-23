import { RequestHandler } from "express";
import * as Topics from "../models/topic";

export const filter: RequestHandler = async (req, res, next) => {
    const {
        q: filter,
        programme,
        categories,
        tutors,
        client,
    } = req.query as Record<string, any>;

    try {
        const topics = await Topics.filter(
            req.neo4j_session,
            filter,
            programme,
            categories,
            client,
            tutors
        );
        res.json(topics);
    } catch (error) {
        next(error);
    }
};

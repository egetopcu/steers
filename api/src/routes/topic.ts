import { RequestHandler } from "express";
import * as Topics from "../models/topic";
import { parseQuery, parseQueryArray } from "../models/utils";

export const filter: RequestHandler = async (req, res, next) => {
    const {
        q: filter,
        programme,
        categories,
        tutors,
        client,
        topics,
        sort,
        limit,
    } = req.query as Record<string, undefined | string | string[]>;

    try {
        const related_topics = await Topics.related(
            req.neo4j_session,
            filter as string,
            parseQuery(programme),
            parseQueryArray(categories),
            parseQuery(client),
            parseQueryArray(tutors),
            parseQueryArray(topics),
            Array.isArray(sort) ? sort.join(", ") : sort,
            parseQuery(limit) || 100
        );
        res.json(related_topics);
    } catch (error) {
        next(error);
    }
};

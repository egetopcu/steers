import * as Clients from "../models/client";
import { RequestHandler } from "express";

export const filter: RequestHandler = async (req, res, next) => {
    const {
        q: filter,
        programme,
        categories,
        tutors,
        topics,
    } = req.query as Record<string, any>;

    try {
        const clients = await Clients.filter(
            req.neo4j_session,
            filter,
            programme,
            categories,
            topics,
            tutors
        );
        res.json(clients);
    } catch (error) {
        next(error);
    }
};

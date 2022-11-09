import * as Clients from "../models/client";
import { RequestHandler } from "express";

export const filter: RequestHandler = async (req, res, next) => {
    try {
        const clients = await Clients.related(req.neo4j_session, req.body);
        res.json(clients);
    } catch (error) {
        next(error);
    }
};

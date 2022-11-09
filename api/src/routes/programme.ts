import { RequestHandler } from "express";
import _ from "lodash";
import * as Programmes from "../models/programme";

export const related: RequestHandler = async (req, res, next) => {
    const query = req.body;

    try {
        const essays = await Programmes.related(req.neo4j_session, query);
        res.json(essays);
    } catch (error) {
        next(error);
    }
};

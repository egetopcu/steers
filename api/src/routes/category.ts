import { RequestHandler } from "express";
import _ from "lodash";
import * as Categories from "../models/category";

export const filter: RequestHandler = async (req, res, next) => {
    try {
        const categories = await Categories.related(
            req.neo4j_session,
            req.body
        );
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

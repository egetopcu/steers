import { RequestHandler } from "express";
import _ from "lodash";
import * as Essays from "../models/essay";

export const related: RequestHandler = async (req, res, next) => {
    try {
        console.log({ req_body: req.body });
        const related_essays = await Essays.related(
            req.neo4j_session,
            req.body
        );
        res.json(related_essays);
    } catch (error) {
        next(error);
    }
};

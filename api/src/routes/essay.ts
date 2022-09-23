import { NextFunction, Request, Response, RequestHandler } from "express";
import _ from "lodash";
import { relatableProperties } from "../models/utils";
import * as Essays from "../models/essay";

export const getById: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.query;
    try {
        const essay = await Essays.getById(req.neo4j_session, id as string);
        res.json(essay);
    } catch (error) {
        next(error);
    }
};

export const getRelated: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const query = _.pick(
        req.query as Record<string, string | string[]>,
        relatableProperties
    );

    try {
        const categories = await Essays.getRelated(req.neo4j_session, query);
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

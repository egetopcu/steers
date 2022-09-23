import { NextFunction, Request, RequestHandler, Response } from "express";
import _ from "lodash";
import * as Categories from "../models/category";
import { relatableProperties } from "../models/utils";

export const findMany: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const query = _.pick(
        req.query as Record<string, string>,
        Categories.searchableAttributes
    );

    try {
        const categories = await Categories.findMany(req.neo4j_session, query);
        res.json(categories);
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
        const categories = await Categories.getRelated(
            req.neo4j_session,
            query
        );
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

export const getConnected: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const categories = await Categories.getConnected(
            req.neo4j_session,
            req.params.id
        );
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

export const filter: RequestHandler = async (req, res, next) => {
    const { q: filter, programme } = req.query as Record<string, string>;

    try {
        const categories = await Categories.filter(
            req.neo4j_session,
            filter,
            programme
        );
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

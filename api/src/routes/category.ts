import { RequestHandler } from "express";
import _ from "lodash";
import * as Categories from "../models/category";
import { parseQuery, parseQueryArray } from "../models/utils";

export const filter: RequestHandler = async (req, res, next) => {
  const { q: filter, required, optional, sort, limit } = req.query as any;

  try {
    const categories = await Categories.related(req.neo4j_session, {
      filter,
      sort,
      limit: limit ? parseInt(limit) : undefined,
      required: {
        programme: parseQuery(required?.programme),
        categories: parseQueryArray(required?.categories),
        topics: parseQueryArray(required?.topics),
        tutors: parseQueryArray(required?.tutors),
        clients: parseQueryArray(required?.clients),
      },
      optional: {
        programme: parseQuery(optional?.programme),
        categories: parseQueryArray(optional?.categories),
        topics: parseQueryArray(optional?.topics),
        tutors: parseQueryArray(optional?.tutors),
        clients: parseQueryArray(optional?.clients),
      },
    });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

import { RequestHandler } from "express";
import _ from "lodash";
import * as Categories from "../models/category";
import { parseQuery, parseQueryArray } from "../models/utils";

export const filter: RequestHandler = async (req, res, next) => {
  const {
    q: filter,
    programme,
    category,
  } = req.query as Record<string, string | string[] | undefined>;

  try {
    const categories = await Categories.filter(
      req.neo4j_session,
      filter ? filter.toString() : "",
      parseQuery(programme),
      parseQueryArray(category)
    );
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

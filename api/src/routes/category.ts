import { RequestHandler } from "express";
import _ from "lodash";
import * as Categories from "../models/category";
import { parseQuery } from "../models/utils";

export const filter: RequestHandler = async (req, res, next) => {
  const { q: filter, programme } = req.query as Record<
    string,
    string | string[] | undefined
  >;

  try {
    const categories = await Categories.filter(
      req.neo4j_session,
      filter as string,
      parseQuery(programme)
    );
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

import { RequestHandler } from "express";
import * as Topics from "../models/topic";
import { parseQuery, parseQueryArray } from "../models/utils";

export const filter: RequestHandler = async (req, res, next) => {
  const {
    q: filter,
    programme,
    categories,
    tutors,
    client,
  } = req.query as Record<string, undefined | string | string[]>;

  try {
    const topics = await Topics.filter(
      req.neo4j_session,
      filter as string,
      parseQuery(programme),
      parseQueryArray(categories),
      parseQuery(client),
      parseQueryArray(tutors)
    );
    res.json(topics);
  } catch (error) {
    next(error);
  }
};

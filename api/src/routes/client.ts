import * as Clients from "../models/client";
import { RequestHandler } from "express";
import { parseQuery, parseQueryArray } from "../models/utils";

export const filter: RequestHandler = async (req, res, next) => {
  const {
    q: filter,
    programme,
    categories,
    tutors,
    topics,
  } = req.query as Record<string, string | string[] | undefined>;

  try {
    const clients = await Clients.filter(
      req.neo4j_session,
      filter as string,
      parseQuery(programme),
      parseQueryArray(categories),
      parseQueryArray(topics),
      parseQueryArray(tutors)
    );
    res.json(clients);
  } catch (error) {
    next(error);
  }
};

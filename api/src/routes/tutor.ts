import { RequestHandler } from "express";
import * as Tutors from "../models/tutor";
import { parseQuery, parseQueryArray } from "../models/utils";

export const related: RequestHandler = async (req, res, next) => {
  const {
    q: filter,
    programme,
    categories,
    tutors,
    clients,
    topics,
    sort,
    limit,
  } = req.query as Record<string, undefined | string | string[]>;

  try {
    const related_tutors = await Tutors.related(
      req.neo4j_session,
      filter as string,
      parseQuery(programme),
      parseQueryArray(categories),
      parseQueryArray(clients),
      parseQueryArray(tutors),
      parseQueryArray(topics),
      Array.isArray(sort) ? sort.join(", ") : sort,
      parseQuery(limit) || 100
    );
    res.json(related_tutors);
  } catch (error) {
    next(error);
  }
};

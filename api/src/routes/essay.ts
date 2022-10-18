import { RequestHandler } from "express";
import _ from "lodash";
import * as Essays from "../models/essay";
import { parseQuery, parseQueryArray } from "../models/utils";

export const filter: RequestHandler = async (req, res, next) => {
  const { programme, categories, tutors, topics, client } = req.query as Record<
    string,
    string | string[] | undefined
  >;

  try {
    const essays = await Essays.filter(
      req.neo4j_session,
      parseQuery(programme),
      parseQueryArray(categories),
      parseQueryArray(tutors),
      parseQueryArray(topics),
      parseQuery(client)
    );
    res.json(essays);
  } catch (error) {
    next(error);
  }
};

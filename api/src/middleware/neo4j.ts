import { Request, Response, NextFunction, RequestHandler } from "express";
import neo4j, { Session } from "neo4j-driver";

declare global {
    namespace Express {
        export interface Request {
            neo4j_session: Session;
        }
    }
}

const db = neo4j.driver(
    process.env.NEO4J_URI!,
    neo4j.auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PASSWORD!)
);

export const handle_neo4j_session: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    req.neo4j_session ??= db.session();

    res.on("finish", () => {
        req.neo4j_session.close();
    });
    next();
};


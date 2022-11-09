import { config } from "dotenv";
config({ debug: true, path: "../.env" });
console.log({ server: process.env.NEO4J_URI });

import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";

import { handle_neo4j_session } from "./middleware/neo4j";
import * as category from "./routes/category";
import * as essay from "./routes/essay";
import * as programme from "./routes/programme";
import * as client from "./routes/client";
import * as topic from "./routes/topic";
import * as tutor from "./routes/tutor";

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(handle_neo4j_session);

app.get("/", (req, res) => {
    res.send("Hello World!!");
});

app.all("/programmes", programme.related);
app.all("/categories", category.filter);
app.all("/clients", client.filter);
app.all("/topics", topic.related);
app.all("/essays", essay.filter);
app.all("/tutors", tutor.related);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error({ error: err });
    res.status(err.status ?? 500).send(
        "<pre>" + (err.message ?? "Internal Server Error") + "</pre>"
    );
});

const PORT = process.env.STEERS_API_PORT
    ? parseInt(process.env.STEERS_API_PORT)
    : 3000;
const HOST = process.env.STEERS_API_HOST ? process.env.STEERS_API_HOST : "::";
app.listen(PORT, HOST, () => {
    console.log(`Listening on port ${PORT}`);
});

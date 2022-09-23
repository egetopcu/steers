import { config } from "dotenv";
config({ debug: true, path: "../.env" });

import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import _ from "lodash";

import { handle_neo4j_session } from "./middleware/neo4j";
import * as category from "./routes/category";
import * as essay from "./routes/essay";
import * as programme from "./routes/programme";
import * as client from "./routes/client";
import * as topic from "./routes/topic";

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(handle_neo4j_session);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/programmes", programme.filter);
app.get("/categories", category.filter);
app.get("/clients", client.filter);
app.get("/topics", topic.filter);
// app.get("/essays/related", essay.getRelated);
// app.get("/categories/find", category.findMany);
// app.get("/categories/related", category.getRelated);
// app.get("/categories/connected/:id", category.getConnected);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error({ error: err });
  res
    .status(err.status ?? 500)
    .send("<pre>" + (err.message ?? "Internal Server Error") + "</pre>");
});

const PORT = process.env.STEERS_API_PORT
  ? parseInt(process.env.STEERS_API_PORT)
  : 3000;
const HOST = process.env.STEERS_API_HOST ? process.env.STEERS_API_HOST : "::";
app.listen(PORT, HOST, () => {
  console.log(`Listening on port ${PORT}`);
});


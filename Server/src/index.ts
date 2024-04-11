import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { migrateDB } from "./database/migrate";
import { AppError, errorHandler } from "./middlewares/errorHandler";
import { users } from "./model/schema";
import db from "./database/connection";
import router from "./routes";
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.SERVER_PORT || 7000;

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(express.json());
app.use("/api", router);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../model/schema";

require('dotenv').config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE URL is missing");
}

const connectionString = process.env.DATABASE_URL;
console.log("Database URL:", connectionString);

const client = postgres(connectionString);
const db = drizzle(client, { schema });

export default db;
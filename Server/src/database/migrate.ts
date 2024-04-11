import { migrate } from "drizzle-orm/postgres-js/migrator";
import db from "./connection";

export const migrateDB = async () => {
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("database migrated");
};

migrateDB();
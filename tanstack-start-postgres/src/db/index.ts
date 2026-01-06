import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { getDatabaseUrl } from "./database-url";

const databaseUrl = getDatabaseUrl();

const db = drizzle(databaseUrl);
export { db };

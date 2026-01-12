import { defineConfig } from "drizzle-kit";
import { getDatabaseUrl } from "./db/database-url";

const databaseUrl = getDatabaseUrl();

export default defineConfig({
  out: "./drizzle",
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});

export function getDatabaseUrl() {
  const postgresUser = process.env.POSTGRES_USER;
  const postgresPassword = process.env.POSTGRES_PASSWORD;
  const postgresDb = process.env.POSTGRES_DB;

  // During build time, environment variables may not be available
  // Return a placeholder - actual connection only happens at runtime
  if (!postgresUser || !postgresPassword || !postgresDb) {
    return "postgres://placeholder:placeholder@localhost:5432/placeholder";
  }

  // In production, we use the service name 'postgres' as the host
  // In development, we connect to localhost
  const host = process.env.NODE_ENV === "production" ? "postgres" : "localhost";

  return `postgres://${postgresUser}:${postgresPassword}@${host}:5432/${postgresDb}`;
}

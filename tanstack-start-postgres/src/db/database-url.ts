export function getDatabaseUrl() {
  const postgresUser = process.env.POSTGRES_USER;
  if (!postgresUser) {
    throw new Error("POSTGRES_USER environment variable not found");
  }

  const postgresPassword = process.env.POSTGRES_PASSWORD;
  if (!postgresPassword) {
    throw new Error("POSTGRES_PASSWORD environment variable not found");
  }

  const postgresDb = process.env.POSTGRES_DB;
  if (!postgresDb) {
    throw new Error("POSTGRES_DB environment variable not found");
  }

  // In production, we use the service name 'postgres' as the host
  // In development, we connect to localhost
  const host = process.env.NODE_ENV === "production" ? "postgres" : "localhost";

  return `postgres://${postgresUser}:${postgresPassword}@${host}:5432/${postgresDb}`;
}

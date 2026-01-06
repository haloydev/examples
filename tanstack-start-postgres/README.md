# Tanstack Start with PostgreSQL Haloy Example App

See [https://haloy.dev/docs/examples/tanstack-start-postgres](https://haloy.dev/docs/examples/tanstack-start-postgres) for the full guide.


## Run local postgres for development
docker run --name postgres-dev \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=todo_app \
  -p 5432:5432 \
  -d postgres:18


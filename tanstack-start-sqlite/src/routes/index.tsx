import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { todos } from "../db/schema";

const getTodos = createServerFn({
  method: "GET",
}).handler(async () => await db.select().from(todos));

const addTodo = createServerFn({ method: "POST" })
  .inputValidator((data: FormData) => {
    if (!(data instanceof FormData)) {
      throw new Error("Expected FormData");
    }
    return {
      title: data.get("title")?.toString() || "",
    };
  })
  .handler(async ({ data }) => {
    await db.insert(todos).values({ title: data.title });
  });

const deleteTodo = createServerFn({ method: "POST" })
  .inputValidator((data: number) => data)
  .handler(async ({ data }) => {
    await db.delete(todos).where(eq(todos.id, data));
  });

export const Route = createFileRoute("/")({
  component: RouteComponent,
  loader: async () => await getTodos(),
});

function RouteComponent() {
  const router = useRouter();
  const todos = Route.useLoaderData();

  return (
    <div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.title}
            <button
              type="button"
              onClick={async () => {
                await deleteTodo({ data: todo.id });
                router.invalidate();
              }}
            >
              X
            </button>
          </li>
        ))}
      </ul>
      <h2>Add todo</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const data = new FormData(form);
          await addTodo({ data });
          router.invalidate();
          form.reset();
        }}
      >
        <input name="title" placeholder="Enter a new todo..." />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

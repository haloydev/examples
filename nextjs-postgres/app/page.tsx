import { addTodo, deleteTodo, getTodos } from "./actions";

export const dynamic = "force-dynamic";

export default async function Home() {
  const todoList = await getTodos();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>
      <ul className="mb-6 space-y-2">
        {todoList.map((todo) => (
          <li key={todo.id} className="flex items-center gap-2">
            <span>{todo.title}</span>
            <form
              action={async () => {
                "use server";
                await deleteTodo(todo.id);
              }}
            >
              <button type="submit" className="text-red-500 hover:text-red-700">
                X
              </button>
            </form>
          </li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mb-2">Add todo</h2>
      <form action={addTodo} className="flex gap-2">
        <input
          name="title"
          placeholder="Enter a new todo..."
          className="border rounded px-2 py-1"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </form>
    </main>
  );
}

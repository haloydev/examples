"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { todos } from "@/db/schema";

export async function getTodos() {
  return await db.select().from(todos);
}

export async function addTodo(formData: FormData) {
  const title = formData.get("title")?.toString();
  if (!title) {
    return;
  }
  await db.insert(todos).values({ title });
  revalidatePath("/");
}

export async function deleteTodo(id: number) {
  await db.delete(todos).where(eq(todos.id, id));
  revalidatePath("/");
}

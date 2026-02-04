"use server";

import { fetchApi } from "@/lib/api";
import { revalidatePath } from "next/cache";

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: "pending" | "completed";
  created_at: Date;
  updated_at: Date;
}

export interface TodoActionResponse {
  success: boolean;
  message: string;
  todo?: Todo;
  todos?: Todo[];
}

// Get all todos for current user
export async function getTodos(): Promise<TodoActionResponse> {
  try {
    const response = await fetchApi("/api/todos");

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, message: "Unauthorized" };
      }
      return { success: false, message: "Failed to fetch todos" };
    }

    const data = await response.json();
    return {
      success: true,
      message: "Todos fetched successfully.",
      todos: data.todos,
    };
  } catch (error) {
    console.error("Get todos error:", error);
    return {
      success: false,
      message: "Server error while fetching todos.",
    };
  }
}

// Create new todo
export async function createTodo(formData: FormData): Promise<TodoActionResponse> {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    const response = await fetchApi("/api/todos", {
      method: "POST",
      body: JSON.stringify({ title, description }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || "Failed to create todo" };
    }

    revalidatePath("/");

    return {
      success: true,
      message: "Todo created successfully.",
      todo: data.todo,
    };
  } catch (error) {
    console.error("Create todo error:", error);
    return {
      success: false,
      message: "Server error while creating todo.",
    };
  }
}

// Update todo
export async function updateTodo(id: string, formData: FormData): Promise<TodoActionResponse> {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;

    // Construct body with only present fields
    const body: any = {};
    if (title !== undefined) body.title = title;
    if (description !== undefined) body.description = description;
    if (status) body.status = status;

    const response = await fetchApi(`/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || "Failed to update todo" };
    }

    revalidatePath("/");

    return {
      success: true,
      message: "Todo updated successfully.",
      todo: data.todo,
    };
  } catch (error) {
    console.error("Update todo error:", error);
    return {
      success: false,
      message: "Server error while updating todo.",
    };
  }
}

// Toggle todo status
export async function toggleTodoStatus(id: string): Promise<TodoActionResponse> {
  try {
    // Call the dedicated toggle endpoint
    const response = await fetchApi(`/api/todos/${id}/toggle`, {
      method: "PATCH", // Using PATCH for partial/state update
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || "Failed to toggle status" };
    }

    revalidatePath("/");

    return {
      success: true,
      message: "Todo status updated.",
      todo: data.todo,
    };

  } catch (error) {
    console.error("Toggle todo status error:", error);
    return {
      success: false,
      message: "Server error while updating todo status.",
    };
  }
}

// Delete todo
export async function deleteTodo(id: string): Promise<TodoActionResponse> {
  try {
    const response = await fetchApi(`/api/todos/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json();
      return { success: false, message: data.message || "Failed to delete todo" };
    }

    revalidatePath("/");

    return {
      success: true,
      message: "Todo deleted successfully.",
    };
  } catch (error) {
    console.error("Delete todo error:", error);
    return {
      success: false,
      message: "Server error while deleting todo.",
    };
  }
}

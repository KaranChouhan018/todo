"use client";

import { useEffect, useState } from "react";
import { getTodos, type Todo } from "@/app/actions/todos";
import { getCurrentUser } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import AddTodoForm from "./components/AddTodoForm";
import TodoList from "./components/TodoList";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setUser(currentUser);
    await loadTodos();
    setLoading(false);
  }

  async function loadTodos() {
    const result = await getTodos();
    if (result.success && result.todos) {
      setTodos(result.todos);
    }
  }

  async function handleLogout() {
    await logout();
    toast.success("Logged out successfully");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">✅ Todo App</h1>
            <p className="text-sm text-muted-foreground">Welcome back, <span className="text-foreground font-medium">{user?.email}</span></p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        <AddTodoForm onAdd={loadTodos} />
        <TodoList initialTodos={todos} onUpdate={loadTodos} />
      </main>
    </div>
  );
}

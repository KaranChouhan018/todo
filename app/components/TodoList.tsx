"use client";

import { Todo } from "@/app/actions/todos";
import TodoItem from "./TodoItem";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TodoListProps {
  initialTodos: Todo[];
  onUpdate: () => void;
}

export default function TodoList({ initialTodos, onUpdate }: TodoListProps) {
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  const stats = useMemo(() => ({
    all: initialTodos.length,
    pending: initialTodos.filter((t) => t.status === "pending").length,
    completed: initialTodos.filter((t) => t.status === "completed").length,
  }), [initialTodos]);

  const filteredTodos = initialTodos.filter((todo) => {
    if (filter === "all") return true;
    return todo.status === filter;
  });

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Your Tasks</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Keep track of your daily goals</p>
            </div>

            <div className="flex gap-3">
              <div className="flex flex-col items-center px-4 py-2 bg-secondary rounded-lg border">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pending</span>
                <span className="text-2xl font-bold">{stats.pending}</span>
              </div>
              <div className="flex flex-col items-center px-4 py-2 bg-primary/10 rounded-lg border border-primary/20">
                <span className="text-xs font-medium text-primary uppercase tracking-wider">Done</span>
                <span className="text-2xl font-bold text-primary">{stats.completed}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {(["all", "pending", "completed"] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
                className="capitalize"
              >
                {f}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filteredTodos.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="p-3 bg-muted rounded-full mb-4">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-1">No tasks found</h3>
              <p className="text-sm text-muted-foreground text-center max-w-xs">
                {filter === "all"
                  ? "You don't have any tasks yet. Create one above!"
                  : `No ${filter} tasks in your list.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onUpdate={onUpdate} />
          ))
        )}
      </div>
    </div>
  );
}

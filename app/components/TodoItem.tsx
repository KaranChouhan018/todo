"use client";

import { Todo } from "@/app/actions/todos";
import { toggleTodoStatus, deleteTodo } from "@/app/actions/todos";
import { useState } from "react";
import EditTodoModal from "./EditTodoModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Check, Pencil, Trash2 } from "lucide-react";

interface TodoItemProps {
  todo: Todo;
  onUpdate: () => void;
}

export default function TodoItem({ todo, onUpdate }: TodoItemProps) {
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  async function handleToggle() {
    setLoading(true);
    const result = await toggleTodoStatus(todo.id);
    if (result.success) {
      toast.success(result.todo?.status === "completed" ? "Task completed!" : "Task reopened");
      onUpdate();
    } else {
      toast.error(result.message || "Failed to update status");
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this todo?")) {
      setLoading(true);
      const result = await deleteTodo(todo.id);
      if (result.success) {
        toast.success("Todo deleted successfully");
        onUpdate();
      } else {
        toast.error(result.message || "Failed to delete todo");
      }
      setLoading(false);
    }
  }

  return (
    <>
      <Card className={`group border-border/50 transition-all hover:border-border ${loading ? 'opacity-50' : ''}`}>
        <div className="p-4 flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            disabled={loading}
            className="mt-0.5 h-6 w-6 rounded-full p-0"
          >
            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${todo.status === 'completed'
                ? 'bg-primary border-primary'
                : 'border-muted-foreground/30 hover:border-primary'
              }`}>
              {todo.status === 'completed' && (
                <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />
              )}
            </div>
          </Button>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-4">
              <h3 className={`font-medium transition-all ${todo.status === 'completed'
                  ? 'text-muted-foreground line-through'
                  : 'text-foreground'
                }`}>
                {todo.title}
              </h3>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditModalOpen(true)}
                  disabled={loading}
                  className="h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  disabled={loading}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {todo.description && (
              <p className={`mt-1 text-sm transition-colors ${todo.status === 'completed' ? 'text-muted-foreground/50' : 'text-muted-foreground'
                }`}>
                {todo.description}
              </p>
            )}

            <div className="mt-3 flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${todo.status === 'completed'
                  ? 'bg-primary/10 border-primary/20 text-primary'
                  : 'bg-secondary border-secondary-foreground/20 text-secondary-foreground'
                }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${todo.status === 'completed' ? 'bg-primary' : 'bg-secondary-foreground'}`}></span>
                {todo.status === 'completed' ? 'Completed' : 'Pending'}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(todo.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <EditTodoModal
        key={todo.id}
        todo={todo}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={onUpdate}
      />
    </>
  );
}

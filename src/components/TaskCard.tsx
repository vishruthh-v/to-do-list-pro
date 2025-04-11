
import React from "react";
import { Task } from "@/contexts/TaskContext";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Calendar, Flag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task["status"]) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const { id, title, description, priority, status, dueDate } = task;

  const priorityColor = {
    low: "bg-green-500 text-white",
    medium: "bg-yellow-500 text-white",
    high: "bg-red-500 text-white",
  }[priority];

  const statusLabel = {
    todo: "To Do",
    "in-progress": "In Progress",
    completed: "Completed",
  }[status];

  const statusColor = {
    todo: "bg-gray-500",
    "in-progress": "bg-blue-500",
    completed: "bg-green-500",
  }[status];

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all hover:shadow-md",
        status === "completed" && "opacity-60"
      )}
    >
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-1",
          `bg-${priority === "low" ? "green" : priority === "medium" ? "yellow" : "red"}-500`
        )}
      />
      <CardContent className="p-4">
        <div className="flex justify-between">
          <div className="flex flex-1 items-start gap-2">
            <Checkbox
              className="mt-0.5"
              checked={status === "completed"}
              onCheckedChange={(checked) => {
                onStatusChange(
                  id,
                  checked ? "completed" : "todo"
                );
              }}
            />
            <div className="flex-1 space-y-1">
              <h3
                className={cn(
                  "font-medium",
                  status === "completed" && "line-through text-muted-foreground"
                )}
              >
                {title}
              </h3>
              {description && (
                <p
                  className={cn(
                    "text-sm text-muted-foreground",
                    status === "completed" && "line-through"
                  )}
                >
                  {description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {dueDate && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(dueDate), "MMM d, yyyy")}</span>
                  </div>
                )}
                <Badge variant="outline" className={cn("text-xs", priorityColor)}>
                  <Flag className="mr-1 h-3 w-3" />
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Badge>
                <Badge className={cn("text-xs text-white", statusColor)}>
                  {statusLabel}
                </Badge>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background p-2">
              <DropdownMenuItem onClick={() => onEdit(task)}>Edit</DropdownMenuItem>
              {status !== "todo" && (
                <DropdownMenuItem
                  onClick={() => onStatusChange(id, "todo")}
                >
                  Mark as Todo
                </DropdownMenuItem>
              )}
              {status !== "in-progress" && (
                <DropdownMenuItem
                  onClick={() => onStatusChange(id, "in-progress")}
                >
                  Mark as In Progress
                </DropdownMenuItem>
              )}
              {status !== "completed" && (
                <DropdownMenuItem
                  onClick={() => onStatusChange(id, "completed")}
                >
                  Mark as Completed
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500"
                onClick={() => onDelete(id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

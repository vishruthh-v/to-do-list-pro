
import React, { useState } from "react";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Task, useTask } from "@/contexts/TaskContext";
import { TaskModal } from "@/components/TaskModal";
import { TaskCard } from "@/components/TaskCard";
import { cn } from "@/lib/utils";

const CalendarPage = () => {
  const { tasks, updateTask, deleteTask } = useTask();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  // Filter tasks for the selected date
  const tasksForSelectedDate = tasks.filter((task) => {
    if (!task.dueDate || !date) return false;
    const taskDate = new Date(task.dueDate);
    const selectedDate = new Date(date);
    return (
      taskDate.getDate() === selectedDate.getDate() &&
      taskDate.getMonth() === selectedDate.getMonth() &&
      taskDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  // Function to highlight dates with tasks
  const getDayClassNames = (day: Date) => {
    const hasTasks = tasks.some((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === day.getDate() &&
        taskDate.getMonth() === day.getMonth() &&
        taskDate.getFullYear() === day.getFullYear()
      );
    });

    const hasCompletedTasks = tasks.some((task) => {
      if (!task.dueDate || task.status !== "completed") return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === day.getDate() &&
        taskDate.getMonth() === day.getMonth() &&
        taskDate.getFullYear() === day.getFullYear()
      );
    });

    const hasInProgressTasks = tasks.some((task) => {
      if (!task.dueDate || task.status !== "in-progress") return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === day.getDate() &&
        taskDate.getMonth() === day.getMonth() &&
        taskDate.getFullYear() === day.getFullYear()
      );
    });

    if (hasCompletedTasks && !hasInProgressTasks) {
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
    } else if (hasInProgressTasks) {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
    } else if (hasTasks) {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
    }

    return "";
  };

  const handleAddTask = () => {
    setSelectedTask(undefined);
    // Pre-fill due date with the selected date
    if (date) {
      const prefilledTask = {
        id: "",
        title: "",
        description: "",
        priority: "medium" as const,
        status: "todo" as const,
        dueDate: date.toISOString(),
        createdAt: "",
        userId: "",
      };
      setSelectedTask(prefilledTask);
    }
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
  };

  const handleStatusChange = (id: string, status: Task["status"]) => {
    updateTask(id, { status });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            View and manage your tasks on a calendar
          </p>
        </div>
        <Button onClick={handleAddTask} className="gap-1">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="w-full"
              modifiers={{
                today: new Date(),
              }}
              modifiersClassNames={{
                today: "bg-primary text-primary-foreground",
              }}
              components={{
                DayContent: (props) => (
                  <div
                    className={cn(
                      "relative flex h-full w-full items-center justify-center",
                      getDayClassNames(props.date)
                    )}
                  >
                    {props.date.getDate()}
                  </div>
                ),
              }}
            />
            <div className="mt-4 space-y-2">
              <div className="text-sm font-medium">Legend:</div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-yellow-300" />
                <span className="text-xs text-muted-foreground">Has Tasks</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-xs text-muted-foreground">In Progress</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-xs text-muted-foreground">Completed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {date
                ? date.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "No date selected"}
            </CardTitle>
            <Badge variant="outline" className="px-3 py-1 text-xs">
              {tasksForSelectedDate.length} task
              {tasksForSelectedDate.length !== 1 ? "s" : ""}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasksForSelectedDate.length > 0 ? (
                tasksForSelectedDate.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <CalendarIcon className="mb-2 h-10 w-10 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No tasks for this day</h3>
                  <p className="text-sm text-muted-foreground">
                    Add a new task to this date
                  </p>
                  <Button
                    onClick={handleAddTask}
                    className="mt-4 gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add Task
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <TaskModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        task={selectedTask}
      />
    </div>
  );
};

export default CalendarPage;

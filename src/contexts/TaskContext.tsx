
import React, { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Define task interface
export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "completed";
  dueDate: string | null;
  createdAt: string;
  userId: string;
}

// Define task context interface
interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "userId">) => void;
  updateTask: (id: string, taskData: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTasksByFilter: (filter: "today" | "upcoming" | "completed" | "all") => Task[];
  isLoading: boolean;
}

// Create context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Sample initial tasks
const SAMPLE_TASKS: Task[] = [
  {
    id: "1",
    title: "Complete project proposal",
    description: "Write the first draft of the project proposal",
    priority: "high",
    status: "todo",
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    createdAt: new Date().toISOString(),
    userId: "1",
  },
  {
    id: "2",
    title: "Schedule team meeting",
    description: "Set up a meeting with the project team",
    priority: "medium",
    status: "completed",
    dueDate: new Date().toISOString(), // Today
    createdAt: new Date().toISOString(),
    userId: "1",
  },
  {
    id: "3",
    title: "Research competitor products",
    description: "Analyze top 3 competitors and document findings",
    priority: "low",
    status: "in-progress",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    createdAt: new Date().toISOString(),
    userId: "1",
  },
];

// Provider component
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load tasks from localStorage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem("todoProTasks");
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch (error) {
        console.error("Failed to parse stored tasks", error);
        // Initialize with sample tasks if parsing fails
        setTasks(SAMPLE_TASKS);
        localStorage.setItem("todoProTasks", JSON.stringify(SAMPLE_TASKS));
      }
    } else {
      // Initialize with sample tasks if no tasks are stored
      setTasks(SAMPLE_TASKS);
      localStorage.setItem("todoProTasks", JSON.stringify(SAMPLE_TASKS));
    }
    setIsLoading(false);
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("todoProTasks", JSON.stringify(tasks));
    }
  }, [tasks, isLoading]);

  // Add a new task
  const addTask = (task: Omit<Task, "id" | "createdAt" | "userId">) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      userId: "1", // Mock user ID
    };

    setTasks((prev) => [...prev, newTask]);
    toast({
      title: "Task added",
      description: "Your task has been added successfully",
    });
  };

  // Update an existing task
  const updateTask = (id: string, taskData: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, ...taskData } : task
      )
    );
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully",
    });
  };

  // Delete a task
  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    toast({
      title: "Task deleted",
      description: "Your task has been deleted successfully",
    });
  };

  // Get tasks filtered by criteria
  const getTasksByFilter = (filter: "today" | "upcoming" | "completed" | "all") => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filter) {
      case "today":
        return tasks.filter((task) => {
          if (!task.dueDate) return false;
          const taskDate = new Date(task.dueDate);
          taskDate.setHours(0, 0, 0, 0);
          return taskDate.getTime() === today.getTime() && task.status !== "completed";
        });
      case "upcoming":
        return tasks.filter((task) => {
          if (!task.dueDate) return false;
          const taskDate = new Date(task.dueDate);
          taskDate.setHours(0, 0, 0, 0);
          return taskDate.getTime() > today.getTime() && task.status !== "completed";
        });
      case "completed":
        return tasks.filter((task) => task.status === "completed");
      case "all":
      default:
        return tasks;
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        getTasksByFilter,
        isLoading,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook to use the task context
export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};


import React, { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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

// Provider component
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // Function to transform Supabase task format to our app format
  const transformTask = (task: any): Task => ({
    id: task.id,
    title: task.title,
    description: task.description || "",
    priority: task.priority as "low" | "medium" | "high",
    status: task.status as "todo" | "in-progress" | "completed",
    dueDate: task.due_date,
    createdAt: task.created_at,
    userId: task.user_id,
  });

  // Load tasks from Supabase when authenticated
  useEffect(() => {
    const fetchTasks = async () => {
      if (!isAuthenticated || !user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          setTasks(data.map(transformTask));
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast({
          title: "Error fetching tasks",
          description: "There was an error loading your tasks.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();

    // Set up realtime subscription for tasks
    const channel = supabase
      .channel("public:tasks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        (payload) => {
          console.log("Realtime change:", payload);
          fetchTasks(); // Refresh tasks when any change happens
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated, user, toast]);

  // Add a new task
  const addTask = async (task: Omit<Task, "id" | "createdAt" | "userId">) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to add tasks.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.from("tasks").insert({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        due_date: task.dueDate,
        user_id: user.id,
      }).select().single();

      if (error) {
        throw error;
      }

      if (data) {
        const newTask = transformTask(data);
        setTasks((prev) => [newTask, ...prev]);
        toast({
          title: "Task added",
          description: "Your task has been added successfully",
        });
      }
    } catch (error) {
      console.error("Error adding task:", error);
      toast({
        title: "Error adding task",
        description: "There was an error adding your task.",
        variant: "destructive",
      });
    }
  };

  // Update an existing task
  const updateTask = async (id: string, taskData: Partial<Task>) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to update tasks.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Convert from our app's format to Supabase format
      const supabaseTaskData: any = {};
      if (taskData.title !== undefined) supabaseTaskData.title = taskData.title;
      if (taskData.description !== undefined) supabaseTaskData.description = taskData.description;
      if (taskData.priority !== undefined) supabaseTaskData.priority = taskData.priority;
      if (taskData.status !== undefined) supabaseTaskData.status = taskData.status;
      if (taskData.dueDate !== undefined) supabaseTaskData.due_date = taskData.dueDate;

      const { error } = await supabase
        .from("tasks")
        .update(supabaseTaskData)
        .eq("id", id);

      if (error) {
        throw error;
      }

      // Update local state
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, ...taskData } : task
        )
      );
      
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error updating task",
        description: "There was an error updating your task.",
        variant: "destructive",
      });
    }
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to delete tasks.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id);

      if (error) {
        throw error;
      }

      // Update local state
      setTasks((prev) => prev.filter((task) => task.id !== id));
      
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error deleting task",
        description: "There was an error deleting your task.",
        variant: "destructive",
      });
    }
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

import React, { useState } from "react";
import { useTask, Task } from "@/contexts/TaskContext";
import { TaskCard } from "@/components/TaskCard";
import { TaskModal } from "@/components/TaskModal";
import { Analytics } from "@/components/Analytics";
import { CalendarView } from "@/components/CalendarView";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Plus,
  Filter,
  CalendarDays,
  CheckCircle2,
  CircleSlash,
  LayoutGrid,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { getTasksByFilter, updateTask, deleteTask, tasks } = useTask();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [currentFilter, setCurrentFilter] = useState<
    "today" | "upcoming" | "completed" | "all"
  >("today");
  const { toast } = useToast();

  const filteredTasks = getTasksByFilter(currentFilter);

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
  };

  const handleStatusChange = (id: string, status: Task["status"]) => {
    updateTask(id, { status });

    // Show toast notification
    const statusMessages = {
      todo: "Task marked as To Do",
      "in-progress": "Task marked as In Progress",
      completed: "Task marked as Completed",
    };

    toast({
      title: statusMessages[status],
      description: "Task status updated successfully",
    });
  };

  const handleAddTask = () => {
    setSelectedTask(undefined);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your tasks and stay organized
          </p>
        </div>
        <Button onClick={handleAddTask} className="gap-1">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Analytics Section */}
      <Analytics tasks={tasks} />

      {/* Calendar View */}
      <CalendarView tasks={tasks} />

      <Tabs
        defaultValue="today"
        value={currentFilter}
        onValueChange={(value) =>
          setCurrentFilter(value as typeof currentFilter)
        }
        className="space-y-4"
      >
        <div className="flex justify-between">
          <TabsList>
            <TabsTrigger value="today" className="gap-1">
              <CalendarDays className="h-4 w-4" />
              <span className="hidden sm:inline">Today</span>
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="gap-1">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Upcoming</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-1">
              <CheckCircle2 className="h-4 w-4" />
              <span className="hidden sm:inline">Completed</span>
            </TabsTrigger>
            <TabsTrigger value="all" className="gap-1">
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">All</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="today" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <CircleSlash className="mb-2 h-10 w-10 text-muted-foreground" />
                  <p className="text-lg font-medium">No tasks for today</p>
                  <p className="text-sm text-muted-foreground">
                    Add a new task to get started
                  </p>
                  <Button onClick={handleAddTask} className="mt-4 gap-1">
                    <Plus className="h-4 w-4" />
                    Add Task
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <CircleSlash className="mb-2 h-10 w-10 text-muted-foreground" />
                  <p className="text-lg font-medium">No upcoming tasks</p>
                  <p className="text-sm text-muted-foreground">
                    All caught up! Add a new task if needed.
                  </p>
                  <Button onClick={handleAddTask} className="mt-4 gap-1">
                    <Plus className="h-4 w-4" />
                    Add Task
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <CircleSlash className="mb-2 h-10 w-10 text-muted-foreground" />
                  <p className="text-lg font-medium">No completed tasks</p>
                  <p className="text-sm text-muted-foreground">
                    Complete some tasks to see them here
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <CircleSlash className="mb-2 h-10 w-10 text-muted-foreground" />
                  <p className="text-lg font-medium">No tasks found</p>
                  <p className="text-sm text-muted-foreground">
                    Add a new task to get started
                  </p>
                  <Button onClick={handleAddTask} className="mt-4 gap-1">
                    <Plus className="h-4 w-4" />
                    Add Task
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <TaskModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        task={selectedTask}
      />
    </div>
  );
};

export default Dashboard;

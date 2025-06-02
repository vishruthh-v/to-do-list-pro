import React from "react";
import { Task } from "@/contexts/TaskContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, isSameDay } from "date-fns";

interface CalendarViewProps {
  tasks: Task[];
}

const COLORS = {
  low: "bg-green-500",
  medium: "bg-yellow-500",
  high: "bg-red-500",
  todo: "bg-gray-500",
  "in-progress": "bg-blue-500",
  completed: "bg-green-500",
};

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
  // Get tasks for a specific day
  const getTasksForDay = (date: Date) => {
    return tasks.filter((task) => isSameDay(new Date(task.dueDate), date));
  };

  // Custom day renderer to show task indicators
  const renderDay = (date: Date) => {
    const dayTasks = getTasksForDay(date);
    const hasTasks = dayTasks.length > 0;

    return (
      <div className="relative h-full w-full">
        <time dateTime={format(date, "yyyy-MM-dd")}>{format(date, "d")}</time>
        {hasTasks && (
          <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-1">
            {dayTasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className={cn(
                  "h-1 w-1 rounded-full",
                  COLORS[task.priority as keyof typeof COLORS]
                )}
              />
            ))}
            {dayTasks.length > 3 && (
              <div className="h-1 w-1 rounded-full bg-gray-400" />
            )}
          </div>
        )}
      </div>
    );
  };

  // Get upcoming tasks for the next 7 days
  const upcomingTasks = tasks
    .filter((task) => {
      const taskDate = new Date(task.dueDate);
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      return taskDate >= today && taskDate <= nextWeek;
    })
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Calendar View</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            className="rounded-md border"
            components={{
              DayContent: ({ date }) => renderDay(date),
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">{task.title}</p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        COLORS[task.priority as keyof typeof COLORS]
                      )}
                    >
                      {task.priority}
                    </Badge>
                    <Badge
                      className={cn(
                        "text-xs text-white",
                        COLORS[task.status as keyof typeof COLORS]
                      )}
                    >
                      {task.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(task.dueDate), "MMM d")}
                </div>
              </div>
            ))}
            {upcomingTasks.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">
                No upcoming tasks for the next 7 days
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


import React, { useMemo } from "react";
import { useTask } from "@/contexts/TaskContext";
import { useFocus } from "@/contexts/FocusContext";
import { formatDuration } from "@/lib/dateUtils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { BarChart2, PieChart as PieChartIcon, Clock, CheckCircle } from "lucide-react";

const Analytics = () => {
  const { tasks } = useTask();
  const { todayCompleted, totalCompleted, totalFocusTime } = useFocus();

  // Generate task status data for pie chart
  const taskStatusData = useMemo(() => {
    const todo = tasks.filter((task) => task.status === "todo").length;
    const inProgress = tasks.filter(
      (task) => task.status === "in-progress"
    ).length;
    const completed = tasks.filter(
      (task) => task.status === "completed"
    ).length;

    return [
      { name: "To Do", value: todo, color: "#94a3b8" },
      { name: "In Progress", value: inProgress, color: "#3b82f6" },
      { name: "Completed", value: completed, color: "#22c55e" },
    ];
  }, [tasks]);

  // Generate task priority data for pie chart
  const taskPriorityData = useMemo(() => {
    const low = tasks.filter((task) => task.priority === "low").length;
    const medium = tasks.filter((task) => task.priority === "medium").length;
    const high = tasks.filter((task) => task.priority === "high").length;

    return [
      { name: "Low", value: low, color: "#22c55e" },
      { name: "Medium", value: medium, color: "#eab308" },
      { name: "High", value: high, color: "#ef4444" },
    ];
  }, [tasks]);

  // Generate last 7 days task completion data for bar chart
  const taskCompletionByDay = useMemo(() => {
    const now = new Date();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      const completedCount = tasks.filter((task) => {
        if (task.status !== "completed") return false;
        const taskDate = new Date(task.createdAt);
        return taskDate >= date && taskDate < nextDate;
      }).length;

      data.push({
        name: days[date.getDay()],
        completed: completedCount,
      });
    }

    return data;
  }, [tasks]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-md border bg-background p-2 shadow-sm">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-sm text-muted-foreground">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Track your productivity and task completion
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total Tasks</CardTitle>
            <CardDescription>All tasks in your system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Completed Tasks</CardTitle>
            <CardDescription>Tasks you've finished</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.filter((task) => task.status === "completed").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Focus Sessions</CardTitle>
            <CardDescription>Completed pomodoros</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompleted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Focus Time</CardTitle>
            <CardDescription>Total time focused</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(totalFocusTime / 60)}m
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" />
              Tasks Completed Per Day
            </CardTitle>
            <CardDescription>
              Number of tasks completed over the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={taskCompletionByDay}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="completed"
                    name="Completed Tasks"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              Task Distribution
            </CardTitle>
            <CardDescription>
              Breakdown of your tasks by status and priority
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="text-center text-sm font-medium">By Status</div>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taskStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {taskStatusData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke="transparent"
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-center text-sm font-medium">
                  By Priority
                </div>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taskPriorityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {taskPriorityData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke="transparent"
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Productivity Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium">
                  Task Completion Rate
                </span>
                <div className="flex items-center justify-between">
                  <div className="w-full">
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{
                          width: `${
                            tasks.length
                              ? Math.round(
                                  (tasks.filter(
                                    (t) => t.status === "completed"
                                  ).length /
                                    tasks.length) *
                                    100
                                )
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="ml-2 text-sm tabular-nums">
                    {tasks.length
                      ? Math.round(
                          (tasks.filter((t) => t.status === "completed")
                            .length /
                            tasks.length) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium">Today&apos;s Progress</p>
                    <p className="text-2xl font-bold">
                      {todayCompleted}{" "}
                      <span className="text-sm text-muted-foreground">
                        sessions
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total Focus Time</p>
                    <p className="text-2xl font-bold">
                      {Math.floor(totalFocusTime / 60)}{" "}
                      <span className="text-sm text-muted-foreground">
                        minutes
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Focus Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm text-muted-foreground">
                    Sessions Today
                  </p>
                  <p className="text-2xl font-bold">{todayCompleted}</p>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                  <p className="text-2xl font-bold">{totalCompleted}</p>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="mb-2 text-sm font-medium">Focus Time</div>
                <div className="text-xl font-semibold">
                  {formatDuration(totalFocusTime)}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  That&apos;s approximately{" "}
                  {Math.round(totalFocusTime / 60 / 60 * 10) / 10} hours of deep work!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;

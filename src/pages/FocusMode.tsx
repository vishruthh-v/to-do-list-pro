
import React, { useState } from "react";
import { useFocus } from "@/contexts/FocusContext";
import { formatTime, formatDuration } from "@/lib/dateUtils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Timer,
  Coffee,
  CheckCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FocusMode = () => {
  const {
    isActive,
    isPaused,
    mode,
    timeRemaining,
    progress,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    skipToBreak,
    skipToFocus,
    todayCompleted,
    totalCompleted,
    totalFocusTime,
  } = useFocus();

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Focus Mode</h1>
          <p className="text-muted-foreground">Stay productive with the Pomodoro technique</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              {mode === "focus" ? (
                <>
                  <Timer className="h-6 w-6 text-primary" />
                  Focus Time
                </>
              ) : (
                <>
                  <Coffee className="h-6 w-6 text-primary" />
                  Break Time
                </>
              )}
            </CardTitle>
            <CardDescription>
              {mode === "focus"
                ? "Stay focused and productive"
                : "Take a short break to recharge"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col items-center justify-center px-6 py-8">
            <div className="relative mb-6 flex h-52 w-52 items-center justify-center rounded-full border-8 border-muted bg-card">
              <div className="absolute inset-0">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle
                    className="stroke-muted-foreground/20"
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    strokeWidth="8"
                  />
                  <circle
                    className={cn(
                      "stroke-primary transition-all duration-500",
                      mode === "break" && "stroke-green-500"
                    )}
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    strokeWidth="8"
                    strokeDasharray="282.743"
                    strokeDashoffset={282.743 - (282.743 * progress) / 100}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
              <div className="text-center z-10">
                <span className="text-4xl font-semibold tabular-nums">
                  {formatTime(timeRemaining)}
                </span>
                <p className="text-sm text-muted-foreground capitalize">
                  {mode} {isActive && !isPaused ? "in progress" : "paused"}
                </p>
              </div>
              {isActive && !isPaused && (
                <div className="absolute inset-0 -m-1 animate-pulse-ring rounded-full border-2 border-primary opacity-0" />
              )}
            </div>

            <div className="mt-2 grid w-full grid-cols-3 gap-2">
              {!isActive ? (
                <Button
                  className="col-span-3 gap-1"
                  onClick={startTimer}
                >
                  <Play className="h-4 w-4" />
                  Start
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={resetTimer}
                    className="gap-1"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                  {isPaused ? (
                    <Button
                      onClick={resumeTimer}
                      className="gap-1"
                    >
                      <Play className="h-4 w-4" />
                      Resume
                    </Button>
                  ) : (
                    <Button
                      onClick={pauseTimer}
                      className="gap-1"
                    >
                      <Pause className="h-4 w-4" />
                      Pause
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={mode === "focus" ? skipToBreak : skipToFocus}
                    className="gap-1"
                  >
                    <SkipForward className="h-4 w-4" />
                    Skip
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Today&apos;s Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Focus Sessions</span>
                  <span className="font-mono text-sm">{todayCompleted}</span>
                </div>
                <Progress value={todayCompleted * 25} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 rounded-lg bg-muted p-4">
                    <p className="text-sm text-muted-foreground">Total Sessions</p>
                    <p className="text-3xl font-bold">{totalCompleted}</p>
                  </div>
                  <div className="space-y-1 rounded-lg bg-muted p-4">
                    <p className="text-sm text-muted-foreground">Total Focus Time</p>
                    <p className="text-3xl font-bold">
                      {Math.floor(totalFocusTime / 60)}m
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  You&apos;ve spent a total of {formatDuration(totalFocusTime)} focusing.
                  Keep it up!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;

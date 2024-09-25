"use client";
import { Button } from "./ui/button";
import React, { useState, useEffect, useRef } from "react";
import {
  MinusIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  RefreshCwIcon,
} from "lucide-react";
import { Card } from "./ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialogFooter,
} from "./ui/alert-dialog";
import { TIMEOUT } from "dns";

type TimerStatus = "idle" | "running" | "pause";
type SessionType = "work" | "break";

interface PomodroState {
  workDuration: number;
  breakDuration: number;
  currentTime: number;
  currentSession: SessionType;
  timerStatus: TimerStatus;
}

export default function PomodroTimer() {
  const [state, setState] = useState<PomodroState>({
    workDuration: 25 * 60,
    breakDuration: 5 * 60,
    currentTime: 25 * 60,
    currentSession: "work",
    timerStatus: "idle",
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (state.timerStatus === "running" && state.currentTime > 0) {
      timerRef.current = setInterval(() => {
        setState((prevState) => ({
          ...prevState,
          currentTime: prevState.currentTime - 1,
        }));
      }, 1000);
    } else if (state.currentTime === 0) {
      clearInterval(timerRef.current as NodeJS.Timeout);
      handleSessionSwitch();
    }
    return () => clearInterval(timerRef.current as NodeJS.Timeout);
  }, [state.timerStatus, state.currentTime]);

  const handleSessionSwitch = (): void => {
    setState((prevState) => {
      const isWorkSession = prevState.currentSession === "work";
      return {
        ...prevState,
        currentSession: isWorkSession ? "break" : "work",
        currentTime: isWorkSession
          ? prevState.breakDuration
          : prevState.workDuration,
      };
    });
  };

  const handleStartPause = (): void => {
    if (state.timerStatus === "running") {
      setState((prevState) => ({
        ...prevState,
        timerStatus: "pause",
      }));
      clearInterval(timerRef.current as NodeJS.Timeout);
    } else {
      setState((prevState) => ({
        ...prevState,
        timerStatus: "running",
      }));
    }
  };

  const handleReset = (): void => {
    clearInterval(timerRef.current as NodeJS.Timeout);
    setState((prevState) => ({
      ...prevState,
      currentTime: prevState.workDuration,
      currentSession: "work",
      timerStatus: "idle",
    }));
  };

  const handleDurationChange = (
    type: SessionType,
    increment: boolean
  ): void => {
    setState((prevState) => {
      const durationChange = increment ? 60 : -60;
      if (type === "work") {
        return {
          ...prevState,
          workDuration: Math.max(60, prevState.workDuration + durationChange),
          currentTime:
            prevState.currentSession === "work"
              ? Math.max(60, prevState.workDuration + durationChange)
              : prevState.currentTime,
        };
      } else {
        return {
          ...prevState,
          breakDuration: Math.max(60, prevState.breakDuration + durationChange),
          currentTime:
            prevState.currentSession === "break"
              ? Math.max(60, prevState.breakDuration + durationChange)
              : prevState.currentTime,
        };
      }
    });
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")} : ${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen dark:bg-gray-900
    bg-[url(./images/bgimg.jpg)] bg-cover"
    >
      <Card
        className="w-full max-w-md p-6 dark:bg-gray-800 shadow-xl shadow-gray-900 rounded-3xl
      ring-2 ring-neutral-500 ring-offset-8 ring-offset-neutral-200 "
      >
        <div className="flex flex-col items-center justify-center gap-6">
          <h1 className="text-4xl font-bold text-blue-950">Pomodoro Timer</h1>
          <p className="text-blue-950">A timer for the Pomodoro Technique.</p>
          <div className="flex flex-col items-center gap-4">
            <div className="text-2xl font-medium">
              <span
                className={`text-${
                  state.currentSession === "work" ? "primary" : "secondary"
                }, text-3xl font-bold text-blue-950`}
              >
                {state.currentSession === "work" ? "Work" : "Break"}
              </span>
            </div>
            <div className="text-8xl font-bold text-blue-950 rounded-3xl">
              {formatTime(state.currentTime)}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDurationChange("work", false)}
              className="ring-2 ring-violet-900 shadow-xl"
            >
              <MinusIcon className="h-6 w-6 text-sky-950" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDurationChange("work", true)}
              className="ring-2 ring-violet-900 shadow-xl"
            >
              <PlusIcon className="h-6 w-6 text-sky-950" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleStartPause}
              className="ring-2 ring-violet-900
            shadow-xl"
            >
              {state.timerStatus === "running" ? (
                <PauseIcon className="h-6 w-6 text-sky-950" />
              ) : (
                <PlayIcon className="h-6 w-6 text-sky-950" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              className="ring-2 ring-violet-900
            shadow-xl"
            >
              <RefreshCwIcon className="h-6 w-6 text-sky-950" />
            </Button>
          </div>
          <div className="p-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="default"
                  className="font-bold bg-blue-950
                ring-2 ring-violet-300 shadow-lg"
                >
                  What is Pomodoro Technique?
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-full max-w-2xl p-4 md:p-6">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">
                    <strong> ➡️ Explanation of Pomodoro Technique 🔥</strong>
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-white text-base">
                    <strong>The Pomodoro Technique </strong>is a time management
                    method that uses a timer to break work into intervals called
                    Pomodoros. The Pomodoro timer is traditionally set for 25
                    minutes, but can be customized to fit your needs. The basic
                    steps are:
                    <br />
                    <br />
                    <ol>
                      <strong>
                        <li>1. Select a single task to focus on.</li>
                        <li>
                          2. Set a timer for 25-30 min. and work continuously
                          until the timer goes off.
                        </li>
                        <li>
                          3. Take a productive 5 min. break—walk around, get a
                          snack, relax.
                        </li>
                        <li>4. Repeat steps 2 & 3 for 4 rounds.</li>
                        <li>5. Take a longer (20-30 min.) break.</li>
                      </strong>
                    </ol>
                    <br />
                    <Button className="font-bold ring-2 ring-white">
                      <a
                        href="https://todoist.com/productivity-methods/pomodoro-technique"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Click Here to Read more!
                      </a>
                    </Button>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="text-white">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction className="font-bold ring-2 ring-white">
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </Card>
    </div>
  );
}

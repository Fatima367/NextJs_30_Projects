"use client";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { json, text } from "stream/consumers";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoListComponent() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTaskText, setEditedTaskText] = useState<string>("");
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks) as Task[]);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, isMounted]);

  const addTask = (): void => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    }
    setNewTask("");
  };

  const toggleTaskCompletion = (id: number): void => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const startEditingTask = (id: number, text: string): void => {
    setEditingTaskId(id);
    setEditedTaskText(text);
  };

  const updateTask = (): void => {
    if (editedTaskText.trim() !== "") {
      setTasks(
        tasks.map((task) =>
          task.id === editingTaskId ? { ...task, text: editedTaskText } : task
        )
      );
      setEditingTaskId(null);
      setEditedTaskText("");
    }
  };

  const deleteTask = (id: number): void => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen dark:bg-gray-900
    bg-gradient-to-bl from-gray-200 via-white to-gray-200">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6
      ring-4 ring-slate-300 ring-offset-2 ring-offset-slate-200">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 font-serif">
          Todo List
        </h1>
        <div className="flex items-center mb-4">
          <Input
            type="text"
            placeholder="Add a new task"
            value={newTask}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewTask(e.target.value)
            }
            className="flex-1 mr-2 px-3 py-2 rounded-md border border-gray-300
             dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 shadow-md
             hover:shadow-sm hover:shadow-slate-600"
          />
          <Button
            onClick={addTask}
            className="bg-slate-600 hover:bg-slate-800 text-white font-medium py-2 px-4
             rounded-lg font-serif shadow-md ring-2 ring-slate-200 hover:shadow-md hover:shadow-slate-600"
          >
            Add
          </Button>
        </div>
        <div className="space-y-6 mt-6 ">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 
              rounded-md px-4 py-2 ring-2 ring-slate-300 ring-offset-2 ring-offset-slate-200
              hover:shadow-md hover:shadow-slate-600"
            >
              <div className="flex items-center">
                <Checkbox
                  checked={task.completed}
                  className="mr-2 "
                  onCheckedChange={() => toggleTaskCompletion(task.id)}
                />
                {editingTaskId === task.id ? (
                  <Input
                    type="text"
                    value={editedTaskText}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setEditedTaskText(e.target.value)
                    }
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") {
                        updateTask();
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-md border border-gray-300 
                    dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 shadow-md bg-white"
                  />
                ) : (
                  <span
                    className={`flex-1 text-gray-800 dark:text-gray-200 ${
                      task.completed
                        ? "line-through text-gray-500 dark:text-gray-400"
                        : ""
                    }`}
                  >
                    {task.text}
                  </span>
                )}
              </div>
              <div className="flex items-center">
                {editingTaskId === task.id ? (
                  <Button
                    onClick={updateTask}
                    className="bg-black hover:bg-slate-800 text-white font-medium py-1 
                    px-2 rounded-lg mr-2 hover:shadow-md hover:shadow-slate-600 ring-1 ring-gray-300"
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    onClick={() => startEditingTask(task.id, task.text)}
                    className="bg-white hover:bg-gray-200 text-gray-800 dark:bg-gray-600
                     dark:hover:bg-gray-500 dark:text-gray-200 font-medium py-1 px-2 rounded-lg mr-2
                     ring-1 ring-gray-300 hover:shadow-md hover:shadow-slate-600"
                  >
                    Edit
                  </Button>
                )}
                <Button
                  onClick={() => deleteTask(task.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 
                  px-2 rounded-lg ring-1 ring-white hover:shadow-md hover:shadow-slate-600"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

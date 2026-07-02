"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { getBoardData, updateTaskColumn } from "@/actions/board";

interface Task {
  id: string;
  projectId: string;
  project: string;
  title: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  dueDate: string;
  column: "Backlog" | "In Progress" | "Review" | "Done";
}

export default function BoardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const columnsList: Task["column"][] = ["Backlog", "In Progress", "Review", "Done"];

  const loadData = async () => {
    try {
      const res = await getBoardData();
      if (res.success && res.data) {
        setTasks(res.data.tasks);
        setProjects(res.data.projects);
        if (res.data.projects.length > 0 && !selectedProject) {
          setSelectedProject(res.data.projects[0].name);
        }
      }
    } catch (err) {
      console.error("Failed to load board data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter tasks based on selected project name
  const filteredTasks = tasks.filter((t) => t.project === selectedProject);

  const handleMoveTask = async (taskId: string, newCol: Task["column"]) => {
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, column: newCol } : t))
      );
      
      const res = await updateTaskColumn(taskId, newCol);
      if (!res.success) {
        alert(res.error || "Failed to update task column");
        // Revert on error
        await loadData();
      }
    } catch (err) {
      console.error("Error moving task", err);
      await loadData();
    }
  };

  const getPriorityStyle = (priority: Task["priority"]) => {
    switch (priority) {
      case "Low":
        return "bg-surface-elevated text-text-muted border border-border/30";
      case "Medium":
        return "bg-warning/10 text-warning border border-warning/20";
      case "High":
        return "bg-danger/10 text-danger border border-danger/20";
      case "Urgent":
        return "bg-danger/20 text-danger border border-danger/60 ring-1 ring-danger/20";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex justify-between items-center">
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="bg-surface border border-border text-text text-[13px] py-1.5 px-3 rounded-sm focus:outline-none focus:border-accent cursor-pointer"
          style={{ boxShadow: "none" }}
        >
          {projects.map((p) => (
            <option key={p.id} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Kanban Board Columns Row */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch min-h-[500px]">
        {columnsList.map((colName) => {
          const colTasks = filteredTasks.filter((t) => t.column === colName);

          return (
            <div
              key={colName}
              className="flex-1 bg-surface/30 border border-border/60 rounded-md p-4 flex flex-col space-y-4"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-border/20">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  {colName}
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-surface-elevated border border-border text-text-muted">
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards Stack */}
              <div className="flex-1 flex flex-col space-y-3">
                {colTasks.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center min-h-[120px] text-text-faint text-[12px] italic">
                    No tasks
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-surface border border-border rounded-md p-3.5 space-y-3.5 hover:border-border/80 transition-all duration-200"
                    >
                      {/* Title */}
                      <h4 className="text-[14px] font-semibold text-text leading-snug">
                        {task.title}
                      </h4>

                      {/* Meta information */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold ${getPriorityStyle(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>
                          <span className="text-[11px] text-accent bg-accent/5 px-2 py-0.5 rounded-full font-semibold border border-accent/15">
                            {task.project.split(" ")[0]}
                          </span>
                        </div>
                        <span className="text-[11px] text-text-muted font-mono">
                          {task.dueDate}
                        </span>
                      </div>

                      {/* Dropdown controls */}
                      <div className="pt-2 border-t border-border/20 flex justify-between items-center">
                        <span className="text-[10px] text-text-faint font-mono">
                          ID: {task.id.slice(0, 8)}
                        </span>
                        <select
                          value=""
                          onChange={(e) =>
                            handleMoveTask(task.id, e.target.value as Task["column"])
                          }
                          className="bg-surface-elevated border border-border text-[11px] text-text-muted rounded px-2 py-0.5 focus:outline-none focus:border-accent cursor-pointer"
                        >
                          <option value="" disabled>
                            Move to →
                          </option>
                          {columnsList
                            .filter((c) => c !== colName)
                            .map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

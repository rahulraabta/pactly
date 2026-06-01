"use client";

import React, { useState } from "react";

interface Task {
  id: string;
  project: "Sunrise Portal" | "Neon Labs" | "Prism Media";
  title: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  dueDate: string;
  column: "Backlog" | "In Progress" | "Review" | "Done";
}

const initialTasks: Task[] = [
  // Backlog
  {
    id: "T-1",
    project: "Sunrise Portal",
    title: "Database migration checks and schema syncing",
    priority: "Low",
    dueDate: "Jun 12, 2026",
    column: "Backlog",
  },
  {
    id: "T-2",
    project: "Prism Media",
    title: "Figma wireframe assets export and localization prep",
    priority: "Medium",
    dueDate: "Jun 18, 2026",
    column: "Backlog",
  },
  // In Progress
  {
    id: "T-3",
    project: "Neon Labs",
    title: "Implement biometrics login FaceID/TouchID checks",
    priority: "High",
    dueDate: "Jun 10, 2026",
    column: "In Progress",
  },
  {
    id: "T-4",
    project: "Prism Media",
    title: "Checkout payment flow webhook validation",
    priority: "Urgent",
    dueDate: "Jun 08, 2026",
    column: "In Progress",
  },
  // Review
  {
    id: "T-5",
    project: "Sunrise Portal",
    title: "Security compliance auditing and SSL setup",
    priority: "High",
    dueDate: "Jun 05, 2026",
    column: "Review",
  },
  {
    id: "T-6",
    project: "Neon Labs",
    title: "API endpoint staging documentation",
    priority: "Low",
    dueDate: "Jun 06, 2026",
    column: "Review",
  },
  // Done
  {
    id: "T-7",
    project: "Sunrise Portal",
    title: "Initial workspace scaffolding and routing setup",
    priority: "Low",
    dueDate: "May 25, 2026",
    column: "Done",
  },
  {
    id: "T-8",
    project: "Prism Media",
    title: "Landing page layout design signoff",
    priority: "Medium",
    dueDate: "May 28, 2026",
    column: "Done",
  },
];

export default function BoardPage() {
  const [selectedProject, setSelectedProject] = useState<
    "Sunrise Portal" | "Neon Labs" | "Prism Media"
  >("Sunrise Portal");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const columnsList: Task["column"][] = ["Backlog", "In Progress", "Review", "Done"];

  // Filter tasks based on selected project
  const filteredTasks = tasks.filter((t) => t.project === selectedProject);

  const handleMoveTask = (taskId: string, newCol: Task["column"]) => {
    console.log(`Move task ${taskId} to → ${newCol}`);
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, column: newCol } : t))
    );
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

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex justify-between items-center">
        <select
          value={selectedProject}
          onChange={(e) =>
            setSelectedProject(
              e.target.value as "Sunrise Portal" | "Neon Labs" | "Prism Media"
            )
          }
          className="bg-surface border border-border text-text text-[13px] py-1.5 px-3 rounded-sm focus:outline-none focus:border-accent cursor-pointer"
          style={{ boxShadow: "none" }}
        >
          <option value="Sunrise Portal">Sunrise Portal</option>
          <option value="Neon Labs">Neon Labs</option>
          <option value="Prism Media">Prism Media</option>
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
                          ID: {task.id}
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

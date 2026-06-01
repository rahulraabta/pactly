"use client";

import { useState } from "react";
import {
  KanbanSquare,
  Plus,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Info,
  Trash2,
  XCircle,
  MoreVertical,
} from "lucide-react";

interface BoardTask {
  id: string;
  project: string;
  title: string;
  description: string;
  status: "Backlog" | "In_Progress" | "In_Review" | "Done";
  priority: "High" | "Medium" | "Low";
  isClientVisible: boolean;
  hoursEstimate: number;
}

const initialTasks: BoardTask[] = [
  {
    id: "TSK-001",
    project: "Dashboard Redesign",
    title: "Design main metrics charts & layout",
    description: "Build clean Plotly/Recharts diagrams showing MRR, burn rate, and delay ledgers in the admin panel.",
    status: "Backlog",
    priority: "High",
    isClientVisible: true,
    hoursEstimate: 8,
  },
  {
    id: "TSK-002",
    project: "Dashboard Redesign",
    title: "Setup Next.js workspace & Tailwind CSS 4",
    description: "Initialize the Next.js project layout structure, configure sidebar navigation and custom theme rules.",
    status: "Done",
    priority: "High",
    isClientVisible: true,
    hoursEstimate: 6,
  },
  {
    id: "TSK-003",
    project: "Mobile App Development",
    title: "Implement biometrics login flow",
    description: "Write custom react-native wrapper for FaceID/TouchID checks and local secure storage key generation.",
    status: "In_Progress",
    priority: "Medium",
    isClientVisible: false,
    hoursEstimate: 12,
  },
  {
    id: "TSK-004",
    project: "E-Commerce Website",
    title: "Integrate Stripe checkout redirection",
    description: "Configure stripe packages, product catalogs, and redirect client to safe payment gate.",
    status: "In_Review",
    priority: "High",
    isClientVisible: true,
    hoursEstimate: 10,
  },
  {
    id: "TSK-005",
    project: "API Integration",
    title: "Setup daily database backups",
    description: "Cron job configuration to backup MongoDB schemas and database logs to cloud S3 buckets.",
    status: "Backlog",
    priority: "Low",
    isClientVisible: false,
    hoursEstimate: 4,
  },
];

export default function BoardPage() {
  const [tasks, setTasks] = useState<BoardTask[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<BoardTask | null>(null);

  // Modal State for New Task
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newProject, setNewProject] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState<BoardTask["priority"]>("Medium");
  const [newVisibility, setNewVisibility] = useState(true);
  const [newEstimate, setNewEstimate] = useState("");
  const [newStatus, setNewStatus] = useState<BoardTask["status"]>("Backlog");

  const columns: { key: BoardTask["status"]; label: string; bg: string }[] = [
    { key: "Backlog", label: "Backlog", bg: "bg-slate-900/60" },
    { key: "In_Progress", label: "In Progress", bg: "bg-indigo-950/20" },
    { key: "In_Review", label: "In Review", bg: "bg-yellow-950/20" },
    { key: "Done", label: "Completed", bg: "bg-emerald-950/20" },
  ];

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newProject) return;

    const newTask: BoardTask = {
      id: `TSK-00${tasks.length + 1}`,
      project: newProject,
      title: newTitle,
      description: newDescription,
      status: newStatus,
      priority: newPriority,
      isClientVisible: newVisibility,
      hoursEstimate: Number(newEstimate) || 0,
    };

    setTasks([...tasks, newTask]);
    setIsModalOpen(false);

    // Reset Fields
    setNewTitle("");
    setNewProject("");
    setNewDescription("");
    setNewPriority("Medium");
    setNewVisibility(true);
    setNewEstimate("");
    setNewStatus("Backlog");
  };

  const handleMoveTask = (id: string, direction: "left" | "right") => {
    const statusOrder: BoardTask["status"][] = ["Backlog", "In_Progress", "In_Review", "Done"];
    setTasks(
      tasks.map((t) => {
        if (t.id === id) {
          const currentIndex = statusOrder.indexOf(t.status);
          const nextIndex =
            direction === "right"
              ? Math.min(statusOrder.length - 1, currentIndex + 1)
              : Math.max(0, currentIndex - 1);
          return { ...t, status: statusOrder[nextIndex] };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
    if (selectedTask?.id === id) setSelectedTask(null);
  };

  const handleToggleVisibility = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, isClientVisible: !t.isClientVisible } : t))
    );
    if (selectedTask?.id === id) {
      setSelectedTask((prev) => prev ? { ...prev, isClientVisible: !prev.isClientVisible } : null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <KanbanSquare className="h-6 w-6 text-teal-400" />
            Board
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your timeline deliverables. Private items stay hidden; Public items sync with the Client Portal.
          </p>
        </div>
        <button
          onClick={() => {
            setNewStatus("Backlog");
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 hover:bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Task
        </button>
      </div>

      {/* Grid of Columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          return (
            <div key={col.key} className={`rounded-xl border border-slate-800 p-4 ${col.bg} flex flex-col min-h-[500px]`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-200">{col.label}</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {colTasks.length}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setNewStatus(col.key);
                    setIsModalOpen(true);
                  }}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Tasks List */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                {colTasks.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-slate-800/80 rounded-lg text-slate-600 text-xs">
                    No tasks here
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="group rounded-lg border border-slate-800/80 bg-slate-900 p-4 space-y-3 hover:border-slate-700 transition-all shadow-md relative"
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 truncate max-w-[120px]">
                          {task.project}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleToggleVisibility(task.id)}
                            title={task.isClientVisible ? "Visible to Client" : "Private (Hidden)"}
                            className={`p-1 rounded hover:bg-slate-800 ${
                              task.isClientVisible ? "text-teal-400" : "text-slate-500"
                            }`}
                          >
                            {task.isClientVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                          </button>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                              task.priority === "High"
                                ? "bg-red-400/10 text-red-400"
                                : task.priority === "Medium"
                                ? "bg-yellow-400/10 text-yellow-400"
                                : "bg-sky-400/10 text-sky-400"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      </div>

                      <div
                        onClick={() => setSelectedTask(task)}
                        className="cursor-pointer space-y-1"
                      >
                        <h4 className="text-sm font-bold text-slate-100 group-hover:text-teal-400 transition-colors line-clamp-2">
                          {task.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-[10px] text-slate-500">
                        <span>{task.hoursEstimate ? `${task.hoursEstimate} hrs est.` : "No est."}</span>

                        <div className="flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleMoveTask(task.id, "left")}
                            disabled={task.status === "Backlog"}
                            className="p-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800"
                          >
                            <ChevronLeft className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleMoveTask(task.id, "right")}
                            disabled={task.status === "Done"}
                            className="p-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800"
                          >
                            <ChevronRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedTask(null)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            >
              <XCircle className="h-4 w-4" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {selectedTask.id}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    selectedTask.priority === "High"
                      ? "bg-red-400/10 text-red-400"
                      : selectedTask.priority === "Medium"
                      ? "bg-yellow-400/10 text-yellow-400"
                      : "bg-sky-400/10 text-sky-400"
                  }`}
                >
                  {selectedTask.priority} Priority
                </span>
                <button
                  onClick={() => handleToggleVisibility(selectedTask.id)}
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold border border-slate-700 ${
                    selectedTask.isClientVisible
                      ? "bg-teal-500/10 text-teal-400 border-teal-500/20"
                      : "bg-slate-850 text-slate-400"
                  }`}
                >
                  {selectedTask.isClientVisible ? (
                    <>
                      <Eye className="h-3 w-3" /> Client Visible
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3 w-3" /> Private Task
                    </>
                  )}
                </button>
              </div>

              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Project</div>
                <div className="text-sm font-semibold text-slate-200">{selectedTask.project}</div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-100">{selectedTask.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {selectedTask.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-4">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Status</span>
                  <span className="text-xs font-semibold text-slate-350">{selectedTask.status.replace("_", " ")}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Hours Estimate</span>
                  <span className="text-xs font-semibold text-slate-350">
                    {selectedTask.hoursEstimate ? `${selectedTask.hoursEstimate} Hours` : "Not estimated"}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-slate-800 pt-4">
                <button
                  onClick={() => handleDeleteTask(selectedTask.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-950/40 hover:bg-red-900 border border-red-850 text-red-400 hover:text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete Task
                </button>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg transition-colors"
                >
                  Close Detail
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            >
              <XCircle className="h-4 w-4" />
            </button>

            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-1">
              <KanbanSquare className="h-5 w-5 text-teal-400" />
              Create Task
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Add a work block to your sprint. Toggle Client Visibility to manage pipeline transparency.
            </p>

            <form onSubmit={handleAddTask} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    placeholder="e.g. Dashboard Redesign"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hours Estimate</label>
                  <input
                    type="number"
                    value={newEstimate}
                    onChange={(e) => setNewEstimate(e.target.value)}
                    placeholder="e.g. 8"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Build API Endpoints"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe the technical requirements or design patterns..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="Backlog">Backlog</option>
                    <option value="In_Progress">In Progress</option>
                    <option value="In_Review">In Review</option>
                    <option value="Done">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="newVisibility"
                    checked={newVisibility}
                    onChange={(e) => setNewVisibility(e.target.checked)}
                    className="h-4 w-4 accent-teal-500 rounded border-slate-800"
                  />
                  <label htmlFor="newVisibility" className="text-xs font-semibold text-slate-350 cursor-pointer">
                    Publish to Client Portal
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-xs font-semibold text-white transition-colors"
                  >
                    Log Task
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

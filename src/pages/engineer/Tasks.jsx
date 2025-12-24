import { useState } from "react";
import tasksData from "@/data/tasks.json";
import { CheckCircle2, Calendar, LayoutGrid } from "lucide-react";

const priorityColor = {
  HIGH: "bg-red-50 text-red-700 border-red-100",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-100",
  LOW: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

export default function EngineerTasks() {
  const [filter, setFilter] = useState("ALL");

  // ✅ local state (important)
  const [tasks, setTasks] = useState(
    tasksData.filter(t => t.assignedTo === "eng-1")
  );

  /* ================= MARK DONE ================= */
  const handleMarkDone = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? { ...task, status: "COMPLETED" }
        : task
    );

    setTasks(updatedTasks);
  };

  /* ================= GROUP + FILTER ================= */
  const groupedTasks = tasks
    .filter(t => filter === "ALL" || t.status === filter)
    .reduce((acc, task) => {
      acc[task.projectName] = acc[task.projectName] || [];
      acc[task.projectName].push(task);
      return acc;
    }, {});

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
          Global Tasks
        </h1>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
          Across all assigned sites
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
        {["ALL", "PENDING", "COMPLETED"].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-5 py-2 text-[10px] font-black uppercase rounded-full border whitespace-nowrap transition-all
              ${
                filter === tab
                  ? "bg-[#0B3C5D] text-white border-[#0B3C5D]"
                  : "bg-white text-slate-500"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TASK LIST */}
      <div className="space-y-8">
        {Object.entries(groupedTasks).map(([projectName, projectTasks]) => (
          <div key={projectName} className="space-y-3">

            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <LayoutGrid size={12} /> {projectName}
            </h2>

            {projectTasks.map(task => (
              <div
                key={task.id}
                className="bg-white p-5 rounded-2xl border shadow-sm space-y-4"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-800 text-base leading-tight truncate">
                      {task.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 flex items-center gap-1">
                      <Calendar size={10} /> {task.dueDate}
                    </p>
                  </div>

                  <span
                    className={`text-[9px] font-black px-2 py-1 rounded-md border uppercase shrink-0 ${priorityColor[task.priority]}`}
                  >
                    {task.priority}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-50">
                  <span className="text-[11px] font-bold text-blue-600 uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    {task.status.replace("_", " ")}
                  </span>

                  {task.status !== "COMPLETED" ? (
                    <button
                      onClick={() => handleMarkDone(task.id)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-black text-[10px] uppercase shadow-md active:scale-95 transition-transform"
                    >
                      Mark Done
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase">
                      <CheckCircle2 size={14} /> Done
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
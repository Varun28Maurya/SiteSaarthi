import { useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar, CheckCircle2, LayoutGrid, Plus, X } from "lucide-react";
import tasksData from "@/data/tasks.json";

const priorityColor = {
  HIGH: "bg-red-50 text-red-700 border-red-100",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-100",
  LOW: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

export default function ProjectTasks() {
  const { projectId } = useParams();

  const [tasks, setTasks] = useState(
    tasksData.filter(task => task.projectId === projectId)
  );

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    dueDate: "",
    priority: "MEDIUM",
  });

  /* ================= MARK DONE ================= */
  const markDone = (taskId) => {
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, status: "COMPLETED" } : t
    ));
  };

  /* ================= ADD TASK ================= */
  const addTask = () => {
    if (!form.title || !form.dueDate) {
      alert("Please fill all fields");
      return;
    }

    const newTask = {
      id: `task-${Date.now()}`,
      projectId,
      title: form.title,
      dueDate: form.dueDate,
      priority: form.priority,
      status: "IN_PROGRESS",
    };

    setTasks([newTask, ...tasks]);
    setForm({ title: "", dueDate: "", priority: "MEDIUM" });
    setShowForm(false);
  };

  return (
    <div className="w-full space-y-6 px-4 sm:px-6 lg:px-10">

      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
            Project Tasks
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            Execution monitoring for this site
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-[#0B3C5D] text-white rounded-lg text-xs font-black uppercase flex items-center gap-2 shadow active:scale-95"
        >
          <Plus size={14} /> Add Task
        </button>
      </div>

      {/* TASK LIST */}
      <div className="space-y-4">
        {tasks.map(task => (
          <div
            key={task.id}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="min-w-0">
                <h3 className="font-bold text-slate-800 text-base leading-tight truncate">
                  {task.title}
                </h3>
                <p className="text-[10px] text-slate-400 font-black uppercase mt-1.5 flex items-center gap-1.5">
                  <Calendar size={12} className="text-slate-300" />
                  Due: {task.dueDate}
                </p>
              </div>

              <span
                className={`text-[9px] font-black px-2.5 py-1 rounded-md border uppercase tracking-widest shrink-0 ${priorityColor[task.priority]}`}
              >
                {task.priority}
              </span>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-50">
              <span className="text-[11px] font-bold text-blue-600 uppercase flex items-center gap-2 tracking-tight">
                <span
                  className={`w-2 h-2 rounded-full ${
                    task.status === "COMPLETED"
                      ? "bg-emerald-500"
                      : "bg-blue-600"
                  }`}
                ></span>
                {task.status.replace("_", " ")}
              </span>

              {task.status !== "COMPLETED" && (
                <button
                  onClick={() => markDone(task.id)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-900/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={14} />
                  Mark as Done
                </button>
              )}
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="py-12 text-center bg-white rounded-3xl border border-dashed border-slate-300">
            <LayoutGrid className="mx-auto text-slate-200 mb-3" size={40} />
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">
              No tasks for this project
            </p>
          </div>
        )}
      </div>

      {/* ADD TASK MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-[999] bg-black/60 flex items-end sm:items-center justify-center">

          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black uppercase">Add Task</h3>
              <button onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>

            <input
              placeholder="Task title"
              className="w-full bg-slate-100 p-4 rounded-xl font-bold"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />

            <input
              type="date"
              className="w-full bg-slate-100 p-4 rounded-xl font-bold"
              value={form.dueDate}
              onChange={e => setForm({ ...form, dueDate: e.target.value })}
            />

            <select
              className="w-full bg-slate-100 p-4 rounded-xl font-bold"
              value={form.priority}
              onChange={e => setForm({ ...form, priority: e.target.value })}
            >
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>

            <button
              onClick={addTask}
              className="w-full py-4 bg-[#0B3C5D] text-white rounded-xl font-black uppercase"
            >
              Add Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
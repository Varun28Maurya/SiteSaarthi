import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  ArrowRight,
  Search,
  ClipboardCheck,
  Package,
  Plus,
  Trash2,
} from "lucide-react";

import projectsSeed from "../../data/projects.json";
import AddProjectModal from "./AddProjectModal";

export default function EngineerProjects() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  /* ================= LOAD PROJECTS ================= */
  useEffect(() => {
    const stored = localStorage.getItem("projects");
    if (stored) {
      setProjects(JSON.parse(stored));
    } else {
      localStorage.setItem("projects", JSON.stringify(projectsSeed));
      setProjects(projectsSeed);
    }
  }, []);

  /* ================= ADD PROJECT ================= */
  const handleAddProject = (newProject) => {
    const updated = [...projects, newProject];
    setProjects(updated);
    localStorage.setItem("projects", JSON.stringify(updated));
  };

  /* ================= REMOVE PROJECT ================= */
  const removeProject = (id) => {
    if (!window.confirm("Remove this project?")) return;
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem("projects", JSON.stringify(updated));
  };

  /* ================= SEARCH ================= */
  const filtered = useMemo(() => {
    return projects.filter(
      p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase())
    );
  }, [projects, search]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* HEADER (UNCHANGED) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          My Projects
        </h1>

        <div className="flex gap-3">
          <div className="relative w-full sm:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              className="pl-10 pr-4 py-3 sm:py-2 border rounded-xl w-full text-sm bg-white"
              placeholder="Search projects..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* ADD PROJECT BUTTON (SAFE) */}
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      {/* PROJECT GRID (UNCHANGED) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(p => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
          >
            <div
              className={`h-1.5 ${
                p.status === "Attention Needed"
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
            />

            <div className="p-5 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg leading-tight">
                  {p.name}
                </h3>

                {/* REMOVE PROJECT */}
                <button
                  onClick={() => removeProject(p.id)}
                  className="text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                <MapPin size={14} /> {p.location}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 bg-slate-50 rounded-xl text-[11px] font-medium flex items-center gap-2">
                  <ClipboardCheck size={14} /> DPR: Done
                </div>
                <div className="p-3 bg-slate-50 rounded-xl text-[11px] font-medium flex items-center gap-2">
                  <Package size={14} /> Mat: {p.materialsPending || 0}
                </div>
              </div>

              <button
                onClick={() => navigate(`/engineer/projects/${p.id}`)}
                className="mt-auto w-full bg-[#0B3C5D] text-white py-3.5 rounded-xl font-bold text-sm flex justify-center items-center gap-2"
              >
                Enter Site <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD PROJECT MODAL */}
      {showAdd && (
        <AddProjectModal
          onClose={() => setShowAdd(false)}
          onAdd={handleAddProject}
        />
      )}
    </div>
  );
}
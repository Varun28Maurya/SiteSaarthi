import React, { useEffect, useState, useMemo } from "react";
import projectsSeed from "../../data/projects.json";
import {
  LayoutGrid,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

const ENGINEER_ID = "eng-1";

{/* ================= Small Compact Stat Card ================= */}
const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
    <div className={`p-2 rounded-lg ${colorClass}`}>
      <Icon size={18} />
    </div>
    <div>
      <p className="text-[11px] text-slate-500 font-medium">{title}</p>
      <p className="text-lg font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

export default function EngineerDashboard() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const existing = localStorage.getItem("projects");
    if (!existing) {
      localStorage.setItem("projects", JSON.stringify(projectsSeed));
    }
    setProjects(JSON.parse(localStorage.getItem("projects") || "[]"));
  }, []);

  const dashboardProjects = useMemo(() => {
    return projects
      .filter(p => p.engineerId === ENGINEER_ID)
      .map(p => {
        const dpr = localStorage.getItem(`dpr-${p.id}`);
        const materials = JSON.parse(
          localStorage.getItem(`materials-${p.id}`) || "[]"
        );
        return {
          ...p,
          status:
            !dpr || materials.length > 3
              ? "Attention Needed"
              : "On Track",
        };
      });
  }, [projects]);

  const stats = {
    total: dashboardProjects.length,
    attention: dashboardProjects.filter(p => p.status === "Attention Needed").length,
    onTrack: dashboardProjects.filter(p => p.status === "On Track").length,
  };

  return (
    <div className="max-w-7xl mx-auto px-3 pb-28">
      
      {/* ================= HEADER ================= */}
      <div className="mt-4 mb-5">
        <h1 className="text-xl font-bold">Engineer Dashboard</h1>
        <p className="text-xs text-slate-500 flex items-center gap-1">
          <Clock size={12} />
          Shift started at 08:30 AM
        </p>
      </div>

      {/* ================= UTILIZATION ================= */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-xl text-white shadow-lg mb-4">
        <p className="text-xs uppercase opacity-90">Utilization</p>
        <p className="text-3xl font-bold">92%</p>
        <div className="w-full bg-white/30 h-1.5 rounded-full mt-2">
          <div className="bg-white h-full w-[92%]" />
        </div>
      </div>

      {/* ================= STATS GRID ================= */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          title="On Track"
          value={stats.onTrack}
          icon={CheckCircle}
          colorClass="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Attention"
          value={stats.attention}
          icon={AlertTriangle}
          colorClass="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Projects"
          value={stats.total}
          icon={LayoutGrid}
          colorClass="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Quality"
          value="✓"
          icon={CheckCircle}
          colorClass="bg-green-50 text-green-600"
        />
      </div>

      {/* ================= ATTENTION RADAR ================= */}
      <div>
        <h2 className="text-sm font-bold mb-3">🚨 Attention Radar</h2>

        <div className="bg-white rounded-xl border divide-y overflow-hidden">
          {dashboardProjects.map(project => (
            <div
              key={project.id}
              className="p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-semibold">
                  {project.name}
                </p>
                <p className="text-xs text-slate-500">
                  DPR not submitted today
                </p>
              </div>

              <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700">
                LOW RISK
              </span>
            </div>
          ))}

          {dashboardProjects.length === 0 && (
            <p className="p-4 text-sm text-slate-500">
              No assigned projects
            </p>
          )}
        </div>
      </div>

    </div>
  );

}

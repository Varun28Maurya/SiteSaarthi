import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import projects from "@/data/projects.json";
import ProjectMap from "@/components/maps/ProjectMap";

import {
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Navigation,
  Plus,
  ChevronLeft,
} from "lucide-react";

/* ================= GPS DISTANCE ================= */
function getDistanceInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export default function ProjectDashboard() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return <div className="p-6 text-sm text-slate-500">Loading…</div>;
  }

  /* ================= STATE ================= */
  const [checkingLocation, setCheckingLocation] = useState(false);
  const [gpsStatus, setGpsStatus] = useState("NOT_VERIFIED");
  const [distanceFromSite, setDistanceFromSite] = useState(null);
  const [dprSubmitted, setDprSubmitted] = useState(false);

  const [attendance, setAttendance] = useState({
    self: false,
    workers: 18, // SAMPLE
  });

  /* ================= SAMPLE SUMMARY DATA ================= */
  const executionSummary = {
    tasksPending: 3,
    materialRequests: 2,
  };

  const tasks = [
    { id: 1, title: "Column Casting – 4th Floor", priority: "High" },
    { id: 2, title: "Electrical Conduit Layout", priority: "Medium" },
    { id: 3, title: "Plastering – Wing A", priority: "Low" },
  ];

  /* ================= LOAD ATTENDANCE ================= */
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const saved = localStorage.getItem(`attendance-${project.id}-${today}`);

    if (saved) {
      const data = JSON.parse(saved);
      setAttendance(p => ({ ...p, self: true }));
      setGpsStatus("VERIFIED");
      setDistanceFromSite(
        Math.round(getDistanceInMeters(data.lat, data.lng, project.lat, project.lng))
      );
    }
  }, [project]);

  /* ================= CHECK-IN ================= */
  const handleSelfCheckIn = () => {
    if (attendance.self || !navigator.geolocation) return;

    setCheckingLocation(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        const distance = getDistanceInMeters(
          latitude,
          longitude,
          project.lat,
          project.lng
        );

        if (distance <= project.radius) {
          localStorage.setItem(
            `attendance-${project.id}-${new Date().toISOString().split("T")[0]}`,
            JSON.stringify({ lat: latitude, lng: longitude })
          );
          setAttendance(p => ({ ...p, self: true }));
          setGpsStatus("VERIFIED");
          setDistanceFromSite(Math.round(distance));
        } else {
          setGpsStatus("FAILED");
          alert(`You are ${Math.round(distance)}m away from site`);
        }
        setCheckingLocation(false);
      },
      () => {
        setGpsStatus("FAILED");
        setCheckingLocation(false);
      }
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* ================= MOBILE BACK HEADER ================= */}
      <div className="flex items-center gap-2 md:hidden">
        <button
          onClick={() => navigate("/engineer/projects")}
          className="p-2 rounded-full bg-white border shadow"
        >
          <ChevronLeft size={18} />
        </button>
        <h1 className="font-black text-lg truncate">{project.name}</h1>
      </div>

      {/* ================= ATTENDANCE + DAILY PROGRESS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ATTENDANCE (UNCHANGED) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border shadow-sm">
          <h3 className="text-xs font-black uppercase text-slate-400 mb-6">
            Attendance Status
          </h3>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <button
              onClick={handleSelfCheckIn}
              disabled={attendance.self || checkingLocation}
              className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3
                ${
                  attendance.self
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                    : "bg-slate-50 border-slate-200 text-slate-400"
                }`}
            >
              <CheckCircle2 size={32} />
              <span className="text-xs font-black uppercase">
                {attendance.self ? "Checked In" : "Self Check-in"}
              </span>
            </button>

            <div className="p-6 rounded-2xl bg-[#0B3C5D] text-white flex flex-col items-center justify-center">
              <span className="text-4xl font-black">{attendance.workers}</span>
              <span className="text-[11px] uppercase text-slate-300 font-bold">
                Workers Present
              </span>
            </div>
          </div>

          <div className="p-4 bg-orange-50 rounded-xl border flex gap-3 mb-4">
            <AlertTriangle size={20} className="text-orange-500" />
            <p className="text-xs font-bold text-orange-700 uppercase">
              {attendance.self
                ? "Attendance logged. DPR unlocked."
                : "Mark attendance to enable DPR"}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <Navigation
              size={14}
              className={
                gpsStatus === "VERIFIED"
                  ? "text-emerald-600"
                  : gpsStatus === "FAILED"
                  ? "text-red-500"
                  : "text-slate-400"
              }
            />
            <span className="text-slate-500">
              {gpsStatus === "VERIFIED"
                ? `GPS Verified • ${distanceFromSite}m`
                : gpsStatus === "FAILED"
                ? "GPS verification failed"
                : "GPS not verified"}
            </span>
          </div>
        </div>

        {/* DAILY PROGRESS (UNCHANGED) */}
        <div className="bg-gradient-to-br from-[#0B3C5D] to-[#07243b] rounded-2xl p-8 text-white shadow-lg h-fit">
          <h3 className="text-xl font-black uppercase">Daily Progress</h3>
          <p className="text-xs text-slate-300 mt-1">
            Capture today’s work & photos
          </p>

          <button
            disabled={!attendance.self || dprSubmitted}
            onClick={() => setDprSubmitted(true)}
            className={`mt-8 w-full py-4 rounded-xl font-black uppercase text-sm
              ${
                dprSubmitted
                  ? "bg-emerald-500"
                  : "bg-orange-500 hover:bg-orange-600 active:scale-95"
              }`}
          >
            {dprSubmitted ? "DPR Submitted" : "Start DPR"}
          </button>
        </div>
      </div>

      {/* ================= URGENT MATERIALS ================= */}
      <div className="bg-white rounded-2xl p-6 border shadow-sm">
        <h3 className="text-xs font-black uppercase text-slate-400 mb-2">
          Urgent Materials
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Raise request for cement, steel, etc.
        </p>
        <button className="w-full py-4 bg-slate-100 rounded-xl font-black uppercase text-xs flex justify-center gap-2 text-[#0B3C5D]">
          <Plus size={16} /> Raise Request
        </button>
      </div>

      {/* ================= PRIORITY TASKS ================= */}
      <div className="bg-white rounded-2xl border shadow-sm">
        <div className="p-5 border-b flex justify-between">
          <h3 className="font-black uppercase">Priority Tasks</h3>
          <span className="text-xs text-blue-600 font-bold">View All</span>
        </div>

        <div className="divide-y">
          {tasks.map(task => (
            <div key={task.id} className="p-5 flex justify-between">
              <div>
                <p className="font-bold">{task.title}</p>
                <p className="text-xs text-slate-400 font-bold uppercase">
                  {task.priority} Priority
                </p>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </div>
          ))}
        </div>
      </div>
      {/* ================= SITE MAP ================= */}
<div className="bg-white rounded-2xl p-6 border shadow-sm">
  <h3 className="text-xs font-black uppercase text-slate-400 mb-4">
    Site Location & Radius
  </h3>

  <div className="h-[260px] rounded-xl overflow-hidden border">
    <ProjectMap
      lat={project.lat}
      lng={project.lng}
      radius={project.radius}
    />
  </div>

  <p className="mt-3 text-[11px] text-slate-500 font-bold uppercase">
    GPS-based project boundary
  </p>
</div>


      
    </div>
  );
}
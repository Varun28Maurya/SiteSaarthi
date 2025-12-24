import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  ClipboardCheck,
  AlertTriangle,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  ChevronRight,
  MoreVertical,
  Activity,
  ArrowUpRight,
  User,
  Bell,
  RefreshCw,
  Search
} from "lucide-react";

/*** KPI Stat Card*/
const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color} transition-transform group-hover:scale-110 duration-300`}>
        <Icon size={22} />
      </div>
      {trend && (
        <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trend.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          <ArrowUpRight size={12} className="mr-1" />
          {trend.value}
        </span>
      )}
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
      <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
    </div>
  </div>
);

/*** Progress Bar Component*/
const ProgressBar = ({ progress, status }) => (
  <div className="w-full mt-3">
    <div className="flex justify-between items-center mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
      <span>Progress</span>
      <span>{progress}%</span>
    </div>
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full transition-all duration-1000 ${status === "On Track" ? 'bg-emerald-500' : 'bg-amber-500'}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

/*** MAIN DASHBOARD*/
export default function Dashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const authUser = JSON.parse(localStorage.getItem("authUser"));
const OWNER_ID = authUser?.id;

  // Mock data 
  useEffect(() => {
    const seedData = () => {
      if (!localStorage.getItem("projects")) {
        localStorage.setItem(
          "projects",
          JSON.stringify([
            {
              id: "proj-1",
              name: "Skyline Residency",
              ownerId: "owner-1",
              engineerId: "eng-1",
              location: "Worli, Mumbai",
              progress: 75,
              startDate: "Jan 2024"
            },
            {
              id: "proj-2",
              name: "Green Valley Villas",
              ownerId: "owner-1",
              engineerId: "eng-1",
              location: "Sector 45, Gurgaon",
              progress: 42,
              startDate: "Mar 2024"
            }
          ])
        );
      }

      if (!localStorage.getItem("dpr-proj-1")) {
        localStorage.setItem(
          "dpr-proj-1",
          JSON.stringify({ date: new Date(), progress: "Slab casting done" })
        );
      }

      if (!localStorage.getItem("materials-proj-2")) {
        localStorage.setItem(
          "materials-proj-2",
          JSON.stringify([{ item: "Cement", status: "Pending" }])
        );
      }
    };

    seedData();
    
    // Simulate loading for UX feel
    const timer = setTimeout(() => {
      const stored = localStorage.getItem("projects");
      if (stored) setProjects(JSON.parse(stored));
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const projectStatus = useMemo(() => {
    return projects
      .filter(p => p.ownerId === OWNER_ID)
      .map(project => {
        const dpr = localStorage.getItem(`dpr-${project.id}`);
        const materials = JSON.parse(
          localStorage.getItem(`materials-${project.id}`) || "[]"
        );
        const pendingMaterials = materials.filter(m => m.status === "Pending").length;

        return {
          ...project,
          dprSubmitted: !!dpr,
          pendingMaterials,
          status: !dpr || pendingMaterials > 0 ? "Attention Needed" : "On Track"
        };
      });
  }, [projects]);

  const stats = {
    active: projectStatus.length,
    dprDone: projectStatus.filter(p => p.dprSubmitted).length,
    dprPending: projectStatus.filter(p => !p.dprSubmitted).length,
    materialsPending: projectStatus.reduce((sum, p) => sum + p.pendingMaterials, 0)
  };

  const auditTrail = useMemo(() => {
    const logs = [];
    projectStatus.forEach(p => {
      if (p.dprSubmitted) logs.push({ msg: `DPR submitted for ${p.name}`, type: "success", time: "2h ago" });
      if (p.pendingMaterials > 0) logs.push({ msg: `Material request pending – ${p.name}`, type: "warning", time: "5h ago" });
      if (!p.dprSubmitted) logs.push({ msg: `DPR pending – ${p.name}`, type: "danger", time: "Just now" });
    });
    return logs.sort((a, b) => (a.type === 'danger' ? -1 : 1)).slice(0, 4);
  }, [projectStatus]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="animate-spin text-blue-600" size={40} />
          <p className="text-slate-400 font-medium animate-pulse">Building your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Owner Control Panel
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              You have <span className="text-blue-600 font-bold">{stats.active} active projects</span> requiring attention today.
            </p>
          </div>
        </div>

        {/* KPI GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Active Sites"
            value={stats.active}
            icon={Building2}
            color="bg-blue-50 text-blue-600"
            trend={{ value: "12%", isPositive: true }}
          />
          <StatCard
            title="DPRs Submitted"
            value={stats.dprDone}
            icon={ClipboardCheck}
            color="bg-emerald-50 text-emerald-600"
            trend={{ value: "Today", isPositive: true }}
          />
          <StatCard
            title="DPRs Missing"
            value={stats.dprPending}
            icon={AlertTriangle}
            color="bg-rose-50 text-rose-600"
          />
          <StatCard
            title="Pending Requests"
            value={stats.materialsPending}
            icon={Truck}
            color="bg-indigo-50 text-indigo-600"
          />
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* PROJECT MONITORING */}
          <div className="lg:col-span-2 space-y-4 order-2 lg:order-1">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Project Monitoring</h2>
              <button
  onClick={() => navigate("/owner/projects")}
  className="text-sm font-bold text-blue-600 hover:underline"
>
  View All Projects
</button>

            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectStatus
  .slice(0, window.innerWidth < 640 ? 1 : projectStatus.length)
  .map(p => (

                <div key={p.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-black text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{p.name}</h3>
                      <div className="flex items-center text-slate-400 text-xs mt-1 font-medium">
                        <MapPin size={12} className="mr-1" />
                        {p.location}
                      </div>
                    </div>
                    <button className="p-1.5 text-slate-300 hover:text-slate-600 rounded-lg">
                      <MoreVertical size={18} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      p.status === "On Track" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    }`}>
                      {p.status}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Since {p.startDate}
                    </span>
                  </div>

                  <ProgressBar progress={p.progress} status={p.status} />

                  <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold ${
                          i === 1 ? 'bg-indigo-100 text-indigo-600' : i === 2 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {i === 1 ? 'PM' : i === 2 ? 'EN' : 'CL'}
                        </div>
                      ))}
                    </div>
                    <button className="text-xs font-black text-slate-400 group-hover:text-blue-600 flex items-center transition-colors">
                      Details <ChevronRight size={14} className="ml-0.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AUDIT TIMELINE */}
          <div className="space-y-4 order-1 lg:order-2">

            <div className="px-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Recent Activity</h2>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-50">
                {auditTrail.map((log, i) => (
                  <div key={i} className="relative pl-10 group">
                    {/* Timeline dot */}
                    <div className={`absolute left-0 top-1.5 w-7 h-7 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 ${
                      log.type === "success" ? "bg-emerald-500" : 
                      log.type === "warning" ? "bg-amber-500" : "bg-rose-500"
                    }`}>
                      {log.type === "success" ? <CheckCircle size={10} className="text-white" /> : 
                       log.type === "warning" ? <Truck size={10} className="text-white" /> : 
                       <AlertTriangle size={10} className="text-white" />}
                    </div>
                    
                    <div className="transition-transform group-hover:translate-x-1 duration-200">
                      <p className={`text-sm font-bold mb-0.5 ${
                        log.type === "success" ? "text-slate-800" : 
                        log.type === "warning" ? "text-amber-700" : "text-rose-700"
                      }`}>
                        {log.msg}
                      </p>
                      <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <Clock size={10} className="mr-1" />
                        {log.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-8 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all uppercase tracking-[0.2em]">
                View All Activity
              </button>
            </div>
          </div>
        </div>
      </main>    
    </div>
  );
}

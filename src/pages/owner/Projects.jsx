import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Share2, 
  MapPin, 
  CreditCard, 
  Hash, 
  ChevronRight, 
  Search,
  Building2,
  X,
  Copy,
  CheckCircle2,
  LayoutGrid
} from "lucide-react";
const generateInviteCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();
/*** PROJECT CARD COMPONENT*/
const ProjectCard = ({ project, onViewDetails }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const code = project.code || project.id;
    const textArea = document.createElement("textarea");
    textArea.value = code;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
      {/* Header with Orange Accent */}
      <div className="p-6 pb-4 border-b border-slate-50 relative overflow-hidden">
        <div className="flex justify-between items-start relative z-10">
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-600 mb-3">
              Active
            </span>
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#0B3C5D] transition-colors">
              {project.name}
            </h3>
            <p className="text-sm text-slate-500 font-medium flex items-center mt-1">
              <MapPin size={14} className="mr-1 text-slate-400" />
              {project.location}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest mb-1">Completion</p>
            <p className="text-lg font-bold text-slate-800">
              {project.progress ?? 0}%
            </p>
          </div>
        </div>
      </div>
      {/* Body */}
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Budget</span>
            <p className="text-sm font-semibold text-slate-700">
              {project.budgetSlab || "Standard"}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Project Code</span>
            <div className="flex items-center gap-1">
              <p className="text-xs font-mono font-bold text-[#0B3C5D] bg-slate-100 px-2 py-1 rounded">
                {project.code || project.id.split('-')[1] || project.id}
              </p>
            </div>
          </div>
        </div>
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress</span>
            <span className="text-xs font-bold text-slate-800">{project.progress ?? 0}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0B3C5D] rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${project.progress ?? 0}%` }}
            />
          </div>
        </div>
      </div>
      {/* Footer Actions */}
      <div className="px-6 py-4 bg-slate-50/50 flex gap-2 border-t border-slate-50">
        <button
          onClick={() => onViewDetails(project.id)}
          className="flex-1 text-sm font-bold text-[#0B3C5D] bg-white border border-slate-200 py-2 rounded-lg hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
        >
          View Details
          <ChevronRight size={16} />
        </button>
        <button 
          onClick={handleCopy}
          className={`p-2 rounded-lg border transition-all flex items-center justify-center ${
            copied ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
          }`}
          title="Share Project Code"
        >
          {copied ? <CheckCircle2 size={18} /> : <Share2 size={18} />}
        </button>
      </div>
    </div>
  );
};
/*** MAIN COMPONENT*/
export default function OwnerProjects() {
  const navigate = useNavigate();
  const [showAddProject, setShowAddProject] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState([]);
  const user = { id: "owner-1", name: "Rajesh Khanna" };
  useEffect(() => {
    const stored = localStorage.getItem("projects");
    if (!stored) {
      const initial = [
        { id: "proj-1", name: "Skyline Residency", location: "Worli, Mumbai", ownerId: "owner-1", progress: 75, budgetSlab: "₹5–20L", code: "SKY-WR" },
        { id: "proj-2", name: "Green Valley Villas", location: "Gurgaon, Sec 45", ownerId: "owner-1", progress: 42, budgetSlab: ">₹20L", code: "GVV-GR" },
      ];
      localStorage.setItem("projects", JSON.stringify(initial));
      setProjects(initial);
    } else {
      setProjects(JSON.parse(stored).filter(p => p.ownerId === user.id));
    }
  }, []);
  const filteredProjects = useMemo(() => {
    return projects.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);
  const handleViewDetails = (id) => {
  navigate(`/owner/projects/${id}`);
};
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-800">
              Project Management
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Manage and monitor your active construction sites.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search projects..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0B3C5D]/20 focus:border-[#0B3C5D] outline-none transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowAddProject(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0B3C5D] text-white px-5 py-2 rounded-lg shadow-md hover:opacity-90 transition-all font-bold text-sm"
            >
              <Plus size={18} />
              Add New Project
            </button>
          </div>
        </div>
        {/* PROJECTS GRID */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.map((p) => (
              <ProjectCard 
                key={p.id} 
                project={p} 
                onViewDetails={handleViewDetails} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
            <Building2 size={48} className="text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-800">No Projects Found</h3>
            <p className="text-slate-500 text-sm mb-6 text-center px-4">You haven't added any projects yet or your search returned no results.</p>
            <button
               onClick={() => setShowAddProject(true)}
               className="bg-[#0B3C5D] text-white px-6 py-2 rounded-lg font-bold shadow-md"
            >
              Add Project
            </button>
          </div>
        )}
      </div>
      {/* ADD PROJECT MODAL */}
      {showAddProject && (
        <AddProjectModal
          ownerId={user.id}
          onClose={() => setShowAddProject(false)}
        />
      )}
    </div>
  );
}
/*** MODAL COMPONENT*/
function AddProjectModal({ ownerId, onClose }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [budgetSlab, setBudgetSlab] = useState("");
  const [inviteCode] = useState(generateInviteCode());
  const handleCreate = () => {
    if (!name || !location || !budgetSlab) return;
    const existing = JSON.parse(localStorage.getItem("projects")) || [];
    const newProject = {
      id: `proj-${Date.now()}`,
      name,
      location,
      ownerId,
      engineerId: null,
      budgetSlab,
      inviteCode,
      progress: 0,
    };
    localStorage.setItem("projects", JSON.stringify([...existing, newProject]));
    onClose();
    window.location.reload();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-6">
        <div className="flex justify-between items-center border-b border-slate-50 pb-4">
          <h2 className="text-lg font-bold text-slate-800">
            Create New Project
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Project Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0B3C5D]/20 focus:border-[#0B3C5D] outline-none transition-all text-sm"
              placeholder="e.g., Skyline Residency"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Location
            </label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0B3C5D]/20 focus:border-[#0B3C5D] outline-none transition-all text-sm"
              placeholder="e.g., Worli, Mumbai"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Budget Slab
            </label>
            <select
              value={budgetSlab}
              onChange={(e) => setBudgetSlab(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0B3C5D]/20 focus:border-[#0B3C5D] outline-none transition-all text-sm"
            >
              <option value="">Select Budget (you can change this later)</option>
              <option value="<5L">Below ₹5L – Basic site tracking & updates</option>
              <option value="5-20L">₹5–20L – Advanced tracking & approvals</option>
              <option value=">20L">Above ₹20L – Full control, reports & compliance</option>
            </select>
          </div>
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Engineer Access Key
            </p>
            <p className="font-mono text-xl font-bold text-[#0B3C5D] tracking-widest">
              {inviteCode}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name || !location || !budgetSlab}
            className="flex-1 py-2.5 bg-[#0B3C5D] text-white rounded-lg font-bold text-sm shadow-lg hover:opacity-90 disabled:opacity-50 transition-all active:scale-95"
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}


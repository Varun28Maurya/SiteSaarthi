import { useEffect, useState } from "react";
import projects from "@/data/projects.json";
import { Plus, X, Package, Calendar, User } from "lucide-react";

const statusColor = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function EngineerMaterials() {
  const [filter, setFilter] = useState("ALL");
  const authUser = JSON.parse(localStorage.getItem("authUser")) || { id: 'eng-1', role: 'ENGINEER' };
  const [materials, setMaterials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ projectId: "", materialName: "", quantity: "", unit: "", remarks: "" });

  const myProjects = projects.filter(p => p.engineerId === authUser.id);
  const filteredMaterials = materials.filter(item => filter === "ALL" || item.status === filter);

  useEffect(() => {
    const stored = localStorage.getItem("materials");
    if (stored) setMaterials(JSON.parse(stored));
  }, []);

  const handleSubmit = () => {
    if (!form.projectId || !form.materialName || !form.quantity || !form.unit) return alert("Required fields missing");
    const project = myProjects.find(p => p.id === form.projectId);
    const newRequest = {
      id: `mt-${Date.now()}`,
      projectId: project.id,
      projectName: project.name,
      materialName: form.materialName,
      quantity: Number(form.quantity),
      unit: form.unit,
      sender: { id: authUser.id, role: authUser.role, name: authUser.name || "Site Engineer" },
      receiver: { id: project.ownerId || "owner-1", role: "OWNER", name: "Project Owner" },
      status: "PENDING",
      requestedOn: new Date().toISOString().split("T")[0],
      remarks: form.remarks,
    };
    const updated = [newRequest, ...materials];
    setMaterials(updated);
    localStorage.setItem("materials", JSON.stringify(updated));
    setForm({ projectId: "", materialName: "", quantity: "", unit: "", remarks: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Material Requests</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Track indents & supplies</p>
        </div>
        <button onClick={() => setShowForm(true)} className="w-full xs:w-auto px-5 py-3 bg-[#0B3C5D] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95 transition-transform">
          <Plus size={18} /> New Request
        </button>
      </div>

      {/* MODAL FORM */}
      {showForm && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-6 space-y-4 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-black text-lg uppercase tracking-tight text-slate-800">New Indent</h3>
              <button onClick={() => setShowForm(false)} className="p-2 bg-slate-100 rounded-full"><X size={20} /></button>
            </div>
            <select className="w-full border-none bg-slate-100 p-4 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500" value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })}>
              <option value="">Select Site Location</option>
              {myProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Material (Cement, etc)" className="col-span-2 border-none bg-slate-100 p-4 rounded-xl text-sm font-bold" value={form.materialName} onChange={e => setForm({ ...form, materialName: e.target.value })} />
              <input placeholder="Quantity" type="number" className="border-none bg-slate-100 p-4 rounded-xl text-sm font-bold" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
              <input placeholder="Unit (Bags/Kg)" className="border-none bg-slate-100 p-4 rounded-xl text-sm font-bold" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} />
            </div>
            <textarea placeholder="Purpose / Area of work" className="w-full border-none bg-slate-100 p-4 rounded-xl text-sm font-bold" value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} />
            <button onClick={handleSubmit} className="w-full py-4 bg-orange-500 text-white rounded-xl font-black uppercase tracking-widest shadow-lg shadow-orange-500/30 active:scale-95 transition-all">Submit Request</button>
          </div>
        </div>
      )}

      {/* SCROLLABLE FILTER TABS */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {["ALL", "PENDING", "APPROVED", "REJECTED"].map(tab => (
          <button key={tab} onClick={() => setFilter(tab)} className={`px-4 py-2 text-[10px] font-black uppercase rounded-full border whitespace-nowrap transition-all ${filter === tab ? "bg-[#0B3C5D] text-white border-[#0B3C5D] shadow-md" : "bg-white text-slate-500 hover:bg-slate-50"}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* CARDS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMaterials.map(item => (
          <div key={item.id} className="rounded-2xl border bg-white p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><Package size={16} className="text-slate-400" /> {item.materialName}</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mt-1">{item.projectName}</p>
              </div>
              <span className={`text-[9px] font-black px-2 py-1 rounded-md border uppercase ${statusColor[item.status]}`}>{item.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-3 border-t border-slate-50">
              <div className="flex flex-col gap-0.5"><span className="text-[9px] font-black text-slate-400 uppercase">Quantity</span><span className="text-xs font-bold text-slate-700">{item.quantity} {item.unit}</span></div>
              <div className="flex flex-col gap-0.5"><span className="text-[9px] font-black text-slate-400 uppercase">Requested</span><span className="text-xs font-bold text-slate-700">{item.requestedOn}</span></div>
            </div>
          </div>
        ))}
        {filteredMaterials.length === 0 && <p className="text-center py-10 text-slate-400 text-xs italic">No matching material requests found.</p>}
      </div>
    </div>
  );
}
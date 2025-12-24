import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Package, Plus, X, Calendar, User, Info } from "lucide-react";
import projects from "@/data/projects.json";

const STATUS_COLORS = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function EngineerMaterials() {
  const { projectId } = useParams();
  const project = projects.find(p => p.id === projectId);

  const [filter, setFilter] = useState("ALL");
  const [materials, setMaterials] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    materialName: "",
    quantity: "",
    unit: "",
    remarks: "",
  });

  /* ================= SAMPLE DATA ================= */
  useEffect(() => {
    const sample = [
      {
        id: "m1",
        projectId,
        materialName: "Cement",
        quantity: 15,
        unit: "20 KG",
        status: "PENDING",
        requestedOn: "2025-12-23",
        receiver: { name: "Project Owner" },
        remarks: "urgent chaiye",
      },
      {
        id: "m2",
        projectId,
        materialName: "Cement (OPC 53)",
        quantity: 200,
        unit: "BAGS",
        status: "APPROVED",
        requestedOn: "2025-03-05",
        receiver: { name: "Project Owner" },
        remarks: "",
      },
      {
        id: "m3",
        projectId,
        materialName: "Steel Rod",
        quantity: 1,
        unit: "TON",
        status: "REJECTED",
        requestedOn: "2025-02-18",
        receiver: { name: "Project Owner" },
        remarks: "quantity excess",
      },
    ];
    setMaterials(sample);
  }, [projectId]);

  const visibleMaterials =
    filter === "ALL"
      ? materials
      : materials.filter(m => m.status === filter);

  return (
    /* 🔥 FIXED CONTAINER */
    <div className="w-full px-3 sm:px-6 lg:px-10 space-y-6">

      {/* ===== HEADER ===== */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black uppercase text-slate-800">
            Material Indents
          </h1>
          <p className="text-[11px] font-bold uppercase text-slate-500">
            Site: {project?.name}
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto px-5 py-3 bg-[#0B3C5D] text-white rounded-xl font-bold flex items-center justify-center gap-2"
        >
          <Plus size={18} /> New Request
        </button>
      </div>

      {/* ===== FILTER TABS (ONLY THIS SCROLLS) ===== */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 min-w-max pb-1">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-5 py-2 text-[11px] font-black uppercase rounded-full border whitespace-nowrap
                ${
                  filter === tab
                    ? "bg-[#0B3C5D] text-white border-[#0B3C5D]"
                    : "bg-white text-slate-500 border-slate-300"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ===== LIST ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {visibleMaterials.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border p-4 sm:p-5 shadow-sm space-y-3"
          >
            <div className="flex justify-between gap-3">
              <div className="flex gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  <Package size={16} className="text-slate-500" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm truncate">
                    {item.materialName}
                  </p>
                  <p className="text-[10px] font-black uppercase text-slate-400">
                    Qty: {item.quantity} {item.unit}
                  </p>
                </div>
              </div>

              <span
                className={`text-[9px] px-2 py-1 rounded-md border font-black uppercase ${STATUS_COLORS[item.status]}`}
              >
                {item.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t">
              <div>
                <p className="text-[9px] uppercase font-black text-slate-400 flex items-center gap-1">
                  <Calendar size={10} /> Requested
                </p>
                <p className="text-xs font-bold">{item.requestedOn}</p>
              </div>

              <div>
                <p className="text-[9px] uppercase font-black text-slate-400 flex items-center gap-1">
                  <User size={10} /> Recipient
                </p>
                <p className="text-xs font-bold truncate">
                  {item.receiver.name}
                </p>
              </div>
            </div>

            {item.remarks && (
              <div className="p-3 bg-slate-50 rounded-xl flex gap-2">
                <Info size={14} className="text-slate-400 shrink-0" />
                <p className="text-[11px] italic text-slate-500">
                  “{item.remarks}”
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ===== MODAL ===== */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 space-y-4">
            <div className="flex justify-between">
              <h3 className="font-black uppercase">New Material Request</h3>
              <button onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>

            <input
              placeholder="Material Name"
              className="w-full bg-slate-100 p-4 rounded-xl font-bold"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Quantity"
                className="bg-slate-100 p-4 rounded-xl font-bold"
              />
              <input
                placeholder="Unit"
                className="bg-slate-100 p-4 rounded-xl font-bold"
              />
            </div>
            <textarea
              placeholder="Remarks"
              className="bg-slate-100 p-4 rounded-xl min-h-[90px] font-bold"
            />

            <button className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black uppercase">
              Submit Indent
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
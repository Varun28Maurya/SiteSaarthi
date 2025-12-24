import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserPlus, Calendar, IndianRupee, X, CheckCircle } from "lucide-react";

export default function ProjectAttendance() {
  const { projectId } = useParams();
  const authUser =
    JSON.parse(localStorage.getItem("authUser")) || { id: "eng-1" };

  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [attendance, setAttendance] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    workerName: "",
    role: "",
    wagePerDay: "",
  });

  /* ================= LOAD + SAMPLE ================= */
  useEffect(() => {
    const stored = localStorage.getItem("attendance");

    if (stored) {
      setAttendance(JSON.parse(stored));
    } else {
      const sampleData = [
        {
          id: "att-1",
          projectId,
          date: today,
          workerName: "Prakash",
          role: "Electrician",
          wagePerDay: 700,
          status: "PRESENT",
          markedBy: authUser.id,
          markedAt: new Date().toISOString(),
        },
        {
          id: "att-2",
          projectId,
          date: today,
          workerName: "Varun Singh",
          role: "Helper",
          wagePerDay: 500,
          status: "PRESENT",
          markedBy: authUser.id,
          markedAt: new Date().toISOString(),
        },
        {
          id: "att-3",
          projectId,
          date: today,
          workerName: "Ramesh Yadav",
          role: "Mason",
          wagePerDay: 800,
          status: "PRESENT",
          markedBy: authUser.id,
          markedAt: new Date().toISOString(),
        },
      ];

      setAttendance(sampleData);
      localStorage.setItem("attendance", JSON.stringify(sampleData));
    }
  }, [projectId]);

  /* ================= SAVE ================= */
  const saveData = (data) => {
    setAttendance(data);
    localStorage.setItem("attendance", JSON.stringify(data));
  };

  /* ================= ADD WORKER ================= */
  const addAttendance = () => {
    if (!form.workerName || !form.role || !form.wagePerDay) {
      alert("Please fill all fields");
      return;
    }

    const newEntry = {
      id: `att-${Date.now()}`,
      projectId,
      date,
      workerName: form.workerName,
      role: form.role,
      wagePerDay: Number(form.wagePerDay),
      status: "PRESENT",
      markedBy: authUser.id,
      markedAt: new Date().toISOString(),
    };

    saveData([newEntry, ...attendance]);
    setForm({ workerName: "", role: "", wagePerDay: "" });
    setShowForm(false);
  };

  /* ================= FILTER ================= */
  const todaysAttendance = attendance.filter(
    (a) => a.projectId === projectId && a.date === date
  );

  /* ================= TOTAL ================= */
  const totalWages = todaysAttendance.reduce(
    (sum, w) => sum + w.wagePerDay,
    0
  );

  return (
    <div className="w-full space-y-6 px-4 sm:px-6 lg:px-10">


      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase text-slate-800">
            Attendance
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase">
            Daily labour tracking & wages
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="px-5 py-3 bg-[#0B3C5D] text-white rounded-xl font-bold flex items-center gap-2 shadow active:scale-95"
        >
          <UserPlus size={18} /> Add Worker
        </button>
      </div>

      {/* DATE + SUMMARY */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="bg-white p-4 rounded-2xl border flex items-center gap-3 flex-1">
          <Calendar size={18} className="text-blue-500" />
          <div className="flex-1">
            <label className="text-[10px] font-black uppercase text-slate-400">
              Select Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-sm font-bold focus:ring-0 border-none p-0"
            />
          </div>
        </div>

        <div className="bg-[#0B3C5D] rounded-2xl text-white flex-1 flex justify-around items-center p-4">
          <div className="text-center">
            <p className="text-[10px] uppercase text-blue-200 font-bold">
              Total Workers
            </p>
            <p className="text-xl font-black">
              {todaysAttendance.length}
            </p>
          </div>
          <div className="h-8 w-px bg-white/10"></div>
          <div className="text-center">
            <p className="text-[10px] uppercase text-blue-200 font-bold">
              Daily Wages
            </p>
            <p className="text-xl font-black">₹{totalWages}</p>
          </div>
        </div>
      </div>

      {/* WORKER LIST */}
      <div className="space-y-3">
        {todaysAttendance.map((w) => (
          <div
            key={w.id}
            className="bg-white border rounded-2xl p-4 flex justify-between items-center shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                {w.workerName.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-sm">{w.workerName}</p>
                <p className="text-[10px] uppercase text-slate-400 font-black">
                  {w.role} • ₹{w.wagePerDay}/day
                </p>
              </div>
            </div>

            <span className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase">
              <CheckCircle size={12} /> Present
            </span>
          </div>
        ))}
      </div>

      {/* ADD WORKER MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-[9999]">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 space-y-4">
            <div className="flex justify-between">
              <h3 className="font-black uppercase">Worker Entry</h3>
              <button onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>

            <input
              placeholder="Worker Name"
              className="w-full bg-slate-100 p-4 rounded-xl font-bold"
              value={form.workerName}
              onChange={(e) =>
                setForm({ ...form, workerName: e.target.value })
              }
            />

            <input
              placeholder="Role"
              className="w-full bg-slate-100 p-4 rounded-xl font-bold"
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
            />

            <div className="relative">
              <IndianRupee
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                placeholder="Wage per day"
                type="number"
                className="w-full bg-slate-100 pl-10 p-4 rounded-xl font-bold"
                value={form.wagePerDay}
                onChange={(e) =>
                  setForm({ ...form, wagePerDay: e.target.value })
                }
              />
            </div>

            <button
              onClick={addAttendance}
              className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black uppercase"
            >
              Mark Present
            </button>
          </div>
        </div>
      )}
    </div>
  );

}

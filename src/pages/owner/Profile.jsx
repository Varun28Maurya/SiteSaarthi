import { LogOut, Building2, Phone, User } from "lucide-react";
export default function OwnerProfile() {
  const owner = {
    name: "Rajesh Sharma",
    company: "Sharma Constructions",
    phone: "+91 98765 43210",
    role: "Owner",
  };
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };
  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl border shadow-sm p-6 sm:p-8 space-y-6">
      <h1 className="text-2xl font-black text-slate-800 uppercase">
        Profile
      </h1>

      <div className="space-y-4">
        <ProfileRow icon={<User size={18} />} label="Name" value={owner.name} />
        <ProfileRow icon={<Building2 size={18} />} label="Company" value={owner.company} />
        <ProfileRow icon={<Phone size={18} />} label="Phone" value={owner.phone} />
        <ProfileRow icon={<User size={18} />} label="Role" value={owner.role} />
      </div>

      <button
        onClick={handleLogout}
        className="w-full mt-6 py-4 bg-rose-600 text-white rounded-xl font-black uppercase flex items-center justify-center gap-2 active:scale-95"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}
/* ===== Reusable Row ===== */
function ProfileRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
      <div className="text-slate-400">{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase text-slate-400">
          {label}
        </p>
        <p className="font-bold text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}
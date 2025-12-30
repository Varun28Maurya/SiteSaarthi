import { LogOut, Building2, Phone, User } from "lucide-react";
import { useState, useEffect } from "react";

export default function EngineerProfile() {
  const [language, setLanguage] = useState("en");

useEffect(() => {
  const savedLang = localStorage.getItem("lang") || "en";
  setLanguage(savedLang);
  localStorage.setItem("lang", savedLang);
}, []);

  // TEMP: later from auth / backend
  const engineer = {
    name: "Amit Verma",
    company: "SiteSaarthi",
    phone: "+91 91234 56789",
    role: "Site Engineer",
  };
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };
  const handleLanguageChange = (e) => {
  const lang = e.target.value;
  setLanguage(lang);
  localStorage.setItem("lang", lang);

  // 🚧 Auto-translation will hook here later
};

  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl border shadow-sm p-6 sm:p-8 space-y-6">
      <h1 className="text-2xl font-black text-slate-800 uppercase">
        Profile
      </h1>

      <div className="space-y-4">
        <ProfileRow icon={<User size={18} />} label="Name" value={engineer.name} />
        <ProfileRow icon={<Building2 size={18} />} label="Company" value={engineer.company} />
        <ProfileRow icon={<Phone size={18} />} label="Phone" value={engineer.phone} />
        <ProfileRow icon={<User size={18} />} label="Role" value={engineer.role} />
        {/* Language Preference */}
<div className="space-y-2">
  <p className="text-xs font-black uppercase text-slate-400">
    Language Preference
  </p>

  <select
    value={language}
    onChange={handleLanguageChange}
    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700 focus:ring-2 focus:ring-[#F97316] outline-none"
  >
    <option value="en">English</option>
    <option value="hi">हिंदी</option>
    <option value="mr">मराठी</option>
  </select>

  <p className="text-[11px] text-slate-400">
    App language will update based on your preference
  </p>
</div>

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

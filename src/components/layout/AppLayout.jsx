import { Menu, Bell, Wifi, WifiOff } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import { User } from "lucide-react";
import { Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OwnerSidebar from "../sidebar/OwnerSidebar";
import EngineerSidebarGlobal from "../sidebar/EngineerSidebarGlobal";
import EngineerSidebarProject from "../sidebar/EngineerSidebarProject";
import OwnerBottomNav from "../sidebar/OwnerSidebarMobile";
import EngineerSidebarGlobalMobile from "../sidebar/EngineerSidebarGlobalMobile";
import EngineerSidebarProjectMobile from "../sidebar/EngineerSidebarProjectMobile";
export default function AppLayout({
  isOffline = false,
  toggleOffline = () => { },
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const isEngineer = location.pathname.startsWith("/engineer");
  const isProjectWorkspace = location.pathname.includes("/engineer/projects/");
  const isOwner = location.pathname.startsWith("/owner");
  const renderSidebar = () => {
    if (isOwner) return <OwnerSidebar />;

    if (isEngineer) {
      return isProjectWorkspace
        ? <EngineerSidebarProject />
        : <EngineerSidebarGlobal />;
    }
    return null;
  };
  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#0B3C5D] text-white hidden lg:block">
        {renderSidebar()}
      </aside>
      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
          {/* LEFT: App Identity */}
          <div className="flex items-center gap-2 sm:gap-3">
            <img
  src="/SiteSaarthiLogo.png"
  alt="SiteSaarthi"
  className="h-8 w-auto sm:h-9"
/>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate max-w-[120px] sm:max-w-none">
              SiteSaarthi
            </h1>
          </div>
          {/* RIGHT: Status + Notifications */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleOffline}
              className={`px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1.5 transition-colors
        ${isOffline
                  ? "bg-rose-50 text-rose-600"
                  : "bg-emerald-50 text-emerald-600"}`}
            >
              {isOffline ? <WifiOff size={14} /> : <Wifi size={14} />}
              <span className="hidden xs:inline">{isOffline ? "OFFLINE" : "ONLINE"}</span>
            </button>
            {/* Read Aloud */}
<button
  title="Read screen aloud"
  className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition"
>
  <Volume2 size={20} />
</button>

{/* Notifications */}
<button className="relative p-2 text-slate-600">
  <Bell size={20} />
  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
</button>
<button
  onClick={() =>
    navigate(isOwner ? "/owner/profile" : "/engineer/profile")
  }
  className="ml-1 w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition"
>
  <User size={18} />
</button>
          </div>
        </header>
        {/* Content - pb-24 ensures visibility above mobile nav */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 lg:pb-6">
          <Outlet />
        </main>
      </div>
      {/* Mobile Bottom Nav */}
      <div className="lg:hidden">
        {isOwner && <OwnerBottomNav />}
        {isEngineer && !isProjectWorkspace && <EngineerSidebarGlobalMobile />}
        {isEngineer && isProjectWorkspace && <EngineerSidebarProjectMobile />}
      </div>
    </div>
  );
}

import { Outlet } from "react-router-dom";
export default function ProjectWorkspace() {
  return (
    <main className="flex-1 flex flex-col min-h-0 overflow-y-auto p-0 sm:p-6">
      <Outlet />
    </main>
  );
}
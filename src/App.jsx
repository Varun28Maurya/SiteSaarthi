import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Auth from "./pages/Auth";

// Layout
import AppLayout from "./components/layout/AppLayout";

// Sidebars
import OwnerSidebar from "./components/sidebar/OwnerSidebar";
import EngineerSidebarGlobal from "./components/sidebar/EngineerSidebarGlobal";

// OWNER
import OwnerDashboard from "./pages/owner/Dashboard";
import OwnerProjects from "./pages/owner/Projects";
import OwnerProjectDetails from "./pages/owner/ProjectDetails";
import OwnerMaterials from "./pages/owner/Materials";
import OwnerChat from "./pages/owner/Chat";
import OwnerDocs from "./pages/owner/Docs";
import OwnerProfile from "./pages/owner/Profile";
import GSTInvoicePage from "./pages/owner/GSTInvoice";
import QuotationPage from "./pages/owner/Quotation";
import PurchaseOrdersPage from "./pages/owner/PurchaseOrder";
import MaterialOrderPage from "./pages/owner/MaterialOrder";

// ENGINEER – GLOBAL
import EngineerDashboard from "./pages/engineer/Dashboard";
import EngineerProjects from "./pages/engineer/Projects";
import EngineerTasks from "./pages/engineer/Tasks";
import EngineerMaterials from "./pages/engineer/Materials";
import EngineerChat from "./pages/engineer/Chat";
import EngineerProfile from "./pages/engineer/Profile";

// ENGINEER – PROJECT
import ProjectWorkspace from "./pages/engineer/project/ProjectWorkspace";
import ProjectDashboard from "./pages/engineer/project/ProjectDashboard";
import ProjectAttendance from "./pages/engineer/project/ProjectAttendance";
import ProjectTasks from "./pages/engineer/project/ProjectTasks";
import ProjectMaterials from "./pages/engineer/project/ProjectMaterials";
import ProjectChat from "./pages/engineer/project/ProjectChat";


/* ---------------- AUTH GUARD ---------------- */
const RequireAuth = ({ children, allowedRole }) => {
  const authUser = JSON.parse(localStorage.getItem("authUser"));

  if (!authUser) return <Navigate to="/login" replace />;
  if (allowedRole && authUser.role !== allowedRole)
    return <Navigate to="/login" replace />;

  return children;
};

function App() {
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const role = authUser?.role;

  return (
    <Router>
      <Routes>

        {/* AUTH */}
        <Route
          path="/"
          element={
            authUser ? (
              <Navigate
                to={role === "OWNER" ? "/owner/dashboard" : "/engineer/dashboard"}
                replace
              />
            ) : (
              <Auth />
            )
          }
        />

        <Route path="/login" element={<Auth />} />

        {/* OWNER */}
        <Route
          path="/owner"
          element={
            <RequireAuth allowedRole="OWNER">
              <AppLayout sidebar={<OwnerSidebar />} />
            </RequireAuth>
          }
        >
  
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<OwnerDashboard />} />
          <Route path="projects" element={<OwnerProjects />} />
          <Route path="projects/:projectId" element={<OwnerProjectDetails />} />
          <Route path="materials" element={<OwnerMaterials />} />
          <Route path="chat" element={<OwnerChat />} />
          <Route path="docs" element={<OwnerDocs />} />
          <Route path="profile" element={<OwnerProfile />} />
          <Route path="docs/gst-invoice" element={<GSTInvoicePage />} />
          <Route path="docs/quotation" element={<QuotationPage />} />
          <Route path="docs/purchase-order" element={<PurchaseOrdersPage />} />
          <Route path="docs/material-order" element={<MaterialOrderPage />} />
        </Route>


        {/* ENGINEER – GLOBAL */}
        <Route
          path="/engineer"
          element={
            <RequireAuth allowedRole="ENGINEER">
              <AppLayout sidebar={<EngineerSidebarGlobal />} />
            </RequireAuth>
          }
        >
          
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<EngineerDashboard />} />
          <Route path="projects" element={<EngineerProjects />} />
          <Route path="tasks" element={<EngineerTasks />} />
          <Route path="materials" element={<EngineerMaterials />} />
          <Route path="chat" element={<EngineerChat />} />
          <Route path="profile" element={<EngineerProfile />} />

          {/* PROJECT CONTEXT */}
          <Route path="projects/:projectId" element={<ProjectWorkspace />}>
            <Route index element={<ProjectDashboard />} />
            <Route path="attendance" element={<ProjectAttendance />} />
            <Route path="tasks" element={<ProjectTasks />} />
            <Route path="materials" element={<ProjectMaterials />} />
            <Route path="chat" element={<ProjectChat />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
export default App;

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function DashboardLayout({ children }) {
  return (
    <div className="flex bg-slate-950 min-h-screen text-slate-300 relative overflow-hidden">
      {/* Unified Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.05),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.03),transparent_35%)] pointer-events-none" />

      <Sidebar />

      <div className="flex-1 flex flex-col relative z-10 h-screen overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
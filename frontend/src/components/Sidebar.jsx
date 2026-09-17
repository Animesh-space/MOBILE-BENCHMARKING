import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaFlask,
  FaChartBar,
  FaHistory,
  FaCog,
} from "react-icons/fa";

function Sidebar() {
  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
    { name: "New Benchmark", icon: <FaFlask />, path: "/benchmark" },
    { name: "Results", icon: <FaChartBar />, path: "/results" },
    { name: "History", icon: <FaHistory />, path: "/history" },
    { name: "Settings", icon: <FaCog />, path: "/settings" },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900/80 backdrop-blur-xl border-r border-slate-800/80 p-6 flex flex-col relative z-20">
      <div className="flex items-center gap-3 mb-10 pl-2">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <span className="text-slate-950 font-bold text-lg">M</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Benchmark
        </h2>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.05)]"
                  : "text-slate-400 border border-transparent hover:bg-slate-800/50 hover:text-slate-200"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      {/* Optional: System status indicator at bottom of sidebar */}
      <div className="mt-auto pt-6 border-t border-slate-800/50">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/30 border border-slate-700/30">
           <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium text-slate-400">System Online</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
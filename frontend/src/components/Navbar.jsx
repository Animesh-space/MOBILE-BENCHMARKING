import { FaBell, FaUserCircle, FaSearch } from "react-icons/fa";

function Navbar() {
  return (
    <div className="sticky top-0 z-30 px-6 pt-6 pb-2 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 flex justify-between items-center shadow-sm">
        
        {/* Search / Breadcrumb Placeholder */}
        <div className="flex items-center gap-3 text-slate-400 bg-slate-950/50 px-4 py-2 rounded-xl border border-slate-800/80 w-64 focus-within:border-cyan-500/50 transition-colors">
          <FaSearch className="text-sm" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none text-sm text-slate-200 placeholder-slate-500 w-full"
          />
        </div>

        <div className="flex items-center gap-5">
          <button className="relative p-2 text-slate-400 hover:text-cyan-400 transition-colors rounded-lg hover:bg-slate-800/50">
            <FaBell className="text-xl" />
            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-cyan-500 rounded-full border-2 border-slate-900"></span>
          </button>
          
          <div className="h-8 w-px bg-slate-800 mx-1"></div>

          <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white leading-none">Admin User</p>
              <p className="text-xs text-slate-500 mt-1">Console Access</p>
            </div>
            <FaUserCircle className="text-3xl text-slate-300" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
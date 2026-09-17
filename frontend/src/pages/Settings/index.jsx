import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

function Settings() {
  const [theme, setTheme] = useState("dark"); // Default to dark for consistency with our new UI
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("English");

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem("mobileBenchmarkSettings"));
    if (savedSettings) {
      setTheme(savedSettings.theme || "dark");
      setNotifications(savedSettings.notifications !== undefined ? savedSettings.notifications : true);
      setLanguage(savedSettings.language || "English");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "mobileBenchmarkSettings",
      JSON.stringify({ theme, notifications, language })
    );
  }, [theme, notifications, language]);

  const resetSettings = () => {
    setTheme("dark");
    setNotifications(true);
    setLanguage("English");
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">System Preferences</h1>
          <p className="mt-2 text-slate-400">Manage your console environment and notifications.</p>
        </div>

        <div className="space-y-6">
          {/* Theme */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-8 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-2">Appearance</h2>
            <p className="text-sm text-slate-400 mb-6">Select the interface color scheme.</p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setTheme("light")}
                className={`flex items-center gap-2 rounded-xl px-6 py-3.5 font-medium transition-all ${
                  theme === "light"
                    ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                    : "bg-slate-950/50 text-slate-400 border border-slate-800 hover:border-slate-700"
                }`}
              >
                ☀️ Light Mode
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex items-center gap-2 rounded-xl px-6 py-3.5 font-medium transition-all ${
                  theme === "dark"
                    ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                    : "bg-slate-950/50 text-slate-400 border border-slate-800 hover:border-slate-700"
                }`}
              >
                🌙 Dark Mode
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Push Notifications</h2>
                <p className="text-sm text-slate-400">Receive alerts when long-running benchmarks complete.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
                <div className="w-14 h-7 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>
          </div>

          {/* Language */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-8 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-2">Localization</h2>
            <p className="text-sm text-slate-400 mb-6">Select your preferred dashboard language.</p>
            <div className="relative max-w-xs">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full appearance-none bg-slate-950/50 border border-slate-800 text-white rounded-xl px-4 py-3.5 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all cursor-pointer"
              >
                <option value="English">🇺🇸 English (US)</option>
                <option value="Spanish">🇪🇸 Español</option>
                <option value="French">🇫🇷 Français</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          {/* Reset */}
          <div className="rounded-2xl border border-red-500/20 bg-red-900/10 p-8 shadow-xl">
            <h2 className="text-xl font-bold text-red-400 mb-2">Danger Zone</h2>
            <p className="text-sm text-red-400/70 mb-6">Restore all local preferences to their default system values.</p>
            <button
              onClick={resetSettings}
              className="rounded-xl bg-red-500/10 border border-red-500/30 px-6 py-3 font-semibold text-red-400 hover:bg-red-500 hover:text-white transition-all"
            >
              Factory Reset Settings
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Settings;
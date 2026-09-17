import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

function NewBenchmark() {
  const navigate = useNavigate();

  const [applicationName, setApplicationName] = useState("");
  const [testType, setTestType] = useState("Functional Testing");
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleToolChange = (tool) => {
    if (tools.includes(tool)) {
      setTools(tools.filter((item) => item !== tool));
    } else {
      setTools([...tools, tool]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tools.length === 0) {
      setError("Please select at least one testing tool.");
      return;
    }
    setError("");
    setLoading(true);

    const requestData = {
      applicationName: applicationName,
      testType: testType,
      tools: tools,
      userId: 1,
      deviceId: 2,
    };

    try {
      const response = await fetch("http://localhost:8080/api/benchmark-run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) throw new Error("Failed to start benchmark");

      const data = await response.json();
      console.log("Benchmark request response:", JSON.stringify(data, null, 2));

      navigate("/results", {
        state: { benchmarkData: data },
      });
    } catch (error) {
      console.error("Error starting benchmark:", error);
      setError("Unable to send benchmark request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
          New Benchmark
        </h1>
        <p className="text-slate-400">
          Configure and execute a new mobile testing sequence.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl max-w-4xl"
      >
        {/* Application Name */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Application Name
          </label>
          <input
            type="text"
            value={applicationName}
            onChange={(e) => setApplicationName(e.target.value)}
            placeholder="e.g. Hospital Management System"
            className="w-full bg-slate-950/50 border border-slate-800 text-white placeholder:text-slate-600 rounded-xl px-4 py-3.5 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all"
            required
          />
        </div>

        {/* Testing Tools */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-300 mb-4">
            Select Testing Tools
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {["Appium", "Espresso", "AI Tester"].map((tool) => {
              const isSelected = tools.includes(tool);
              return (
                <div
                  key={tool}
                  onClick={() => handleToolChange(tool)}
                  className={`relative flex items-center p-4 cursor-pointer rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? "bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.05)]"
                      : "bg-slate-950/50 border-slate-800 hover:border-slate-600 hover:bg-slate-800/30"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center mr-3 transition-colors ${
                    isSelected ? "bg-cyan-500 border-cyan-500" : "border-slate-600"
                  }`}>
                    {isSelected && (
                      <svg className="w-3.5 h-3.5 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`font-medium ${isSelected ? "text-cyan-400" : "text-slate-300"}`}>
                    {tool}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Test Type */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Test Type
          </label>
          <select
            value={testType}
            onChange={(e) => setTestType(e.target.value)}
            className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-xl px-4 py-3.5 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all appearance-none"
          >
            <option>Functional Testing</option>
            <option>Performance Testing</option>
            <option>Security Testing</option>
          </select>
        </div>

        {/* Selected Tools Status */}
        <div className="mb-8 p-4 rounded-xl bg-slate-950/50 border border-slate-800">
          <p className="text-sm text-slate-400">
            <span className="text-slate-300 font-medium">Ready to test with:</span>{" "}
            {tools.length > 0 ? (
              <span className="text-cyan-400 font-medium">{tools.join(" • ")}</span>
            ) : (
              <span className="text-slate-500">No tools selected</span>
            )}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        {/* Start Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-8 py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-slate-950" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Running Benchmark...
            </>
          ) : (
            "Initialize Benchmark"
          )}
        </button>
      </form>
    </DashboardLayout>
  );
}

export default NewBenchmark;
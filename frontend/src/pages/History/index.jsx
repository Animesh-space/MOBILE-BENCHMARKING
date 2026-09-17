import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

function History() {
  const [benchmarks, setBenchmarks] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");
      const [benchmarksResponse, resultsResponse] = await Promise.all([
        fetch("http://localhost:8080/api/benchmarks"),
        fetch("http://localhost:8080/api/results"),
      ]);
      if (!benchmarksResponse.ok) throw new Error("Unable to load benchmarks");
      if (!resultsResponse.ok) throw new Error("Unable to load benchmark results");
      
      const benchmarksData = await benchmarksResponse.json();
      const resultsData = await resultsResponse.json();

      setBenchmarks(benchmarksData);
      setResults(resultsData);
    } catch (err) {
      console.error("History loading error:", err);
      setError("Unable to load benchmark history.");
    } finally {
      setLoading(false);
    }
  };

  const getBenchmarkResults = (benchmarkId) => results.filter((result) => result.benchmark?.id === benchmarkId);

  const getOverallPassRate = (benchmarkResults) => {
    if (benchmarkResults.length === 0) return "N/A";
    let totalRuns = 0;
    let passedRuns = 0;
    benchmarkResults.forEach((result) => {
      totalRuns += result.totalRuns || 0;
      passedRuns += result.passedRuns || 0;
    });
    if (totalRuns === 0) return "N/A";
    const passRate = (passedRuns / totalRuns) * 100;
    return `${passRate.toFixed(1)}%`;
  };

  const getRecommendedTool = (benchmarkResults) => {
    if (benchmarkResults.length === 0) return "N/A";
    const validResults = benchmarkResults.filter((result) => result.status === "PASSED" && result.executionTime !== null && result.executionTime !== undefined);
    if (validResults.length === 0) return "N/A";

    const maximumExecutionTime = Math.max(...validResults.map((result) => Number(result.executionTime) || 0));

    const scoredResults = validResults.map((result) => {
      const totalRuns = Number(result.totalRuns) || 0;
      const passedRuns = Number(result.passedRuns) || 0;
      let passRate = Number(result.passRate);

      if ((!Number.isFinite(passRate) || passRate === 0) && totalRuns > 0) passRate = (passedRuns / totalRuns) * 100;
      if (!Number.isFinite(passRate)) passRate = 0;

      const executionTime = Number(result.executionTime) || 0;
      const flakiness = Number(result.flakiness) || 0;
      let speedScore = 100;

      if (maximumExecutionTime > 0) speedScore = (1 - executionTime / maximumExecutionTime) * 100;

      const reliabilityScore = Math.max(0, 100 - flakiness);
      const recommendationScore = passRate * 0.70 + speedScore * 0.20 + reliabilityScore * 0.10;

      return { ...result, recommendationScore };
    });

    const recommendedResult = scoredResults.reduce((bestResult, currentResult) => currentResult.recommendationScore > bestResult.recommendationScore ? currentResult : bestResult);
    return recommendedResult.tool || "N/A";
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleString();
  };

  const handleViewResults = (benchmark) => {
    navigate("/results", {
      state: {
        benchmarkData: {
          benchmarkId: benchmark.id,
          applicationName: benchmark.benchmarkName,
          testType: benchmark.category,
          status: benchmark.status,
          outputs: {},
        },
      },
    });
  };

  const sortedBenchmarks = [...benchmarks].reverse();

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Run History</h1>
        <p className="mt-2 text-slate-400">Access and review archived benchmark executions.</p>
      </div>

      {loading && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-10 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
          <span className="text-slate-400">Syncing telemetry data...</span>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 flex flex-col items-center text-center">
          <svg className="w-8 h-8 text-red-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={loadHistory} className="rounded-lg bg-red-500/20 border border-red-500/50 px-6 py-2 text-red-300 hover:bg-red-500/30 transition-colors">
            Retry Connection
          </button>
        </div>
      )}

      {!loading && !error && sortedBenchmarks.length === 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-10 text-center">
          <p className="text-slate-400">No telemetry records located in the database.</p>
        </div>
      )}

      {!loading && !error && sortedBenchmarks.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-xl">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-950/80 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-4">Run ID</th>
                  <th className="px-6 py-4">Target App</th>
                  <th className="px-6 py-4">Test Profile</th>
                  <th className="px-6 py-4">Tools</th>
                  <th className="px-6 py-4">Avg Pass</th>
                  <th className="px-6 py-4">Recommended</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {sortedBenchmarks.map((benchmark) => {
                  const benchmarkResults = getBenchmarkResults(benchmark.id);
                  const isCompleted = benchmark.status === "COMPLETED";

                  return (
                    <tr key={benchmark.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-mono text-slate-500">
                        #{String(benchmark.id).padStart(4, '0')}
                      </td>
                      <td className="px-6 py-4 font-semibold text-white">
                        {benchmark.benchmarkName}
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {benchmark.category}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {benchmarkResults.length} engines
                      </td>
                      <td className="px-6 py-4 text-slate-300 font-medium">
                        {getOverallPassRate(benchmarkResults)}
                      </td>
                      <td className="px-6 py-4 font-medium text-cyan-400">
                        {getRecommendedTool(benchmarkResults)}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-400">
                        {benchmark.expectedDuration}s
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border ${
                            isCompleted 
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                              : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          }`}
                        >
                          {benchmark.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        {formatDate(benchmark.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleViewResults(benchmark)}
                          className="rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 px-4 py-2 text-xs font-semibold transition-all border border-slate-700 hover:border-cyan-500"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default History;
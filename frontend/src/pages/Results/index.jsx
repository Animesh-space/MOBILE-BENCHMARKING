import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/* ... KEEP ALL YOUR PARSING/CALCULATION FUNCTIONS EXACTLY THE SAME HERE (extractNumber, extractInteger, parseToolResult, calculateRecommendation) ... */
function extractNumber(text, patterns, defaultValue = 0) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return Number.parseFloat(match[1]);
  }
  return defaultValue;
}

function extractInteger(text, patterns, defaultValue = 0) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return Number.parseInt(match[1], 10);
  }
  return defaultValue;
}

function parseToolResult(tool, output) {
  const text = output || "";
  const totalRuns = extractInteger(text, [/TOTAL RUNS:\s*(\d+)/i, /Total Runs:\s*(\d+)/i], 0);
  const passedRuns = extractInteger(text, [/PASSED RUNS:\s*(\d+)/i, /Passed:\s*(\d+)/i], 0);
  const failedRuns = extractInteger(text, [/FAILED RUNS:\s*(\d+)/i, /Failed:\s*(\d+)/i], 0);
  const passRate = extractNumber(text, [/PASS RATE:\s*([0-9]+(?:\.[0-9]+)?)%/i, /Pass Rate:\s*([0-9]+(?:\.[0-9]+)?)%/i], totalRuns > 0 ? (passedRuns / totalRuns) * 100 : 0);
  const averageExecutionTime = extractNumber(text, [/AVERAGE EXECUTION TIME:\s*([0-9]+(?:\.[0-9]+)?)/i, /Average Execution Time:\s*([0-9]+(?:\.[0-9]+)?)/i], 0);
  const totalExecutionTime = extractNumber(text, [/TOTAL EXECUTION TIME:\s*([0-9]+(?:\.[0-9]+)?)/i, /Total Execution Time:\s*([0-9]+(?:\.[0-9]+)?)/i], 0);
  const flakiness = totalRuns > 0 ? (failedRuns / totalRuns) * 100 : 0;
  const status = totalRuns > 0 && failedRuns === 0 ? "PASSED" : "FAILED";

  return { tool, totalRuns, passedRuns, failedRuns, passRate, averageExecutionTime, totalExecutionTime, flakiness, status, rawOutput: text, source: "current benchmark" };
}

function calculateRecommendation(results) {
  if (!results || results.length === 0) return { tool: "Not available", reason: "No benchmark results are available.", score: 0 };
  const validResults = results.filter(result => result.totalRuns > 0 && result.averageExecutionTime > 0);
  if (validResults.length === 0) return { tool: "Not available", reason: "Complete run statistics are not available for the selected tools.", score: 0 };

  const fastestTime = Math.min(...validResults.map(result => result.averageExecutionTime));
  const slowestTime = Math.max(...validResults.map(result => result.averageExecutionTime));
  const timeRange = slowestTime - fastestTime;

  const scoredResults = validResults.map((result) => {
    const passRate = result.passRate !== null && result.passRate !== undefined ? Number(result.passRate) : result.totalRuns > 0 ? (result.passedRuns / result.totalRuns) * 100 : 0;
    const flakiness = Number(result.flakiness || 0);
    const reliabilityScore = passRate * 0.7;
    let speedScore = 100;
    if (timeRange > 0) speedScore = ((slowestTime - result.averageExecutionTime) / timeRange) * 100;
    const weightedSpeedScore = speedScore * 0.3;
    const flakinessPenalty = flakiness * 0.5;
    const finalScore = reliabilityScore + weightedSpeedScore - flakinessPenalty;
    return { ...result, passRate, recommendationScore: finalScore };
  });

  const recommendedTool = scoredResults.reduce((best, current) => current.recommendationScore > best.recommendationScore ? current : best);
  let reason = "Best balance of reliability and execution speed.";
  if (recommendedTool.passRate === 100) {
    if (recommendedTool.tool === "Appium") reason = "Appium completed all test runs successfully and provides a reliable benchmark result.";
    else if (recommendedTool.tool === "Espresso") reason = "Espresso completed all test runs successfully while providing strong execution performance.";
    else if (recommendedTool.tool === "AI Tester") reason = "AI Tester completed all test runs successfully and provides a strong balance of speed and reliability.";
    else reason = "This tool completed all test runs successfully and achieved the best overall score.";
  } else if (recommendedTool.failedRuns > 0) {
    reason = "This tool achieved the best combined score, but it has some failed runs. Review reliability before using it in production.";
  } else {
    reason = "This tool achieved the best combined reliability and performance score.";
  }
  return { tool: recommendedTool.tool, reason, score: recommendedTool.recommendationScore };
}
/* ... END LOGIC KEEP ... */


function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  const benchmarkData = location.state?.benchmarkData;
  const [databaseResults, setDatabaseResults] = useState([]);
  const [loadingDatabaseResults, setLoadingDatabaseResults] = useState(true);
  const [databaseError, setDatabaseError] = useState("");
  const [benchmarkInfo, setBenchmarkInfo] = useState(null);
  const [loadingBenchmarkInfo, setLoadingBenchmarkInfo] = useState(false);

  useEffect(() => {
    async function loadDatabaseResults() {
      try {
        setLoadingDatabaseResults(true);
        setDatabaseError("");
        const response = await fetch("http://localhost:8080/api/results");
        if (!response.ok) throw new Error(`Backend returned HTTP ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Unexpected results response");
        setDatabaseResults(data);
      } catch (error) {
        console.error("Error loading saved benchmark results:", error);
        setDatabaseError("Saved results could not be loaded from MySQL.");
      } finally {
        setLoadingDatabaseResults(false);
      }
    }
    loadDatabaseResults();
  }, []);

  const currentResults = useMemo(() => {
    if (!benchmarkData?.outputs) return [];
    return Object.entries(benchmarkData.outputs).map(([tool, output]) => parseToolResult(tool, output));
  }, [benchmarkData]);

  const currentBenchmarkId = benchmarkData?.benchmarkId;

  useEffect(() => {
    async function loadBenchmarkInfo() {
      if (!currentBenchmarkId) return;
      try {
        setLoadingBenchmarkInfo(true);
        const response = await fetch(`http://localhost:8080/api/benchmarks/${currentBenchmarkId}`);
        if (!response.ok) throw new Error(`Backend returned HTTP ${response.status}`);
        const data = await response.json();
        setBenchmarkInfo(data);
      } catch (error) {
        console.error("Error loading benchmark information:", error);
      } finally {
        setLoadingBenchmarkInfo(false);
      }
    }
    loadBenchmarkInfo();
  }, [currentBenchmarkId]);

  const savedResults = useMemo(() => {
    let records = databaseResults;
    if (currentBenchmarkId) {
      records = databaseResults.filter((item) => {
        const savedBenchmarkId = item.benchmarkId ?? item.benchmark?.id;
        return Number(savedBenchmarkId) === Number(currentBenchmarkId);
      });
    } else if (databaseResults.length > 0) {
      const benchmarkIds = databaseResults
        .map((item) => item.benchmarkId ?? item.benchmark?.id)
        .filter((id) => id !== null && id !== undefined).map(Number);
      const latestBenchmarkId = benchmarkIds.length > 0 ? Math.max(...benchmarkIds) : null;
      if (latestBenchmarkId !== null) {
        records = databaseResults.filter((item) => {
          const savedBenchmarkId = item.benchmarkId ?? item.benchmark?.id;
          return Number(savedBenchmarkId) === latestBenchmarkId;
        });
      }
    }
    return records.map((item) => ({
      tool: item.tool || "Unknown",
      totalRuns: Number(item.totalRuns ?? 0),
      passedRuns: Number(item.passedRuns ?? 0),
      failedRuns: Number(item.failedRuns ?? 0),
      passRate: item.passRate !== null && item.passRate !== undefined ? Number(item.passRate) : null,
      averageExecutionTime: Number(item.executionTime ?? 0),
      totalExecutionTime: 0,
      flakiness: Number(item.flakiness ?? 0),
      status: item.status || "UNKNOWN",
      rawOutput: "",
      resultId: item.id,
      benchmarkId: item.benchmarkId ?? item.benchmark?.id,
      benchmark: item.benchmark,
      source: "database",
    }));
  }, [databaseResults, currentBenchmarkId]);

  const results = useMemo(() => {
    if (currentResults.length === 0) return savedResults;
    return currentResults.map((currentResult) => {
      const savedResult = savedResults.find(item => item.tool.toLowerCase() === currentResult.tool.toLowerCase());
      if (!savedResult) return currentResult;
      return {
        ...currentResult,
        totalRuns: savedResult.totalRuns || currentResult.totalRuns,
        passedRuns: savedResult.passedRuns || currentResult.passedRuns,
        failedRuns: savedResult.failedRuns || currentResult.failedRuns,
        passRate: savedResult.passRate !== null && savedResult.passRate !== undefined ? savedResult.passRate : currentResult.passRate,
        averageExecutionTime: savedResult.averageExecutionTime || currentResult.averageExecutionTime,
        flakiness: savedResult.flakiness,
        status: savedResult.status,
        resultId: savedResult.resultId,
        benchmarkId: savedResult.benchmarkId,
        benchmark: savedResult.benchmark,
        source: "database + current benchmark",
      };
    });
  }, [currentResults, savedResults]);

  const fastestTool = useMemo(() => {
    const validResults = results.filter((result) => result.averageExecutionTime > 0);
    if (validResults.length === 0) return "Not available";
    return validResults.reduce((fastest, current) => current.averageExecutionTime < fastest.averageExecutionTime ? current : fastest).tool;
  }, [results]);

  const recommendation = useMemo(() => calculateRecommendation(results), [results]);

  // Chart configuration updated for dark theme
  const chartData = useMemo(() => {
    return {
      labels: results.map((result) => result.tool),
      datasets: [
        {
          label: "Average Execution Time",
          data: results.map((result) => result.averageExecutionTime),
          backgroundColor: [
            "rgba(34, 211, 238, 0.6)", // Cyan
            "rgba(16, 185, 129, 0.6)", // Emerald
            "rgba(167, 139, 250, 0.6)", // Purple
          ],
          borderColor: [
            "rgb(34, 211, 238)",
            "rgb(16, 185, 129)",
            "rgb(167, 139, 250)",
          ],
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    };
  }, [results]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    color: "#94a3b8", // text-slate-400
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Average Execution Time by Tool",
        color: "#f8fafc", // text-slate-50
        font: { size: 16, weight: 'bold' },
        padding: { bottom: 20 }
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)", // slate-950
        titleColor: "#38bdf8",
        bodyColor: "#f8fafc",
        borderColor: "rgba(30, 41, 59, 1)", // slate-800
        borderWidth: 1,
        callbacks: {
          label: (context) => `${context.parsed.y.toFixed(3)} seconds`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(51, 65, 85, 0.3)" }, // slate-700/30
        ticks: { color: "#94a3b8" },
        title: { display: true, text: "Time in seconds", color: "#64748b" },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#94a3b8" },
      },
    },
  };

  const displayApplicationName = benchmarkData?.applicationName || benchmarkInfo?.benchmarkName || savedResults[0]?.benchmark?.benchmarkName || "Saved Benchmark";
  const displayTestType = benchmarkData?.testType || benchmarkInfo?.category || savedResults[0]?.benchmark?.category || "Not specified";
  const displayStatus = benchmarkData?.status || benchmarkInfo?.status || (savedResults.length > 0 ? "COMPLETED" : "Unknown");

  if (!benchmarkData && loadingDatabaseResults) {
    return (
      <DashboardLayout>
        <div className="bg-slate-900/50 border border-cyan-500/20 text-cyan-400 rounded-2xl p-8 flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <svg className="animate-spin mx-auto h-8 w-8 text-cyan-500 mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h1 className="text-xl font-bold mb-2 text-white">Loading Saved Results</h1>
            <p className="text-slate-400">Fetching benchmark data from MySQL...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!benchmarkData && !loadingDatabaseResults && results.length === 0) {
    return (
      <DashboardLayout>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-10 text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">No Benchmark Data</h1>
          <p className="text-slate-400 mb-6">No saved benchmark results were found in the database.</p>
          {databaseError && <p className="mb-6 text-red-400 text-sm bg-red-500/10 inline-block px-4 py-2 rounded-lg border border-red-500/20">{databaseError}</p>}
          <div>
            <button onClick={() => navigate("/newbenchmark")} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-6 py-2.5 rounded-xl font-semibold transition-colors">
              Create New Benchmark
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Benchmark Analysis</h1>
          <p className="text-slate-400 mt-2">Comprehensive breakdown of tool performance.</p>
          {databaseError && <p className="text-red-400 text-sm mt-2">{databaseError}</p>}
        </div>
      </div>

      {/* Benchmark Information Bar */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 mb-8 flex flex-wrap gap-8">
        <div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Target Application</p>
          <p className="text-white font-medium">{displayApplicationName}</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Execution Mode</p>
          <p className="text-white font-medium">{displayTestType}</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">System Status</p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              {displayStatus === "COMPLETED" && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${displayStatus === "COMPLETED" ? "bg-emerald-500" : "bg-yellow-500"}`}></span>
            </span>
            <p className={`font-medium ${displayStatus === "COMPLETED" ? "text-emerald-400" : "text-yellow-400"}`}>{displayStatus}</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Tools Tested", value: results.length, color: "text-white" },
          { label: "Fastest Engine", value: fastestTool, color: "text-cyan-400", sub: "Based on raw execution speed" },
          { label: "Optimal Choice", value: recommendation.tool, color: "text-emerald-400", sub: `Score: ${recommendation.score.toFixed(1)}/100` },
          { label: "Completion State", value: displayStatus, color: displayStatus === "COMPLETED" ? "text-emerald-400" : "text-yellow-400" }
        ].map((card, i) => (
          <div key={i} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <p className="text-slate-400 text-sm font-medium mb-3 relative z-10">{card.label}</p>
            <p className={`text-3xl font-bold tracking-tight mb-1 relative z-10 ${card.color}`}>{card.value}</p>
            {card.sub && <p className="text-xs text-slate-500 relative z-10">{card.sub}</p>}
          </div>
        ))}
      </div>

      {/* AI Recommendation Explanation */}
      {recommendation.tool !== "Not available" && (
        <div className="bg-gradient-to-r from-cyan-900/30 to-emerald-900/20 border border-cyan-500/20 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row gap-6 items-start">
          <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 shrink-0">
             <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white mb-1">System Recommendation: <span className="text-cyan-400">{recommendation.tool}</span></h2>
            <p className="text-slate-300 leading-relaxed text-sm mb-2">{recommendation.reason}</p>
            <p className="text-xs text-slate-500">
              The algorithm evaluates pass rate (70%), execution velocity (30%), and applies penalties for flakiness.
            </p>
          </div>
        </div>
      )}

      {/* Chart */}
      {results.length > 0 && (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 mb-8">
          <div className="relative h-80">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white">Execution Metrics Matrix</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/50 text-slate-400 uppercase tracking-wider text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Testing Tool</th>
                <th className="px-6 py-4">Total Runs</th>
                <th className="px-6 py-4">Passed</th>
                <th className="px-6 py-4">Failed</th>
                <th className="px-6 py-4">Pass Rate</th>
                <th className="px-6 py-4">Avg Time</th>
                <th className="px-6 py-4">Flakiness</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {results.map((result) => (
                <tr key={result.resultId || result.tool} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-white">{result.tool}</td>
                  <td className="px-6 py-4 text-slate-300">{result.totalRuns > 0 ? result.totalRuns : "N/A"}</td>
                  <td className="px-6 py-4 text-emerald-400 font-medium">{result.totalRuns > 0 ? result.passedRuns : "N/A"}</td>
                  <td className="px-6 py-4 text-red-400 font-medium">{result.totalRuns > 0 ? result.failedRuns : "N/A"}</td>
                  <td className="px-6 py-4 text-slate-300">
                    {result.passRate === null || result.passRate === undefined ? "N/A" : (
                      <div className="flex items-center gap-2">
                        <span>{result.passRate.toFixed(1)}%</span>
                        <div className="h-1.5 w-12 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${result.passRate}%` }}></div>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-300 font-mono">{result.averageExecutionTime.toFixed(3)}s</td>
                  <td className="px-6 py-4 text-slate-400">{result.flakiness !== undefined ? `${result.flakiness.toFixed(1)}%` : "N/A"}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${
                      result.status === "PASSED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}>
                      {result.status || "UNKNOWN"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {currentResults.length === 0 && savedResults.length > 0 && (
        <div className="bg-slate-800/30 text-slate-400 rounded-xl p-4 text-sm mb-8 text-center border border-slate-700/30">
          Archived results fetched from persistent storage.
        </div>
      )}

      {/* Raw Output Accordions */}
      {currentResults.length > 0 && (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Terminal Logs</h2>
          <div className="space-y-4">
            {currentResults.map((result) => (
              <details key={result.tool} className="group border border-slate-800 rounded-xl bg-slate-950/30 overflow-hidden">
                <summary className="font-semibold cursor-pointer p-4 text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors flex justify-between items-center outline-none">
                  <span>{result.tool} Output</span>
                  <span className="text-slate-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 border-t border-slate-800 bg-slate-950">
                  <pre className="text-emerald-400 font-mono text-xs sm:text-sm whitespace-pre-wrap overflow-x-auto leading-relaxed">
                    {result.rawOutput || "// No logs generated"}
                  </pre>
                </div>
              </details>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Results;
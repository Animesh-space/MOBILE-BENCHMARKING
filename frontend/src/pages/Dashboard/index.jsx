import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

function Dashboard() {
  const navigate = useNavigate();

  const researchPapers = [
    {
      title: "Comparison of GUI Testing Tools for Android Applications",
      description:
        "A study comparing Android GUI testing tools using factors such as execution speed, reliability, and maintainability.",
      link: "https://oulurepo.oulu.fi/handle/10024/8284",
    },
    {
      title: "Comparing Mobile Testing Tools Using Documentary Analysis",
      description:
        "A study comparing mobile testing tools including Appium and Espresso using technical evaluation criteria.",
      link: "https://arxiv.org/abs/2307.00355",
    },
    {
      title: "Testing Tools for Android Context-Aware Applications: A Systematic Mapping",
      description:
        "A systematic study of Android testing tools and their use in mobile application testing research.",
      link: "https://link.springer.com/article/10.1186/s13173-019-0093-7",
    },
  ];

  return (
    <DashboardLayout>
      {/* --------------------------------
          HEADER
      -------------------------------- */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Dashboard
        </h1>
        <p className="mt-2 text-slate-400">
          Welcome to the Mobile Testing Benchmark Console
        </p>
      </div>

      {/* --------------------------------
          SYSTEM INTRODUCTION (HERO)
      -------------------------------- */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 sm:p-12 shadow-2xl mb-12">
        {/* Decorative Background Glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            SYSTEM OVERVIEW
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Compare Mobile Testing <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Frameworks</span>
          </h2>

          <p className="text-lg leading-relaxed text-slate-300 mb-4">
            Mobile Benchmark is a centralized platform designed to evaluate and compare 
            different mobile application testing tools using consistent execution tasks 
            and unified evaluation metrics.
          </p>

          <p className="text-slate-400 leading-relaxed mb-10">
            The system securely dispatches tasks to selected engines, collects raw telemetry 
            data, and synthesizes the results into actionable comparisons to help you choose 
            the most reliable tool for your pipeline.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/benchmark")}
              className="rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-8 py-3.5 font-semibold transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]"
            >
              Initialize Benchmark
            </button>
            <button
              onClick={() => navigate("/history")}
              className="rounded-xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 hover:bg-slate-800 px-8 py-3.5 font-semibold text-white transition-all"
            >
              View Telemetry History
            </button>
          </div>
        </div>
      </div>

      {/* --------------------------------
          HOW THE SYSTEM WORKS
      -------------------------------- */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-2">
          Execution Pipeline
        </h2>
        <p className="text-slate-400 mb-8">
          The benchmarking process follows a strict, four-stage automated workflow.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* STEP 1 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6 relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-cyan-400 font-mono font-bold text-lg group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-colors">
              01
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Target App</h3>
            <p className="text-sm leading-relaxed text-slate-400">
              Select the mobile application package and define the specific testing scenario.
            </p>
          </div>

          {/* STEP 2 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 font-mono font-bold text-lg group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-colors">
              02
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Frameworks</h3>
            <p className="text-sm leading-relaxed text-slate-400">
              Provision the testing engines (e.g., Appium, Espresso) for parallel execution.
            </p>
          </div>

          {/* STEP 3 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6 relative overflow-hidden group hover:border-purple-500/30 transition-colors">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-purple-400 font-mono font-bold text-lg group-hover:bg-purple-500/10 group-hover:border-purple-500/30 transition-colors">
              03
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Execution</h3>
            <p className="text-sm leading-relaxed text-slate-400">
              The system dispatches tests and streams raw telemetry data securely.
            </p>
          </div>

          {/* STEP 4 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-blue-400 font-mono font-bold text-lg group-hover:bg-blue-500/10 group-hover:border-blue-500/30 transition-colors">
              04
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Analysis</h3>
            <p className="text-sm leading-relaxed text-slate-400">
              Synthesize results into visual matrices, ranking reliability and speed.
            </p>
          </div>
        </div>
      </div>

      {/* --------------------------------
          ABOUT & CAPABILITIES
      -------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">
            System Architecture
          </h2>
          <p className="leading-relaxed text-slate-400 mb-4">
            Mobile Benchmark operates as an isolated orchestration layer, providing a 
            clean environment for executing and comparing mobile testing frameworks 
            without local dependency conflicts.
          </p>
          <p className="leading-relaxed text-slate-400">
            By standardizing the input parameters and normalizing the output logs, 
            the platform ensures that execution speed, pass rates, and flakiness 
            metrics are evaluated on an absolute, level playing field.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">
            Core Capabilities
          </h2>
          <ul className="space-y-4">
            {[
              "Deploy concurrent mobile testing benchmarks",
              "Evaluate frameworks on speed and reliability",
              "Inspect raw terminal outputs and logs",
              "Query historical benchmark telemetry"
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-4 text-slate-300">
                <div className="flex shrink-0 items-center justify-center w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                  <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* --------------------------------
          RESEARCH REFERENCES
      -------------------------------- */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-2">
          Academic Context
        </h2>
        <p className="text-slate-400 mb-8">
          Peer-reviewed literature underpinning our evaluation methodologies.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {researchPapers.map((paper, index) => (
            <a
              key={index}
              href={paper.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6 transition-all hover:bg-slate-800/80 hover:border-cyan-500/50"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="px-3 py-1 rounded-md bg-slate-800 text-cyan-400 text-xs font-mono font-bold tracking-wider group-hover:bg-cyan-500/10 transition-colors">
                  PUB_0{index + 1}
                </div>
                <svg className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>

              <h3 className="text-lg font-bold leading-snug text-white mb-3 group-hover:text-cyan-400 transition-colors">
                {paper.title}
              </h3>

              <p className="text-sm leading-relaxed text-slate-400 flex-1 mb-6">
                {paper.description}
              </p>

              <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-slate-300 group-hover:text-cyan-400 transition-colors">
                Access Document <span className="text-lg leading-none">→</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* --------------------------------
          QUICK ACTIONS FOOTER
      -------------------------------- */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900/80 to-slate-900/40 backdrop-blur-xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">
            Ready to test?
          </h2>
          <p className="text-slate-400 text-sm">
            Configure a new run or review your archived telemetry.
          </p>
        </div>

        <div className="flex w-full sm:w-auto gap-4">
          <button
            onClick={() => navigate("/history")}
            className="flex-1 sm:flex-none rounded-xl bg-slate-800 border border-slate-700 px-6 py-3 font-semibold text-white hover:bg-slate-700 transition-colors text-center"
          >
            Archives
          </button>
          <button
            onClick={() => navigate("/benchmark")}
            className="flex-1 sm:flex-none rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-6 py-3 font-semibold transition-colors text-center shadow-[0_0_15px_rgba(34,211,238,0.2)]"
          >
            New Run
          </button>
        </div>
      </div>

    </DashboardLayout>
  );
}

export default Dashboard;
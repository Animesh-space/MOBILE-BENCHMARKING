import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NewBenchmark from "./pages/NewBenchmark";
import Results from "./pages/Results";
import Comparison from "./pages/Comparison";
import History from "./pages/History";
import Settings from "./pages/Settings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/benchmark" element={<NewBenchmark />} />
      <Route path="/results" element={<Results />} />
      <Route path="/comparison" element={<Comparison />} />
      <Route path="/history" element={<History />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;
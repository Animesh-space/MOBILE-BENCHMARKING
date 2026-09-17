import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
);

function PerformanceChart({ scores = [] }) {

  const labels = scores.map(
    (result) => result.tool || "Unknown"
  );

  const benchmarkScores = scores.map(
    (result) => Number(result.score || 0)
  );

  const data = {
    labels: labels,

    datasets: [
      {
        label: "Benchmark Score",
        data: benchmarkScores,
        backgroundColor: "#3B82F6",
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "top",
      },

      title: {
        display: false,
      },
    },

    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Score",
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 h-[480px]">

      <h2 className="text-2xl font-bold mb-6">
        Benchmark Performance
      </h2>

      {scores.length === 0 ? (
        <div className="flex items-center justify-center h-[360px]">
          <p className="text-gray-500">
            No benchmark scores available.
          </p>
        </div>
      ) : (
        <div className="h-[360px]">
          <Bar data={data} options={options} />
        </div>
      )}

    </div>
  );
}

export default PerformanceChart;
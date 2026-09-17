import { FaRobot, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function RecommendationCard({ recommendation }) {
  const navigate = useNavigate();

  if (!recommendation) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 h-[480px] flex items-center justify-center">
        <p className="text-gray-500">
          Loading recommendation...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 h-[480px] flex flex-col">

      <div className="flex items-center gap-3 mb-6">
        <FaRobot className="text-3xl text-blue-600" />

        <h2 className="text-2xl font-bold">
          AI Recommendation
        </h2>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 mb-5">
        <p className="text-blue-700 font-semibold">
          Recommended Tool
        </p>

        <h1 className="text-3xl font-bold text-blue-600 mt-2">
          {recommendation.recommendedTool}
        </h1>
      </div>

      <div className="space-y-4 text-gray-700 leading-7 flex-1">

        <div className="flex items-start gap-3">
          <FaCheckCircle className="text-green-500 mt-1" />

          <p>
            Highest Benchmark Score (
            {recommendation.score}
            /100)
          </p>
        </div>

        <div className="flex items-start gap-3">
          <FaCheckCircle className="text-green-500 mt-1" />

          <p>
            Fastest Execution Time (
            {recommendation.executionTime}
            sec)
          </p>
        </div>

        <div className="flex items-start gap-3">
          <FaCheckCircle className="text-green-500 mt-1" />

          <p>
            {recommendation.reason}
          </p>
        </div>

      </div>

      <button
        onClick={() => navigate("/results")}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
      >
        View Detailed Report
      </button>

    </div>
  );
}

export default RecommendationCard;
import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

function Comparison() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/results")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch results");
        }

        return response.json();
      })
      .then((data) => {
        const tools = data.filter(
          (result) =>
            result.benchmark?.benchmarkName === "Appium" ||
            result.benchmark?.benchmarkName === "Espresso" ||
            result.benchmark?.benchmarkName === "AI Tester"
        );

        setResults(tools);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching comparison results:", error);
        setLoading(false);
      });
  }, []);

  // Find fastest execution time
  const fastestTime =
    results.length > 0
      ? Math.min(
          ...results.map((result) =>
            Number(result.executionTime || 0)
          )
        )
      : 1;

  // Calculate overall score
  const calculateOverallScore = (result) => {
    const coverage = Number(result.coverage || 0);

    const executionTime = Number(
      result.executionTime || 0
    );

    const flakiness = Number(
      result.flakiness || 0
    );

    const resourceUsage = Number(
      result.resourceUsage || 0
    );

    // Higher is better
    const coverageScore = coverage;

    // Lower execution time is better
    const timeScore =
      executionTime > 0
        ? (fastestTime / executionTime) * 100
        : 0;

    // Lower flakiness is better
    const reliabilityScore =
      100 - flakiness;

    // Lower resource usage is better
    const resourceScore =
      100 - resourceUsage;

    const overallScore =
      coverageScore * 0.40 +
      timeScore * 0.25 +
      reliabilityScore * 0.20 +
      resourceScore * 0.15;

    return Math.round(overallScore * 10) / 10;
  };

  return (
    <DashboardLayout>

      <h1 className="text-4xl font-bold mb-2">
        Tool Comparison
      </h1>

      <p className="text-gray-500 mb-8">
        Compare the performance of different mobile testing tools.
      </p>

      <div className="bg-white rounded-2xl shadow-lg p-8">

        {loading ? (
          <p className="text-gray-500">
            Loading comparison results...
          </p>
        ) : results.length === 0 ? (
          <p className="text-gray-500">
            No comparison results available.
          </p>
        ) : (

          <table className="w-full">

            <thead>
              <tr className="border-b text-left">

                <th className="pb-4">Tool</th>

                <th className="pb-4">
                  Coverage
                </th>

                <th className="pb-4">
                  Execution Time
                </th>

                <th className="pb-4">
                  Flakiness
                </th>

                <th className="pb-4">
                  Resource Usage
                </th>

                <th className="pb-4">
                  Overall Score
                </th>

              </tr>
            </thead>

            <tbody>

              {results.map((result) => {

                const overallScore =
                  calculateOverallScore(result);

                return (
                  <tr
                    key={result.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="py-4 font-semibold">
                      {result.benchmark?.benchmarkName ||
                        "Unknown"}
                    </td>

                    <td>
                      {result.coverage}%
                    </td>

                    <td>
                      {result.executionTime} sec
                    </td>

                    <td>
                      {result.flakiness}%
                    </td>

                    <td>
                      {result.resourceUsage}%
                    </td>

                    <td>

                      <div className="w-40 bg-gray-200 rounded-full h-4">

                        <div
                          className="bg-blue-600 h-4 rounded-full"
                          style={{
                            width: `${overallScore}%`,
                          }}
                        />

                      </div>

                      <span className="text-sm font-semibold">
                        {overallScore}%
                      </span>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        )}

      </div>

    </DashboardLayout>
  );
}

export default Comparison;
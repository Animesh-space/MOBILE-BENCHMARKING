package com.mobilebenchmark.backend.benchmarkresult;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/scoring")
@CrossOrigin(origins = "http://localhost:5173")
public class ScoringController {

    @Autowired
    private BenchmarkResultRepository benchmarkResultRepository;

    @Autowired
    private ScoringService scoringService;


    @GetMapping
    public List<Map<String, Object>> getScores() {

        List<BenchmarkResult> results =
                benchmarkResultRepository.findAll();

        // Only include the three mobile testing tools
        List<BenchmarkResult> testingResults = results.stream()
                .filter(r -> r.getBenchmark() != null)
                .filter(r -> {
                    String name =
                            r.getBenchmark().getBenchmarkName();

                    return name.equals("Appium")
                            || name.equals("Espresso")
                            || name.equals("AI Tester");
                })
                .toList();

        // Find fastest testing tool
        double fastestTime = testingResults.stream()
                .filter(r -> r.getExecutionTime() != null)
                .mapToDouble(BenchmarkResult::getExecutionTime)
                .min()
                .orElse(0);

        List<Map<String, Object>> scores = new ArrayList<>();

        for (BenchmarkResult result : testingResults) {

            if (result.getExecutionTime() == null) {
                continue;
            }

            double executionTime =
                    result.getExecutionTime();

            double flakiness =
                    result.getFlakiness() != null
                            ? result.getFlakiness()
                            : 0.0;

            int score = scoringService.calculateScore(
                    executionTime,
                    fastestTime,
                    flakiness
            );

            Map<String, Object> data =
                    new LinkedHashMap<>();

            data.put("resultId", result.getId());
            data.put(
                    "tool",
                    result.getBenchmark().getBenchmarkName()
            );
            data.put("executionTime", executionTime);
            data.put("flakiness", flakiness);
            data.put("score", score);

            scores.add(data);
        }

        return scores;
    }
}
package com.mobilebenchmark.backend.benchmarkresult;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendation")
@CrossOrigin(origins = "http://localhost:5173")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @Autowired
    private BenchmarkResultRepository benchmarkResultRepository;

    @Autowired
    private ScoringService scoringService;

    @GetMapping
    public Map<String, Object> getRecommendation(
            @RequestParam Long benchmarkId) {

        BenchmarkResult result =
                recommendationService.getRecommendation(benchmarkId);

        // Get only results belonging to this benchmark
        List<BenchmarkResult> results =
                benchmarkResultRepository.findByBenchmarkId(benchmarkId)
                        .stream()
                        .filter(r -> r.getExecutionTime() != null)
                        .toList();

        // Find fastest tool for this benchmark
        double fastestTime = results.stream()
                .mapToDouble(BenchmarkResult::getExecutionTime)
                .min()
                .orElse(result.getExecutionTime());

        double flakiness =
                result.getFlakiness() != null
                        ? result.getFlakiness()
                        : 0.0;

        int score = scoringService.calculateScore(
                result.getExecutionTime(),
                fastestTime,
                flakiness
        );

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put(
                "benchmarkId",
                benchmarkId
        );

        response.put(
                "recommendedTool",
                result.getTool()
        );

        response.put(
                "score",
                score
        );

        response.put(
                "executionTime",
                result.getExecutionTime()
        );

        response.put(
                "reason",
                result.getTool()
                        + " achieved the highest overall benchmark score for this benchmark."
        );

        return response;
    }
}
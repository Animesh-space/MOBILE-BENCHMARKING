
package com.mobilebenchmark.backend.benchmarkresult;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class RecommendationService {

    @Autowired
    private BenchmarkResultRepository benchmarkResultRepository;

    @Autowired
    private ScoringService scoringService;

    public BenchmarkResult getRecommendation(Long benchmarkId) {

        List<BenchmarkResult> results =
                benchmarkResultRepository.findByBenchmarkId(benchmarkId)
                        .stream()
                        .filter(result -> result.getExecutionTime() != null)
                        .filter(result -> result.getTool() != null)
                        .toList();

        if (results.isEmpty()) {
            throw new RuntimeException(
                    "No results available for benchmark ID: " + benchmarkId
            );
        }

        // Find the fastest execution time among tools in this benchmark
        double fastestTime = results.stream()
                .mapToDouble(BenchmarkResult::getExecutionTime)
                .min()
                .orElse(0.0);

        // Select the result with the highest score
        return results.stream()
                .max(Comparator.comparingInt(result ->
                        scoringService.calculateScore(
                                result.getExecutionTime(),
                                fastestTime,
                                result.getFlakiness() != null
                                        ? result.getFlakiness()
                                        : 0.0
                        )
                ))
                .orElseThrow(() ->
                        new RuntimeException(
                                "Unable to calculate recommendation"
                        ));
    }
}
package com.mobilebenchmark.backend.benchmarkresult;

import org.springframework.stereotype.Service;

@Service
public class ScoringService {

    private static final double SPEED_WEIGHT = 0.60;
    private static final double RELIABILITY_WEIGHT = 0.40;

    public int calculateScore(
            double executionTime,
            double fastestTime,
            double flakiness) {

        // Speed score
        double speedScore =
                (fastestTime / executionTime) * 100;

        // Prevent score from going above 100
        if (speedScore > 100) {
            speedScore = 100;
        }

        // Reliability score
        double reliabilityScore =
                100 - flakiness;

        // Prevent invalid values
        if (reliabilityScore < 0) {
            reliabilityScore = 0;
        }

        // Final weighted score
        double finalScore =
                (speedScore * SPEED_WEIGHT)
                + (reliabilityScore * RELIABILITY_WEIGHT);

        return (int) Math.round(finalScore);
    }
}
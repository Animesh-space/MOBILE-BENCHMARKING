
package com.mobilebenchmark.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BenchmarkResultRequest {

    private Long userId;

    private Long deviceId;

    private Long benchmarkId;

    private String tool;

    private Integer score;

    private Integer totalRuns;

    private Integer passedRuns;

    private Integer failedRuns;

    private Double passRate;

    private Double executionTime;

    private Double coverage;

    private Double flakiness;

    private Double resourceUsage;

    private String status;
}
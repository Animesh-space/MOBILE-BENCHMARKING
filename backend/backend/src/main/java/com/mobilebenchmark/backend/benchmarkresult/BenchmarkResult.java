
package com.mobilebenchmark.backend.benchmarkresult;

import com.mobilebenchmark.backend.benchmark.Benchmark;
import com.mobilebenchmark.backend.device.Device;
import com.mobilebenchmark.backend.entity.User;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "benchmark_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BenchmarkResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "device_id")
    private Device device;

    @ManyToOne
    @JoinColumn(name = "benchmark_id")
    private Benchmark benchmark;

    @Column(nullable = false)
    private String tool;

    private Integer score;

    /*
     * Complete test execution statistics
     */
    @Column(name = "total_runs")
    private Integer totalRuns;

    @Column(name = "passed_runs")
    private Integer passedRuns;

    @Column(name = "failed_runs")
    private Integer failedRuns;

    @Column(name = "pass_rate")
    private Double passRate;

    @Column(nullable = false)
    private Double executionTime;

    private Double coverage;

    @Column(nullable = false)
    private Double flakiness;

    private Double resourceUsage;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private LocalDateTime executedAt;
}
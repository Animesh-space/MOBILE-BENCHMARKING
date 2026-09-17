
package com.mobilebenchmark.backend.benchmarkresult;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BenchmarkResultRepository
        extends JpaRepository<BenchmarkResult, Long> {

    List<BenchmarkResult> findByBenchmarkId(Long benchmarkId);
}
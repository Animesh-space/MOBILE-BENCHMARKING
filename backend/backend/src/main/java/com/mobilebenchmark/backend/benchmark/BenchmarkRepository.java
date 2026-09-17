package com.mobilebenchmark.backend.benchmark;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BenchmarkRepository extends JpaRepository<Benchmark, Long> {

}
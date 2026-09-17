package com.mobilebenchmark.backend.benchmark;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BenchmarkService {

    @Autowired
    private BenchmarkRepository benchmarkRepository;

    // Add Benchmark
    public Benchmark saveBenchmark(Benchmark benchmark) {
        return benchmarkRepository.save(benchmark);
    }

    // Get All Benchmarks
    public List<Benchmark> getAllBenchmarks() {
        return benchmarkRepository.findAll();
    }

    // Get Benchmark By Id
    public Optional<Benchmark> getBenchmarkById(Long id) {
        return benchmarkRepository.findById(id);
    }

    // Update Benchmark
    public Benchmark updateBenchmark(Long id, Benchmark benchmark) {
        benchmark.setId(id);
        return benchmarkRepository.save(benchmark);
    }

    // Delete Benchmark
    public void deleteBenchmark(Long id) {
        benchmarkRepository.deleteById(id);
    }
}
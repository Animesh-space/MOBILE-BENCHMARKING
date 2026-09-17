package com.mobilebenchmark.backend.benchmark;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/benchmarks")
@CrossOrigin(origins = "http://localhost:5173")
public class BenchmarkController {

    @Autowired
    private BenchmarkService benchmarkService;

    // Add Benchmark
    @PostMapping
    public Benchmark addBenchmark(@RequestBody Benchmark benchmark) {
        return benchmarkService.saveBenchmark(benchmark);
    }

    // Get All Benchmarks
    @GetMapping
    public List<Benchmark> getAllBenchmarks() {
        return benchmarkService.getAllBenchmarks();
    }

    // Get Benchmark By Id
    @GetMapping("/{id}")
    public Optional<Benchmark> getBenchmark(@PathVariable Long id) {
        return benchmarkService.getBenchmarkById(id);
    }

    // Update Benchmark
    @PutMapping("/{id}")
    public Benchmark updateBenchmark(@PathVariable Long id,
                                     @RequestBody Benchmark benchmark) {
        return benchmarkService.updateBenchmark(id, benchmark);
    }

    // Delete Benchmark
    @DeleteMapping("/{id}")
    public void deleteBenchmark(@PathVariable Long id) {
        benchmarkService.deleteBenchmark(id);
    }
}
package com.mobilebenchmark.backend.benchmarkresult;

import com.mobilebenchmark.backend.dto.BenchmarkResultRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "http://localhost:5173")
public class BenchmarkResultController {

    @Autowired
    private BenchmarkResultService benchmarkResultService;

    @PostMapping
    public BenchmarkResult saveResult(
            @RequestBody BenchmarkResultRequest request) {

        return benchmarkResultService.saveResult(request);
    }

    @GetMapping
    public List<BenchmarkResult> getAllResults() {

        return benchmarkResultService.getAllResults();
    }

    @GetMapping("/{id}")
    public Optional<BenchmarkResult> getResult(
            @PathVariable Long id) {

        return benchmarkResultService.getResultById(id);
    }

    @PutMapping("/{id}")
    public BenchmarkResult updateResult(
            @PathVariable Long id,
            @RequestBody BenchmarkResultRequest request) {

        return benchmarkResultService.updateResult(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteResult(@PathVariable Long id) {

        benchmarkResultService.deleteResult(id);
    }
}
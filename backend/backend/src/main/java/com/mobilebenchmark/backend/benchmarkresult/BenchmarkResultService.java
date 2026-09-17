
package com.mobilebenchmark.backend.benchmarkresult;

import com.mobilebenchmark.backend.benchmark.Benchmark;
import com.mobilebenchmark.backend.benchmark.BenchmarkRepository;
import com.mobilebenchmark.backend.device.Device;
import com.mobilebenchmark.backend.device.DeviceRepository;
import com.mobilebenchmark.backend.dto.BenchmarkResultRequest;
import com.mobilebenchmark.backend.entity.User;
import com.mobilebenchmark.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BenchmarkResultService {

    @Autowired
    private BenchmarkResultRepository benchmarkResultRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private BenchmarkRepository benchmarkRepository;

    // CREATE RESULT FROM FRONTEND REQUEST
    public BenchmarkResult saveResult(BenchmarkResultRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Device device = deviceRepository.findById(request.getDeviceId())
                .orElseThrow(() ->
                        new RuntimeException("Device not found"));

        Benchmark benchmark = benchmarkRepository.findById(
                request.getBenchmarkId()
        ).orElseThrow(() ->
                new RuntimeException("Benchmark not found"));

        BenchmarkResult result = BenchmarkResult.builder()
                .user(user)
                .device(device)
                .benchmark(benchmark)
                .tool(request.getTool())
                .score(request.getScore())

                .totalRuns(request.getTotalRuns())
                .passedRuns(request.getPassedRuns())
                .failedRuns(request.getFailedRuns())
                .passRate(request.getPassRate())

                .executionTime(
                        request.getExecutionTime() == null
                                ? 0.0
                                : request.getExecutionTime()
                )
                .coverage(request.getCoverage())
                .flakiness(
                        request.getFlakiness() == null
                                ? 0.0
                                : request.getFlakiness()
                )
                .resourceUsage(request.getResourceUsage())
                .status(
                        request.getStatus() == null
                                ? "UNKNOWN"
                                : request.getStatus()
                )
                .executedAt(LocalDateTime.now())
                .build();

        return benchmarkResultRepository.save(result);
    }

    // AUTOMATICALLY SAVE RESULT AFTER A TOOL RUNS
    public BenchmarkResult saveAutomaticResult(
            Long userId,
            Long deviceId,
            Long benchmarkId,
            String tool,
            Integer totalRuns,
            Integer passedRuns,
            Integer failedRuns,
            Double passRate,
            Double executionTime,
            Double flakiness,
            String status) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() ->
                        new RuntimeException("Device not found"));

        Benchmark benchmark = benchmarkRepository.findById(benchmarkId)
                .orElseThrow(() ->
                        new RuntimeException("Benchmark not found"));

        BenchmarkResult result = BenchmarkResult.builder()
                .user(user)
                .device(device)
                .benchmark(benchmark)
                .tool(tool)
                .score(null)

                .totalRuns(
                        totalRuns == null
                                ? 0
                                : totalRuns
                )
                .passedRuns(
                        passedRuns == null
                                ? 0
                                : passedRuns
                )
                .failedRuns(
                        failedRuns == null
                                ? 0
                                : failedRuns
                )
                .passRate(
                        passRate == null
                                ? 0.0
                                : passRate
                )

                .executionTime(
                        executionTime == null
                                ? 0.0
                                : executionTime
                )
                .coverage(null)
                .flakiness(
                        flakiness == null
                                ? 0.0
                                : flakiness
                )
                .resourceUsage(null)
                .status(
                        status == null
                                ? "UNKNOWN"
                                : status
                )
                .executedAt(LocalDateTime.now())
                .build();

        return benchmarkResultRepository.save(result);
    }

    // GET ALL RESULTS
    public List<BenchmarkResult> getAllResults() {

        return benchmarkResultRepository.findAll();
    }

    // GET RESULT BY ID
    public Optional<BenchmarkResult> getResultById(Long id) {

        return benchmarkResultRepository.findById(id);
    }

    // UPDATE RESULT
    public BenchmarkResult updateResult(
            Long id,
            BenchmarkResultRequest request) {

        BenchmarkResult result =
                benchmarkResultRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Benchmark result not found"
                                ));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Device device = deviceRepository.findById(request.getDeviceId())
                .orElseThrow(() ->
                        new RuntimeException("Device not found"));

        Benchmark benchmark = benchmarkRepository.findById(
                request.getBenchmarkId()
        ).orElseThrow(() ->
                new RuntimeException("Benchmark not found"));

        result.setUser(user);
        result.setDevice(device);
        result.setBenchmark(benchmark);
        result.setTool(request.getTool());
        result.setScore(request.getScore());

        result.setTotalRuns(request.getTotalRuns());
        result.setPassedRuns(request.getPassedRuns());
        result.setFailedRuns(request.getFailedRuns());
        result.setPassRate(request.getPassRate());

        result.setExecutionTime(
                request.getExecutionTime() == null
                        ? 0.0
                        : request.getExecutionTime()
        );

        result.setCoverage(request.getCoverage());

        result.setFlakiness(
                request.getFlakiness() == null
                        ? 0.0
                        : request.getFlakiness()
        );

        result.setResourceUsage(request.getResourceUsage());

        result.setStatus(
                request.getStatus() == null
                        ? "UNKNOWN"
                        : request.getStatus()
        );

        return benchmarkResultRepository.save(result);
    }

    // DELETE RESULT
    public void deleteResult(Long id) {

        benchmarkResultRepository.deleteById(id);
    }
}
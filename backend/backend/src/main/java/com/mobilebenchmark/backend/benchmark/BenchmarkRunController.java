
package com.mobilebenchmark.backend.benchmark;

import com.mobilebenchmark.backend.benchmarkresult.BenchmarkResult;
import com.mobilebenchmark.backend.benchmarkresult.BenchmarkResultService;
import com.mobilebenchmark.backend.dto.BenchmarkRunRequest;
import com.mobilebenchmark.backend.runner.AITesterRunner;
import com.mobilebenchmark.backend.runner.AppiumRunner;
import com.mobilebenchmark.backend.runner.EspressoRunner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/benchmark-run")
@CrossOrigin(origins = "http://localhost:5173")
public class BenchmarkRunController {

    @Autowired
    private AppiumRunner appiumRunner;

    @Autowired
    private EspressoRunner espressoRunner;

    @Autowired
    private AITesterRunner aiTesterRunner;

    @Autowired
    private BenchmarkService benchmarkService;

    @Autowired
    private BenchmarkResultService benchmarkResultService;

    private static final Pattern TOTAL_RUNS_PATTERN =
            Pattern.compile(
                    "(?:TOTAL RUNS|Total Runs):\\s*(\\d+)",
                    Pattern.CASE_INSENSITIVE
            );

    private static final Pattern PASSED_RUNS_PATTERN =
            Pattern.compile(
                    "(?:PASSED RUNS|Passed):\\s*(\\d+)",
                    Pattern.CASE_INSENSITIVE
            );

    private static final Pattern FAILED_RUNS_PATTERN =
            Pattern.compile(
                    "(?:FAILED RUNS|Failed):\\s*(\\d+)",
                    Pattern.CASE_INSENSITIVE
            );

    private static final Pattern PASS_RATE_PATTERN =
            Pattern.compile(
                    "(?:PASS RATE|Pass Rate):\\s*([0-9]+(?:\\.[0-9]+)?)%",
                    Pattern.CASE_INSENSITIVE
            );

    private static final Pattern AVERAGE_TIME_PATTERN =
            Pattern.compile(
                    "AVERAGE EXECUTION TIME:\\s*([0-9]+(?:\\.[0-9]+)?)",
                    Pattern.CASE_INSENSITIVE
            );

    private static final Pattern APPIUM_AVERAGE_TIME_PATTERN =
            Pattern.compile(
                    "Average Execution Time:\\s*([0-9]+(?:\\.[0-9]+)?)",
                    Pattern.CASE_INSENSITIVE
            );

    @PostMapping
    public ResponseEntity<Map<String, Object>> startBenchmark(
            @RequestBody BenchmarkRunRequest request) {

        Map<String, Object> response =
                new LinkedHashMap<>();

        if (request.getApplicationName() == null ||
                request.getApplicationName().isBlank()) {

            response.put("status", "FAILED");
            response.put(
                    "message",
                    "Application name is required"
            );

            return ResponseEntity.badRequest()
                    .body(response);
        }

        if (request.getTestType() == null ||
                request.getTestType().isBlank()) {

            response.put("status", "FAILED");
            response.put(
                    "message",
                    "Test type is required"
            );

            return ResponseEntity.badRequest()
                    .body(response);
        }

        if (request.getUserId() == null ||
                request.getDeviceId() == null) {

            response.put("status", "FAILED");
            response.put(
                    "message",
                    "User ID and Device ID are required"
            );

            return ResponseEntity.badRequest()
                    .body(response);
        }

        if (request.getTools() == null ||
                request.getTools().isEmpty()) {

            response.put("status", "FAILED");
            response.put(
                    "message",
                    "Please select at least one testing tool"
            );

            return ResponseEntity.badRequest()
                    .body(response);
        }

        /*
         * Create a benchmark record first.
         */
        Benchmark benchmark = Benchmark.builder()
                .benchmarkName(request.getApplicationName())
                .category(request.getTestType())
                .description("Automated benchmark execution")
                .expectedDuration(0)
                .status("RUNNING")
                .build();

        benchmark = benchmarkService.saveBenchmark(benchmark);

        Long benchmarkId = benchmark.getId();

        response.put(
                "applicationName",
                request.getApplicationName()
        );

        response.put(
                "testType",
                request.getTestType()
        );

        response.put(
                "selectedTools",
                request.getTools()
        );

        response.put(
                "benchmarkId",
                benchmarkId
        );

        Map<String, String> outputs =
                new LinkedHashMap<>();

        List<Map<String, Object>> savedResults =
                new ArrayList<>();

        /*
         * NEW:
         * Stores the total execution time of all selected tools.
         */
        double totalExecutionTime = 0.0;

        for (String tool : request.getTools()) {

            String output = "";

            if (tool.equalsIgnoreCase("Appium")) {

                output = appiumRunner.runAppiumTest();

                outputs.put("Appium", output);
            }

            else if (tool.equalsIgnoreCase("Espresso")) {

                output = espressoRunner.runEspressoTest();

                outputs.put("Espresso", output);
            }

            else if (tool.equalsIgnoreCase("AI Tester")) {

                output = aiTesterRunner.runAITester();

                outputs.put("AI Tester", output);
            }

            else {

                outputs.put(
                        tool,
                        "Unsupported testing tool"
                );

                continue;
            }

            /*
             * Extract statistics from the tool output.
             */
            BenchmarkMetrics metrics =
                    parseMetrics(output);

            /*
             * NEW:
             * Add this tool's execution time to the total duration.
             */
            totalExecutionTime +=
                    metrics.averageExecutionTime;

            double flakiness = 0.0;

            if (metrics.totalRuns > 0) {

                flakiness =
                        ((double) metrics.failedRuns /
                                metrics.totalRuns) * 100.0;
            }

            String resultStatus;

            if (metrics.totalRuns > 0 &&
                    metrics.failedRuns == 0) {

                resultStatus = "PASSED";
            }

            else {

                resultStatus = "FAILED";
            }

            /*
             * Save the complete result into MySQL.
             */
            BenchmarkResult savedResult =
                    benchmarkResultService.saveAutomaticResult(
                            request.getUserId(),
                            request.getDeviceId(),
                            benchmarkId,
                            tool,
                            metrics.totalRuns,
                            metrics.passedRuns,
                            metrics.failedRuns,
                            metrics.passRate,
                            metrics.averageExecutionTime,
                            flakiness,
                            resultStatus
                    );

            Map<String, Object> savedResultInfo =
                    new LinkedHashMap<>();

            savedResultInfo.put(
                    "id",
                    savedResult.getId()
            );

            savedResultInfo.put(
                    "tool",
                    tool
            );

            savedResultInfo.put(
                    "totalRuns",
                    metrics.totalRuns
            );

            savedResultInfo.put(
                    "passedRuns",
                    metrics.passedRuns
            );

            savedResultInfo.put(
                    "failedRuns",
                    metrics.failedRuns
            );

            savedResultInfo.put(
                    "passRate",
                    metrics.passRate
            );

            savedResultInfo.put(
                    "executionTime",
                    metrics.averageExecutionTime
            );

            savedResultInfo.put(
                    "flakiness",
                    flakiness
            );

            savedResultInfo.put(
                    "status",
                    resultStatus
            );

            savedResults.add(savedResultInfo);
        }

        /*
         * NEW:
         * Convert the total execution time into whole seconds.
         *
         * Math.ceil ensures that 2.55 becomes 3 seconds
         * instead of 2 seconds.
         */
        int expectedDuration =
                (int) Math.ceil(totalExecutionTime);

        /*
         * NEW:
         * Update the benchmark with the actual duration.
         */
        benchmark.setExpectedDuration(expectedDuration);
        benchmark.setStatus("COMPLETED");

        benchmarkService.saveBenchmark(benchmark);

        response.put(
                "status",
                "COMPLETED"
        );

        response.put(
                "message",
                "Selected benchmark tools executed and saved"
        );

        response.put(
                "outputs",
                outputs
        );

        response.put(
                "savedResults",
                savedResults
        );

        /*
         * NEW:
         * Return the calculated duration to the frontend.
         */
        response.put(
                "expectedDuration",
                expectedDuration
        );

        return ResponseEntity.ok(response);
    }

    /*
     * Extract all required metrics from raw tool output.
     */
    private BenchmarkMetrics parseMetrics(String output) {

        BenchmarkMetrics metrics =
                new BenchmarkMetrics();

        if (output == null) {
            return metrics;
        }

        metrics.totalRuns =
                extractInteger(
                        output,
                        TOTAL_RUNS_PATTERN
                );

        metrics.passedRuns =
                extractInteger(
                        output,
                        PASSED_RUNS_PATTERN
                );

        metrics.failedRuns =
                extractInteger(
                        output,
                        FAILED_RUNS_PATTERN
                );

        metrics.passRate =
                extractDouble(
                        output,
                        PASS_RATE_PATTERN
                );

        /*
         * Espresso uses:
         *
         * AVERAGE EXECUTION TIME: 4.626 seconds
         */
        metrics.averageExecutionTime =
                extractDouble(
                        output,
                        AVERAGE_TIME_PATTERN
                );

        /*
         * Appium and AI Tester use:
         *
         * Average Execution Time: 13.223 sec
         */
        if (metrics.averageExecutionTime == 0.0) {

            metrics.averageExecutionTime =
                    extractDouble(
                            output,
                            APPIUM_AVERAGE_TIME_PATTERN
                    );
        }

        /*
         * If the output does not contain a pass rate,
         * calculate it using passed runs and total runs.
         */
        if (metrics.passRate == 0.0 &&
                metrics.totalRuns > 0) {

            metrics.passRate =
                    ((double) metrics.passedRuns /
                            metrics.totalRuns) * 100.0;
        }

        return metrics;
    }

    private int extractInteger(
            String text,
            Pattern pattern) {

        Matcher matcher =
                pattern.matcher(text);

        if (matcher.find()) {

            return Integer.parseInt(
                    matcher.group(1)
            );
        }

        return 0;
    }

    private double extractDouble(
            String text,
            Pattern pattern) {

        Matcher matcher =
                pattern.matcher(text);

        if (matcher.find()) {

            return Double.parseDouble(
                    matcher.group(1)
            );
        }

        return 0.0;
    }

    /*
     * Stores the parsed statistics for one tool.
     */
    private static class BenchmarkMetrics {

        private int totalRuns;

        private int passedRuns;

        private int failedRuns;

        private double passRate;

        private double averageExecutionTime;
    }
}
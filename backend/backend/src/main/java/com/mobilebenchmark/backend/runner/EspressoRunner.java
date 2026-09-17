
package com.mobilebenchmark.backend.runner;

import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class EspressoRunner {

    private static final String PROJECT_DIRECTORY =
            "C:\\Users\\USER\\Downloads\\demo-android-app";

    private static final String ADB_PATH =
            "C:\\Users\\USER\\Downloads\\platform-tools-latest-windows\\platform-tools\\adb.exe";

    private static final String DEVICE_ID =
            "29241JEGR17998";

    private static final String TEST_CLASS =
            "com.epam.mobitru.login.EspressoBenchmarkTest";

    private static final String BENCHMARK_TAG =
            "ESPRESSO_BENCHMARK";

    private static final Pattern RESULT_PATTERN =
            Pattern.compile(
                    "TEST_RESULT=(PASS|FAIL),TIME=([0-9]+(?:\\.[0-9]+)?)"
            );

    public String runEspressoTest() {

        int totalRuns = 10;
        int passedRuns = 0;
        int failedRuns = 0;

        double totalExecutionTime = 0.0;
        int recordedTimeRuns = 0;

        StringBuilder output = new StringBuilder();

        output.append("\n====================================\n");
        output.append("STARTING ESPRESSO BENCHMARK\n");
        output.append("====================================\n");

        for (int run = 1; run <= totalRuns; run++) {

            output.append("\n------------------------------------\n");
            output.append("ESPRESSO RUN ").append(run).append("\n");
            output.append("------------------------------------\n");

            try {

                /*
                 * Clear old logcat messages before starting this run.
                 */
                clearLogcat();

                /*
                 * Execute the Espresso instrumentation test.
                 */
                List<String> gradleCommand = new ArrayList<>();

                gradleCommand.add("cmd");
                gradleCommand.add("/c");
                gradleCommand.add("gradlew.bat");
                gradleCommand.add("app:connectedDebugAndroidTest");
                gradleCommand.add(
                        "-Pandroid.testInstrumentationRunnerArguments.class="
                                + TEST_CLASS
                );

                ProcessBuilder gradleProcessBuilder =
                        new ProcessBuilder(gradleCommand);

                gradleProcessBuilder.directory(
                        new File(PROJECT_DIRECTORY)
                );

                gradleProcessBuilder.redirectErrorStream(true);

                Process gradleProcess =
                        gradleProcessBuilder.start();

                String gradleOutput =
                        readProcessOutput(gradleProcess);

                int gradleExitCode =
                        gradleProcess.waitFor();

                output.append(gradleOutput);

                /*
                 * Read the custom result from Android logcat.
                 */
                String logcatOutput =
                        readBenchmarkLogcat();

                output.append("\nCaptured benchmark log:\n");
                output.append(logcatOutput);
                output.append("\n");

                Matcher matcher =
                        RESULT_PATTERN.matcher(logcatOutput);

                if (matcher.find()) {

                    String result =
                            matcher.group(1);

                    double executionTime =
                            Double.parseDouble(matcher.group(2));

                    totalExecutionTime += executionTime;
                    recordedTimeRuns++;

                    if ("PASS".equals(result)) {

                        passedRuns++;

                        output.append(
                                "Run "
                                        + run
                                        + " result: PASS\n"
                        );

                    } else {

                        failedRuns++;

                        output.append(
                                "Run "
                                        + run
                                        + " result: FAIL\n"
                        );
                    }

                    output.append(
                            String.format(
                                    Locale.US,
                                    "Run %d execution time: %.3f seconds\n",
                                    run,
                                    executionTime
                            )
                    );

                } else {

                    /*
                     * Do not treat Gradle success as a benchmark pass.
                     * A Gradle build may succeed even if our custom result
                     * was not captured.
                     */
                    failedRuns++;

                    output.append(
                            "Run "
                                    + run
                                    + ": benchmark result was not found "
                                    + "in logcat.\n"
                    );

                    output.append(
                            "Gradle exit code: "
                                    + gradleExitCode
                                    + "\n"
                    );
                }

            } catch (Exception error) {

                failedRuns++;

                output.append(
                        "Run "
                                + run
                                + " failed with error:\n"
                );

                output.append(
                        error.getMessage()
                );

                output.append("\n");
            }
        }

        /*
         * Reinstall the application after the benchmark.
         */
        output.append("\n------------------------------------\n");
        output.append("REINSTALLING APPLICATION\n");
        output.append("------------------------------------\n");

        reinstallApplication(output);

        /*
         * Calculate summary values.
         */
        double passRate =
                ((double) passedRuns / totalRuns) * 100.0;

        double failureRate =
                ((double) failedRuns / totalRuns) * 100.0;

        double averageExecutionTime = 0.0;

        if (recordedTimeRuns > 0) {

            averageExecutionTime =
                    totalExecutionTime / recordedTimeRuns;
        }

        /*
         * Print final benchmark summary.
         */
        output.append("\n====================================\n");
        output.append("ESPRESSO BENCHMARK SUMMARY\n");
        output.append("====================================\n");

        output.append(
                "TOTAL RUNS: "
                        + totalRuns
                        + "\n"
        );

        output.append(
                "PASSED RUNS: "
                        + passedRuns
                        + "\n"
        );

        output.append(
                "FAILED RUNS: "
                        + failedRuns
                        + "\n"
        );

        output.append(
                String.format(
                        Locale.US,
                        "PASS RATE: %.2f%%\n",
                        passRate
                )
        );

        output.append(
                String.format(
                        Locale.US,
                        "FAILURE RATE: %.2f%%\n",
                        failureRate
                )
        );

        output.append(
                String.format(
                        Locale.US,
                        "TOTAL EXECUTION TIME: %.3f seconds\n",
                        totalExecutionTime
                )
        );

        output.append(
                String.format(
                        Locale.US,
                        "AVERAGE EXECUTION TIME: %.3f seconds\n",
                        averageExecutionTime
                )
        );

        output.append(
                "RECORDED TIME RUNS: "
                        + recordedTimeRuns
                        + "\n"
        );

        output.append("====================================\n");

        /*
         * Print the complete Espresso benchmark output
         * in the Spring Boot / VS Code terminal.
         */
        System.out.println(output.toString());

        /*
         * Return the same output to the frontend.
         */
        return output.toString();
    }

    private void clearLogcat() throws Exception {

        List<String> command = new ArrayList<>();

        command.add(ADB_PATH);
        command.add("-s");
        command.add(DEVICE_ID);
        command.add("logcat");
        command.add("-c");

        ProcessBuilder processBuilder =
                new ProcessBuilder(command);

        processBuilder.redirectErrorStream(true);

        Process process =
                processBuilder.start();

        readProcessOutput(process);

        process.waitFor();
    }

    private String readBenchmarkLogcat() throws Exception {

        List<String> command = new ArrayList<>();

        command.add(ADB_PATH);
        command.add("-s");
        command.add(DEVICE_ID);
        command.add("logcat");
        command.add("-d");
        command.add("-s");
        command.add(BENCHMARK_TAG + ":I");
        command.add("*:S");

        ProcessBuilder processBuilder =
                new ProcessBuilder(command);

        processBuilder.redirectErrorStream(true);

        Process process =
                processBuilder.start();

        String output =
                readProcessOutput(process);

        process.waitFor();

        return output;
    }

    private void reinstallApplication(StringBuilder output) {

        try {

            String apkPath =
                    PROJECT_DIRECTORY
                            + "\\app\\build\\outputs\\apk\\debug\\app-debug.apk";

            List<String> command = new ArrayList<>();

            command.add(ADB_PATH);
            command.add("-s");
            command.add(DEVICE_ID);
            command.add("install");
            command.add("-r");
            command.add(apkPath);

            ProcessBuilder processBuilder =
                    new ProcessBuilder(command);

            processBuilder.redirectErrorStream(true);

            Process process =
                    processBuilder.start();

            String installOutput =
                    readProcessOutput(process);

            int exitCode =
                    process.waitFor();

            output.append(installOutput);

            output.append(
                    "\nAPK installation exit code: "
                            + exitCode
                            + "\n"
            );

        } catch (Exception error) {

            output.append(
                    "\nAPK reinstall failed: "
                            + error.getMessage()
                            + "\n"
            );
        }
    }

    private String readProcessOutput(Process process)
            throws Exception {

        StringBuilder output =
                new StringBuilder();

        BufferedReader reader =
                new BufferedReader(
                        new InputStreamReader(
                                process.getInputStream()
                        )
                );

        String line;

        while ((line = reader.readLine()) != null) {

            output.append(line);
            output.append("\n");
        }

        return output.toString();
    }
}
package com.mobilebenchmark.backend.runner;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;

@Service
public class AITesterRunner {

    public String runAITester() {

        try {

            ProcessBuilder processBuilder =
                    new ProcessBuilder(
                            "python",
                            "C:\\Users\\USER\\ai-tester\\ai_benchmark_10.py"
                    );

            processBuilder.redirectErrorStream(true);

            Process process =
                    processBuilder.start();

            BufferedReader reader =
                    new BufferedReader(
                            new InputStreamReader(
                                    process.getInputStream()
                            )
                    );

            StringBuilder output =
                    new StringBuilder();

            String line;

            while ((line = reader.readLine()) != null) {

                System.out.println(line);

                output.append(line)
                        .append("\n");
            }

            int exitCode = process.waitFor();

            output.append("\nEXIT CODE: ")
                    .append(exitCode);

            return output.toString();

        } catch (Exception e) {

            return "ERROR: " + e.getMessage();
        }
    }
}
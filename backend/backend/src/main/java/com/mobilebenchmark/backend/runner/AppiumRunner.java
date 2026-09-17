package com.mobilebenchmark.backend.runner;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;

@Service
public class AppiumRunner {

    public String runAppiumTest() {

        try {

            ProcessBuilder processBuilder =
                    new ProcessBuilder(
                            "node",
                            "C:\\Users\\USER\\appium-tests\\test.js"
                    );

            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start();

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

                output.append(line).append("\n");
            }

            int exitCode = process.waitFor();

            output.append("EXIT CODE: ")
                    .append(exitCode);

            return output.toString();

        } catch (Exception e) {

            return "ERROR: " + e.getMessage();
        }
    }
}
package com.mobilebenchmark.backend.runner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/run-ai-tester")
@CrossOrigin(origins = "http://localhost:5173")
public class AITesterRunnerController {

    @Autowired
    private AITesterRunner aiTesterRunner;

    @PostMapping
    public String runAITester() {

        return aiTesterRunner.runAITester();
    }
}
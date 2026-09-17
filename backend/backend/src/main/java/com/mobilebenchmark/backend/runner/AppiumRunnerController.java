package com.mobilebenchmark.backend.runner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/run-appium")
@CrossOrigin(origins = "http://localhost:5173")
public class AppiumRunnerController {

    @Autowired
    private AppiumRunner appiumRunner;

    @PostMapping
    public String runAppium() {

        return appiumRunner.runAppiumTest();
    }
}
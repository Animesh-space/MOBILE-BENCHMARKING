
package com.mobilebenchmark.backend.runner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/run-espresso")
@CrossOrigin(origins = "http://localhost:5173")
public class EspressoRunnerController {

    @Autowired
    private EspressoRunner espressoRunner;

    @PostMapping
    public String runEspresso() {

        return espressoRunner.runEspressoTest();
    }
}
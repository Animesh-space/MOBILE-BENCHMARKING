package com.mobilebenchmark.backend.controller;

import com.mobilebenchmark.backend.dto.LoginRequest;
import com.mobilebenchmark.backend.dto.LoginResponse;
import com.mobilebenchmark.backend.entity.User;
import com.mobilebenchmark.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserService userService;

    // Login API
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        Optional<User> user = userService.login(
                request.getEmail(),
                request.getPassword()
        );

        if (user.isPresent()) {
            return new LoginResponse(
                    true,
                    "Login Successful",
                    user.get().getName(),
                    user.get().getRole()
            );
        }

        return new LoginResponse(
                false,
                "Invalid Email or Password",
                null,
                null
        );
    }

    // Register API (Temporary)
    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

}
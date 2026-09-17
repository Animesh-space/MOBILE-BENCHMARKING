package com.mobilebenchmark.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponse {

    private boolean success;
    private String message;
    private String name;
    private String role;

}
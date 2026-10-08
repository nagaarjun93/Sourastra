package com.sourashtra.learn.controller;

import com.sourashtra.learn.dto.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ApiResponse<Map<String, String>> healthCheck() {
        return ApiResponse.success(Map.of(
            "status", "UP",
            "app", "Sourashtra Learn Backend",
            "version", "1.0.0"
        ), "Service is healthy");
    }
}


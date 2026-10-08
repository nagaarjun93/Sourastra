package com.sourashtra.learn.controller;

import com.sourashtra.learn.dto.AIAskRequest;
import com.sourashtra.learn.dto.AIAskResponse;
import com.sourashtra.learn.dto.ApiResponse;
import com.sourashtra.learn.service.AIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/ask")
    public ResponseEntity<ApiResponse<AIAskResponse>> askQuestion(@RequestBody(required = false) AIAskRequest request) {
        String q = (request != null) ? request.getQuestion() : "";
        AIAskResponse response = aiService.askQuestion(q);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

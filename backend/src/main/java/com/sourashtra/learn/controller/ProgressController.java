package com.sourashtra.learn.controller;

import com.sourashtra.learn.dto.ApiResponse;
import com.sourashtra.learn.model.UserProgress;
import com.sourashtra.learn.service.ProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "*")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserProgress>> getUserProgress(@PathVariable("userId") String userId) {
        return ResponseEntity.ok(ApiResponse.success(progressService.getUserProgress(userId)));
    }

    @PostMapping("/complete-lesson")
    public ResponseEntity<ApiResponse<UserProgress>> completeLesson(
            @RequestParam("userId") String userId,
            @RequestParam("lessonId") String lessonId) {
        return ResponseEntity.ok(ApiResponse.success(progressService.completeLesson(userId, lessonId), "Lesson marked completed"));
    }

    @PostMapping("/master-word")
    public ResponseEntity<ApiResponse<UserProgress>> masterWord(
            @RequestParam("userId") String userId,
            @RequestParam("wordId") String wordId) {
        return ResponseEntity.ok(ApiResponse.success(progressService.addMasteredWord(userId, wordId), "Word marked mastered"));
    }
}

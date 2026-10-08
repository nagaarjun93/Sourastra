package com.sourashtra.learn.controller;

import com.sourashtra.learn.dto.ApiResponse;
import com.sourashtra.learn.dto.QuizResultDto;
import com.sourashtra.learn.dto.QuizSubmissionDto;
import com.sourashtra.learn.model.QuizQuestion;
import com.sourashtra.learn.service.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz")
@CrossOrigin(origins = "*")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<QuizQuestion>>> getQuestions(@RequestParam(value = "category", required = false) String category) {
        return ResponseEntity.ok(ApiResponse.success(quizService.getQuizQuestions(category)));
    }

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<QuizResultDto>> submitQuiz(@RequestBody QuizSubmissionDto submission) {
        return ResponseEntity.ok(ApiResponse.success(quizService.evaluateQuiz(submission), "Quiz evaluated successfully"));
    }
}

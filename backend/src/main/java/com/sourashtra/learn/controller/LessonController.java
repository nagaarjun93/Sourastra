package com.sourashtra.learn.controller;

import com.sourashtra.learn.dto.ApiResponse;
import com.sourashtra.learn.model.Lesson;
import com.sourashtra.learn.service.LessonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
@CrossOrigin(origins = "*")
public class LessonController {

    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Lesson>>> getAllLessons() {
        return ResponseEntity.ok(ApiResponse.success(lessonService.getAllLessons()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Lesson>> getLessonById(@PathVariable("id") String id) {
        return ResponseEntity.ok(ApiResponse.success(lessonService.getLessonById(id)));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<Lesson>>> getLessonsByCategory(@PathVariable("category") String category) {
        return ResponseEntity.ok(ApiResponse.success(lessonService.getLessonsByCategory(category)));
    }
}

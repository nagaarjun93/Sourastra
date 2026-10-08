package com.sourashtra.learn.controller;

import com.sourashtra.learn.dto.ApiResponse;
import com.sourashtra.learn.model.Word;
import com.sourashtra.learn.service.WordService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/words")
@CrossOrigin(origins = "*")
public class WordController {

    private final WordService wordService;

    public WordController(WordService wordService) {
        this.wordService = wordService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Word>>> getAllWords() {
        return ResponseEntity.ok(ApiResponse.success(wordService.getAllWords()));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Word>>> searchWords(@RequestParam("q") String query) {
        return ResponseEntity.ok(ApiResponse.success(wordService.searchWords(query)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Word>> getWordById(@PathVariable("id") String id) {
        return ResponseEntity.ok(ApiResponse.success(wordService.getWordById(id)));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<Word>>> getWordsByCategory(@PathVariable("category") String category) {
        return ResponseEntity.ok(ApiResponse.success(wordService.getWordsByCategory(category)));
    }
}

const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
function writeFile(relPath, content) {
    const fullPath = path.isAbsolute(relPath) ? relPath : path.join(baseDir, relPath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
    console.log('Wrote:', path.relative(baseDir, fullPath), `(${Buffer.byteLength(content, 'utf8')} bytes)`);
}

// 1. WordController
writeFile('src/main/java/com/sourashtra/learn/controller/WordController.java', `
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
`);

// 2. LessonController
writeFile('src/main/java/com/sourashtra/learn/controller/LessonController.java', `
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
`);

// 3. QuizController
writeFile('src/main/java/com/sourashtra/learn/controller/QuizController.java', `
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
`);

// 4. AuthController
writeFile('src/main/java/com/sourashtra/learn/controller/AuthController.java', `
package com.sourashtra.learn.controller;

import com.sourashtra.learn.dto.ApiResponse;
import com.sourashtra.learn.dto.AuthRequest;
import com.sourashtra.learn.dto.AuthResponse;
import com.sourashtra.learn.dto.RegisterRequest;
import com.sourashtra.learn.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(ApiResponse.success(authService.register(request), "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(ApiResponse.success(authService.login(request), "Login successful"));
    }
}
`);

// 5. ProgressController
writeFile('src/main/java/com/sourashtra/learn/controller/ProgressController.java', `
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
`);

// 6. AIController
writeFile('src/main/java/com/sourashtra/learn/controller/AIController.java', `
package com.sourashtra.learn.controller;

import com.sourashtra.learn.dto.AIAskRequest;
import com.sourashtra.learn.dto.AIAskResponse;
import com.sourashtra.learn.dto.ApiResponse;
import com.sourashtra.learn.service.AIService;
import jakarta.validation.Valid;
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
    public ResponseEntity<ApiResponse<AIAskResponse>> askQuestion(@Valid @RequestBody AIAskRequest request) {
        AIAskResponse response = aiService.askQuestion(request.getQuestion());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
`);

// 7. HealthController
writeFile('src/main/java/com/sourashtra/learn/controller/HealthController.java', `
package com.sourashtra.learn.controller;

import com.sourashtra.learn.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = "*")
public class HealthController {

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, String>>> health() {
        return ResponseEntity.ok(ApiResponse.success(
            Map.of(
                "status", "UP",
                "app", "Sourashtra Learn Backend",
                "version", "1.0.0"
            )
        ));
    }
}
`);

// 8. Application Entry
writeFile('src/main/java/com/sourashtra/learn/SourashtraLearnApplication.java', `
package com.sourashtra.learn;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SourashtraLearnApplication {
    public static void main(String[] args) {
        SpringApplication.run(SourashtraLearnApplication.class, args);
    }
}
`);

console.log('Controllers and Application entry generation finished.');

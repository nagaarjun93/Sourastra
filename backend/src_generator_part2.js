const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
function writeFile(relPath, content) {
    const fullPath = path.isAbsolute(relPath) ? relPath : path.join(baseDir, relPath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
    console.log('Wrote:', path.relative(baseDir, fullPath), `(${Buffer.byteLength(content, 'utf8')} bytes)`);
}

// Repositories
writeFile('src/main/java/com/sourashtra/learn/repository/WordRepository.java', `
package com.sourashtra.learn.repository;

import com.sourashtra.learn.model.Word;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WordRepository extends MongoRepository<Word, String> {
    List<Word> findByCategory(String category);
    List<Word> findBySourashtraContainingIgnoreCaseOrTamilContainingIgnoreCaseOrEnglishContainingIgnoreCase(String s, String t, String e);
    List<Word> findByVerifiedTrue();
    long count();
}
`);

writeFile('src/main/java/com/sourashtra/learn/repository/LessonRepository.java', `
package com.sourashtra.learn.repository;

import com.sourashtra.learn.model.Lesson;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LessonRepository extends MongoRepository<Lesson, String> {
    List<Lesson> findAllByOrderByLessonNumberAsc();
    List<Lesson> findByCategory(String category);
    long count();
}
`);

writeFile('src/main/java/com/sourashtra/learn/repository/QuizQuestionRepository.java', `
package com.sourashtra.learn.repository;

import com.sourashtra.learn.model.QuizQuestion;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizQuestionRepository extends MongoRepository<QuizQuestion, String> {
    List<QuizQuestion> findByCategory(String category);
    long count();
}
`);

writeFile('src/main/java/com/sourashtra/learn/repository/UserRepository.java', `
package com.sourashtra.learn.repository;

import com.sourashtra.learn.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
`);

writeFile('src/main/java/com/sourashtra/learn/repository/UserProgressRepository.java', `
package com.sourashtra.learn.repository;

import com.sourashtra.learn.model.UserProgress;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends MongoRepository<UserProgress, String> {
    Optional<UserProgress> findByUserId(String userId);
}
`);

// DTOs
writeFile('src/main/java/com/sourashtra/learn/dto/ApiResponse.java', `
package com.sourashtra.learn.dto;

import java.time.Instant;

public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private Instant timestamp = Instant.now();

    public ApiResponse() {}
    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = Instant.now();
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, message, data);
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "Operation successful", data);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public T getData() { return data; }
    public void setData(T data) { this.data = data; }
    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}
`);

writeFile('src/main/java/com/sourashtra/learn/dto/AuthRequest.java', `
package com.sourashtra.learn.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AuthRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    public AuthRequest() {}
    public AuthRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
`);

writeFile('src/main/java/com/sourashtra/learn/dto/RegisterRequest.java', `
package com.sourashtra.learn.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    public RegisterRequest() {}
    public RegisterRequest(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
`);

writeFile('src/main/java/com/sourashtra/learn/dto/AuthResponse.java', `
package com.sourashtra.learn.dto;

public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private String id;
    private String name;
    private String email;

    public AuthResponse() {}
    public AuthResponse(String token, String id, String name, String email) {
        this.token = token;
        this.id = id;
        this.name = name;
        this.email = email;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
`);

writeFile('src/main/java/com/sourashtra/learn/dto/AIAskRequest.java', `
package com.sourashtra.learn.dto;

import jakarta.validation.constraints.NotBlank;

public class AIAskRequest {
    @NotBlank(message = "Question is required")
    private String question;

    public AIAskRequest() {}
    public AIAskRequest(String question) {
        this.question = question;
    }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
}
`);

writeFile('src/main/java/com/sourashtra/learn/dto/AIAskResponse.java', `
package com.sourashtra.learn.dto;

import java.util.ArrayList;
import java.util.List;

public class AIAskResponse {
    private String answer;
    private List<SourceRef> sources = new ArrayList<>();

    public AIAskResponse() {}
    public AIAskResponse(String answer, List<SourceRef> sources) {
        this.answer = answer;
        this.sources = sources != null ? sources : new ArrayList<>();
    }

    public static class SourceRef {
        private String source;
        private Integer sourcePage;

        public SourceRef() {}
        public SourceRef(String source, Integer sourcePage) {
            this.source = source;
            this.sourcePage = sourcePage;
        }

        public String getSource() { return source; }
        public void setSource(String source) { this.source = source; }
        public Integer getSourcePage() { return sourcePage; }
        public void setSourcePage(Integer sourcePage) { this.sourcePage = sourcePage; }
    }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
    public List<SourceRef> getSources() { return sources; }
    public void setSources(List<SourceRef> sources) { this.sources = sources; }
}
`);

writeFile('src/main/java/com/sourashtra/learn/dto/QuizSubmissionDto.java', `
package com.sourashtra.learn.dto;

import java.util.HashMap;
import java.util.Map;

public class QuizSubmissionDto {
    private String userId;
    // Map of questionId -> selectedOptionIndex
    private Map<String, Integer> answers = new HashMap<>();

    public QuizSubmissionDto() {}

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public Map<String, Integer> getAnswers() { return answers; }
    public void setAnswers(Map<String, Integer> answers) { this.answers = answers; }
}
`);

writeFile('src/main/java/com/sourashtra/learn/dto/QuizResultDto.java', `
package com.sourashtra.learn.dto;

public class QuizResultDto {
    private int totalQuestions;
    private int correctAnswers;
    private double scorePercentage;
    private String feedback;

    public QuizResultDto() {}
    public QuizResultDto(int totalQuestions, int correctAnswers, double scorePercentage, String feedback) {
        this.totalQuestions = totalQuestions;
        this.correctAnswers = correctAnswers;
        this.scorePercentage = scorePercentage;
        this.feedback = feedback;
    }

    public int getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }
    public int getCorrectAnswers() { return correctAnswers; }
    public void setCorrectAnswers(int correctAnswers) { this.correctAnswers = correctAnswers; }
    public double getScorePercentage() { return scorePercentage; }
    public void setScorePercentage(double scorePercentage) { this.scorePercentage = scorePercentage; }
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
}
`);

// Exceptions
writeFile('src/main/java/com/sourashtra/learn/exception/ResourceNotFoundException.java', `
package com.sourashtra.learn.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
`);

writeFile('src/main/java/com/sourashtra/learn/exception/GlobalExceptionHandler.java', `
package com.sourashtra.learn.exception;

import com.sourashtra.learn.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<String>> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        ApiResponse<Map<String, String>> response = new ApiResponse<>(false, "Validation failed", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<String>> handleIllegalArg(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<String>> handleGeneral(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Internal Server Error: " + ex.getMessage()));
    }
}
`);

console.log('Repositories, DTOs, and Exceptions generation finished.');

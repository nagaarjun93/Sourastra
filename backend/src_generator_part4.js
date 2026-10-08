const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
function writeFile(relPath, content) {
    const fullPath = path.isAbsolute(relPath) ? relPath : path.join(baseDir, relPath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
    console.log('Wrote:', path.relative(baseDir, fullPath), `(${Buffer.byteLength(content, 'utf8')} bytes)`);
}

// WordService & WordServiceImpl
writeFile('src/main/java/com/sourashtra/learn/service/WordService.java', `
package com.sourashtra.learn.service;

import com.sourashtra.learn.model.Word;
import java.util.List;

public interface WordService {
    List<Word> getAllWords();
    List<Word> searchWords(String query);
    Word getWordById(String id);
    List<Word> getWordsByCategory(String category);
}
`);

writeFile('src/main/java/com/sourashtra/learn/service/WordServiceImpl.java', `
package com.sourashtra.learn.service;

import com.sourashtra.learn.exception.ResourceNotFoundException;
import com.sourashtra.learn.model.Word;
import com.sourashtra.learn.repository.WordRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WordServiceImpl implements WordService {

    private final WordRepository wordRepository;

    public WordServiceImpl(WordRepository wordRepository) {
        this.wordRepository = wordRepository;
    }

    @Override
    public List<Word> getAllWords() {
        return wordRepository.findAll();
    }

    @Override
    public List<Word> searchWords(String query) {
        if (query == null || query.trim().isEmpty()) {
            return wordRepository.findAll();
        }
        String q = query.trim();
        return wordRepository.findBySourashtraContainingIgnoreCaseOrTamilContainingIgnoreCaseOrEnglishContainingIgnoreCase(q, q, q);
    }

    @Override
    public Word getWordById(String id) {
        return wordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Word not found with id: " + id));
    }

    @Override
    public List<Word> getWordsByCategory(String category) {
        return wordRepository.findByCategory(category);
    }
}
`);

// LessonService & LessonServiceImpl
writeFile('src/main/java/com/sourashtra/learn/service/LessonService.java', `
package com.sourashtra.learn.service;

import com.sourashtra.learn.model.Lesson;
import java.util.List;

public interface LessonService {
    List<Lesson> getAllLessons();
    Lesson getLessonById(String id);
    List<Lesson> getLessonsByCategory(String category);
}
`);

writeFile('src/main/java/com/sourashtra/learn/service/LessonServiceImpl.java', `
package com.sourashtra.learn.service;

import com.sourashtra.learn.exception.ResourceNotFoundException;
import com.sourashtra.learn.model.Lesson;
import com.sourashtra.learn.repository.LessonRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LessonServiceImpl implements LessonService {

    private final LessonRepository lessonRepository;

    public LessonServiceImpl(LessonRepository lessonRepository) {
        this.lessonRepository = lessonRepository;
    }

    @Override
    public List<Lesson> getAllLessons() {
        return lessonRepository.findAllByOrderByLessonNumberAsc();
    }

    @Override
    public Lesson getLessonById(String id) {
        return lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + id));
    }

    @Override
    public List<Lesson> getLessonsByCategory(String category) {
        return lessonRepository.findByCategory(category);
    }
}
`);

// QuizService & QuizServiceImpl
writeFile('src/main/java/com/sourashtra/learn/service/QuizService.java', `
package com.sourashtra.learn.service;

import com.sourashtra.learn.dto.QuizResultDto;
import com.sourashtra.learn.dto.QuizSubmissionDto;
import com.sourashtra.learn.model.QuizQuestion;
import java.util.List;

public interface QuizService {
    List<QuizQuestion> getQuizQuestions(String category);
    QuizResultDto evaluateQuiz(QuizSubmissionDto submission);
}
`);

writeFile('src/main/java/com/sourashtra/learn/service/QuizServiceImpl.java', `
package com.sourashtra.learn.service;

import com.sourashtra.learn.dto.QuizResultDto;
import com.sourashtra.learn.dto.QuizSubmissionDto;
import com.sourashtra.learn.model.QuizQuestion;
import com.sourashtra.learn.repository.QuizQuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class QuizServiceImpl implements QuizService {

    private final QuizQuestionRepository quizQuestionRepository;

    public QuizServiceImpl(QuizQuestionRepository quizQuestionRepository) {
        this.quizQuestionRepository = quizQuestionRepository;
    }

    @Override
    public List<QuizQuestion> getQuizQuestions(String category) {
        if (category != null && !category.trim().isEmpty()) {
            return quizQuestionRepository.findByCategory(category);
        }
        return quizQuestionRepository.findAll();
    }

    @Override
    public QuizResultDto evaluateQuiz(QuizSubmissionDto submission) {
        List<QuizQuestion> questions = quizQuestionRepository.findAll();
        if (questions.isEmpty()) {
            return new QuizResultDto(0, 0, 0.0, "No questions found");
        }

        int correctCount = 0;
        int evaluatedCount = 0;
        Map<String, Integer> answers = submission.getAnswers();

        for (QuizQuestion q : questions) {
            if (answers.containsKey(q.getId())) {
                evaluatedCount++;
                if (answers.get(q.getId()) == q.getCorrectOptionIndex()) {
                    correctCount++;
                }
            }
        }

        int total = evaluatedCount > 0 ? evaluatedCount : questions.size();
        double percentage = total > 0 ? ((double) correctCount / total) * 100.0 : 0.0;
        String feedback = percentage >= 80.0 ? "Excellent! You are mastering verified Sourashtra!" :
                          percentage >= 50.0 ? "Good effort! Keep revising the vocabulary lessons." :
                          "Keep practicing with the verified Sourashtra lessons.";

        return new QuizResultDto(total, correctCount, Math.round(percentage * 10.0) / 10.0, feedback);
    }
}
`);

// AuthService & AuthServiceImpl
writeFile('src/main/java/com/sourashtra/learn/service/AuthService.java', `
package com.sourashtra.learn.service;

import com.sourashtra.learn.dto.AuthRequest;
import com.sourashtra.learn.dto.AuthResponse;
import com.sourashtra.learn.dto.RegisterRequest;

public interface AuthService {
    AuthResponse login(AuthRequest request);
    AuthResponse register(RegisterRequest request);
}
`);

writeFile('src/main/java/com/sourashtra/learn/service/AuthServiceImpl.java', `
package com.sourashtra.learn.service;

import com.sourashtra.learn.dto.AuthRequest;
import com.sourashtra.learn.dto.AuthResponse;
import com.sourashtra.learn.dto.RegisterRequest;
import com.sourashtra.learn.model.User;
import com.sourashtra.learn.model.UserProgress;
import com.sourashtra.learn.repository.UserProgressRepository;
import com.sourashtra.learn.repository.UserRepository;
import com.sourashtra.learn.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserProgressRepository userProgressRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthServiceImpl(UserRepository userRepository,
                           UserProgressRepository userProgressRepository,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager,
                           JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.userProgressRepository = userProgressRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail());
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered: " + request.getEmail());
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword())
        );
        User savedUser = userRepository.save(user);

        // Initialize user progress
        UserProgress progress = new UserProgress(savedUser.getId());
        userProgressRepository.save(progress);

        String token = tokenProvider.generateTokenFromUsername(savedUser.getEmail());
        return new AuthResponse(token, savedUser.getId(), savedUser.getName(), savedUser.getEmail());
    }
}
`);

// ProgressService & ProgressServiceImpl
writeFile('src/main/java/com/sourashtra/learn/service/ProgressService.java', `
package com.sourashtra.learn.service;

import com.sourashtra.learn.model.UserProgress;

public interface ProgressService {
    UserProgress getUserProgress(String userId);
    UserProgress completeLesson(String userId, String lessonId);
    UserProgress addMasteredWord(String userId, String wordId);
}
`);

writeFile('src/main/java/com/sourashtra/learn/service/ProgressServiceImpl.java', `
package com.sourashtra.learn.service;

import com.sourashtra.learn.model.UserProgress;
import com.sourashtra.learn.repository.UserProgressRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class ProgressServiceImpl implements ProgressService {

    private final UserProgressRepository progressRepository;

    public ProgressServiceImpl(UserProgressRepository progressRepository) {
        this.progressRepository = progressRepository;
    }

    @Override
    public UserProgress getUserProgress(String userId) {
        return progressRepository.findByUserId(userId)
                .orElseGet(() -> {
                    UserProgress p = new UserProgress(userId);
                    return progressRepository.save(p);
                });
    }

    @Override
    public UserProgress completeLesson(String userId, String lessonId) {
        UserProgress progress = getUserProgress(userId);
        progress.getCompletedLessonIds().add(lessonId);
        progress.setLastActiveDate(Instant.now());
        return progressRepository.save(progress);
    }

    @Override
    public UserProgress addMasteredWord(String userId, String wordId) {
        UserProgress progress = getUserProgress(userId);
        progress.getMasteredWordIds().add(wordId);
        progress.setLastActiveDate(Instant.now());
        return progressRepository.save(progress);
    }
}
`);

// AIService & AIServiceImpl (RAG Knowledge Engine)
writeFile('src/main/java/com/sourashtra/learn/service/AIService.java', `
package com.sourashtra.learn.service;

import com.sourashtra.learn.dto.AIAskResponse;

public interface AIService {
    AIAskResponse askQuestion(String question);
}
`);

writeFile('src/main/java/com/sourashtra/learn/service/AIServiceImpl.java', `
package com.sourashtra.learn.service;

import com.sourashtra.learn.dto.AIAskResponse;
import com.sourashtra.learn.model.Word;
import com.sourashtra.learn.repository.WordRepository;
import com.sourashtra.learn.util.AppConstants;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AIServiceImpl implements AIService {

    private final WordRepository wordRepository;

    public AIServiceImpl(WordRepository wordRepository) {
        this.wordRepository = wordRepository;
    }

    @Override
    public AIAskResponse askQuestion(String question) {
        if (question == null || question.trim().isEmpty()) {
            return new AIAskResponse(AppConstants.AI_NOT_AVAILABLE_MESSAGE, Collections.emptyList());
        }

        String cleanQ = question.trim().toLowerCase();

        // 1. Retrieve all verified words
        List<Word> allVerified = wordRepository.findByVerifiedTrue();

        // 2. Tokenize user query to find keyword matches across Sourashtra, Tamil, and English
        String[] tokens = cleanQ.replaceAll("[^a-zA-Z0-9\\\\u0B80-\\\\u0BFF\\\\s]", "").split("\\\\s+");
        Set<Word> matchedWords = new LinkedHashSet<>();

        for (Word word : allVerified) {
            String sourashtra = (word.getSourashtra() != null) ? word.getSourashtra().toLowerCase() : "";
            String english = (word.getEnglish() != null) ? word.getEnglish().toLowerCase() : "";
            String tamil = (word.getTamil() != null) ? word.getTamil() : "";

            // Direct substring matches
            if (cleanQ.contains(english) && !english.isEmpty() && english.length() > 2) {
                matchedWords.add(word);
            }
            if (cleanQ.contains(sourashtra) && !sourashtra.isEmpty() && sourashtra.length() > 2) {
                matchedWords.add(word);
            }
            if (cleanQ.contains(tamil) && !tamil.isEmpty()) {
                matchedWords.add(word);
            }

            // Token matching
            for (String token : tokens) {
                if (token.length() > 2) {
                    if (english.contains(token) || sourashtra.contains(token) || tamil.contains(token)) {
                        matchedWords.add(word);
                    }
                }
            }
        }

        // 3. Fallback for general greetings or requests like "teach me basic sourashtra"
        if (matchedWords.isEmpty() && (cleanQ.contains("teach") || cleanQ.contains("basic") || cleanQ.contains("hello") || cleanQ.contains("sourashtra"))) {
            // Pick foundational words from verified knowledge base (e.g. page 7 & 8)
            matchedWords.addAll(allVerified.stream().limit(5).collect(Collectors.toList()));
        }

        // 4. If no verified information is matched, enforce CRITICAL LANGUAGE DATA RULE
        if (matchedWords.isEmpty()) {
            return new AIAskResponse(AppConstants.AI_NOT_AVAILABLE_MESSAGE, Collections.emptyList());
        }

        // 5. Construct grounded RAG response strictly from verified knowledge
        StringBuilder answerBuilder = new StringBuilder();
        List<AIAskResponse.SourceRef> sources = new ArrayList<>();
        Set<Integer> pages = new LinkedHashSet<>();

        answerBuilder.append("Based on the verified Sourashtra knowledge base:\\n\\n");

        for (Word w : matchedWords) {
            answerBuilder.append("• **Sourashtra:** ").append(w.getSourashtra()).append("\\n");
            answerBuilder.append("  **Tamil:** ").append(w.getTamil()).append("\\n");
            answerBuilder.append("  **English:** ").append(w.getEnglish()).append("\\n");
            if (w.getPronunciation() != null && !w.getPronunciation().isEmpty()) {
                answerBuilder.append("  **Pronunciation:** ").append(w.getPronunciation()).append("\\n");
            }
            if (w.getExamples() != null && !w.getExamples().isEmpty()) {
                Word.Example ex = w.getExamples().get(0);
                answerBuilder.append("  *Example:* ").append(ex.getSourashtra())
                        .append(" — ").append(ex.getTamil())
                        .append(" (").append(ex.getEnglish()).append(")\\n");
            }
            answerBuilder.append("  *Source:* ").append(w.getSource()).append(" (Page ").append(w.getSourcePage()).append(")\\n\\n");

            if (w.getSourcePage() != null && !pages.contains(w.getSourcePage())) {
                pages.add(w.getSourcePage());
                sources.add(new AIAskResponse.SourceRef(w.getSource(), w.getSourcePage()));
            }
        }

        return new AIAskResponse(answerBuilder.toString().trim(), sources);
    }
}
`);

console.log('Services generation finished.');

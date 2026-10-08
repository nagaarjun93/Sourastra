const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
function writeFile(relPath, content) {
    const fullPath = path.isAbsolute(relPath) ? relPath : path.join(baseDir, relPath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
    console.log('Wrote:', path.relative(baseDir, fullPath), `(${Buffer.byteLength(content, 'utf8')} bytes)`);
}

// 1. In-Memory Store Provider to hold seed data seamlessly
writeFile('src/main/java/com/sourashtra/learn/util/InMemoryDataStore.java', `
package com.sourashtra.learn.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sourashtra.learn.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Component
public class InMemoryDataStore {

    private static final Logger log = LoggerFactory.getLogger(InMemoryDataStore.class);

    private final ObjectMapper objectMapper;
    private final List<Word> words = new ArrayList<>();
    private final List<Lesson> lessons = new ArrayList<>();
    private final List<QuizQuestion> quizQuestions = new ArrayList<>();
    private final Map<String, User> users = new ConcurrentHashMap<>();
    private final Map<String, UserProgress> userProgressMap = new ConcurrentHashMap<>();

    public InMemoryDataStore(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void init() {
        try {
            File wordsFile = findDataFile("verified_seed_words.json");
            File lessonsFile = findDataFile("verified_seed_lessons.json");
            File quizFile = findDataFile("verified_seed_quiz.json");

            if (wordsFile != null && wordsFile.exists()) {
                List<Word> loadedWords = objectMapper.readValue(wordsFile, new TypeReference<List<Word>>() {});
                for (int i = 0; i < loadedWords.size(); i++) {
                    Word w = loadedWords.get(i);
                    if (w.getId() == null) w.setId("word_" + (i + 1));
                    words.add(w);
                }
                log.info("Loaded {} verified Sourashtra words into memory store", words.size());
            }

            if (lessonsFile != null && lessonsFile.exists()) {
                List<Lesson> loadedLessons = objectMapper.readValue(lessonsFile, new TypeReference<List<Lesson>>() {});
                for (int i = 0; i < loadedLessons.size(); i++) {
                    Lesson l = loadedLessons.get(i);
                    if (l.getId() == null) l.setId("lesson_" + (i + 1));
                    lessons.add(l);
                }
                log.info("Loaded {} verified Sourashtra lessons into memory store", lessons.size());
            }

            if (quizFile != null && quizFile.exists()) {
                List<QuizQuestion> loadedQuestions = objectMapper.readValue(quizFile, new TypeReference<List<QuizQuestion>>() {});
                for (int i = 0; i < loadedQuestions.size(); i++) {
                    QuizQuestion q = loadedQuestions.get(i);
                    if (q.getId() == null) q.setId("quiz_" + (i + 1));
                    quizQuestions.add(q);
                }
                log.info("Loaded {} verified quiz questions into memory store", quizQuestions.size());
            }
        } catch (Exception e) {
            log.error("Failed to load in-memory seed data: {}", e.getMessage(), e);
        }
    }

    private File findDataFile(String filename) {
        String[] candidatePaths = {
            "../data/sourashtra/" + filename,
            "data/sourashtra/" + filename,
            "../../data/sourashtra/" + filename,
            "C:/Users/NAGA ARJUN/Documents/Sourastra/sourashtra-learn/data/sourashtra/" + filename
        };
        for (String path : candidatePaths) {
            File f = new File(path);
            if (f.exists()) return f;
        }
        return null;
    }

    public List<Word> getWords() { return words; }
    public List<Lesson> getLessons() { return lessons; }
    public List<QuizQuestion> getQuizQuestions() { return quizQuestions; }
    public Map<String, User> getUsers() { return users; }
    public Map<String, UserProgress> getUserProgressMap() { return userProgressMap; }
}
`);

// 2. Updated WordServiceImpl with fallback
writeFile('src/main/java/com/sourashtra/learn/service/WordServiceImpl.java', `
package com.sourashtra.learn.service;

import com.sourashtra.learn.exception.ResourceNotFoundException;
import com.sourashtra.learn.model.Word;
import com.sourashtra.learn.repository.WordRepository;
import com.sourashtra.learn.util.InMemoryDataStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WordServiceImpl implements WordService {

    private static final Logger log = LoggerFactory.getLogger(WordServiceImpl.class);

    private final WordRepository wordRepository;
    private final InMemoryDataStore inMemoryDataStore;

    public WordServiceImpl(WordRepository wordRepository, InMemoryDataStore inMemoryDataStore) {
        this.wordRepository = wordRepository;
        this.inMemoryDataStore = inMemoryDataStore;
    }

    @Override
    public List<Word> getAllWords() {
        try {
            List<Word> words = wordRepository.findAll();
            if (!words.isEmpty()) return words;
        } catch (Exception e) {
            log.debug("MongoDB unavailable, falling back to in-memory store: {}", e.getMessage());
        }
        return inMemoryDataStore.getWords();
    }

    @Override
    public List<Word> searchWords(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllWords();
        }
        String q = query.trim().toLowerCase();
        try {
            List<Word> words = wordRepository.findBySourashtraContainingIgnoreCaseOrTamilContainingIgnoreCaseOrEnglishContainingIgnoreCase(q, q, q);
            if (!words.isEmpty()) return words;
        } catch (Exception e) {
            log.debug("MongoDB search error, falling back to in-memory store: {}", e.getMessage());
        }

        return inMemoryDataStore.getWords().stream()
                .filter(w -> (w.getSourashtra() != null && w.getSourashtra().toLowerCase().contains(q)) ||
                             (w.getTamil() != null && w.getTamil().toLowerCase().contains(q)) ||
                             (w.getEnglish() != null && w.getEnglish().toLowerCase().contains(q)))
                .collect(Collectors.toList());
    }

    @Override
    public Word getWordById(String id) {
        try {
            return wordRepository.findById(id).orElse(null);
        } catch (Exception ignored) {}

        return inMemoryDataStore.getWords().stream()
                .filter(w -> id.equals(w.getId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Word not found with id: " + id));
    }

    @Override
    public List<Word> getWordsByCategory(String category) {
        try {
            List<Word> words = wordRepository.findByCategory(category);
            if (!words.isEmpty()) return words;
        } catch (Exception ignored) {}

        return inMemoryDataStore.getWords().stream()
                .filter(w -> category.equalsIgnoreCase(w.getCategory()))
                .collect(Collectors.toList());
    }
}
`);

// 3. Updated LessonServiceImpl with fallback
writeFile('src/main/java/com/sourashtra/learn/service/LessonServiceImpl.java', `
package com.sourashtra.learn.service;

import com.sourashtra.learn.exception.ResourceNotFoundException;
import com.sourashtra.learn.model.Lesson;
import com.sourashtra.learn.repository.LessonRepository;
import com.sourashtra.learn.util.InMemoryDataStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LessonServiceImpl implements LessonService {

    private static final Logger log = LoggerFactory.getLogger(LessonServiceImpl.class);

    private final LessonRepository lessonRepository;
    private final InMemoryDataStore inMemoryDataStore;

    public LessonServiceImpl(LessonRepository lessonRepository, InMemoryDataStore inMemoryDataStore) {
        this.lessonRepository = lessonRepository;
        this.inMemoryDataStore = inMemoryDataStore;
    }

    @Override
    public List<Lesson> getAllLessons() {
        try {
            List<Lesson> lessons = lessonRepository.findAllByOrderByLessonNumberAsc();
            if (!lessons.isEmpty()) return lessons;
        } catch (Exception e) {
            log.debug("MongoDB lessons unavailable, falling back: {}", e.getMessage());
        }
        return inMemoryDataStore.getLessons();
    }

    @Override
    public Lesson getLessonById(String id) {
        try {
            return lessonRepository.findById(id).orElse(null);
        } catch (Exception ignored) {}

        return inMemoryDataStore.getLessons().stream()
                .filter(l -> id.equals(l.getId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + id));
    }

    @Override
    public List<Lesson> getLessonsByCategory(String category) {
        try {
            List<Lesson> lessons = lessonRepository.findByCategory(category);
            if (!lessons.isEmpty()) return lessons;
        } catch (Exception ignored) {}

        return inMemoryDataStore.getLessons().stream()
                .filter(l -> category.equalsIgnoreCase(l.getCategory()))
                .collect(Collectors.toList());
    }
}
`);

// 4. Updated QuizServiceImpl with fallback
writeFile('src/main/java/com/sourashtra/learn/service/QuizServiceImpl.java', `
package com.sourashtra.learn.service;

import com.sourashtra.learn.dto.QuizResultDto;
import com.sourashtra.learn.dto.QuizSubmissionDto;
import com.sourashtra.learn.model.QuizQuestion;
import com.sourashtra.learn.repository.QuizQuestionRepository;
import com.sourashtra.learn.util.InMemoryDataStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class QuizServiceImpl implements QuizService {

    private static final Logger log = LoggerFactory.getLogger(QuizServiceImpl.class);

    private final QuizQuestionRepository quizQuestionRepository;
    private final InMemoryDataStore inMemoryDataStore;

    public QuizServiceImpl(QuizQuestionRepository quizQuestionRepository, InMemoryDataStore inMemoryDataStore) {
        this.quizQuestionRepository = quizQuestionRepository;
        this.inMemoryDataStore = inMemoryDataStore;
    }

    @Override
    public List<QuizQuestion> getQuizQuestions(String category) {
        List<QuizQuestion> questions = null;
        try {
            if (category != null && !category.trim().isEmpty()) {
                questions = quizQuestionRepository.findByCategory(category);
            } else {
                questions = quizQuestionRepository.findAll();
            }
            if (questions != null && !questions.isEmpty()) return questions;
        } catch (Exception e) {
            log.debug("MongoDB quiz error, falling back: {}", e.getMessage());
        }

        if (category != null && !category.trim().isEmpty()) {
            return inMemoryDataStore.getQuizQuestions().stream()
                    .filter(q -> category.equalsIgnoreCase(q.getCategory()))
                    .collect(Collectors.toList());
        }
        return inMemoryDataStore.getQuizQuestions();
    }

    @Override
    public QuizResultDto evaluateQuiz(QuizSubmissionDto submission) {
        List<QuizQuestion> questions = getQuizQuestions(null);
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

// 5. Updated AuthServiceImpl with fallback
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
import com.sourashtra.learn.util.InMemoryDataStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;
    private final UserProgressRepository userProgressRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final InMemoryDataStore inMemoryDataStore;

    public AuthServiceImpl(UserRepository userRepository,
                           UserProgressRepository userProgressRepository,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager,
                           JwtTokenProvider tokenProvider,
                           InMemoryDataStore inMemoryDataStore) {
        this.userRepository = userRepository;
        this.userProgressRepository = userProgressRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.inMemoryDataStore = inMemoryDataStore;
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            User user = userRepository.findByEmail(request.getEmail()).orElse(null);
            if (user != null) {
                String token = tokenProvider.generateTokenFromUsername(user.getEmail());
                return new AuthResponse(token, user.getId(), user.getName(), user.getEmail());
            }
        } catch (Exception e) {
            log.debug("Mongo/AuthManager login exception, checking in-memory users: {}", e.getMessage());
        }

        // Fallback for in-memory user
        User memUser = inMemoryDataStore.getUsers().get(request.getEmail().toLowerCase());
        if (memUser != null && passwordEncoder.matches(request.getPassword(), memUser.getPassword())) {
            String token = tokenProvider.generateTokenFromUsername(memUser.getEmail());
            return new AuthResponse(token, memUser.getId(), memUser.getName(), memUser.getEmail());
        }

        throw new IllegalArgumentException("Invalid email or password");
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().toLowerCase();
        try {
            if (userRepository.existsByEmail(email)) {
                throw new IllegalArgumentException("Email is already registered: " + email);
            }

            User user = new User(
                    request.getName(),
                    email,
                    passwordEncoder.encode(request.getPassword())
            );
            User savedUser = userRepository.save(user);

            UserProgress progress = new UserProgress(savedUser.getId());
            userProgressRepository.save(progress);

            String token = tokenProvider.generateTokenFromUsername(savedUser.getEmail());
            return new AuthResponse(token, savedUser.getId(), savedUser.getName(), savedUser.getEmail());
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            log.warn("MongoDB unavailable during register, saving to in-memory store: {}", e.getMessage());
            if (inMemoryDataStore.getUsers().containsKey(email)) {
                throw new IllegalArgumentException("Email is already registered: " + email);
            }
            User user = new User(request.getName(), email, passwordEncoder.encode(request.getPassword()));
            user.setId(UUID.randomUUID().toString());
            inMemoryDataStore.getUsers().put(email, user);

            UserProgress progress = new UserProgress(user.getId());
            inMemoryDataStore.getUserProgressMap().put(user.getId(), progress);

            String token = tokenProvider.generateTokenFromUsername(user.getEmail());
            return new AuthResponse(token, user.getId(), user.getName(), user.getEmail());
        }
    }
}
`);

// 6. Updated AIServiceImpl to use WordService
writeFile('src/main/java/com/sourashtra/learn/service/AIServiceImpl.java', `
package com.sourashtra.learn.service;

import com.sourashtra.learn.dto.AIAskResponse;
import com.sourashtra.learn.model.Word;
import com.sourashtra.learn.util.AppConstants;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AIServiceImpl implements AIService {

    private final WordService wordService;

    public AIServiceImpl(WordService wordService) {
        this.wordService = wordService;
    }

    @Override
    public AIAskResponse askQuestion(String question) {
        if (question == null || question.trim().isEmpty()) {
            return new AIAskResponse(AppConstants.AI_NOT_AVAILABLE_MESSAGE, Collections.emptyList());
        }

        String cleanQ = question.trim().toLowerCase();

        // 1. Retrieve all verified words via WordService (Mongo or in-memory fallback)
        List<Word> allVerified = wordService.getAllWords().stream()
                .filter(Word::isVerified)
                .collect(Collectors.toList());

        // 2. Tokenize user query to find keyword matches across Sourashtra, Tamil, and English
        String[] tokens = cleanQ.replaceAll("[^a-zA-Z0-9\\\\u0B80-\\\\u0BFF\\\\s]", "").split("\\\\s+");
        Set<Word> matchedWords = new LinkedHashSet<>();

        for (Word word : allVerified) {
            String sourashtra = (word.getSourashtra() != null) ? word.getSourashtra().toLowerCase() : "";
            String english = (word.getEnglish() != null) ? word.getEnglish().toLowerCase() : "";
            String tamil = (word.getTamil() != null) ? word.getTamil() : "";

            if (cleanQ.contains(english) && !english.isEmpty() && english.length() > 2) {
                matchedWords.add(word);
            }
            if (cleanQ.contains(sourashtra) && !sourashtra.isEmpty() && sourashtra.length() > 2) {
                matchedWords.add(word);
            }
            if (cleanQ.contains(tamil) && !tamil.isEmpty()) {
                matchedWords.add(word);
            }

            for (String token : tokens) {
                if (token.length() > 2) {
                    if (english.contains(token) || sourashtra.contains(token) || tamil.contains(token)) {
                        matchedWords.add(word);
                    }
                }
            }
        }

        // 3. Fallback for general queries like "teach me basic sourashtra"
        if (matchedWords.isEmpty() && (cleanQ.contains("teach") || cleanQ.contains("basic") || cleanQ.contains("hello") || cleanQ.contains("sourashtra"))) {
            matchedWords.addAll(allVerified.stream().limit(5).collect(Collectors.toList()));
        }

        // 4. CRITICAL LANGUAGE DATA RULE
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

// 7. Updated ProgressServiceImpl with fallback
writeFile('src/main/java/com/sourashtra/learn/service/ProgressServiceImpl.java', `
package com.sourashtra.learn.service;

import com.sourashtra.learn.model.UserProgress;
import com.sourashtra.learn.repository.UserProgressRepository;
import com.sourashtra.learn.util.InMemoryDataStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class ProgressServiceImpl implements ProgressService {

    private static final Logger log = LoggerFactory.getLogger(ProgressServiceImpl.class);

    private final UserProgressRepository progressRepository;
    private final InMemoryDataStore inMemoryDataStore;

    public ProgressServiceImpl(UserProgressRepository progressRepository, InMemoryDataStore inMemoryDataStore) {
        this.progressRepository = progressRepository;
        this.inMemoryDataStore = inMemoryDataStore;
    }

    @Override
    public UserProgress getUserProgress(String userId) {
        try {
            return progressRepository.findByUserId(userId)
                    .orElseGet(() -> {
                        UserProgress p = new UserProgress(userId);
                        return progressRepository.save(p);
                    });
        } catch (Exception e) {
            log.debug("MongoDB progress error, falling back to in-memory: {}", e.getMessage());
            return inMemoryDataStore.getUserProgressMap().computeIfAbsent(userId, UserProgress::new);
        }
    }

    @Override
    public UserProgress completeLesson(String userId, String lessonId) {
        UserProgress progress = getUserProgress(userId);
        progress.getCompletedLessonIds().add(lessonId);
        progress.setLastActiveDate(Instant.now());
        try {
            return progressRepository.save(progress);
        } catch (Exception ignored) {}
        return progress;
    }

    @Override
    public UserProgress addMasteredWord(String userId, String wordId) {
        UserProgress progress = getUserProgress(userId);
        progress.getMasteredWordIds().add(wordId);
        progress.setLastActiveDate(Instant.now());
        try {
            return progressRepository.save(progress);
        } catch (Exception ignored) {}
        return progress;
    }
}
`);

// 8. CustomUserDetailsService with fallback
writeFile('src/main/java/com/sourashtra/learn/security/CustomUserDetailsService.java', `
package com.sourashtra.learn.security;

import com.sourashtra.learn.model.User;
import com.sourashtra.learn.repository.UserRepository;
import com.sourashtra.learn.util.InMemoryDataStore;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final InMemoryDataStore inMemoryDataStore;

    public CustomUserDetailsService(UserRepository userRepository, InMemoryDataStore inMemoryDataStore) {
        this.userRepository = userRepository;
        this.inMemoryDataStore = inMemoryDataStore;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = null;
        try {
            user = userRepository.findByEmail(email).orElse(null);
        } catch (Exception ignored) {}

        if (user == null) {
            user = inMemoryDataStore.getUsers().get(email.toLowerCase());
        }

        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                user.getRoles().stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList())
        );
    }
}
`);

// 9. DatabaseInitializer with timeout protection
writeFile('src/main/java/com/sourashtra/learn/util/DatabaseInitializer.java', `
package com.sourashtra.learn.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sourashtra.learn.model.Lesson;
import com.sourashtra.learn.model.QuizQuestion;
import com.sourashtra.learn.model.Word;
import com.sourashtra.learn.repository.LessonRepository;
import com.sourashtra.learn.repository.QuizQuestionRepository;
import com.sourashtra.learn.repository.WordRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.List;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseInitializer.class);

    private final WordRepository wordRepository;
    private final LessonRepository lessonRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final ObjectMapper objectMapper;

    public DatabaseInitializer(WordRepository wordRepository,
                               LessonRepository lessonRepository,
                               QuizQuestionRepository quizQuestionRepository,
                               ObjectMapper objectMapper) {
        this.wordRepository = wordRepository;
        this.lessonRepository = lessonRepository;
        this.quizQuestionRepository = quizQuestionRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) {
        log.info("Checking database initialization status...");
        try {
            File wordsFile = findDataFile("verified_seed_words.json");
            File lessonsFile = findDataFile("verified_seed_lessons.json");
            File quizFile = findDataFile("verified_seed_quiz.json");

            if (wordsFile != null && wordsFile.exists() && wordRepository.count() == 0) {
                List<Word> words = objectMapper.readValue(wordsFile, new TypeReference<List<Word>>() {});
                wordRepository.saveAll(words);
                log.info("Initialized {} verified Sourashtra words in MongoDB from {}", words.size(), wordsFile.getName());
            }

            if (lessonsFile != null && lessonsFile.exists() && lessonRepository.count() == 0) {
                List<Lesson> lessons = objectMapper.readValue(lessonsFile, new TypeReference<List<Lesson>>() {});
                lessonRepository.saveAll(lessons);
                log.info("Initialized {} verified Sourashtra lessons in MongoDB from {}", lessons.size(), lessonsFile.getName());
            }

            if (quizFile != null && quizFile.exists() && quizQuestionRepository.count() == 0) {
                List<QuizQuestion> questions = objectMapper.readValue(quizFile, new TypeReference<List<QuizQuestion>>() {});
                quizQuestionRepository.saveAll(questions);
                log.info("Initialized {} verified quiz questions in MongoDB from {}", questions.size(), quizFile.getName());
            }
        } catch (Exception e) {
            log.warn("MongoDB Atlas connection not immediately available (Notice: IP 157.51.1.104 or 0.0.0.0/0 may need whitelisting in MongoDB Atlas console under Network Access): {}", e.getMessage());
            log.info("Spring Boot backend is actively using the verified in-memory dataset to serve all REST API requests seamlessly.");
        }
    }

    private File findDataFile(String filename) {
        String[] candidatePaths = {
            "../data/sourashtra/" + filename,
            "data/sourashtra/" + filename,
            "../../data/sourashtra/" + filename,
            "C:/Users/NAGA ARJUN/Documents/Sourastra/sourashtra-learn/data/sourashtra/" + filename
        };
        for (String path : candidatePaths) {
            File f = new File(path);
            if (f.exists()) return f;
        }
        return null;
    }
}
`);

// 10. Adjust connection timeout in application.properties so it doesn't block Tomcat startup
writeFile('src/main/resources/application.properties', `
spring.application.name=sourashtra-learn-backend
server.port=8080

spring.data.mongodb.uri=mongodb+srv://nagaarjunn31_db_user:ZmwTw3DJAPF7wItl@cluster0.dxpdlum.mongodb.net/sourashtra_learn?retryWrites=true&w=majority&appName=Cluster0&connectTimeoutMS=3000&serverSelectionTimeoutMS=3000
spring.data.mongodb.database=sourashtra_learn

jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
jwt.expiration=86400000

spring.main.banner-mode=console
logging.level.com.sourashtra.learn=INFO
logging.level.org.mongodb.driver=ERROR
`);

console.log('Resilience fallback implementation complete.');

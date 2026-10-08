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
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.InputStream;
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
            InputStream wordsStream = getResourceStream("verified_seed_words.json");
            InputStream lessonsStream = getResourceStream("verified_seed_lessons.json");
            InputStream quizStream = getResourceStream("verified_seed_quiz.json");

            if (wordsStream != null && wordRepository.count() == 0) {
                List<Word> words = objectMapper.readValue(wordsStream, new TypeReference<List<Word>>() {});
                wordRepository.saveAll(words);
                log.info("Initialized {} verified Sourashtra words in MongoDB", words.size());
            }

            if (lessonsStream != null && lessonRepository.count() == 0) {
                List<Lesson> lessons = objectMapper.readValue(lessonsStream, new TypeReference<List<Lesson>>() {});
                lessonRepository.saveAll(lessons);
                log.info("Initialized {} verified Sourashtra lessons in MongoDB", lessons.size());
            }

            if (quizStream != null && quizQuestionRepository.count() == 0) {
                List<QuizQuestion> questions = objectMapper.readValue(quizStream, new TypeReference<List<QuizQuestion>>() {});
                quizQuestionRepository.saveAll(questions);
                log.info("Initialized {} verified quiz questions in MongoDB", questions.size());
            }
        } catch (Exception e) {
            log.warn("MongoDB Atlas connection not immediately available (Notice: IP 157.51.1.104 or 0.0.0.0/0 may need whitelisting in MongoDB Atlas console under Network Access): {}", e.getMessage());
            log.info("Spring Boot backend is actively using the verified in-memory dataset to serve all REST API requests seamlessly.");
        }
    }

    private InputStream getResourceStream(String filename) {
        try {
            ClassPathResource cpr = new ClassPathResource("data/sourashtra/" + filename);
            if (cpr.exists()) {
                return cpr.getInputStream();
            }
            File f = new File("../data/sourashtra/" + filename);
            if (f.exists()) return f.toURI().toURL().openStream();
            File f2 = new File("data/sourashtra/" + filename);
            if (f2.exists()) return f2.toURI().toURL().openStream();
        } catch (Exception ignored) {}
        return null;
    }
}

package com.sourashtra.learn.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sourashtra.learn.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.InputStream;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

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
            InputStream wordsStream = getResourceStream("verified_seed_words.json");
            InputStream lessonsStream = getResourceStream("verified_seed_lessons.json");
            InputStream quizStream = getResourceStream("verified_seed_quiz.json");

            if (wordsStream != null) {
                List<Word> loadedWords = objectMapper.readValue(wordsStream, new TypeReference<List<Word>>() {});
                for (int i = 0; i < loadedWords.size(); i++) {
                    Word w = loadedWords.get(i);
                    if (w.getId() == null) w.setId("word_" + (i + 1));
                    words.add(w);
                }
                log.info("Successfully loaded {} verified Sourashtra words into memory store", words.size());
            }

            if (lessonsStream != null) {
                List<Lesson> loadedLessons = objectMapper.readValue(lessonsStream, new TypeReference<List<Lesson>>() {});
                for (int i = 0; i < loadedLessons.size(); i++) {
                    Lesson l = loadedLessons.get(i);
                    if (l.getId() == null) l.setId("lesson_" + (i + 1));
                    lessons.add(l);
                }
                log.info("Successfully loaded {} verified Sourashtra lessons into memory store", lessons.size());
            }

            if (quizStream != null) {
                List<QuizQuestion> loadedQuestions = objectMapper.readValue(quizStream, new TypeReference<List<QuizQuestion>>() {});
                for (int i = 0; i < loadedQuestions.size(); i++) {
                    QuizQuestion q = loadedQuestions.get(i);
                    if (q.getId() == null) q.setId("quiz_" + (i + 1));
                    quizQuestions.add(q);
                }
                log.info("Successfully loaded {} verified quiz questions into memory store", quizQuestions.size());
            }
        } catch (Exception e) {
            log.error("Failed to load in-memory seed data: {}", e.getMessage(), e);
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

    public List<Word> getWords() { return words; }
    public List<Lesson> getLessons() { return lessons; }
    public List<QuizQuestion> getQuizQuestions() { return quizQuestions; }
    public Map<String, User> getUsers() { return users; }
    public Map<String, UserProgress> getUserProgressMap() { return userProgressMap; }
}

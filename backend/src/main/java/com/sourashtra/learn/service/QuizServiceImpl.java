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

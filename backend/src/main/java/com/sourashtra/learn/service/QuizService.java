package com.sourashtra.learn.service;

import com.sourashtra.learn.dto.QuizResultDto;
import com.sourashtra.learn.dto.QuizSubmissionDto;
import com.sourashtra.learn.model.QuizQuestion;
import java.util.List;

public interface QuizService {
    List<QuizQuestion> getQuizQuestions(String category);
    QuizResultDto evaluateQuiz(QuizSubmissionDto submission);
}

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

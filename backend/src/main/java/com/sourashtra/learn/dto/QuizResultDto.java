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

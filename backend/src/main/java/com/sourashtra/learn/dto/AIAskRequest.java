package com.sourashtra.learn.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AIAskRequest {

    private String question;
    private String prompt;
    private String text;

    public AIAskRequest() {}

    public AIAskRequest(String question) {
        this.question = question;
    }

    public String getQuestion() {
        if (question != null && !question.trim().isEmpty()) return question;
        if (prompt != null && !prompt.trim().isEmpty()) return prompt;
        if (text != null && !text.trim().isEmpty()) return text;
        return "";
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}

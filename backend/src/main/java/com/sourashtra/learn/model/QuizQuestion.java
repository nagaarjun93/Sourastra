package com.sourashtra.learn.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "quiz_questions")
@JsonIgnoreProperties(ignoreUnknown = true)
public class QuizQuestion {

    @Id
    private String id;
    private String type;
    private String question;
    private String questionTamil;
    private List<String> options = new ArrayList<>();
    private Integer correctOptionIndex;
    private String correctAnswer;
    private String category;
    private String tamilHint;
    private String explanation;
    private String source;
    private Integer sourcePage;
    private String wordId;
    private boolean verified;

    public QuizQuestion() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getQuestionTamil() { return questionTamil; }
    public void setQuestionTamil(String questionTamil) { this.questionTamil = questionTamil; }

    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }

    public Integer getCorrectOptionIndex() { return correctOptionIndex; }
    public void setCorrectOptionIndex(Integer correctOptionIndex) { this.correctOptionIndex = correctOptionIndex; }

    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getTamilHint() { return tamilHint; }
    public void setTamilHint(String tamilHint) { this.tamilHint = tamilHint; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public Integer getSourcePage() { return sourcePage; }
    public void setSourcePage(Integer sourcePage) { this.sourcePage = sourcePage; }

    public String getWordId() { return wordId; }
    public void setWordId(String wordId) { this.wordId = wordId; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
}

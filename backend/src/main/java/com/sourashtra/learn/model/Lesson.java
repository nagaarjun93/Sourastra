package com.sourashtra.learn.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "lessons")
public class Lesson {
    @Id
    private String id;
    private int lessonNumber;
    private String title;
    private String titleTamil;
    private String description;
    private String category;
    private List<String> wordIds = new ArrayList<>();
    private String source;
    private Integer sourcePage;
    private boolean verified;

    public Lesson() {}

    public Lesson(int lessonNumber, String title, String titleTamil, String description, String category, String source, Integer sourcePage, boolean verified) {
        this.lessonNumber = lessonNumber;
        this.title = title;
        this.titleTamil = titleTamil;
        this.description = description;
        this.category = category;
        this.source = source;
        this.sourcePage = sourcePage;
        this.verified = verified;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public int getLessonNumber() { return lessonNumber; }
    public void setLessonNumber(int lessonNumber) { this.lessonNumber = lessonNumber; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getTitleTamil() { return titleTamil; }
    public void setTitleTamil(String titleTamil) { this.titleTamil = titleTamil; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public List<String> getWordIds() { return wordIds; }
    public void setWordIds(List<String> wordIds) { this.wordIds = wordIds; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public Integer getSourcePage() { return sourcePage; }
    public void setSourcePage(Integer sourcePage) { this.sourcePage = sourcePage; }
    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
}

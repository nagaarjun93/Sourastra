package com.sourashtra.learn.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Document(collection = "user_progress")
public class UserProgress {
    @Id
    private String id;

    @Indexed(unique = true)
    private String userId;

    private Set<String> completedLessonIds = new HashSet<>();
    private Set<String> masteredWordIds = new HashSet<>();
    private Map<String, Integer> quizScores = new HashMap<>();
    private int streakDays = 1;
    private long lastActiveDate = System.currentTimeMillis();

    public UserProgress() {}
    public UserProgress(String userId) {
        this.userId = userId;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public Set<String> getCompletedLessonIds() { return completedLessonIds; }
    public void setCompletedLessonIds(Set<String> completedLessonIds) { this.completedLessonIds = completedLessonIds; }
    public Set<String> getMasteredWordIds() { return masteredWordIds; }
    public void setMasteredWordIds(Set<String> masteredWordIds) { this.masteredWordIds = masteredWordIds; }
    public Map<String, Integer> getQuizScores() { return quizScores; }
    public void setQuizScores(Map<String, Integer> quizScores) { this.quizScores = quizScores; }
    public int getStreakDays() { return streakDays; }
    public void setStreakDays(int streakDays) { this.streakDays = streakDays; }
    public long getLastActiveDate() { return lastActiveDate; }
    public void setLastActiveDate(long lastActiveDate) { this.lastActiveDate = lastActiveDate; }
}

const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const javaDir = path.join(baseDir, 'src/main/java/com/sourashtra/learn');
const resourcesDir = path.join(baseDir, 'src/main/resources');

function writeFile(relPath, content) {
    const fullPath = path.isAbsolute(relPath) ? relPath : path.join(baseDir, relPath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
    console.log('Wrote:', path.relative(baseDir, fullPath), `(${Buffer.byteLength(content, 'utf8')} bytes)`);
}

// 1. application.properties
writeFile('src/main/resources/application.properties', `
spring.application.name=sourashtra-learn-backend
server.port=8080

spring.data.mongodb.uri=mongodb+srv://nagaarjunn31_db_user:ZmwTw3DJAPF7wItl@cluster0.dxpdlum.mongodb.net/sourashtra_learn?retryWrites=true&w=majority&appName=Cluster0
spring.data.mongodb.database=sourashtra_learn

jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
jwt.expiration=86400000

spring.main.banner-mode=console
logging.level.com.sourashtra.learn=INFO
`);

// 2. Models
writeFile('src/main/java/com/sourashtra/learn/model/Word.java', `
package com.sourashtra.learn.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "sourashtra_words")
public class Word {
    @Id
    private String id;

    @Indexed
    private String sourashtra;

    @Indexed
    private String tamil;

    @Indexed
    private String english;

    private String pronunciation;

    @Indexed
    private String category;

    private List<Example> examples = new ArrayList<>();
    private String source;
    private Integer sourcePage;
    private boolean verified;

    public Word() {}

    public Word(String sourashtra, String tamil, String english, String pronunciation, String category, String source, Integer sourcePage, boolean verified) {
        this.sourashtra = sourashtra;
        this.tamil = tamil;
        this.english = english;
        this.pronunciation = pronunciation;
        this.category = category;
        this.source = source;
        this.sourcePage = sourcePage;
        this.verified = verified;
    }

    public static class Example {
        private String sourashtra;
        private String tamil;
        private String english;

        public Example() {}
        public Example(String sourashtra, String tamil, String english) {
            this.sourashtra = sourashtra;
            this.tamil = tamil;
            this.english = english;
        }

        public String getSourashtra() { return sourashtra; }
        public void setSourashtra(String sourashtra) { this.sourashtra = sourashtra; }
        public String getTamil() { return tamil; }
        public void setTamil(String tamil) { this.tamil = tamil; }
        public String getEnglish() { return english; }
        public void setEnglish(String english) { this.english = english; }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getSourashtra() { return sourashtra; }
    public void setSourashtra(String sourashtra) { this.sourashtra = sourashtra; }
    public String getTamil() { return tamil; }
    public void setTamil(String tamil) { this.tamil = tamil; }
    public String getEnglish() { return english; }
    public void setEnglish(String english) { this.english = english; }
    public String getPronunciation() { return pronunciation; }
    public void setPronunciation(String pronunciation) { this.pronunciation = pronunciation; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public List<Example> getExamples() { return examples; }
    public void setExamples(List<Example> examples) { this.examples = examples; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public Integer getSourcePage() { return sourcePage; }
    public void setSourcePage(Integer sourcePage) { this.sourcePage = sourcePage; }
    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
}
`);

writeFile('src/main/java/com/sourashtra/learn/model/Lesson.java', `
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
`);

writeFile('src/main/java/com/sourashtra/learn/model/QuizQuestion.java', `
package com.sourashtra.learn.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "quiz_questions")
public class QuizQuestion {
    @Id
    private String id;
    private String question;
    private String questionTamil;
    private List<String> options = new ArrayList<>();
    private int correctOptionIndex;
    private String explanation;
    private String category;
    private String source;
    private Integer sourcePage;
    private boolean verified;

    public QuizQuestion() {}

    public QuizQuestion(String question, String questionTamil, List<String> options, int correctOptionIndex, String explanation, String category, String source, Integer sourcePage, boolean verified) {
        this.question = question;
        this.questionTamil = questionTamil;
        this.options = options;
        this.correctOptionIndex = correctOptionIndex;
        this.explanation = explanation;
        this.category = category;
        this.source = source;
        this.sourcePage = sourcePage;
        this.verified = verified;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public String getQuestionTamil() { return questionTamil; }
    public void setQuestionTamil(String questionTamil) { this.questionTamil = questionTamil; }
    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }
    public int getCorrectOptionIndex() { return correctOptionIndex; }
    public void setCorrectOptionIndex(int correctOptionIndex) { this.correctOptionIndex = correctOptionIndex; }
    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public Integer getSourcePage() { return sourcePage; }
    public void setSourcePage(Integer sourcePage) { this.sourcePage = sourcePage; }
    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
}
`);

writeFile('src/main/java/com/sourashtra/learn/model/User.java', `
package com.sourashtra.learn.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;

    @Indexed(unique = true)
    private String email;
    private String password;
    private Set<String> roles = new HashSet<>();
    private Instant createdAt = Instant.now();

    public User() {}

    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.roles.add("ROLE_USER");
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
`);

writeFile('src/main/java/com/sourashtra/learn/model/UserProgress.java', `
package com.sourashtra.learn.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
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
    private Instant lastActiveDate = Instant.now();

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
    public Instant getLastActiveDate() { return lastActiveDate; }
    public void setLastActiveDate(Instant lastActiveDate) { this.lastActiveDate = lastActiveDate; }
}
`);

console.log('Models generation finished.');

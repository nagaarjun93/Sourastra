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

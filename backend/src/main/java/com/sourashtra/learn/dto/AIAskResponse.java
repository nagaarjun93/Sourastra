package com.sourashtra.learn.dto;

import java.util.ArrayList;
import java.util.List;

public class AIAskResponse {
    private String answer;
    private List<SourceRef> sources = new ArrayList<>();

    public AIAskResponse() {}
    public AIAskResponse(String answer, List<SourceRef> sources) {
        this.answer = answer;
        this.sources = sources != null ? sources : new ArrayList<>();
    }

    public static class SourceRef {
        private String source;
        private Integer sourcePage;

        public SourceRef() {}
        public SourceRef(String source, Integer sourcePage) {
            this.source = source;
            this.sourcePage = sourcePage;
        }

        public String getSource() { return source; }
        public void setSource(String source) { this.source = source; }
        public Integer getSourcePage() { return sourcePage; }
        public void setSourcePage(Integer sourcePage) { this.sourcePage = sourcePage; }
    }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
    public List<SourceRef> getSources() { return sources; }
    public void setSources(List<SourceRef> sources) { this.sources = sources; }
}

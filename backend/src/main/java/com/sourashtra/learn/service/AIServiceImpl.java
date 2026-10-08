package com.sourashtra.learn.service;

import com.sourashtra.learn.dto.AIAskResponse;
import com.sourashtra.learn.model.Word;
import com.sourashtra.learn.util.AppConstants;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class AIServiceImpl implements AIService {

    private final WordService wordService;

    public AIServiceImpl(WordService wordService) {
        this.wordService = wordService;
    }

    @Override
    public AIAskResponse askQuestion(String question) {
        if (question == null || question.trim().isEmpty()) {
            return new AIAskResponse(AppConstants.AI_NOT_AVAILABLE_MESSAGE, Collections.emptyList());
        }

        String cleanQ = question.trim().toLowerCase();

        // 1. Retrieve all verified words
        List<Word> allVerified = wordService.getAllWords().stream()
                .filter(Word::isVerified)
                .collect(Collectors.toList());

        // 2. Strict matching against verified knowledge (Exact word boundary & Tamil script)
        Set<Word> matchedWords = new LinkedHashSet<>();

        for (Word word : allVerified) {
            String sourashtra = (word.getSourashtra() != null) ? word.getSourashtra().toLowerCase().trim() : "";
            String english = (word.getEnglish() != null) ? word.getEnglish().toLowerCase().trim() : "";
            String tamil = (word.getTamil() != null) ? word.getTamil().trim() : "";

            boolean matchFound = false;

            // English match (whole word boundary)
            if (!english.isEmpty()) {
                String[] englishParts = english.split("/");
                for (String part : englishParts) {
                    String cleanPart = part.trim().toLowerCase();
                    if (!cleanPart.isEmpty() && matchesWordBoundary(cleanQ, cleanPart)) {
                        matchedWords.add(word);
                        matchFound = true;
                        break;
                    }
                }
            }

            // Sourashtra match (whole word boundary)
            if (!matchFound && !sourashtra.isEmpty()) {
                if (matchesWordBoundary(cleanQ, sourashtra)) {
                    matchedWords.add(word);
                    matchFound = true;
                }
            }

            // Tamil match (Tamil characters substring)
            if (!matchFound && !tamil.isEmpty()) {
                if (cleanQ.contains(tamil)) {
                    matchedWords.add(word);
                }
            }
        }

        // 3. Foundation request: Only if user specifically asks to learn basic Sourashtra
        if (matchedWords.isEmpty() && (cleanQ.contains("basic sourashtra") || cleanQ.contains("teach me sourashtra") || cleanQ.contains("learn sourashtra") || cleanQ.equals("sourashtra"))) {
            matchedWords.addAll(allVerified.stream().limit(5).collect(Collectors.toList()));
        }

        // 4. CRITICAL LANGUAGE DATA RULE: If not available in verified knowledge, strictly refuse to hallucinate
        if (matchedWords.isEmpty()) {
            return new AIAskResponse(AppConstants.AI_NOT_AVAILABLE_MESSAGE, Collections.emptyList());
        }

        // 5. Construct authoritative response strictly citing verified records
        StringBuilder answerBuilder = new StringBuilder();
        List<AIAskResponse.SourceRef> sources = new ArrayList<>();
        Set<Integer> pages = new LinkedHashSet<>();

        answerBuilder.append("Based on the verified Sourashtra knowledge base:\n\n");

        for (Word w : matchedWords) {
            answerBuilder.append("• **Sourashtra:** ").append(w.getSourashtra()).append("\n");
            answerBuilder.append("  **Tamil:** ").append(w.getTamil()).append("\n");
            answerBuilder.append("  **English:** ").append(w.getEnglish()).append("\n");
            if (w.getPronunciation() != null && !w.getPronunciation().isEmpty()) {
                answerBuilder.append("  **Pronunciation:** ").append(w.getPronunciation()).append("\n");
            }
            if (w.getExamples() != null && !w.getExamples().isEmpty()) {
                Word.Example ex = w.getExamples().get(0);
                answerBuilder.append("  *Example:* ").append(ex.getSourashtra())
                        .append(" — ").append(ex.getTamil())
                        .append(" (").append(ex.getEnglish()).append(")\n");
            }
            answerBuilder.append("  *Source:* ").append(w.getSource()).append(" (Page ").append(w.getSourcePage()).append(")\n\n");

            if (w.getSourcePage() != null && !pages.contains(w.getSourcePage())) {
                pages.add(w.getSourcePage());
                sources.add(new AIAskResponse.SourceRef(w.getSource(), w.getSourcePage()));
            }
        }

        return new AIAskResponse(answerBuilder.toString().trim(), sources);
    }

    private boolean matchesWordBoundary(String text, String term) {
        String regex = "(?i).*\\b" + Pattern.quote(term) + "\\b.*";
        return text.matches(regex);
    }
}

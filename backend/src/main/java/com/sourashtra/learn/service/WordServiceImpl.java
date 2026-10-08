package com.sourashtra.learn.service;

import com.sourashtra.learn.exception.ResourceNotFoundException;
import com.sourashtra.learn.model.Word;
import com.sourashtra.learn.repository.WordRepository;
import com.sourashtra.learn.util.InMemoryDataStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WordServiceImpl implements WordService {

    private static final Logger log = LoggerFactory.getLogger(WordServiceImpl.class);

    private final WordRepository wordRepository;
    private final InMemoryDataStore inMemoryDataStore;

    public WordServiceImpl(WordRepository wordRepository, InMemoryDataStore inMemoryDataStore) {
        this.wordRepository = wordRepository;
        this.inMemoryDataStore = inMemoryDataStore;
    }

    @Override
    public List<Word> getAllWords() {
        try {
            List<Word> words = wordRepository.findAll();
            if (words != null && !words.isEmpty()) return words;
        } catch (Exception e) {
            log.debug("MongoDB unavailable, falling back to in-memory store: {}", e.getMessage());
        }
        return inMemoryDataStore.getWords();
    }

    @Override
    public List<Word> getAllVerifiedWords() {
        try {
            List<Word> words = wordRepository.findByVerifiedTrue();
            if (words != null && !words.isEmpty()) return words;
        } catch (Exception ignored) {}
        return inMemoryDataStore.getWords().stream()
                .filter(Word::isVerified)
                .collect(Collectors.toList());
    }

    @Override
    public Page<Word> getVerifiedWordsPaged(Pageable pageable) {
        try {
            Page<Word> page = wordRepository.findByVerifiedTrue(pageable);
            if (page != null && page.hasContent()) return page;
        } catch (Exception ignored) {}
        List<Word> verified = getAllVerifiedWords();
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), verified.size());
        List<Word> sublist = start <= end ? verified.subList(start, end) : List.of();
        return new PageImpl<>(sublist, pageable, verified.size());
    }

    @Override
    public List<Word> searchWords(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllWords();
        }
        String q = query.trim().toLowerCase();
        try {
            List<Word> words = wordRepository.findBySourashtraContainingIgnoreCaseOrTamilContainingIgnoreCaseOrEnglishContainingIgnoreCase(q, q, q);
            if (words != null && !words.isEmpty()) return words;
        } catch (Exception e) {
            log.debug("MongoDB search error, falling back to in-memory store: {}", e.getMessage());
        }

        return inMemoryDataStore.getWords().stream()
                .filter(w -> (w.getSourashtra() != null && w.getSourashtra().toLowerCase().contains(q)) ||
                             (w.getTamil() != null && w.getTamil().toLowerCase().contains(q)) ||
                             (w.getEnglish() != null && w.getEnglish().toLowerCase().contains(q)) ||
                             (w.getPronunciation() != null && w.getPronunciation().toLowerCase().contains(q)))
                .collect(Collectors.toList());
    }

    @Override
    public Word getWordById(String id) {
        try {
            return wordRepository.findById(id).orElse(null);
        } catch (Exception ignored) {}

        return inMemoryDataStore.getWords().stream()
                .filter(w -> id.equals(w.getId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Word not found with id: " + id));
    }

    @Override
    public List<Word> getWordsByCategory(String category) {
        try {
            List<Word> words = wordRepository.findByCategoryIgnoreCase(category);
            if (words != null && !words.isEmpty()) return words;
        } catch (Exception ignored) {}

        return inMemoryDataStore.getWords().stream()
                .filter(w -> category.equalsIgnoreCase(w.getCategory()))
                .collect(Collectors.toList());
    }
}

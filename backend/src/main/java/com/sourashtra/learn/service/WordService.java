package com.sourashtra.learn.service;

import com.sourashtra.learn.model.Word;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface WordService {
    List<Word> getAllWords();
    List<Word> getAllVerifiedWords();
    Page<Word> getVerifiedWordsPaged(Pageable pageable);
    List<Word> searchWords(String keyword);
    Word getWordById(String id);
    List<Word> getWordsByCategory(String category);
}

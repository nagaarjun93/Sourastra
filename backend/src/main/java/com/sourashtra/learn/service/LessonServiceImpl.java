package com.sourashtra.learn.service;

import com.sourashtra.learn.exception.ResourceNotFoundException;
import com.sourashtra.learn.model.Lesson;
import com.sourashtra.learn.repository.LessonRepository;
import com.sourashtra.learn.util.InMemoryDataStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LessonServiceImpl implements LessonService {

    private static final Logger log = LoggerFactory.getLogger(LessonServiceImpl.class);

    private final LessonRepository lessonRepository;
    private final InMemoryDataStore inMemoryDataStore;

    public LessonServiceImpl(LessonRepository lessonRepository, InMemoryDataStore inMemoryDataStore) {
        this.lessonRepository = lessonRepository;
        this.inMemoryDataStore = inMemoryDataStore;
    }

    @Override
    public List<Lesson> getAllLessons() {
        try {
            List<Lesson> lessons = lessonRepository.findAllByOrderByLessonNumberAsc();
            if (!lessons.isEmpty()) return lessons;
        } catch (Exception e) {
            log.debug("MongoDB lessons unavailable, falling back: {}", e.getMessage());
        }
        return inMemoryDataStore.getLessons();
    }

    @Override
    public Lesson getLessonById(String id) {
        try {
            return lessonRepository.findById(id).orElse(null);
        } catch (Exception ignored) {}

        return inMemoryDataStore.getLessons().stream()
                .filter(l -> id.equals(l.getId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + id));
    }

    @Override
    public List<Lesson> getLessonsByCategory(String category) {
        try {
            List<Lesson> lessons = lessonRepository.findByCategory(category);
            if (!lessons.isEmpty()) return lessons;
        } catch (Exception ignored) {}

        return inMemoryDataStore.getLessons().stream()
                .filter(l -> category.equalsIgnoreCase(l.getCategory()))
                .collect(Collectors.toList());
    }
}

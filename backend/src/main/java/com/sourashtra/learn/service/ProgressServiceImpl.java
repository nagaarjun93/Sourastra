package com.sourashtra.learn.service;

import com.sourashtra.learn.model.UserProgress;
import com.sourashtra.learn.repository.UserProgressRepository;
import com.sourashtra.learn.util.InMemoryDataStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;


@Service
public class ProgressServiceImpl implements ProgressService {

    private static final Logger log = LoggerFactory.getLogger(ProgressServiceImpl.class);

    private final UserProgressRepository progressRepository;
    private final InMemoryDataStore inMemoryDataStore;

    public ProgressServiceImpl(UserProgressRepository progressRepository, InMemoryDataStore inMemoryDataStore) {
        this.progressRepository = progressRepository;
        this.inMemoryDataStore = inMemoryDataStore;
    }

    @Override
    public UserProgress getUserProgress(String userId) {
        try {
            return progressRepository.findByUserId(userId)
                    .orElseGet(() -> {
                        UserProgress p = new UserProgress(userId);
                        return progressRepository.save(p);
                    });
        } catch (Exception e) {
            log.debug("MongoDB progress error, falling back to in-memory: {}", e.getMessage());
            return inMemoryDataStore.getUserProgressMap().computeIfAbsent(userId, UserProgress::new);
        }
    }

    @Override
    public UserProgress completeLesson(String userId, String lessonId) {
        UserProgress progress = getUserProgress(userId);
        progress.getCompletedLessonIds().add(lessonId);
        progress.setLastActiveDate(System.currentTimeMillis());
        try {
            return progressRepository.save(progress);
        } catch (Exception ignored) {}
        return progress;
    }

    @Override
    public UserProgress addMasteredWord(String userId, String wordId) {
        UserProgress progress = getUserProgress(userId);
        progress.getMasteredWordIds().add(wordId);
        progress.setLastActiveDate(System.currentTimeMillis());
        try {
            return progressRepository.save(progress);
        } catch (Exception ignored) {}
        return progress;
    }
}

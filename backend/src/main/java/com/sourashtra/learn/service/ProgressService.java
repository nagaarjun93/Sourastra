package com.sourashtra.learn.service;

import com.sourashtra.learn.model.UserProgress;

public interface ProgressService {
    UserProgress getUserProgress(String userId);
    UserProgress completeLesson(String userId, String lessonId);
    UserProgress addMasteredWord(String userId, String wordId);
}

package com.sourashtra.learn.service;

import com.sourashtra.learn.model.Lesson;
import java.util.List;

public interface LessonService {
    List<Lesson> getAllLessons();
    Lesson getLessonById(String id);
    List<Lesson> getLessonsByCategory(String category);
}

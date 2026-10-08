package com.sourashtra.learn.repository;

import com.sourashtra.learn.model.Lesson;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LessonRepository extends MongoRepository<Lesson, String> {
    List<Lesson> findAllByOrderByLessonNumberAsc();
    List<Lesson> findByCategory(String category);
    long count();
}

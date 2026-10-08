package com.sourashtra.learn.repository;

import com.sourashtra.learn.model.Word;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WordRepository extends MongoRepository<Word, String> {

    List<Word> findByVerifiedTrue();

    Page<Word> findByVerifiedTrue(Pageable pageable);

    List<Word> findByCategory(String category);

    List<Word> findByCategoryIgnoreCase(String category);

    List<Word> findByCategoryIgnoreCaseAndVerifiedTrue(String category);

    List<Word> findBySourashtraContainingIgnoreCaseOrTamilContainingIgnoreCaseOrEnglishContainingIgnoreCase(String sourashtra, String tamil, String english);

    @Query("{ 'verified': true, $or: [ " +
           "{ 'sourashtra': { $regex: ?0, $options: 'i' } }, " +
           "{ 'tamil': { $regex: ?0, $options: 'i' } }, " +
           "{ 'english': { $regex: ?0, $options: 'i' } }, " +
           "{ 'pronunciation': { $regex: ?0, $options: 'i' } } " +
           "] }")
    List<Word> searchWords(String keyword);
}

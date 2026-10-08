import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { AudioButton } from '../components/AudioButton';
import { ProgressService } from '../services/progressService';
import { getTanglish } from '../utils/tanglish';
import seedWords from '../data/verified_seed_words.json';

export default function QuizScreen({ route, navigation }: any) {
  const initialCat = route?.params?.category || 'All';
  const [selectedCategory, setSelectedCategory] = useState(initialCat);

  // Dynamically extract categories from seedWords
  const categories = useMemo(() => {
    const cats = new Set<string>();
    seedWords.forEach((w: any) => {
      if (w.category) cats.add(w.category.trim());
    });
    return ['All', ...Array.from(cats).sort()];
  }, []);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [showReview, setShowReview] = useState(false);

  // Generate dynamic quiz questions from local 1,024 dataset or backend
  const loadDynamicQuiz = (category: string) => {
    setIsLoading(true);
    setIsSubmitted(false);
    setSelectedAnswers({});
    setCurrentIndex(0);
    setShowReview(false);

    // Try backend API first
    const catQuery = category !== 'All' ? `&category=${encodeURIComponent(category)}` : '';
    fetch(`http://localhost:8080/api/quiz/generate?count=10${catQuery}`)
      .then((res) => res.json())
      .then((json) => {
        if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
          setQuestions(json.data);
          setIsLoading(false);
        } else {
          fallbackGenerate(category);
        }
      })
      .catch(() => {
        fallbackGenerate(category);
      });
  };

  const fallbackGenerate = (category: string) => {
    const pool = category === 'All'
      ? seedWords
      : seedWords.filter((w: any) => (w.category || '').toLowerCase().includes(category.toLowerCase()));

    const candidatePool = pool.length >= 4 ? pool : seedWords;
    const shuffled = [...candidatePool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(10, shuffled.length));

    const generated = selected.map((item: any, idx: number) => {
      const qType = idx % 5;
      const distractors = seedWords
        .filter((w: any) => w.id !== item.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      let questionText = '';
      let questionTamil = '';
      let correctAnswer = '';
      let options: string[] = [];

      if (qType === 0) {
        // Sourashtra -> Tamil Meaning
        questionText = `What is the Tamil meaning of Sourashtra word "${item.sourashtra}"?`;
        questionTamil = `"${item.sourashtra}" என்ற சௌராஷ்ட்ர சொல்லின் தமிழ் அர்த்தம் என்ன?`;
        correctAnswer = item.tamil;
        options = [item.tamil, ...distractors.map((d: any) => d.tamil)].sort(() => 0.5 - Math.random());
      } else if (qType === 1) {
        // Tamil -> Sourashtra Word
        questionText = `What is the Sourashtra word for "${item.tamil}" (${item.english})?`;
        questionTamil = `"${item.tamil}" (${item.english}) என்பதற்கான சௌராஷ்ட்ர சொல் எது?`;
        correctAnswer = item.sourashtra;
        options = [item.sourashtra, ...distractors.map((d: any) => d.sourashtra)].sort(() => 0.5 - Math.random());
      } else if (qType === 2) {
        // Sourashtra -> English Meaning
        questionText = `What is the English meaning of Sourashtra word "${item.sourashtra}"?`;
        questionTamil = `"${item.sourashtra}" என்பதன் ஆங்கிலப் பொருள் என்ன?`;
        correctAnswer = item.english;
        options = [item.english, ...distractors.map((d: any) => d.english)].sort(() => 0.5 - Math.random());
      } else if (qType === 3) {
        // English -> Sourashtra Word
        questionText = `What is the Sourashtra word for English "${item.english}"?`;
        questionTamil = `"${item.english}" என்ற ஆங்கிலச் சொல்லுக்குரிய சௌராஷ்ட்ர சொல் எது?`;
        correctAnswer = item.sourashtra;
        options = [item.sourashtra, ...distractors.map((d: any) => d.sourashtra)].sort(() => 0.5 - Math.random());
      } else {
        // Pronunciation / Phonetic match
        questionText = `What is the correct phonetic pronunciation of "${item.sourashtra}"?`;
        questionTamil = `"${item.sourashtra}" சொல்லின் சரியான உச்சரிப்பு ஒலிப்பு எது?`;
        correctAnswer = item.pronunciation || item.sourashtra;
        options = [item.pronunciation || item.sourashtra, ...distractors.map((d: any) => d.pronunciation || d.sourashtra)].sort(() => 0.5 - Math.random());
      }

      return {
        id: `dyn_q_${item.id}_${idx}`,
        question: questionText,
        questionTamil: questionTamil,
        sourashtraWord: item.sourashtra,
        pronunciation: item.pronunciation,
        options,
        correctAnswer,
        explanation: `"${item.sourashtra}" (${item.pronunciation || ''}) means "${item.english}" in English and "${item.tamil}" in Tamil.`,
        category: item.category || 'General',
        sourcePage: item.sourcePage || 7,
      };
    });

    setQuestions(generated);
    setIsLoading(false);
  };

  useEffect(() => {
    loadDynamicQuiz(selectedCategory);
  }, [selectedCategory]);

  const currentQ = questions[currentIndex] || questions[0];
  const selectedOption = currentQ ? selectedAnswers[currentQ.id] : null;

  const handleSelectOption = (opt: string) => {
    if (isSubmitted || !currentQ) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: opt }));
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Calculate score and submit
      let correct = 0;
      questions.forEach((q) => {
        if (selectedAnswers[q.id] === q.correctAnswer) {
          correct++;
        }
      });
      const xp = correct * 10 + 20;
      setEarnedXp(xp);
      setIsSubmitted(true);

      // Save to Progress Storage
      await ProgressService.recordQuizResult(selectedCategory, correct, questions.length);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / Math.max(questions.length, 1)) * 100),
    };
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="Dynamic Practice Quiz"
        subtitle={`8,585 சொற்களிலிருந்து உருவாகும் நேரலை பயிற்சி (${categories.length} வகைகள்)`}
        onBack={() => (navigation?.goBack ? navigation.goBack() : null)}
      />

      {/* Category Filter Pills */}
      <View style={styles.categoryWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Generating dynamic quiz questions...</Text>
        </View>
      ) : isSubmitted ? (
        // SCORE & RESULTS SCREEN
        <ScrollView contentContainerStyle={styles.container}>
          {(() => {
            const { correct, total, percentage } = calculateScore();
            return (
              <View>
                <Card style={styles.resultCard}>
                  <Text style={styles.resultEmoji}>
                    {percentage >= 80 ? '🏆' : percentage >= 60 ? '🎉' : '📚'}
                  </Text>
                  <Text style={styles.resultTitle}>
                    {percentage >= 80
                      ? 'Outstanding Master!'
                      : percentage >= 60
                      ? 'Well Done!'
                      : 'Keep Learning!'}
                  </Text>
                  <Text style={styles.resultTamilTitle}>
                    {percentage >= 80
                      ? 'அருமையான தேர்வு முடிவு!'
                      : percentage >= 60
                      ? 'நன்றாகச் செய்தீர்கள்!'
                      : 'தொடர்ந்து பயிற்சி செய்யுங்கள்!'}
                  </Text>

                  <View style={styles.scorePill}>
                    <Text style={styles.scoreText}>
                      {correct} / {total} Correct Answers
                    </Text>
                  </View>

                  <Text style={styles.percentageText}>{percentage}% Score</Text>

                  <View style={styles.xpRow}>
                    <Badge label={`+${earnedXp} XP Earned 🔥`} variant="primary" />
                    <Badge label={`Streak Active ⚡`} variant="source" />
                  </View>

                  <View style={styles.resultActionRow}>
                    <TouchableOpacity
                      style={styles.reviewBtn}
                      onPress={() => setShowReview(!showReview)}
                    >
                      <Text style={styles.reviewBtnText}>
                        {showReview ? 'Hide Review' : '📝 Review Answers'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.restartBtn}
                      onPress={() => loadDynamicQuiz(selectedCategory)}
                    >
                      <Text style={styles.restartBtnText}>New Quiz 🔄</Text>
                    </TouchableOpacity>
                  </View>
                </Card>

                {/* Question by Question Review */}
                {showReview ? (
                  <View style={styles.reviewSection}>
                    <Text style={styles.reviewSectionHeader}>DETAILED ANSWERS & EXPLANATIONS:</Text>
                    {questions.map((q, idx) => {
                      const userAns = selectedAnswers[q.id];
                      const isCorrect = userAns === q.correctAnswer;
                      return (
                        <Card key={q.id} style={styles.reviewCard}>
                          <View style={styles.reviewTop}>
                            <Text style={styles.reviewQNum}>Question {idx + 1}</Text>
                            <Badge
                              label={isCorrect ? '✅ Correct' : '❌ Incorrect'}
                              variant={isCorrect ? 'primary' : 'source'}
                            />
                          </View>
                          <Text style={styles.reviewQuestion}>{q.question}</Text>
                          <Text style={styles.reviewTamilQ}>{q.questionTamil}</Text>
                          <Text style={styles.reviewTanglishQ}>🅰️ {getTanglish(q.questionTamil)}</Text>

                          <View style={styles.reviewAnsBox}>
                            <Text style={styles.reviewAnsLine}>
                              Your Answer: <Text style={{ fontWeight: '700', color: isCorrect ? '#16A34A' : '#DC2626' }}>{userAns || 'Not Answered'}</Text>
                            </Text>
                            {!isCorrect && (
                              <Text style={styles.reviewAnsLine}>
                                Correct Answer: <Text style={{ fontWeight: '700', color: '#16A34A' }}>{q.correctAnswer}</Text>
                              </Text>
                            )}
                          </View>

                          <Text style={styles.explanationText}>💡 {q.explanation}</Text>
                        </Card>
                      );
                    })}
                  </View>
                ) : null}
              </View>
            );
          })()}
        </ScrollView>
      ) : currentQ ? (
        // ACTIVE QUESTION SCREEN
        <ScrollView contentContainerStyle={styles.container}>
          {/* Progress Header */}
          <View style={styles.qProgressRow}>
            <Text style={styles.qProgressText}>
              Question {currentIndex + 1} of {questions.length}
            </Text>
            <Badge label={currentQ.category} variant="primary" />
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${((currentIndex + 1) / questions.length) * 100}%` },
              ]}
            />
          </View>

          {/* Question Card */}
          <Card style={styles.questionCard}>
            {currentQ.sourashtraWord ? (
              <View style={styles.speakerRow}>
                <AudioButton
                  word={currentQ.sourashtraWord}
                  pronunciation={currentQ.pronunciation}
                  size="small"
                />
              </View>
            ) : null}

            <Text style={styles.questionText}>{currentQ.question}</Text>
            <Text style={styles.questionTamilText}>{currentQ.questionTamil}</Text>
            <Text style={styles.questionTanglishText}>🅰️ Tanglish: {getTanglish(currentQ.questionTamil)}</Text>

            {/* Options */}
            <View style={styles.optionsList}>
              {currentQ.options.map((opt: string, idx: number) => {
                const isSelected = selectedOption === opt;
                const isTamilOpt = /[\u0B80-\u0BFF]/.test(opt);
                return (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.7}
                    style={[
                      styles.optionButton,
                      isSelected && styles.optionButtonSelected,
                    ]}
                    onPress={() => handleSelectOption(opt)}
                  >
                    <View style={[styles.optionRadio, isSelected && styles.optionRadioSelected]}>
                      <Text style={[styles.radioLetter, isSelected && styles.radioLetterSelected]}>
                        {String.fromCharCode(65 + idx)}
                      </Text>
                    </View>
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                      {opt} {isTamilOpt ? `(${getTanglish(opt)})` : ''}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>

          {/* Navigation Controls */}
          <View style={styles.navRow}>
            <TouchableOpacity
              style={[styles.prevBtn, currentIndex === 0 && styles.btnDisabled]}
              onPress={handlePrevious}
              disabled={currentIndex === 0}
            >
              <Text style={styles.prevBtnText}>⬅️ Previous</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.nextBtn, !selectedOption && styles.btnDisabled]}
              onPress={handleNext}
              disabled={!selectedOption}
            >
              <Text style={styles.nextBtnText}>
                {currentIndex === questions.length - 1 ? 'Finish Quiz 🏁' : 'Next ➡️'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  categoryWrapper: {
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  categoryContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  qProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  qProgressText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  questionCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  speakerRow: {
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 24,
  },
  questionTamilText: {
    fontSize: 14,
    color: '#475569',
    marginTop: 4,
    marginBottom: 4,
  },
  questionTanglishText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 16,
  },
  optionsList: {
    gap: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  optionButtonSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: COLORS.primary,
  },
  optionRadio: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionRadioSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  radioLetter: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  radioLetterSelected: {
    color: '#FFFFFF',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
  },
  optionTextSelected: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  prevBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  prevBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  nextBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  nextBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  btnDisabled: {
    opacity: 0.4,
  },
  resultCard: {
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  resultEmoji: {
    fontSize: 54,
    marginBottom: 10,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  resultTamilTitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  scorePill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 14,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  percentageText: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.primary,
    marginVertical: 10,
  },
  xpRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  resultActionRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  reviewBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  reviewBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  restartBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  restartBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  reviewSection: {
    marginTop: 10,
  },
  reviewSectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  reviewCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  reviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reviewQNum: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  reviewQuestion: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  reviewTamilQ: {
    fontSize: 13,
    color: '#475569',
    marginTop: 2,
    marginBottom: 2,
  },
  reviewTanglishQ: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 8,
  },
  reviewAnsBox: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    gap: 4,
    marginVertical: 6,
  },
  reviewAnsLine: {
    fontSize: 13,
    color: '#334155',
  },
  explanationText: {
    fontSize: 12,
    color: '#4338CA',
    lineHeight: 16,
    marginTop: 4,
  },
});

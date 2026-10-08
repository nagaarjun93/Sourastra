import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { AudioButton } from '../components/AudioButton';
import { getTanglish } from '../utils/tanglish';
import seedLessons from '../data/verified_seed_lessons.json';
import seedWords from '../data/verified_seed_words.json';

interface LearnScreenProps {
  navigation?: any;
}

// Icon mappings for each chapter
const CHAPTER_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  chap_1: 'book',
  chap_2: 'sparkles',
  chap_3: 'people',
  chap_4: 'restaurant',
  chap_5: 'calculator',
  chap_6: 'swap-horizontal',
  chap_7: 'chatbubbles',
  chap_8: 'ribbon',
};

// Chapter lock criteria
const CHAPTER_LOCKS: Record<string, { locked: boolean; minXp: number; requirement: string }> = {
  chap_1: { locked: false, minXp: 0, requirement: 'Unlocked by Default' },
  chap_2: { locked: false, minXp: 0, requirement: 'Unlocked by Default' },
  chap_3: { locked: true, minXp: 30, requirement: 'Complete Chapter 2 or Earn 30 XP' },
  chap_4: { locked: true, minXp: 60, requirement: 'Complete Chapter 3 or Earn 60 XP' },
  chap_5: { locked: true, minXp: 90, requirement: 'Complete Chapter 4 or Earn 90 XP' },
  chap_6: { locked: true, minXp: 120, requirement: 'Complete Chapter 5 or Earn 120 XP' },
  chap_7: { locked: true, minXp: 150, requirement: 'Complete Chapter 6 or Earn 150 XP' },
  chap_8: { locked: true, minXp: 180, requirement: 'Complete Chapter 7 or Earn 180 XP' },
};

export default function LearnScreen({ navigation }: LearnScreenProps) {
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [unlockedChapters, setUnlockedChapters] = useState<Set<string>>(
    new Set(['chap_1', 'chap_2'])
  );

  const selectedChapter = useMemo(() => {
    return seedLessons.find((c: any) => c.id === selectedChapterId) || null;
  }, [selectedChapterId]);

  // Words belonging to the selected chapter
  const chapterWords = useMemo(() => {
    if (!selectedChapter) return [];
    
    switch (selectedChapter.id) {
      case 'chap_1':
        return seedWords.filter((w: any) => w.category === 'Foundation' || w.category === 'Pronoun');
      case 'chap_2':
        return seedWords.filter((w: any) => w.category === 'Verb');
      case 'chap_3':
        return seedWords.filter((w: any) => w.category === 'Family' || w.category === 'House' || w.category === 'Body' || w.category === 'Clothes');
      case 'chap_4':
        return seedWords.filter((w: any) => w.category === 'Food' || w.category === 'Nature' || w.category === 'Animals');
      case 'chap_5':
        return seedWords.filter((w: any) => w.category === 'Number' || w.category === 'Time' || w.category === 'Metals' || w.category === 'Colours');
      case 'chap_6':
        return seedWords.filter((w: any) => w.category === 'Antonyms');
      case 'chap_7':
        return seedWords.filter((w: any) => w.category === 'Phrases');
      case 'chap_8':
      default:
        return seedWords.filter((w: any) =>
          ['Grammar', 'Feelings', 'Professions', 'Culture', 'Vocabulary'].includes(w.category)
        );
    }
  }, [selectedChapter]);

  const getChapterWordsCount = (chapId: string) => {
    switch (chapId) {
      case 'chap_1':
        return seedWords.filter((w: any) => w.category === 'Foundation' || w.category === 'Pronoun').length;
      case 'chap_2':
        return seedWords.filter((w: any) => w.category === 'Verb').length;
      case 'chap_3':
        return seedWords.filter((w: any) => w.category === 'Family' || w.category === 'House' || w.category === 'Body' || w.category === 'Clothes').length;
      case 'chap_4':
        return seedWords.filter((w: any) => w.category === 'Food' || w.category === 'Nature' || w.category === 'Animals').length;
      case 'chap_5':
        return seedWords.filter((w: any) => w.category === 'Number' || w.category === 'Time' || w.category === 'Metals' || w.category === 'Colours').length;
      case 'chap_6':
        return seedWords.filter((w: any) => w.category === 'Antonyms').length;
      case 'chap_7':
        return seedWords.filter((w: any) => w.category === 'Phrases').length;
      case 'chap_8':
      default:
        return seedWords.filter((w: any) =>
          ['Grammar', 'Feelings', 'Professions', 'Culture', 'Vocabulary'].includes(w.category)
        ).length;
    }
  };

  const handleChapterPress = (chap: any) => {
    const isLocked = !unlockedChapters.has(chap.id);
    if (isLocked) {
      const lockInfo = CHAPTER_LOCKS[chap.id];
      Alert.alert(
        '🔒 Chapter Locked',
        `${chap.title} (${chap.tamilTitle}) is currently locked.\n\nRequirement: ${lockInfo?.requirement || 'Complete previous chapter'}`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Unlock Now 🔓',
            onPress: () => {
              setUnlockedChapters((prev) => new Set(prev).add(chap.id));
              setSelectedChapterId(chap.id);
            },
          },
        ]
      );
      return;
    }
    setSelectedChapterId(chap.id);
  };

  const handleStartPractice = (category: string) => {
    if (navigation && navigation.navigate) {
      navigation.navigate('QuizTab', { category });
    }
  };

  const handleOpenFlashcards = () => {
    if (navigation && navigation.navigate) {
      navigation.navigate('FlashcardsTab');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title={selectedChapter ? selectedChapter.title : "Curriculum & Chapters"}
        subtitle={selectedChapter ? selectedChapter.tamilTitle : `பாட அத்தியாயங்கள் (${seedWords.length} Master Words)`}
        onBack={selectedChapter ? () => setSelectedChapterId(null) : () => navigation?.goBack()}
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {!selectedChapter ? (
          // CHAPTERS OVERVIEW LIST
          <View>
            <View style={styles.bannerBox}>
              <View style={styles.bannerIconBox}>
                <Ionicons name="school" size={24} color="#4F46E5" />
              </View>
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>Structured 8-Chapter Learning</Text>
                <Text style={styles.bannerSub}>
                  Progress through root words, verbs, nouns, dialogues, and unlock each chapter step-by-step.
                </Text>
              </View>
            </View>

            <View style={styles.quickNavRow}>
              <TouchableOpacity style={styles.quickCardBtn} onPress={handleOpenFlashcards} activeOpacity={0.8}>
                <Ionicons name="albums" size={18} color="#EA580C" />
                <Text style={styles.quickCardText}>Study Cards</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickQuizBtn}
                onPress={() => handleStartPractice('All')}
                activeOpacity={0.8}
              >
                <Ionicons name="trophy" size={18} color="#16A34A" />
                <Text style={styles.quickQuizText}>All-Chapter Quiz</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeader}>CURRICULUM MODULES</Text>
              <TouchableOpacity
                onPress={() => {
                  setUnlockedChapters(
                    new Set(seedLessons.map((l: any) => l.id))
                  );
                }}
              >
                <Text style={styles.unlockAllText}>Unlock All 🔓</Text>
              </TouchableOpacity>
            </View>

            {seedLessons.map((chap: any) => {
              const isLocked = !unlockedChapters.has(chap.id);
              const iconName = CHAPTER_ICONS[chap.id] || 'book';
              const lockInfo = CHAPTER_LOCKS[chap.id];

              return (
                <TouchableOpacity
                  key={chap.id}
                  activeOpacity={0.85}
                  onPress={() => handleChapterPress(chap)}
                >
                  <Card style={[styles.chapterCard, isLocked && styles.chapterCardLocked]}>
                    <View style={styles.chapterHeader}>
                      <View style={[styles.iconCircle, isLocked && styles.iconCircleLocked]}>
                        <Ionicons
                          name={isLocked ? 'lock-closed' : iconName}
                          size={22}
                          color={isLocked ? '#94A3B8' : COLORS.primary}
                        />
                      </View>
                      <View style={styles.chapterTitles}>
                        <View style={styles.chapNumRow}>
                          <Text style={[styles.chapNumber, isLocked && styles.chapNumberLocked]}>
                            CHAPTER {chap.chapterNumber}
                          </Text>
                          {isLocked && (
                            <View style={styles.lockedBadge}>
                              <Ionicons name="lock-closed" size={10} color="#64748B" />
                              <Text style={styles.lockedBadgeText}>LOCKED</Text>
                            </View>
                          )}
                        </View>
                        <Text style={[styles.chapTitle, isLocked && styles.chapTitleLocked]}>
                          {chap.title}
                        </Text>
                        <Text style={styles.chapTamilTitle}>
                          {chap.tamilTitle} • 🅰️ {getTanglish(chap.tamilTitle)}
                        </Text>
                      </View>
                    </View>

                    <Text style={[styles.chapDesc, isLocked && styles.chapDescLocked]}>
                      {chap.description}
                    </Text>

                    {isLocked && lockInfo ? (
                      <View style={styles.lockRequirementBox}>
                        <Ionicons name="key-outline" size={13} color="#D97706" />
                        <Text style={styles.lockRequirementText}>
                          Unlock: {lockInfo.requirement}
                        </Text>
                      </View>
                    ) : null}

                    <View style={styles.chapFooter}>
                      <Badge label={chap.category} variant={isLocked ? 'secondary' : 'source'} />
                      <Badge label={`${getChapterWordsCount(chap.id)} Words`} variant={isLocked ? 'secondary' : 'primary'} />
                      <Text style={[styles.openArrow, isLocked && styles.openArrowLocked]}>
                        {isLocked ? 'Tap to Unlock' : 'Start ➡️'}
                      </Text>
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          // DETAILED CHAPTER VIEW
          <View>
            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedChapterId(null)}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={16} color="#334155" style={{ marginRight: 6 }} />
              <Text style={styles.backBtnText}>Back to All Chapters</Text>
            </TouchableOpacity>

            {/* Chapter Details Banner */}
            <Card style={styles.activeChapterBanner}>
              <View style={styles.activeHeaderRow}>
                <View style={styles.activeIconCircle}>
                  <Ionicons
                    name={CHAPTER_ICONS[selectedChapter.id] || 'book'}
                    size={28}
                    color="#4F46E5"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.activeChapTag}>CHAPTER {selectedChapter.chapterNumber}</Text>
                  <Text style={styles.activeChapTitle}>{selectedChapter.title}</Text>
                  <Text style={styles.activeChapTamil}>
                    {selectedChapter.tamilTitle} • 🅰️ {getTanglish(selectedChapter.tamilTitle)}
                  </Text>
                </View>
              </View>

              <Text style={styles.activeChapDesc}>{selectedChapter.description}</Text>

              <View style={styles.activeMetaRow}>
                <Badge label={selectedChapter.category} variant="source" />
                <Badge label={`${chapterWords.length} Master Words`} variant="primary" />
              </View>

              <TouchableOpacity
                style={styles.chapterQuizBtn}
                onPress={() => handleStartPractice(selectedChapter.category)}
                activeOpacity={0.8}
              >
                <Ionicons name="trophy" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.chapterQuizBtnText}>
                  Practice Chapter {selectedChapter.chapterNumber} Quiz
                </Text>
              </TouchableOpacity>
            </Card>

            <Text style={styles.vocabSectionHeader}>
              VOCABULARY & SENTENCES ({chapterWords.length}):
            </Text>

            {/* Words List in Chapter */}
            {chapterWords.map((word: any) => (
              <Card key={word.id} style={styles.wordCard}>
                <View style={styles.wordCardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sourashtraText}>{word.sourashtra}</Text>
                    {word.pronunciation ? (
                      <Text style={styles.pronounceText}>🗣️ [{word.pronunciation}]</Text>
                    ) : null}
                  </View>
                  <AudioButton
                    word={word.sourashtra}
                    pronunciation={word.pronunciation}
                    tamil={word.tamil}
                  />
                </View>

                <View style={styles.transBox}>
                  <View style={styles.transLine}>
                    <Text style={styles.transTag}>Tamil (தமிழ்):</Text>
                    <Text style={styles.transTamVal}>{word.tamil}</Text>
                  </View>
                  <View style={styles.transLine}>
                    <Text style={styles.transTagTanglish}>Tanglish:</Text>
                    <Text style={styles.transTanglishVal}>{getTanglish(word.tamil)}</Text>
                  </View>
                  <View style={styles.transLine}>
                    <Text style={styles.transTag}>English:</Text>
                    <Text style={styles.transEngVal}>{word.english}</Text>
                  </View>
                </View>

                {word.examples && word.examples[0] ? (
                  <View style={styles.exBox}>
                    <Text style={styles.exTitle}>💡 Example Sentence:</Text>
                    <Text style={styles.exSour}>{word.examples[0].sourashtra}</Text>
                    <Text style={styles.exMean}>
                      {word.examples[0].tamil} • <Text style={{ color: '#059669', fontWeight: '700' }}>Tanglish: {getTanglish(word.examples[0].tamil)}</Text> ({word.examples[0].english})
                    </Text>
                  </View>
                ) : null}

                <View style={styles.cardBottom}>
                  <Badge label={word.category || 'General'} variant="primary" />
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
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
  bannerBox: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    marginBottom: 16,
    alignItems: 'center',
    gap: 12,
  },
  bannerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E1B4B',
  },
  bannerSub: {
    fontSize: 12,
    color: '#4338CA',
    marginTop: 2,
    lineHeight: 16,
  },
  quickNavRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  quickCardBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FDBA74',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  quickCardText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EA580C',
  },
  quickQuizBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#86EFAC',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  quickQuizText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16A34A',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1.2,
  },
  unlockAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6366F1',
  },
  chapterCard: {
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  chapterCardLocked: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.85,
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleLocked: {
    backgroundColor: '#F1F5F9',
  },
  chapterTitles: {
    flex: 1,
  },
  chapNumRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chapNumber: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1.2,
  },
  chapNumberLocked: {
    color: '#94A3B8',
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  lockedBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
  },
  chapTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  chapTitleLocked: {
    color: '#64748B',
  },
  chapTamilTitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 1,
  },
  chapDesc: {
    fontSize: 13,
    color: '#475569',
    marginTop: 10,
    lineHeight: 18,
  },
  chapDescLocked: {
    color: '#94A3B8',
  },
  lockRequirementBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  lockRequirementText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
    flex: 1,
  },
  chapFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  openArrow: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  openArrowLocked: {
    color: '#94A3B8',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 14,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  activeChapterBanner: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 18,
    borderWidth: 2,
    borderColor: '#C7D2FE',
    marginBottom: 16,
  },
  activeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  activeIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  activeChapTag: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1.2,
  },
  activeChapTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  activeChapTamil: {
    fontSize: 14,
    color: '#475569',
    marginTop: 2,
  },
  activeChapDesc: {
    fontSize: 13,
    color: '#475569',
    marginVertical: 10,
    lineHeight: 18,
  },
  activeMetaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  chapterQuizBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterQuizBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  vocabSectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  wordCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  wordCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sourashtraText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  pronounceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginTop: 2,
  },
  transBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginVertical: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  transLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    width: 90,
  },
  transTagTanglish: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
    width: 90,
  },
  transTamVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  transTanglishVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#047857',
    flex: 1,
  },
  transEngVal: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    flex: 1,
  },
  exBox: {
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 10,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  exTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  exSour: {
    fontSize: 13,
    fontWeight: '700',
    color: '#78350F',
    marginTop: 2,
  },
  exMean: {
    fontSize: 12,
    color: '#92400E',
    marginTop: 1,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
});

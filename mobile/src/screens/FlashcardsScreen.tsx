import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { SpeechService } from '../services/speechService';
import { getTanglish } from '../utils/tanglish';
import seedWords from '../data/verified_seed_words.json';

const { width } = Dimensions.get('window');

export default function FlashcardsScreen({ navigation }: any) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());
  const [reviewIds, setReviewIds] = useState<Set<string>>(new Set());
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Dynamically extract unique categories from the 8,585 seedWords
  const categories = useMemo(() => {
    const cats = new Set<string>();
    seedWords.forEach((w: any) => {
      if (w.category) cats.add(w.category.trim());
    });
    return ['All', ...Array.from(cats).sort()];
  }, []);

  // Filter words across the entire dictionary by category and search query
  const filteredWords = useMemo(() => {
    let list = seedWords as any[];
    if (selectedCategory !== 'All') {
      const lowerCat = selectedCategory.toLowerCase();
      list = list.filter((w: any) =>
        (w.category || '').toLowerCase().includes(lowerCat) ||
        (w.categories && w.categories.some((c: string) => c.toLowerCase().includes(lowerCat)))
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((w: any) =>
        (w.sourashtra && w.sourashtra.toLowerCase().includes(q)) ||
        (w.tanglish && w.tanglish.toLowerCase().includes(q)) ||
        (w.tamil && w.tamil.toLowerCase().includes(q)) ||
        (w.english && w.english.toLowerCase().includes(q)) ||
        (w.sourashtraScript && w.sourashtraScript.includes(q))
      );
    }
    return list.length > 0 ? list : seedWords;
  }, [selectedCategory, searchQuery]);

  const currentWord = filteredWords[currentIndex] || filteredWords[0] || {
    id: '1',
    sourashtra: 'சா³',
    english: 'See',
    tamil: 'பார்',
    pronunciation: 'Saa',
    category: 'Foundation',
    sourcePage: 7,
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < filteredWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(filteredWords.length - 1);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    setCurrentIndex(randomIndex);
  };

  const handleMarkMastered = () => {
    setMasteredIds((prev: Set<string>) => new Set(prev).add(currentWord.id));
    setReviewIds((prev: Set<string>) => {
      const next = new Set(prev);
      next.delete(currentWord.id);
      return next;
    });
    handleNext();
  };

  const handleMarkReview = () => {
    setReviewIds((prev: Set<string>) => new Set(prev).add(currentWord.id));
    handleNext();
  };

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    SpeechService.speakSourashtra(currentWord.sourashtra, currentWord.pronunciation);
    setTimeout(() => setIsPlayingAudio(false), 1200);
  };

  const progressPercent = Math.round(((currentIndex + 1) / Math.max(filteredWords.length, 1)) * 100);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Header
        title="Interactive Flashcards"
        subtitle={`முழு அகராதிப் பயிற்சி (${filteredWords.length.toLocaleString()} Words)`}
        onBack={() => (navigation?.goBack ? navigation.goBack() : null)}
      />

      {/* Search Input for Full Dictionary */}
      <View style={styles.searchBarBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchTextInput}
          placeholder="Search 8,585 words across full dictionary..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={(txt) => {
            setSearchQuery(txt);
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.searchClearBtn}>
            <Text style={styles.searchClearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category Pills */}
      <View style={styles.categoryWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((cat: string) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipActive,
              ]}
              onPress={() => {
                setSelectedCategory(cat);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
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

      {/* Progress & Counter Bar */}
      <View style={styles.statsBar}>
        <View style={styles.counterBox}>
          <Text style={styles.counterText}>
            Card {currentIndex + 1} of {filteredWords.length.toLocaleString()}
          </Text>
        </View>
        <View style={styles.badgeRow}>
          <Text style={styles.masteredBadge}>✅ Mastered: {masteredIds.size}</Text>
          <Text style={styles.reviewBadge}>🔄 Review: {reviewIds.size}</Text>
        </View>
      </View>

      {/* Progress Line */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
      </View>

      {/* Main Flashcard */}
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.flashcardTouchable}
          activeOpacity={0.9}
          onPress={handleFlip}
        >
          <Card style={[styles.flashcard, isFlipped ? styles.flashcardBack : styles.flashcardFront]}>
            <View style={styles.cardTopRow}>
              <Badge
                label={currentWord.category || 'General'}
                variant="primary"
              />
              <TouchableOpacity style={styles.audioIconBtn} onPress={handlePlayAudio}>
                <Text style={styles.audioIconEmoji}>{isPlayingAudio ? '🔊' : '🔈'}</Text>
                <Text style={styles.audioIconLabel}>{isPlayingAudio ? 'Playing' : 'Listen'}</Text>
              </TouchableOpacity>
            </View>

            {!isFlipped ? (
              // FRONT SIDE: Sourashtra & Phonetics
              <View style={styles.cardMainContent}>
                {currentWord.sourashtraScript ? (
                  <View style={styles.nativeScriptBadge}>
                    <Text style={styles.nativeScriptLabel}>அசல் சௌராஷ்ட்ர எழுத்துரு (Native Script):</Text>
                    <Text style={styles.nativeScriptBig}>{currentWord.sourashtraScript}</Text>
                  </View>
                ) : null}
                <Text style={styles.scriptLabel}>சௌராஷ்ட்ர ஒலிப்பு (Tamil Script)</Text>
                <Text style={styles.sourashtraBigText}>{currentWord.sourashtra}</Text>
                {currentWord.tanglish || currentWord.pronunciation ? (
                  <View style={styles.pronunciationBubble}>
                    <Text style={styles.pronunciationText}>
                      🗣️ [{currentWord.tanglish || currentWord.pronunciation}]
                    </Text>
                  </View>
                ) : null}
                <View style={styles.tapPrompt}>
                  <Text style={styles.tapPromptText}>👆 Tap card to see Tamil, Tanglish & English meaning</Text>
                </View>
              </View>
            ) : (
              // BACK SIDE: Tamil, Tanglish, English & Examples
              <View style={styles.cardMainContent}>
                <Text style={styles.scriptLabel}>MEANING & TRANSLATION</Text>
                
                <View style={styles.meaningBox}>
                  <Text style={styles.meaningLangLabel}>🇮🇳 TAMIL (தமிழ்):</Text>
                  <Text style={styles.tamilMeaningText}>{currentWord.tamil}</Text>
                </View>

                <View style={[styles.meaningBox, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
                  <Text style={styles.meaningLangLabelTanglish}>🅰️ TANGLISH:</Text>
                  <Text style={styles.tanglishMeaningText}>{getTanglish(currentWord.tamil)}</Text>
                </View>

                <View style={styles.meaningBox}>
                  <Text style={styles.meaningLangLabel}>🇬🇧 ENGLISH:</Text>
                  <Text style={styles.englishMeaningText}>{currentWord.english}</Text>
                </View>

                {currentWord.examples && currentWord.examples[0] ? (
                  <View style={styles.exampleBox}>
                    <Text style={styles.exampleHeader}>💡 Example Sentence:</Text>
                    <Text style={styles.exampleSourashtra}>{currentWord.examples[0].sourashtra}</Text>
                    <Text style={styles.exampleMeaning}>
                      {currentWord.examples[0].tamil} • <Text style={{ color: '#059669', fontWeight: '700' }}>Tanglish: {getTanglish(currentWord.examples[0].tamil)}</Text> ({currentWord.examples[0].english})
                    </Text>
                  </View>
                ) : null}

                <View style={styles.tapPrompt}>
                  <Text style={styles.tapPromptText}>👆 Tap card to flip back</Text>
                </View>
              </View>
            )}
          </Card>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionBtnReview} onPress={handleMarkReview}>
          <Text style={styles.actionBtnTextReview}>🔄 Need Practice</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtnShuffle} onPress={handleShuffle}>
          <Text style={styles.actionBtnEmoji}>🔀</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtnMastered} onPress={handleMarkMastered}>
          <Text style={styles.actionBtnTextMastered}>✅ I Know It</Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Footer */}
      <View style={styles.navFooter}>
        <TouchableOpacity style={styles.navBtn} onPress={handlePrev}>
          <Text style={styles.navBtnText}>⬅️ Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.flipBtn} onPress={handleFlip}>
          <Text style={styles.flipBtnText}>🔄 Flip Card</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={handleNext}>
          <Text style={styles.navBtnText}>Next ➡️</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6,
  },
  counterBox: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  counterText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  masteredBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16A34A',
  },
  reviewBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EA580C',
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 20,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 4,
  },
  flashcardTouchable: {
    width: '100%',
    height: 330,
  },
  flashcard: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  flashcardFront: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E0E7FF',
  },
  flashcardBack: {
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#C7D2FE',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  audioIconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    gap: 4,
  },
  audioIconEmoji: {
    fontSize: 14,
  },
  audioIconLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },
  cardMainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  scriptLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  sourashtraBigText: {
    fontSize: 38,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginVertical: 6,
  },
  pronunciationBubble: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginTop: 8,
  },
  pronunciationText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
  },
  meaningBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  meaningLangLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 2,
  },
  meaningLangLabelTanglish: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    marginBottom: 2,
  },
  tamilMeaningText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  tanglishMeaningText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#047857',
  },
  englishMeaningText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  exampleBox: {
    width: '100%',
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 10,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  exampleHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  exampleSourashtra: {
    fontSize: 13,
    fontWeight: '700',
    color: '#78350F',
    marginTop: 2,
  },
  exampleMeaning: {
    fontSize: 11,
    color: '#92400E',
    marginTop: 1,
  },
  tapPrompt: {
    marginTop: 'auto',
    paddingTop: 8,
  },
  tapPromptText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 10,
  },
  actionBtnReview: {
    flex: 1,
    backgroundColor: '#FFF7ED',
    borderWidth: 1.5,
    borderColor: '#FDBA74',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  actionBtnTextReview: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EA580C',
  },
  actionBtnShuffle: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnEmoji: {
    fontSize: 18,
  },
  actionBtnMastered: {
    flex: 1,
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  actionBtnTextMastered: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16A34A',
  },
  navFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  navBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  navBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  flipBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  flipBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchTextInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    padding: 0,
  },
  searchClearBtn: {
    padding: 4,
  },
  searchClearText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '700',
  },
  nativeScriptBadge: {
    backgroundColor: '#FDF4FF',
    borderColor: '#F0ABFC',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignItems: 'center',
    marginBottom: 8,
  },
  nativeScriptLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A855F7',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  nativeScriptBig: {
    fontSize: 26,
    fontWeight: '800',
    color: '#7E22CE',
  },
});

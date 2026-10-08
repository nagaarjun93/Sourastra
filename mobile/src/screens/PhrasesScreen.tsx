import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { AudioButton } from '../components/AudioButton';
import { getTanglish } from '../utils/tanglish';
import seedWords from '../data/verified_seed_words.json';
import weavingData from '../data/sourashtra_weaving_heritage.json';
import marriageData from '../data/sourashtra_marriage_culture.json';

const PHRASE_CATEGORIES: { id: string; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'All', label: 'All Phrases', icon: 'chatbubbles' },
  { id: 'Greetings', label: 'வணக்கம் (Greetings)', icon: 'hand-right' },
  { id: 'Shopping', label: 'கடைவீதி (Shopping)', icon: 'cart' },
  { id: 'Travel', label: 'பயணம் (Travel)', icon: 'bus' },
  { id: 'Health', label: 'மருத்துவம் (Doctor)', icon: 'medkit' },
  { id: 'Home', label: 'வீட்டு உரையாடல் (Home)', icon: 'home' },
  { id: 'Questions', label: 'கேள்விகள் (Questions)', icon: 'help-circle' },
  { id: 'Weaving', label: 'கைத்தறி (Weaving)', icon: 'layers' },
  { id: 'Marriage', label: 'திருமணம் (Rituals)', icon: 'heart' },
  { id: 'Tenses', label: 'காலங்கள் (Tenses)', icon: 'flash' },
];

export default function PhrasesScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  // Extract all phrases and words with example sentences from the master dataset
  const allPhrases = useMemo(() => {
    const list: any[] = [];
    
    // 1. Direct Phrases category from seed words
    seedWords.forEach((w: any) => {
      if (w.category === 'Phrases') {
        let situCat = 'Home';
        const s = (w.sourashtra || '').toLowerCase();
        const t = (w.tamil || '').toLowerCase();
        const e = (w.english || '').toLowerCase();

        if (s.includes('நமஸ்கார்') || s.includes('அவொ') || s.includes('கெஸ்கொ') || t.includes('வணக்கம்') || t.includes('வாருங்கள்') || t.includes('நன்றி')) {
          situCat = 'Greetings';
        } else if (s.includes('மோல்') || s.includes('ரூபியா') || s.includes('கமி') || s.includes('கிலோ') || t.includes('விலை') || t.includes('ரூபாய்')) {
          situCat = 'Shopping';
        } else if (s.includes('பஸ்') || s.includes('ரயில்') || s.includes('டிக்கெட்') || s.includes('ஸொஜ்ஜொ') || s.includes('ஒத்தி') || t.includes('பேருந்து') || t.includes('நிலையம்') || t.includes('திரும்பு')) {
          situCat = 'Travel';
        } else if (s.includes('டாக்டர்') || s.includes('தாவ்') || s.includes('து³கய்') || s.includes('ஒளஷத்³') || t.includes('மருத்துவர்') || t.includes('காய்ச்சல்') || t.includes('வலி') || t.includes('மருந்து')) {
          situCat = 'Health';
        } else if (s.includes('?') || t.includes('?') || e.includes('?') || s.includes('காய்') || s.includes('கெத்தெ') || s.includes('கோன்')) {
          situCat = 'Questions';
        }

        const tVal = w.tamil || '';
        list.push({
          id: `seed_${w.id}`,
          sourashtra: w.sourashtra,
          tamil: tVal,
          tanglish: getTanglish(tVal),
          english: w.english,
          pronunciation: w.pronunciation,
          situationalCategory: situCat,
          example: w.examples && w.examples[0] ? w.examples[0] : null,
        });
      } else if (w.category === 'Grammar' && (w.sourashtra.endsWith('ஸ்') || w.sourashtra.endsWith('ய்') || w.sourashtra.endsWith('லொ'))) {
        const tVal = w.tamil || '';
        list.push({
          id: `gram_${w.id}`,
          sourashtra: w.sourashtra,
          tamil: tVal,
          tanglish: getTanglish(tVal),
          english: w.english,
          pronunciation: w.pronunciation,
          situationalCategory: 'Tenses',
          example: w.examples && w.examples[0] ? w.examples[0] : null,
        });
      } else if (w.examples && w.examples[0]) {
        const ex = w.examples[0];
        if (ex.sourashtra && ex.sourashtra.length > 5 && !ex.sourashtra.includes('பத³ம்')) {
          const tVal = ex.tamil || '';
          list.push({
            id: `ex_${w.id}`,
            sourashtra: ex.sourashtra,
            tamil: tVal,
            tanglish: getTanglish(tVal),
            english: ex.english,
            pronunciation: w.pronunciation,
            situationalCategory: w.category === 'Verb' ? 'Home' : 'Questions',
            example: null,
          });
        }
      }
    });

    // 2. Weaving heritage sentences
    weavingData.forEach((w: any, idx: number) => {
      if (w.sourashtraSentence) {
        list.push({
          id: `weave_${idx}`,
          sourashtra: w.sourashtraSentence,
          tamil: w.tamilSentence,
          tanglish: getTanglish(w.tamilSentence || ''),
          english: w.englishSentence,
          pronunciation: w.pronunciationSentence || w.pronunciation,
          situationalCategory: 'Weaving',
          example: {
            sourashtra: w.sourashtra,
            tamil: w.tamil,
            english: w.english,
          },
        });
      }
    });

    // 3. Marriage and ritual sentences
    marriageData.forEach((m: any, idx: number) => {
      if (m.sourashtraSentence) {
        list.push({
          id: `marriage_${idx}`,
          sourashtra: m.sourashtraSentence,
          tamil: m.tamilSentence,
          tanglish: getTanglish(m.tamilSentence || ''),
          english: m.englishSentence,
          pronunciation: m.pronunciationSentence || m.pronunciation,
          situationalCategory: 'Marriage',
          example: {
            sourashtra: m.sourashtra,
            tamil: m.tamil,
            english: m.english,
          },
        });
      }
    });

    return list;
  }, []);

  // Filter phrases based on search and category
  const filteredPhrases = useMemo(() => {
    let result = allPhrases;

    if (selectedCat !== 'All') {
      result = result.filter((p) => p.situationalCategory === selectedCat);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          (p.sourashtra || '').toLowerCase().includes(q) ||
          (p.tamil || '').toLowerCase().includes(q) ||
          (p.tanglish || '').toLowerCase().includes(q) ||
          (p.english || '').toLowerCase().includes(q) ||
          (p.pronunciation || '').toLowerCase().includes(q)
      );
    }

    return result;
  }, [allPhrases, selectedCat, searchQuery]);

  const renderPhraseItem = useCallback(({ item: phrase, index: idx }: { item: any; index: number }) => {
    return (
      <Card style={[styles.phraseCard, SHADOWS.small]}>
        {/* Card Top Row */}
        <View style={styles.phraseTopRow}>
          <View style={styles.phraseLeftHeader}>
            <View style={styles.phraseNumberBadge}>
              <Text style={styles.phraseNumberText}>{idx + 1}</Text>
            </View>
            <Badge label={phrase.situationalCategory || 'General'} variant="primary" />
          </View>
          <AudioButton
            word={phrase.sourashtra}
            pronunciation={phrase.pronunciation}
            tamil={phrase.tamil}
            size="small"
          />
        </View>

        {/* Main Sourashtra Line */}
        <Text style={styles.sourashtraLine}>{phrase.sourashtra}</Text>

        {/* Phonetic Pronunciation */}
        {phrase.pronunciation ? (
          <Text style={styles.pronounceLine}>🗣️ [{phrase.pronunciation}]</Text>
        ) : null}

        {/* Translation Boxes with 3 Languages */}
        <View style={styles.translationCard}>
          <View style={styles.transRow}>
            <Text style={styles.langTagTamil}>🇮🇳 TAMIL:</Text>
            <Text style={styles.tamilText}>{phrase.tamil}</Text>
          </View>

          <View style={styles.transDivider} />

          <View style={styles.transRow}>
            <Text style={styles.langTagTanglish}>🅰️ TANGLISH:</Text>
            <Text style={styles.tanglishText}>{phrase.tanglish}</Text>
          </View>

          <View style={styles.transDivider} />

          <View style={styles.transRow}>
            <Text style={styles.langTagEnglish}>🇬🇧 ENGLISH:</Text>
            <Text style={styles.englishText}>{phrase.english}</Text>
          </View>
        </View>

        {/* Example if attached */}
        {phrase.example ? (
          <View style={styles.nestedExBox}>
            <Text style={styles.nestedExTag}>💡 Core Heritage Word:</Text>
            <Text style={styles.nestedExSour}>{phrase.example.sourashtra}</Text>
            <Text style={styles.nestedExMean}>
              {phrase.example.tamil} • <Text style={{ color: '#059669', fontWeight: '700' }}>Tanglish: {getTanglish(phrase.example.tamil || '')}</Text> ({phrase.example.english})
            </Text>
          </View>
        ) : null}
      </Card>
    );
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header with Back button */}
      <Header
        title="Conversations & Phrases"
        subtitle="தினசரி உரையாடல் வாக்கியங்கள் (Digital Phrasebook)"
        onBack={() => navigation.goBack()}
      />

      {/* Hero Search Box */}
      <View style={styles.searchSection}>
        <View style={[styles.searchBar, SHADOWS.small]}>
          <Ionicons name="search" size={18} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search phrases in Tamil, English, or Sourashtra..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Category Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {PHRASE_CATEGORIES.map((cat) => {
            const isActive = selectedCat === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                onPress={() => setSelectedCat(cat.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={cat.icon}
                  size={14}
                  color={isActive ? '#FFFFFF' : COLORS.primary}
                />
                <Text style={[styles.categoryLabel, isActive && styles.categoryLabelActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Phrases Virtualized List */}
      <FlatList
        data={filteredPhrases}
        keyExtractor={(item) => item.id}
        renderItem={renderPhraseItem}
        initialNumToRender={12}
        maxToRenderPerBatch={15}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.countRow}>
            <Text style={styles.countText}>
              Showing <Text style={styles.countBold}>{filteredPhrases.length}</Text> Conversational Lines
            </Text>
            <TouchableOpacity
              style={styles.practiceBtn}
              onPress={() => navigation && navigation.navigate && navigation.navigate('QuizTab', { category: 'Phrases' })}
            >
              <Ionicons name="trophy" size={12} color={COLORS.primary} style={{ marginRight: 4 }} />
              <Text style={styles.practiceBtnText}>Practice Quiz</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="search" size={40} color="#CBD5E1" style={{ marginBottom: 8 }} />
            <Text style={styles.emptyTitle}>No Matching Phrases Found</Text>
            <Text style={styles.emptySub}>Try searching for "Welcome", "Price", "Water", or "Doctor".</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchSection: {
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  clearSearch: {
    fontSize: 16,
    color: '#94A3B8',
    padding: 4,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryEmoji: {
    fontSize: 13,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  categoryLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  countText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  countBold: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  practiceBtn: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  practiceBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  phraseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  phraseTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  phraseLeftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  phraseNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phraseNumberText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
  },
  sourashtraLine: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 28,
  },
  pronounceLine: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 10,
  },
  translationCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 6,
  },
  transRow: {
    gap: 2,
  },
  langTagTamil: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: 0.5,
  },
  tamilText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  langTagTanglish: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.5,
  },
  tanglishText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#047857',
  },
  transDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  langTagEnglish: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  englishText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
  nestedExBox: {
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  nestedExTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400E',
  },
  nestedExSour: {
    fontSize: 13,
    fontWeight: '700',
    color: '#78350F',
    marginTop: 2,
  },
  nestedExMean: {
    fontSize: 12,
    color: '#92400E',
    marginTop: 1,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyEmoji: {
    fontSize: 44,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
});

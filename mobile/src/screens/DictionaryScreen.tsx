import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../constants/theme';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { AudioButton } from '../components/AudioButton';
import { Word } from '../types';
import seedWords from '../data/verified_seed_words.json';
import { CustomWordsService } from '../services/customWordsService';
import { getTanglish } from '../utils/tanglish';

export default function DictionaryScreen({ navigation }: any) {
  const [wordsList, setWordsList] = useState<Word[]>(seedWords as any);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    // Load local seed + custom AI learned words
    CustomWordsService.getAllWords().then((all) => {
      if (all && all.length > 0) {
        setWordsList(all);
      }
    });

    // Attempt live fetch from Backend
    fetch('http://localhost:8080/api/words')
      .then((res) => res.json())
      .then((json) => {
        if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
          setWordsList(json.data);
        }
      })
      .catch(() => {
        // Fallback to local verified dataset
      });
  }, []);

  // Dynamically extract categories from the actual words list
  const categories = useMemo(() => {
    const cats = new Set<string>();
    wordsList.forEach((w: any) => {
      if (w.category && typeof w.category === 'string') {
        cats.add(w.category.trim());
      }
    });
    return ['All', ...Array.from(cats).sort()];
  }, [wordsList]);

  const filteredWords = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q && selectedCategory === 'All') {
      return wordsList;
    }

    return wordsList.filter((word) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        word.category?.toLowerCase() === selectedCategory.toLowerCase();

      if (!matchesCategory) return false;
      if (!q) return true;

      return (
        word.sourashtra?.toLowerCase().includes(q) ||
        (word.sourashtraScript && word.sourashtraScript.includes(q)) ||
        word.english?.toLowerCase().includes(q) ||
        word.tamil?.toLowerCase().includes(q) ||
        (word.tanglish && word.tanglish.toLowerCase().includes(q)) ||
        (word.pronunciation && word.pronunciation.toLowerCase().includes(q))
      );
    });
  }, [wordsList, searchQuery, selectedCategory]);

  const renderWordItem = useCallback(({ item: word }: { item: Word }) => {
    const tanglishVal = word.tanglish || getTanglish(word.tamil);

    return (
      <Card style={styles.wordCard}>
        <View style={styles.wordHeader}>
          <View style={{ flex: 1 }}>
            {word.sourashtraScript ? (
              <Text style={styles.nativeScriptText}>{word.sourashtraScript}</Text>
            ) : null}

            <View style={styles.sourashtraRow}>
              <Text style={styles.sourashtraText}>{word.sourashtra}</Text>
              {word.pronunciation && (
                <View style={styles.pronounceBadge}>
                  <Text style={styles.pronunciationText}>
                    🗣️ [{word.pronunciation}]
                  </Text>
                </View>
              )}
            </View>

            {/* 3 Language Translation Rows */}
            <View style={styles.transBox}>
              <View style={styles.transRow}>
                <View style={styles.tagTamil}>
                  <Text style={styles.tagTamilText}>🇮🇳 தமிழ்</Text>
                </View>
                <Text style={styles.tamilText}>{word.tamil}</Text>
              </View>

              <View style={styles.transRow}>
                <View style={styles.tagTanglish}>
                  <Text style={styles.tagTanglishText}>🅰️ Tanglish</Text>
                </View>
                <Text style={styles.tanglishText}>{tanglishVal}</Text>
              </View>

              <View style={styles.transRow}>
                <View style={styles.tagEnglish}>
                  <Text style={styles.tagEnglishText}>🇬🇧 English</Text>
                </View>
                <Text style={styles.englishText}>{word.english}</Text>
              </View>
            </View>
          </View>

          <AudioButton
            word={word.sourashtra}
            pronunciation={word.pronunciation}
            size="small"
          />
        </View>

        {/* Example sentence if available */}
        {word.examples && word.examples.length > 0 && word.examples[0].sourashtra && (
          <View style={styles.exampleContainer}>
            <Text style={styles.exampleLabel}>💡 Example Sentence (உதாரண வாக்கியம்):</Text>
            <Text style={styles.exampleSourashtra}>
              {word.examples[0].sourashtra}
            </Text>
            <Text style={styles.exampleTamil}>
              {word.examples[0].tamil}
              {word.examples[0].english ? ` (${word.examples[0].english})` : ''}
            </Text>
          </View>
        )}

        <View style={styles.footerRow}>
          <Badge label={word.category || 'General'} variant="primary" />
          <Badge
            label={word.sourcePage ? `Page ${word.sourcePage}` : 'Verified'}
            variant="source"
          />
        </View>
      </Card>
    );
  }, []);

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>🔎</Text>
      <Text style={styles.emptyText}>No verified words match "{searchQuery}"</Text>
      <Text style={styles.emptySub}>
        Try searching English, Tamil, Tanglish, or phonetic Sourashtra.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="Verified Dictionary"
        subtitle={`முழு அகராதி (${filteredWords.length.toLocaleString()} Words)`}
        onBack={navigation?.canGoBack() ? () => navigation.goBack() : undefined}
      />

      {/* Search Input Bar */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.input}
            placeholder="Search 8,585+ words in Tamil, English, Sourashtra..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtnBox}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
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
                  styles.categoryChipText,
                  selectedCategory === cat && styles.categoryChipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Virtualized Words FlatList for instant smooth performance */}
      <FlatList
        data={filteredWords}
        keyExtractor={(item) => item.id}
        renderItem={renderWordItem}
        initialNumToRender={12}
        maxToRenderPerBatch={15}
        windowSize={5}
        removeClippedSubviews={Platform.OS !== 'web'}
        contentContainerStyle={styles.container}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  searchBarContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 8,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  clearBtnBox: {
    padding: 6,
  },
  clearBtn: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '700',
  },
  categoryScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  categoryChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  container: {
    padding: 16,
    paddingBottom: 40,
    gap: 12,
  },
  wordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...SHADOWS.small,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  nativeScriptText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#7C3AED',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  sourashtraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  sourashtraText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  pronounceBadge: {
    backgroundColor: '#ECFDF5',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  pronunciationText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '700',
  },
  transBox: {
    gap: 4,
  },
  transRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagTamil: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    width: 65,
    alignItems: 'center',
  },
  tagTamilText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#92400E',
  },
  tamilText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
  },
  tagTanglish: {
    backgroundColor: '#E0F2FE',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    width: 65,
    alignItems: 'center',
  },
  tagTanglishText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0369A1',
  },
  tanglishText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0284C7',
    flex: 1,
  },
  tagEnglish: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    width: 65,
    alignItems: 'center',
  },
  tagEnglishText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#475569',
  },
  englishText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    flex: 1,
  },
  exampleContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  exampleLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1E40AF',
    marginBottom: 2,
  },
  exampleSourashtra: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  exampleTamil: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
});

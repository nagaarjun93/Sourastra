import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
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
import weavingData from '../data/sourashtra_weaving_heritage.json';
import marriageData from '../data/sourashtra_marriage_culture.json';
import literaryData from '../data/sourashtra_literary_words.json';

type TabKey = 'weaving' | 'marriage' | 'literature';

export default function HeritageScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<TabKey>('weaving');
  const [searchQuery, setSearchQuery] = useState('');

  // Precomputed datasets
  const weavingItems = useMemo(() => {
    return weavingData.map((item, idx) => ({
      ...item,
      id: `w_${idx}`,
      tanglish: getTanglish(item.tamil || ''),
      tanglishSentence: getTanglish(item.tamilSentence || ''),
    }));
  }, []);

  const marriageItems = useMemo(() => {
    return marriageData.map((item, idx) => ({
      ...item,
      id: `m_${idx}`,
      tanglish: getTanglish(item.tamil || ''),
      tanglishSentence: getTanglish(item.tamilSentence || ''),
    }));
  }, []);

  const literaryItems = useMemo(() => {
    return (literaryData as any[]).map((item, idx) => ({
      ...item,
      id: `lit_${idx}`,
      tanglish: getTanglish(item.tamil || ''),
    }));
  }, []);

  // Filter based on active tab and search query
  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    if (activeTab === 'weaving') {
      if (!q) return weavingItems;
      return weavingItems.filter(
        (i) =>
          (i.sourashtra || '').toLowerCase().includes(q) ||
          (i.tamil || '').toLowerCase().includes(q) ||
          (i.tanglish || '').toLowerCase().includes(q) ||
          (i.english || '').toLowerCase().includes(q) ||
          (i.sourashtraSentence || '').toLowerCase().includes(q)
      );
    } else if (activeTab === 'marriage') {
      if (!q) return marriageItems;
      return marriageItems.filter(
        (i) =>
          (i.sourashtra || '').toLowerCase().includes(q) ||
          (i.tamil || '').toLowerCase().includes(q) ||
          (i.tanglish || '').toLowerCase().includes(q) ||
          (i.english || '').toLowerCase().includes(q) ||
          (i.sourashtraSentence || '').toLowerCase().includes(q)
      );
    } else {
      if (!q) return literaryItems;
      return literaryItems.filter(
        (i) =>
          (i.sourashtra || '').toLowerCase().includes(q) ||
          (i.tamil || '').toLowerCase().includes(q) ||
          (i.tanglish || '').toLowerCase().includes(q)
      );
    }
  }, [activeTab, searchQuery, weavingItems, marriageItems, literaryItems]);

  const renderWeavingOrMarriageItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      const isWeaving = activeTab === 'weaving';
      return (
        <Card style={[styles.itemCard, SHADOWS.small]}>
          <View style={styles.cardHeader}>
            <View style={styles.badgeRow}>
              <View style={styles.indexCircle}>
                <Text style={styles.indexText}>{index + 1}</Text>
              </View>
              <Badge
                label={isWeaving ? '🧵 Handloom' : '💍 Ritual & Culture'}
                variant={isWeaving ? 'primary' : 'secondary'}
              />
            </View>
            <AudioButton
              word={item.sourashtra}
              pronunciation={item.pronunciation}
              tamil={item.tamil}
              size="small"
            />
          </View>

          {/* Core Word */}
          <View style={styles.wordSection}>
            <Text style={styles.sourashtraWord}>{item.sourashtra}</Text>
            {item.pronunciation ? (
              <Text style={styles.pronounceText}>🗣️ [{item.pronunciation}]</Text>
            ) : null}
            <Text style={styles.tamilMeaning}>
              🇮🇳 {item.tamil} • <Text style={styles.tanglishWord}>{item.tanglish}</Text>
            </Text>
            <Text style={styles.englishMeaning}>🇬🇧 {item.english}</Text>
          </View>

          {/* Context Sentence */}
          {item.sourashtraSentence ? (
            <View style={styles.sentenceBox}>
              <View style={styles.sentenceHeader}>
                <Ionicons name="chatbubble-ellipses" size={14} color="#0D9488" />
                <Text style={styles.sentenceLabel}>உதாரண வாக்கியம் (Usage):</Text>
              </View>
              <Text style={styles.sourashtraSentence}>{item.sourashtraSentence}</Text>
              {item.pronunciationSentence ? (
                <Text style={styles.pronounceSentence}>[{item.pronunciationSentence}]</Text>
              ) : null}
              <Text style={styles.tamilSentence}>
                🇮🇳 {item.tamilSentence}
              </Text>
              <Text style={styles.tanglishSentence}>
                🅰️ {item.tanglishSentence}
              </Text>
              <Text style={styles.englishSentence}>
                🇬🇧 {item.englishSentence}
              </Text>
            </View>
          ) : null}
        </Card>
      );
    },
    [activeTab]
  );

  const renderLiteraryItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      return (
        <Card style={[styles.itemCard, SHADOWS.small]}>
          <View style={styles.cardHeader}>
            <View style={styles.badgeRow}>
              <View style={styles.indexCircle}>
                <Text style={styles.indexText}>{index + 1}</Text>
              </View>
              <Badge label="📜 Ramayanam" variant="primary" />
            </View>
            <AudioButton
              word={item.sourashtra}
              tamil={item.tamil}
              size="small"
            />
          </View>

          <View style={styles.wordSection}>
            <Text style={styles.sourashtraWord}>{item.sourashtra}</Text>
            {item.sourashtraScript ? (
              <Text style={styles.scriptText}>சௌராஷ்ட்ர எழுத்து: {item.sourashtraScript}</Text>
            ) : null}
            <Text style={styles.tamilMeaning}>
              🇮🇳 தமிழ்: {item.tamil}
            </Text>
            <Text style={styles.tanglishWord}>
              🅰️ Tanglish: {item.tanglish}
            </Text>
          </View>
        </Card>
      );
    },
    []
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="Heritage & Culture"
        subtitle="கைத்தறி நெசவு, திருமணம் & இலக்கிய மரபு"
        onBack={() => navigation.goBack()}
      />

      {/* Tabs Row */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'weaving' && styles.tabButtonActive]}
          onPress={() => setActiveTab('weaving')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="layers"
            size={16}
            color={activeTab === 'weaving' ? '#FFFFFF' : '#0D9488'}
          />
          <Text
            style={[styles.tabText, activeTab === 'weaving' && styles.tabTextActive]}
          >
            Weaving (32)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'marriage' && styles.tabButtonActive]}
          onPress={() => setActiveTab('marriage')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="heart"
            size={16}
            color={activeTab === 'marriage' ? '#FFFFFF' : '#0D9488'}
          />
          <Text
            style={[styles.tabText, activeTab === 'marriage' && styles.tabTextActive]}
          >
            Rituals (93)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'literature' && styles.tabButtonActive]}
          onPress={() => setActiveTab('literature')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="book"
            size={16}
            color={activeTab === 'literature' ? '#FFFFFF' : '#0D9488'}
          />
          <Text
            style={[styles.tabText, activeTab === 'literature' && styles.tabTextActive]}
          >
            Literature (644)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={[styles.searchBar, SHADOWS.small]}>
          <Ionicons name="search" size={18} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={
              activeTab === 'weaving'
                ? 'Search handloom & weaving terms...'
                : activeTab === 'marriage'
                ? 'Search marriage & ritual terms...'
                : 'Search classical literary words...'
            }
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
      </View>

      {/* Virtualized FlatList */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={
          activeTab === 'literature'
            ? renderLiteraryItem
            : renderWeavingOrMarriageItem
        }
        initialNumToRender={10}
        maxToRenderPerBatch={12}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.countRow}>
            <Text style={styles.countText}>
              Showing <Text style={styles.countBold}>{filteredData.length}</Text> Heritage Items
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="search" size={40} color="#CBD5E1" style={{ marginBottom: 8 }} />
            <Text style={styles.emptyTitle}>No Heritage Terms Found</Text>
            <Text style={styles.emptySub}>
              Try searching in Tamil (e.g. "கைத்தறி", "பூணூல்") or English ("Weaving", "Silk").
            </Text>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  searchSection: {
    backgroundColor: '#FFFFFF',
    paddingTop: 8,
    paddingBottom: 10,
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
    height: 46,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  countRow: {
    marginBottom: 12,
  },
  countText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  countBold: {
    fontWeight: '700',
    color: '#0D9488',
  },
  itemCard: {
    marginBottom: 14,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  indexCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  wordSection: {
    marginBottom: 10,
  },
  sourashtraWord: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  scriptText: {
    fontSize: 15,
    color: '#7C3AED',
    marginBottom: 4,
    fontWeight: '600',
  },
  pronounceText: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '600',
    marginBottom: 6,
  },
  tamilMeaning: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  tanglishWord: {
    color: '#0D9488',
    fontWeight: '600',
  },
  englishMeaning: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  sentenceBox: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  sentenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  sentenceLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  sourashtraSentence: {
    fontSize: 16,
    fontWeight: '700',
    color: '#134E4A',
    marginBottom: 4,
  },
  pronounceSentence: {
    fontSize: 12,
    color: '#059669',
    marginBottom: 4,
  },
  tamilSentence: {
    fontSize: 13,
    color: '#1E293B',
    marginBottom: 2,
  },
  tanglishSentence: {
    fontSize: 12,
    color: '#0D9488',
    marginBottom: 2,
  },
  englishSentence: {
    fontSize: 12,
    color: '#475569',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

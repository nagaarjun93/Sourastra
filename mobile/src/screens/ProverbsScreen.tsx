import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { AudioButton } from '../components/AudioButton';
import { COLORS, SHADOWS } from '../constants/theme';
import proverbsData from '../data/sourashtra_proverbs.json';

interface Proverb {
  id: string;
  sourashtra: string;
  sourashtraScript: string;
  pronunciation: string;
  tamil: string;
  tanglish: string;
  english: string;
  explanation: string;
  category: string;
}

export default function ProverbsScreen({ navigation }: { navigation: any }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    proverbsData.forEach((p: any) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, []);

  // Filter proverbs based on query and category
  const filteredProverbs = useMemo(() => {
    return (proverbsData as Proverb[]).filter((p) => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        p.sourashtra.toLowerCase().includes(q) ||
        (p.sourashtraScript && p.sourashtraScript.includes(q)) ||
        p.pronunciation.toLowerCase().includes(q) ||
        p.tamil.toLowerCase().includes(q) ||
        (p.tanglish && p.tanglish.toLowerCase().includes(q)) ||
        p.english.toLowerCase().includes(q) ||
        p.explanation.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedCategory]);

  // Featured Proverb of the Day based on calendar day
  const dailyProverb = useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
    );
    const idx = dayOfYear % proverbsData.length;
    return (proverbsData as Proverb[])[idx];
  }, []);

  const handleShareProverb = async (item: Proverb) => {
    try {
      const shareContent = `📜 Sourashtra Proverb (ஜுன்னவாசு):\n\n${item.sourashtraScript ? item.sourashtraScript + '\n' : ''}${item.sourashtra}\n[${item.pronunciation}]\n\n🇮🇳 தமிழ்: ${item.tamil}\n🅰️ Tanglish: ${item.tanglish}\n🇬🇧 English: ${item.english}\n\n💡 விளக்கம்: ${item.explanation}\n\n- Learned via Sourashtra Learn App`;
      await Share.share({ message: shareContent });
    } catch (e) {
      console.warn('Share error:', e);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header with Back Navigation */}
      <Header
        title="Sourashtra Proverbs"
        subtitle="மரபுத் தொடர்கள் & பழமொழிகள் (ஜுன்னவாசு)"
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Featured Proverb of the Day Card */}
        {dailyProverb && (
          <Card style={styles.spotlightCard}>
            <View style={styles.spotlightHeader}>
              <View style={styles.spotlightBadgeRow}>
                <Text style={{ fontSize: 18 }}>📜</Text>
                <Text style={styles.spotlightBadgeText}>PROVERB OF THE DAY • ஜுன்னவாசு</Text>
              </View>
              <Badge label={dailyProverb.category} variant="secondary" />
            </View>

            {dailyProverb.sourashtraScript ? (
              <Text style={styles.spotlightNativeScript}>{dailyProverb.sourashtraScript}</Text>
            ) : null}

            <Text style={styles.spotlightSourasText}>{dailyProverb.sourashtra}</Text>
            <Text style={styles.spotlightPronounce}>🗣️ [{dailyProverb.pronunciation}]</Text>

            <View style={styles.spotlightMeaningBox}>
              <View style={styles.meaningLine}>
                <Text style={styles.langLabel}>🇮🇳 தமிழ்:</Text>
                <Text style={styles.langVal}>{dailyProverb.tamil}</Text>
              </View>
              {dailyProverb.tanglish ? (
                <View style={styles.meaningLine}>
                  <Text style={styles.langLabelTanglish}>🅰️ Tanglish:</Text>
                  <Text style={styles.langValTanglish}>{dailyProverb.tanglish}</Text>
                </View>
              ) : null}
              <View style={styles.meaningLine}>
                <Text style={styles.langLabel}>🇬🇧 English:</Text>
                <Text style={styles.langVal}>{dailyProverb.english}</Text>
              </View>
            </View>

            <View style={styles.explanationBox}>
              <Text style={styles.explanationLabel}>💡 பண்பாட்டு விளக்கம் (Wisdom):</Text>
              <Text style={styles.explanationText}>{dailyProverb.explanation}</Text>
            </View>

            <View style={styles.spotlightActionsRow}>
              <AudioButton
                word={dailyProverb.sourashtra}
                pronunciation={dailyProverb.pronunciation}
                size="medium"
              />
              <TouchableOpacity
                style={styles.shareBtn}
                activeOpacity={0.7}
                onPress={() => handleShareProverb(dailyProverb)}
              >
                <Ionicons name="share-social-outline" size={18} color="#92400E" />
                <Text style={styles.shareBtnText}>Share Proverb</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search proverbs in Tamil, English, or Sourashtra..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {categories.map((cat, idx) => (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.8}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.categoryPill,
                selectedCategory === cat && styles.categoryPillActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryPillText,
                  selectedCategory === cat && styles.categoryPillTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Proverbs List Header */}
        <View style={styles.listHeaderRow}>
          <Text style={styles.listCountText}>
            Showing {filteredProverbs.length} Proverbs (பழமொழிகள்)
          </Text>
        </View>

        {/* Proverbs Cards */}
        <View style={styles.proverbsList}>
          {filteredProverbs.map((item) => (
            <Card key={item.id} style={styles.proverbCard}>
              <View style={styles.proverbHeaderRow}>
                <Badge label={item.category} variant="secondary" />
                <TouchableOpacity
                  onPress={() => handleShareProverb(item)}
                  style={styles.cardShareBtn}
                  activeOpacity={0.7}
                >
                  <Ionicons name="share-outline" size={16} color="#64748B" />
                </TouchableOpacity>
              </View>

              {item.sourashtraScript ? (
                <Text style={styles.cardNativeScript}>{item.sourashtraScript}</Text>
              ) : null}

              <Text style={styles.cardSourasText}>{item.sourashtra}</Text>
              <Text style={styles.cardPronounce}>🗣️ [{item.pronunciation}]</Text>

              <View style={styles.cardTransBox}>
                <View style={styles.cardTransLine}>
                  <Text style={styles.cardTransLabel}>🇮🇳 தமிழ்:</Text>
                  <Text style={styles.cardTransVal}>{item.tamil}</Text>
                </View>
                {item.tanglish ? (
                  <View style={styles.cardTransLine}>
                    <Text style={styles.cardTransLabelTanglish}>🅰️ Tanglish:</Text>
                    <Text style={styles.cardTransValTanglish}>{item.tanglish}</Text>
                  </View>
                ) : null}
                <View style={styles.cardTransLine}>
                  <Text style={styles.cardTransLabel}>🇬🇧 English:</Text>
                  <Text style={styles.cardTransVal}>{item.english}</Text>
                </View>
              </View>

              {item.explanation ? (
                <View style={styles.cardExplBox}>
                  <Text style={styles.cardExplLabel}>💡 பண்பாட்டு பொருள்:</Text>
                  <Text style={styles.cardExplText}>{item.explanation}</Text>
                </View>
              ) : null}

              <View style={styles.cardFooterRow}>
                <View style={styles.cardFooterLeft}>
                  <Text style={styles.cardFooterHint}>Ancient Sourashtra Wisdom</Text>
                </View>
                <AudioButton
                  word={item.sourashtra}
                  pronunciation={item.pronunciation}
                  size="medium"
                />
              </View>
            </Card>
          ))}
        </View>
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
  spotlightCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FDE68A',
    ...SHADOWS.medium,
  },
  spotlightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  spotlightBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  spotlightBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
    letterSpacing: 0.5,
  },
  spotlightNativeScript: {
    fontSize: 20,
    fontWeight: '800',
    color: '#B45309',
    marginBottom: 4,
    lineHeight: 28,
  },
  spotlightSourasText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#451A03',
    lineHeight: 26,
  },
  spotlightPronounce: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 12,
  },
  spotlightMeaningBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    gap: 6,
    marginBottom: 10,
  },
  meaningLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  langLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    width: 80,
  },
  langVal: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    lineHeight: 18,
  },
  langLabelTanglish: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
    width: 80,
  },
  langValTanglish: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#0369A1',
    lineHeight: 18,
  },
  explanationBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  explanationLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 2,
  },
  explanationText: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 17,
  },
  spotlightActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FDE68A',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  shareBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#78350F',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.small,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
  },
  clearBtn: {
    padding: 4,
  },
  categoryScroll: {
    marginBottom: 16,
  },
  categoryScrollContent: {
    gap: 8,
  },
  categoryPill: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listHeaderRow: {
    marginBottom: 12,
  },
  listCountText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  proverbsList: {
    gap: 14,
  },
  proverbCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...SHADOWS.small,
  },
  proverbHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardShareBtn: {
    padding: 4,
  },
  cardNativeScript: {
    fontSize: 17,
    fontWeight: '700',
    color: '#7C3AED',
    marginBottom: 4,
    lineHeight: 24,
  },
  cardSourasText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 24,
  },
  cardPronounce: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 10,
  },
  cardTransBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
    marginBottom: 10,
  },
  cardTransLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cardTransLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    width: 75,
  },
  cardTransVal: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
    lineHeight: 18,
  },
  cardTransLabelTanglish: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
    width: 75,
  },
  cardTransValTanglish: {
    flex: 1,
    fontSize: 13,
    color: '#0369A1',
    lineHeight: 18,
  },
  cardExplBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
    marginBottom: 10,
  },
  cardExplLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 1,
  },
  cardExplText: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 16,
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  cardFooterLeft: {
    flex: 1,
  },
  cardFooterHint: {
    fontSize: 11,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
});

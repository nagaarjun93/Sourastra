import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import gotraData from '../data/sourashtra_gotras.json';

interface GotraGroup {
  gotra: string;
  familyNames: string[];
  count: number;
}

export default function GotraFinderScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGotraFilter, setSelectedGotraFilter] = useState('All');

  const allGotraGroups: GotraGroup[] = useMemo(() => {
    return (gotraData.grouped || []).sort((a: GotraGroup, b: GotraGroup) =>
      a.gotra.localeCompare(b.gotra)
    );
  }, []);

  // Top filter chips of prominent Gotras
  const filterChips = useMemo(() => {
    const list = allGotraGroups.map((g) => g.gotra);
    return ['All', ...list];
  }, [allGotraGroups]);

  // Direct match when user enters a specific family surname
  const matchedFamilyResult = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || q.length < 2) return null;

    const matches: { gotra: string; familyName: string }[] = [];
    (gotraData.flatList || []).forEach((item: any) => {
      if (item.familyName && item.familyName.toLowerCase().includes(q)) {
        matches.push(item);
      }
    });

    return matches.length > 0 ? matches : null;
  }, [searchQuery]);

  // Filtered list of Gotra groups
  const filteredGroups = useMemo(() => {
    let result = allGotraGroups;

    if (selectedGotraFilter !== 'All') {
      result = result.filter((g) => g.gotra.toLowerCase() === selectedGotraFilter.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result
        .map((g) => {
          const gotraMatches = g.gotra.toLowerCase().includes(q);
          const matchedNames = g.familyNames.filter((name) =>
            name.toLowerCase().includes(q)
          );
          if (gotraMatches) {
            return g; // Return all family names if Gotra name matches
          }
          if (matchedNames.length > 0) {
            return {
              ...g,
              familyNames: matchedNames,
              count: matchedNames.length,
            };
          }
          return null;
        })
        .filter(Boolean) as GotraGroup[];
    }

    return result;
  }, [allGotraGroups, selectedGotraFilter, searchQuery]);

  const renderGotraItem = useCallback(
    ({ item, index }: { item: GotraGroup; index: number }) => {
      return (
        <Card style={[styles.gotraCard, SHADOWS.small]}>
          {/* Gotra Header */}
          <View style={styles.gotraHeader}>
            <View style={styles.gotraIconBox}>
              <Text style={{ fontSize: 20 }}>🔱</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.gotraName}>{item.gotra} Gotra</Text>
              <Text style={styles.gotraTamilSub}>ரிஷி கோத்ரம் ({item.count} குடும்பப் பெயர்கள்)</Text>
            </View>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{item.count} Surnames</Text>
            </View>
          </View>

          {/* Family Names Pills */}
          <View style={styles.familyNamesContainer}>
            {item.familyNames.map((name, idx) => {
              const isMatch =
                searchQuery.trim() &&
                name.toLowerCase().includes(searchQuery.trim().toLowerCase());
              return (
                <View
                  key={`${item.gotra}_${name}_${idx}`}
                  style={[styles.namePill, isMatch ? styles.namePillHighlight : null]}
                >
                  <Text style={[styles.namePillText, isMatch ? styles.namePillTextHighlight : null]}>
                    {name}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>
      );
    },
    [searchQuery]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="Gothru & Lineage Finder"
        subtitle="கோத்ரங்கள் & குடும்பப் பெயர்கள் (1,129 Surnames)"
        onBack={() => navigation.goBack()}
      />

      {/* Hero Search Box */}
      <View style={styles.searchSection}>
        <View style={[styles.searchBar, SHADOWS.small]}>
          <Ionicons name="search" size={18} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Type your family surname (e.g. Kesavun, Sengun)..."
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

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filterChips.map((g) => {
            const isActive = selectedGotraFilter === g;
            return (
              <TouchableOpacity
                key={g}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setSelectedGotraFilter(g)}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {g === 'All' ? 'All (65 Gotras)' : `${g} Gotra`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Instant Lineage Match Banner */}
      {matchedFamilyResult && (
        <View style={styles.matchBanner}>
          <View style={styles.matchBannerHeader}>
            <Ionicons name="sparkles" size={18} color="#7C3AED" />
            <Text style={styles.matchBannerTitle}>Lineage Lookup Result:</Text>
          </View>
          <Text style={styles.matchBannerDesc}>
            Found <Text style={{ fontWeight: '700' }}>{matchedFamilyResult.length}</Text> family surname match(es):
          </Text>
          <View style={styles.matchList}>
            {matchedFamilyResult.slice(0, 5).map((m, i) => (
              <View key={`match_${i}`} style={styles.matchCard}>
                <Text style={styles.matchFamilyName}>👤 {m.familyName}</Text>
                <Text style={styles.matchGotraName}>➔ 🔱 {m.gotra} Gotra</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Gotras FlatList */}
      <FlatList
        data={filteredGroups}
        keyExtractor={(item) => item.gotra}
        renderItem={renderGotraItem}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.countRow}>
            <Text style={styles.countText}>
              Showing <Text style={styles.countBold}>{filteredGroups.length}</Text> Rishi Gotras (1,129 Family Names)
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="search" size={40} color="#CBD5E1" style={{ marginBottom: 8 }} />
            <Text style={styles.emptyTitle}>No Gotras or Surnames Found</Text>
            <Text style={styles.emptySub}>
              Try searching with common spellings like "Aathin", "Kesavun", "Bheemun", or "Bharadwaja".
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
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  filterScroll: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  matchBanner: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  matchBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  matchBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#6D28D9',
  },
  matchBannerDesc: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  matchList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C4B5FD',
    gap: 6,
  },
  matchFamilyName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  matchGotraName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7C3AED',
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
    color: '#7C3AED',
  },
  gotraCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  gotraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  gotraIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  gotraName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
  },
  gotraTamilSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
  },
  familyNamesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  namePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  namePillHighlight: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  namePillText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
  },
  namePillTextHighlight: {
    color: '#B45309',
    fontWeight: '800',
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

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { ProgressService, UserProgressData } from '../services/progressService';
import seedWords from '../data/verified_seed_words.json';
import seedLessons from '../data/verified_seed_lessons.json';

interface ProgressScreenProps {
  navigation?: any;
}

export default function ProgressScreen({ navigation }: ProgressScreenProps) {
  const [progress, setProgress] = useState<UserProgressData | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const data = await ProgressService.loadProgress();
    setProgress(data);
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
    const unsubscribe = ProgressService.subscribe((p) => {
      setProgress(p);
    });
    return unsubscribe;
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const totalWords = seedWords.length;
  const totalChapters = seedLessons.length;
  const currentXp = progress?.totalXp ?? 0;
  const streak = progress?.streakDays ?? 1;
  const wordsLearned = progress?.wordsLearned ?? 0;
  const wordsPercent = Math.round((wordsLearned / totalWords) * 100);
  const quizzesTaken = progress?.quizzesTaken ?? 0;
  const history = progress?.quizHistory || [];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="📊 My Progress & Stats"
        subtitle="உங்கள் சௌராஷ்ட்ர கற்றல் முன்னேற்ற விவரங்கள்"
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Main XP & Level Banner */}
        <Card style={styles.mainBanner}>
          <View style={styles.bannerRow}>
            <View style={styles.levelBadgeCircle}>
              <Text style={styles.levelEmoji}>🔥</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.xpNumber}>{currentXp} XP</Text>
              <Text style={styles.levelTitle}>Level: Explorer Learner</Text>
              <Text style={styles.streakText}>⚡ {streak} Day Learning Streak</Text>
            </View>
          </View>
        </Card>

        {/* 2x2 Stats Grid */}
        <View style={styles.gridContainer}>
          <Card style={styles.statCard}>
            <Text style={styles.statEmoji}>🔤</Text>
            <Text style={styles.statNumber}>{wordsLearned} / {totalWords}</Text>
            <Text style={styles.statLabel}>Words Mastered</Text>
            <View style={styles.miniBarBg}>
              <View style={[styles.miniBarFill, { width: `${Math.max(5, wordsPercent)}%` }]} />
            </View>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statEmoji}>📚</Text>
            <Text style={styles.statNumber}>{totalChapters}</Text>
            <Text style={styles.statLabel}>Total Chapters</Text>
            <Text style={styles.statSub}>160 Pages Verified</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statEmoji}>🎯</Text>
            <Text style={styles.statNumber}>{quizzesTaken}</Text>
            <Text style={styles.statLabel}>Quizzes Completed</Text>
            <Text style={styles.statSub}>Dynamic Generator</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statEmoji}>🏆</Text>
            <Text style={styles.statNumber}>{Math.round(currentXp / 50)}</Text>
            <Text style={styles.statLabel}>Achievements</Text>
            <Text style={styles.statSub}>Unlocked Badges</Text>
          </Card>
        </View>

        {/* Learning Roadmap Progress */}
        <Text style={styles.sectionTitle}>CURRICULUM CHAPTER MASTERY</Text>
        <Card style={styles.roadmapCard}>
          {seedLessons.map((chap: any, idx: number) => {
            const isCompleted = idx < 2;
            return (
              <View key={chap.id} style={styles.chapterProgressRow}>
                <View style={[styles.stepCircle, isCompleted && styles.stepCircleDone]}>
                  <Text style={styles.stepCircleText}>{isCompleted ? '✓' : `${idx + 1}`}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.chapRoadmapTitle}>Chapter {chap.chapterNumber}: {chap.title}</Text>
                  <Text style={styles.chapRoadmapTamil}>{chap.tamilTitle}</Text>
                </View>
                <Badge
                  label={isCompleted ? 'Mastered' : 'In Progress'}
                  variant={isCompleted ? 'success' : 'source'}
                />
              </View>
            );
          })}
        </Card>

        {/* Recent Quiz Performance History */}
        <Text style={styles.sectionTitle}>RECENT QUIZ ATTEMPTS</Text>
        {history.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🎯</Text>
            <Text style={styles.emptyText}>No quizzes taken yet.</Text>
            <TouchableOpacity
              style={styles.startQuizBtn}
              onPress={() => navigation?.navigate('QuizTab')}
            >
              <Text style={styles.startQuizBtnText}>Take a Practice Quiz 🚀</Text>
            </TouchableOpacity>
          </Card>
        ) : (
          <View style={{ gap: 8 }}>
            {history.slice(0, 5).map((item: any, i: number) => (
              <Card key={i} style={styles.historyCard}>
                <View style={styles.historyRow}>
                  <View>
                    <Text style={styles.historyTitle}>{item.category || 'All Categories'} Quiz</Text>
                    <Text style={styles.historyDate}>{new Date(item.date).toLocaleDateString()}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.historyScore, item.percentage >= 80 ? styles.scoreGreen : styles.scoreOrange]}>
                      {item.score} / {item.total} ({item.percentage}%)
                    </Text>
                    <Badge label={item.percentage >= 80 ? 'Pass' : 'Practice'} variant={item.percentage >= 80 ? 'success' : 'source'} />
                  </View>
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
  mainBanner: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  levelBadgeCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelEmoji: {
    fontSize: 28,
  },
  xpNumber: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  levelTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E0E7FF',
    marginTop: 2,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FDE047',
    marginTop: 4,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flexBasis: '48%',
    flexGrow: 1,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  statEmoji: {
    fontSize: 22,
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  statSub: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  miniBarBg: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  miniBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 6,
  },
  roadmapCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  chapterProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleDone: {
    backgroundColor: '#DCFCE7',
  },
  stepCircleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  chapRoadmapTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  chapRoadmapTamil: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    borderRadius: 16,
  },
  emptyEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 14,
  },
  startQuizBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  startQuizBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  historyCard: {
    padding: 14,
    borderRadius: 14,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  historyDate: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  historyScore: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  scoreGreen: {
    color: '#16A34A',
  },
  scoreOrange: {
    color: '#EA580C',
  },
});

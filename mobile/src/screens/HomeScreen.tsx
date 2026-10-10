import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { AudioButton } from '../components/AudioButton';
import { ProgressService, UserProgressData } from '../services/progressService';
import { getTanglish } from '../utils/tanglish';
import seedWords from '../data/verified_seed_words.json';
import seedLessons from '../data/verified_seed_lessons.json';

interface HomeScreenProps {
  navigation: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const totalWordsCount = seedWords.length;
  const totalChaptersCount = seedLessons.length;

  const [userProgress, setUserProgress] = useState<UserProgressData | null>(null);
  const [dailyBonusNotice, setDailyBonusNotice] = useState<string | null>(null);

  useEffect(() => {
    // Record login / daily session and calculate accurate streak & XP bonus
    ProgressService.recordDailyLogin().then(({ progress, bonusXp, isNewDay }) => {
      setUserProgress(progress);
      if (isNewDay && bonusXp > 0) {
        setDailyBonusNotice(`🔥 Day Streak Active: Day ${progress.streakDays}! (+${bonusXp} XP Daily Bonus)`);
      }
    });

    const unsubscribe = ProgressService.subscribe((p) => {
      setUserProgress(p);
    });

    return unsubscribe;
  }, []);

  // Daily seed based on current calendar date
  const dayOfYear = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }, []);

  // Candidate pool of quality words for Word of the Day
  const candidateWords = useMemo(() => {
    const list = seedWords.filter((w: any) => w.sourashtra && w.tamil && w.english && w.sourashtra.length <= 18);
    return list.length > 0 ? list : seedWords;
  }, []);

  // Pick a featured Word of the Day that changes every single day
  const wordOfTheDay = useMemo(() => {
    const index = (dayOfYear * 17 + 5) % candidateWords.length;
    return candidateWords[index] || candidateWords[0];
  }, [dayOfYear, candidateWords]);

  // Pool of authentic daily conversational phrases that rotates every day
  const phrasePool = useMemo(() => {
    const fromWords = seedWords.filter((w: any) => w.category === 'Phrases' || (w.sourashtra && w.sourashtra.includes('?')));
    const defaults = [
      {
        sourashtra: 'துமி கெஸ்கொ அஸாஸ்?',
        pronunciation: 'Dhumi khesko asaasa?',
        tamil: 'நீங்கள் எப்படி இருக்கிறீர்கள்?',
        tanglish: 'Neengal eppadi irukkireergal?',
        english: 'How are you?',
        situational: 'Daily Greeting (வணக்கம்)',
      },
      {
        sourashtra: 'கைஸே ஆஸா?',
        pronunciation: 'Kaise aasa?',
        tamil: 'எப்படி இருக்கிறாய்?',
        tanglish: 'Eppadi irukkiraay?',
        english: 'How are you?',
        situational: 'Friendly Talk (நலம் விசாரிப்பு)',
      },
      {
        sourashtra: 'துமி காய் கரா?',
        pronunciation: 'Thumi kaai kara?',
        tamil: 'நீங்கள் என்ன செய்கிறீர்கள்?',
        tanglish: 'Neengal enna seygireergal?',
        english: 'What are you doing?',
        situational: 'Conversation (உரையாடல்)',
      },
      {
        sourashtra: 'இக்கடே வா!',
        pronunciation: 'Ikkade vaa!',
        tamil: 'இங்கே வா!',
        tanglish: 'Inge vaa!',
        english: 'Come here!',
        situational: 'Daily Call (அழைத்தல்)',
      },
      {
        sourashtra: 'மாலா நகோ!',
        pronunciation: 'Maala nako!',
        tamil: 'எனக்கு வேண்டாம்!',
        tanglish: 'Enakku vendaam!',
        english: "I don't want it!",
        situational: 'Daily Request (மறுப்பு)',
      },
      {
        sourashtra: 'குடே போகா?',
        pronunciation: 'Kude boga?',
        tamil: 'எங்கே போகிறாய்?',
        tanglish: 'Enge pogiraay?',
        english: 'Where are you going?',
        situational: 'Travel & Enquiry (பயணம்)',
      },
      {
        sourashtra: 'ஜா2க்ரதே!',
        pronunciation: 'Jaagrade!',
        tamil: 'ஜாக்கிரதை!',
        tanglish: 'Jaakkiradhai!',
        english: 'Be careful!',
        situational: 'Precaution (பாதுகாப்பு)',
      },
      {
        sourashtra: 'தாள்!',
        pronunciation: 'Taal!',
        tamil: 'காத்திரு!',
        tanglish: 'Kaathiru!',
        english: 'Wait!',
        situational: 'Action (காத்திருத்தல்)',
      },
      {
        sourashtra: 'தந்யவாத்! சொக்கட் அஸா!',
        pronunciation: 'Dhanyavaad! Cho\'kkat asaa!',
        tamil: 'நன்றி! நன்றாக இருக்கிறது!',
        tanglish: 'Nandri! Nandraaga irukkiradhu!',
        english: 'Thank you! It is very good!',
        situational: 'Appreciation (பாராட்டு)',
      },
      {
        sourashtra: 'ஹொவ், ஏக் கப் சாய் திய்யா!',
        pronunciation: 'Hov, ek cup chaai dhiyya!',
        tamil: 'ஆம், ஒரு கப் டீ கொடுங்கள்!',
        tanglish: 'Aam, oru cup tea kodungal!',
        english: 'Yes, please give one cup of tea!',
        situational: 'Tea Shop (டீக்கடை)',
      }
    ];

    if (fromWords.length > 0) {
      const mapped = fromWords.map((fw: any) => ({
        sourashtra: fw.sourashtra,
        pronunciation: fw.pronunciation || fw.tanglish || fw.sourashtra,
        tamil: fw.tamil,
        tanglish: getTanglish(fw.tamil),
        english: fw.english,
        situational: fw.category || 'Daily Phrase (தினசரி வாக்கியம்)',
      }));
      return [...defaults, ...mapped];
    }
    return defaults;
  }, []);

  // Pick a featured Conversational Phrase of the Day that rotates daily
  const phraseOfTheDay = useMemo(() => {
    const index = (dayOfYear * 7 + 3) % phrasePool.length;
    return phrasePool[index];
  }, [dayOfYear, phrasePool]);

  const menuItems = useMemo(
    () => [
      {
        id: 'challenge',
        title: '14-Day Learning Challenge',
        tamilSubtitle: '14-நாள் விரைவு சவால் (Level 1)',
        tanglishSubtitle: '14-Naal Viraivu Savaal (Level 2 Unlock Gate)',
        description: 'Step-by-step 14 days curriculum. Pass the Day 14 test (6/8+) to unlock Level 2!',
        badge: '📅 Level 1 Gate',
        screen: 'Challenge',
        icon: 'ribbon',
        iconBg: '#312E81',
        isHero: true,
      },
      {
        id: 'stories',
        title: 'Duolingo Stories',
        tamilSubtitle: 'உரையாடல் கதைகள்',
        tanglishSubtitle: 'Uraiyaadal Kadhaigal (Duolingo Style)',
        description: 'Interactive real-life dialogues with characters, checkpoints, Tanglish, and XP rewards.',
        badge: '🦉 Duolingo Style',
        screen: 'Stories',
        icon: 'chatbubbles',
        iconBg: '#58CC02',
      },
      {
        id: 'podcast',
        title: 'Hands-Free Audio Podcast',
        tamilSubtitle: 'தானியங்கி ஆடியோ பயிற்சி முறை',
        tanglishSubtitle: 'Hands-Free Audio Payirchi (Continuous Loop)',
        description: 'Listen while walking or commuting: speaks Sourashtra, pauses, then speaks Tamil meaning automatically.',
        badge: '🎧 Audio Loop',
        screen: 'Podcast',
        icon: 'headset',
        iconBg: '#0F172A',
      },
      {
        id: 'proverbs',
        title: 'Proverbs & Wisdom (ஜுன்னவாசு)',
        tamilSubtitle: 'மரபுத் தொடர்கள் & பழமொழிகள்',
        tanglishSubtitle: 'Junnavaachu (Ancient Cultural Wisdom)',
        description: 'Authentic Sourashtra proverbs with native script, cultural wisdom, voice pronunciation & sharing.',
        badge: '📜 Junnavaachu',
        screen: 'Proverbs',
        icon: 'bookmark',
        iconBg: '#B45309',
      },
      {
        id: 'gotra',
        title: 'Gothru & Lineage Finder',
        tamilSubtitle: 'கோத்ரங்கள் & குடும்பப் பெயர்கள்',
        tanglishSubtitle: 'Gothru & Kudumba Peyargal (1,129 Surnames)',
        description: 'Explore 65 Rishi Gotras and lookup your family lineage from 1,129 ancestral surnames.',
        badge: '🔱 1,129 Surnames',
        screen: 'GotraFinder',
        icon: 'people',
        iconBg: '#7C3AED',
      },
      {
        id: 'heritage',
        title: 'Heritage & Culture',
        tamilSubtitle: 'நெசவு, சடங்குகள் & இலக்கியம்',
        tanglishSubtitle: 'Nesavu, Sadangugal & Ilakkiyam',
        description: 'Traditional Handloom weaving heritage, marriage rituals, and classical Ramayanam literary vocabulary.',
        badge: '🏺 Cultural Heritage',
        screen: 'Heritage',
        icon: 'sparkles',
        iconBg: '#0D9488',
      },
      {
        id: 'learn',
        title: 'Learn Chapters',
        tamilSubtitle: `பாடங்கள் (${totalChaptersCount} Chapters)`,
        tanglishSubtitle: 'Paadangal (Curriculum)',
        description: 'Structured progressive lessons directly from verified Sourashtra textbook.',
        badge: 'Curriculum',
        screen: 'LearnTab',
        icon: 'book',
        iconBg: '#6366F1',
      },
      {
        id: 'phrases',
        title: 'Conversations & Phrases',
        tamilSubtitle: 'உரையாடல் வாக்கியங்கள்',
        tanglishSubtitle: 'Uraiyaadal Vaakkiyangal (Phrasebook)',
        description: 'Daily speaking lines with Tamil, Tanglish, English, and audio pronunciation.',
        badge: 'Essential',
        screen: 'PhrasesTab',
        icon: 'chatbubbles',
        iconBg: '#0284C7',
      },
      {
        id: 'flashcards',
        title: 'Interactive Flashcards',
        tamilSubtitle: 'ஃப்ளாஷ்கார்டுகள்',
        tanglishSubtitle: 'Flashcard-gal (Memory Drills)',
        description: 'Flip cards with Sourashtra, Tamil, Tanglish, and English translation.',
        badge: 'Interactive',
        screen: 'FlashcardsTab',
        icon: 'albums',
        iconBg: '#EA580C',
      },
      {
        id: 'dictionary',
        title: 'Smart Dictionary',
        tamilSubtitle: `அகராதி (${totalWordsCount.toLocaleString()} Words)`,
        tanglishSubtitle: 'Agaraadhi (4 Languages)',
        description: 'Search Sourashtra, Tamil, Tanglish, and English with voice audio & examples.',
        badge: `${totalWordsCount.toLocaleString()} Words`,
        screen: 'DictionaryTab',
        icon: 'search',
        iconBg: '#059669',
      },
      {
        id: 'practice',
        title: 'Dynamic Practice & Quizzes',
        tamilSubtitle: 'பயிற்சி வினாக்கள்',
        tanglishSubtitle: 'Payirchi Vinaakkal (Quizzes)',
        description: 'Dynamic multi-format quizzes with Tamil & Tanglish hints.',
        badge: 'Quiz Bank',
        screen: 'QuizTab',
        icon: 'trophy',
        iconBg: '#D97706',
      },
      {
        id: 'ai_tutor',
        title: 'Gemini AI Tutor & Translator',
        tamilSubtitle: 'சௌராஷ்ட்ர ஆசிரியர்',
        tanglishSubtitle: 'Sourashtra Aasiriyar (Gemini AI)',
        description: 'Ask any question in Tamil, English, or Tanglish for instant conversational learning.',
        badge: 'Gemini AI',
        screen: 'AITutorTab',
        icon: 'hardware-chip',
        iconBg: '#9333EA',
      },
      {
        id: 'progress',
        title: 'My Progress & Analytics',
        tamilSubtitle: 'என் முன்னேற்றம்',
        tanglishSubtitle: 'En Munnetram (XP & Streaks)',
        description: 'Track learned words, daily streaks, XP points, and quiz history.',
        badge: 'Stats & XP',
        screen: 'ProgressTab',
        icon: 'stats-chart',
        iconBg: '#475569',
      },
    ],
    [totalWordsCount, totalChaptersCount]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Navbar with Prominent Menu Button & User Stats */}
      <Header
        title="Sourashtra Learn"
        subtitle="சௌராஷ்ட்ர பாஷை கற்போம்"
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Brand Hero Banner with Official Logo */}
        <View style={[styles.brandHeroCard, SHADOWS.small]}>
          <Image
            source={require('../../assets/app_logo.png')}
            style={styles.brandHeroLogo}
            resizeMode="contain"
          />
          <View style={styles.brandHeroContent}>
            <Text style={styles.brandHeroTitle}>SOURASTRA</Text>
            <Text style={styles.brandHeroTagline}>Learn • Practice • Grow</Text>
            <View style={styles.brandBadgeRow}>
              <View style={styles.brandTamilPill}>
                <Text style={styles.brandTamilText}>சௌராஷ்ட்ர பாஷை கற்போம்</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Daily Streak Bonus Notification Banner */}
        {dailyBonusNotice ? (
          <View style={styles.streakBonusBanner}>
            <View style={styles.streakBonusLeft}>
              <Text style={{ fontSize: 20 }}>🔥</Text>
              <Text style={styles.streakBonusText}>{dailyBonusNotice}</Text>
            </View>
            <TouchableOpacity onPress={() => setDailyBonusNotice(null)} style={styles.streakBonusClose}>
              <Ionicons name="close" size={16} color="#9A3412" />
            </TouchableOpacity>
          </View>
        ) : null}

        {/* User Stats Card Grid (Curd UI) */}
        <View style={styles.statsCardGrid}>
          <View style={[styles.statMiniCard, { borderLeftColor: '#EA580C' }]}>
            <View style={styles.statIconRow}>
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={styles.statNumber}>{userProgress?.streakDays ?? 1}</Text>
            </View>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>

          <View style={[styles.statMiniCard, { borderLeftColor: '#4F46E5' }]}>
            <View style={styles.statIconRow}>
              <Text style={styles.statEmoji}>💎</Text>
              <Text style={styles.statNumber}>{userProgress?.totalXp ?? 0}</Text>
            </View>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>

          <View style={[styles.statMiniCard, { borderLeftColor: '#059669' }]}>
            <View style={styles.statIconRow}>
              <Text style={styles.statEmoji}>📖</Text>
              <Text style={styles.statNumber}>{userProgress?.wordsLearned ?? 0}</Text>
            </View>
            <Text style={styles.statLabel}>Words Learned</Text>
          </View>

          <View style={[styles.statMiniCard, { borderLeftColor: '#D97706' }]}>
            <View style={styles.statIconRow}>
              <Text style={styles.statEmoji}>🏆</Text>
              <Text style={styles.statNumber}>{userProgress?.quizzesTaken ?? 0}</Text>
            </View>
            <Text style={styles.statLabel}>Quizzes Done</Text>
          </View>
        </View>

        {/* 🚀 Quick Feature Launchers: Challenge, Podcast, Proverbs */}
        <View style={styles.quickLaunchContainer}>
          <TouchableOpacity
            style={[styles.quickLaunchBtn, { backgroundColor: '#312E81' }]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Challenge')}
          >
            <View style={styles.quickLaunchIconBox}>
              <Text style={{ fontSize: 20 }}>📅</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.quickLaunchTitle}>14-Day Challenge</Text>
              <Text style={styles.quickLaunchSub}>14-நாள் விரைவு சவால்</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#C7D2FE" />
          </TouchableOpacity>

          <View style={styles.quickLaunchRow}>
            <TouchableOpacity
              style={[styles.quickLaunchMiniBtn, { backgroundColor: '#0F172A' }]}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Podcast')}
            >
              <Text style={{ fontSize: 20, marginBottom: 4 }}>🎧</Text>
              <Text style={styles.quickLaunchMiniTitle}>Audio Podcast</Text>
              <Text style={styles.quickLaunchMiniSub}>Hands-Free Mode</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickLaunchMiniBtn, { backgroundColor: '#B45309' }]}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Proverbs')}
            >
              <Text style={{ fontSize: 20, marginBottom: 4 }}>📜</Text>
              <Text style={styles.quickLaunchMiniTitle}>Proverbs</Text>
              <Text style={styles.quickLaunchMiniSub}>ஜுன்னவாசு Wisdom</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.quickLaunchRow, { marginTop: 8 }]}>
            <TouchableOpacity
              style={[styles.quickLaunchMiniBtn, { backgroundColor: '#7C3AED' }]}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('GotraFinder')}
            >
              <Text style={{ fontSize: 20, marginBottom: 4 }}>🔱</Text>
              <Text style={styles.quickLaunchMiniTitle}>Gothru Finder</Text>
              <Text style={styles.quickLaunchMiniSub}>1,129 Surnames</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickLaunchMiniBtn, { backgroundColor: '#0D9488' }]}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Heritage')}
            >
              <Text style={{ fontSize: 20, marginBottom: 4 }}>🏺</Text>
              <Text style={styles.quickLaunchMiniTitle}>Heritage Culture</Text>
              <Text style={styles.quickLaunchMiniSub}>Weaving & Rituals</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 🌟 Word of the Day Card (Curd with 4 Languages) */}
        <Card style={styles.wordOfTheDayCard}>
          <View style={styles.cardSectionHeader}>
            <View style={styles.cardHeaderBadgeRow}>
              <Text style={styles.sectionHeaderIcon}>🌟</Text>
              <Text style={styles.sectionHeaderTitle}>WORD OF THE DAY</Text>
            </View>
            <Badge label="4 Languages" variant="primary" />
          </View>

          <View style={styles.wodContentRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.wodSourashtraRow}>
                <Text style={styles.wodSourashtraText}>{wordOfTheDay.sourashtra}</Text>
                {wordOfTheDay.sourashtraScript ? (
                  <View style={[styles.pronounceChip, { backgroundColor: '#FDF4FF', borderColor: '#F0ABFC' }]}>
                    <Text style={[styles.pronounceChipText, { color: '#9333EA', fontWeight: '800' }]}>
                      ꢯ [{wordOfTheDay.sourashtraScript}]
                    </Text>
                  </View>
                ) : null}
                {wordOfTheDay.pronunciation && (
                  <View style={styles.pronounceChip}>
                    <Text style={styles.pronounceChipText}>🗣️ [{wordOfTheDay.pronunciation}]</Text>
                  </View>
                )}
              </View>

              {/* 4-Language Translation Rows */}
              <View style={styles.wodLangList}>
                <View style={styles.langPillRow}>
                  <View style={styles.pillTamil}>
                    <Text style={styles.pillTextTamil}>🇮🇳 தமிழ்</Text>
                  </View>
                  <Text style={styles.langPillValue}>{wordOfTheDay.tamil}</Text>
                </View>

                <View style={styles.langPillRow}>
                  <View style={styles.pillTanglish}>
                    <Text style={styles.pillTextTanglish}>🅰️ Tanglish</Text>
                  </View>
                  <Text style={styles.langPillValueTanglish}>{getTanglish(wordOfTheDay.tamil)}</Text>
                </View>

                <View style={styles.langPillRow}>
                  <View style={styles.pillEnglish}>
                    <Text style={styles.pillTextEnglish}>🇬🇧 English</Text>
                  </View>
                  <Text style={styles.langPillValue}>{wordOfTheDay.english}</Text>
                </View>
              </View>
            </View>

            <AudioButton
              word={wordOfTheDay.sourashtra}
              pronunciation={wordOfTheDay.pronunciation}
              size="medium"
            />
          </View>

          {wordOfTheDay.examples && wordOfTheDay.examples[0] && (
            <View style={styles.wodExampleBox}>
              <Text style={styles.wodExampleTag}>💡 Example Sentence:</Text>
              <Text style={styles.wodExampleSour}>{wordOfTheDay.examples[0].sourashtra}</Text>
              <Text style={styles.wodExampleMean}>
                {wordOfTheDay.examples[0].tamil} • <Text style={{ color: '#059669', fontWeight: '700' }}>Tanglish: {getTanglish(wordOfTheDay.examples[0].tamil)}</Text> ({wordOfTheDay.examples[0].english})
              </Text>
            </View>
          )}
        </Card>

        {/* 💬 Phrase of the Day Card (Curd with 4 Languages) */}
        <Card style={styles.phraseOfTheDayCard}>
          <View style={styles.cardSectionHeader}>
            <View style={styles.cardHeaderBadgeRow}>
              <Text style={styles.sectionHeaderIcon}>💬</Text>
              <Text style={styles.sectionHeaderTitle}>CONVERSATIONAL PHRASE</Text>
            </View>
            <Badge label={phraseOfTheDay.situational} variant="secondary" />
          </View>

          <View style={styles.wodContentRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.phraseSourasText}>{phraseOfTheDay.sourashtra}</Text>
              <Text style={styles.phrasePronounce}>🗣️ [{phraseOfTheDay.pronunciation}]</Text>

              <View style={styles.phraseTransBox}>
                <View style={styles.phraseTransLine}>
                  <Text style={styles.phraseLangLabel}>🇮🇳 தமிழ்:</Text>
                  <Text style={styles.phraseTransVal}>{phraseOfTheDay.tamil}</Text>
                </View>
                <View style={styles.phraseTransLine}>
                  <Text style={styles.phraseLangLabelTanglish}>🅰️ Tanglish:</Text>
                  <Text style={styles.phraseTransValTanglish}>{phraseOfTheDay.tanglish}</Text>
                </View>
                <View style={styles.phraseTransLine}>
                  <Text style={styles.phraseLangLabel}>🇬🇧 English:</Text>
                  <Text style={styles.phraseTransVal}>{phraseOfTheDay.english}</Text>
                </View>
              </View>
            </View>

            <AudioButton
              word={phraseOfTheDay.sourashtra}
              pronunciation={phraseOfTheDay.pronunciation}
              size="medium"
            />
          </View>
        </Card>

        {/* Feature Cards Section (All Curriculum Modules) */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.mainSectionTitle}>Explore Learning Modules</Text>
          <Text style={styles.mainSectionSubtitle}>Interactive modules to master Sourashtra step-by-step</Text>
        </View>

        <View style={styles.cardList}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              onPress={() => {
                if (['DictionaryTab', 'AITutorTab', 'ProgressTab'].includes(item.screen)) {
                  navigation.navigate('MainTabs', { screen: item.screen });
                } else {
                  navigation.navigate(item.screen);
                }
              }}
            >
              <Card style={[styles.menuCard, item.isHero && styles.heroCard]}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardIconTitleRow}>
                    <View style={[styles.cardIconBox, { backgroundColor: item.iconBg }]}>
                      <Ionicons name={item.icon as any} size={22} color="#FFFFFF" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.cardTitle, item.isHero && styles.heroCardTitle]}>
                        {item.title}
                      </Text>
                    </View>
                  </View>
                </View>

                <Text style={[styles.cardDescription, item.isHero && styles.heroCardDescription]}>
                  {item.description}
                </Text>

                <View style={styles.cardFooter}>
                  <Badge
                    label={item.badge}
                    variant={item.isHero ? 'primary' : 'source'}
                  />
                  <View style={styles.openRow}>
                    <Text style={[styles.openText, item.isHero && styles.heroOpenText]}>
                      Open Module
                    </Text>
                    <Ionicons
                      name="arrow-forward"
                      size={14}
                      color={item.isHero ? '#FFFFFF' : COLORS.primary}
                    />
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
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

  // Brand Hero Banner
  brandHeroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  brandHeroLogo: {
    width: 64,
    height: 64,
    borderRadius: 14,
  },
  brandHeroContent: {
    flex: 1,
  },
  brandHeroTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F2C59',
    letterSpacing: 0.5,
  },
  brandHeroTagline: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
    marginTop: 1,
    letterSpacing: 0.5,
  },
  brandBadgeRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  brandTamilPill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  brandTamilText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4338CA',
  },

  streakBonusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFEDD5',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
  },
  streakBonusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  streakBonusText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#9A3412',
    flex: 1,
  },
  streakBonusClose: {
    padding: 4,
  },

  // 4-Card Stats Grid
  statsCardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  statMiniCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.small,
  },
  statIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  statEmoji: {
    fontSize: 18,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },

  // Word of the Day Card
  wordOfTheDayCard: {
    marginVertical: 0,
    marginBottom: 16,
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
    ...SHADOWS.medium,
  },
  cardSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionHeaderIcon: {
    fontSize: 16,
  },
  sectionHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4338CA',
    letterSpacing: 0.6,
  },
  wodContentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  wodSourashtraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  wodSourashtraText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E1B4B',
  },
  pronounceChip: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  pronounceChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
  wodLangList: {
    gap: 6,
  },
  langPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pillTamil: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    minWidth: 68,
    alignItems: 'center',
  },
  pillTextTamil: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
  },
  pillTanglish: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    minWidth: 68,
    alignItems: 'center',
  },
  pillTextTanglish: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065F46',
  },
  pillEnglish: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    minWidth: 68,
    alignItems: 'center',
  },
  pillTextEnglish: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3730A3',
  },
  langPillValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
  },
  langPillValueTanglish: {
    fontSize: 13,
    fontWeight: '800',
    color: '#059669',
    flex: 1,
  },
  wodExampleBox: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#4F46E5',
  },
  wodExampleTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 2,
  },
  wodExampleSour: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E1B4B',
  },
  wodExampleMean: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },

  // Phrase of the Day Card
  phraseOfTheDayCard: {
    marginVertical: 0,
    marginBottom: 20,
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    ...SHADOWS.medium,
  },
  phraseSourasText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0369A1',
    marginBottom: 2,
  },
  phrasePronounce: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
    marginBottom: 8,
  },
  phraseTransBox: {
    gap: 4,
    backgroundColor: '#F0F9FF',
    padding: 10,
    borderRadius: 10,
  },
  phraseTransLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  phraseLangLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    width: 75,
  },
  phraseLangLabelTanglish: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284C7',
    width: 75,
  },
  phraseTransVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
  },
  phraseTransValTanglish: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0369A1',
    flex: 1,
  },

  // Section Headers
  sectionTitleRow: {
    marginBottom: 12,
  },
  mainSectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  mainSectionSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },

  // Menu Module Cards
  cardList: {
    gap: 12,
  },
  menuCard: {
    marginVertical: 0,
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.small,
  },
  heroCard: {
    backgroundColor: '#1E1B4B',
    borderColor: '#4338CA',
    ...SHADOWS.medium,
  },
  cardHeader: {
    marginBottom: 8,
  },
  cardIconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  heroCardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  cardDescription: {
    fontSize: 13.5,
    color: '#64748B',
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 4,
  },
  heroCardDescription: {
    color: '#CBD5E1',
    lineHeight: 20,
  },
  cardFooter: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  openRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  openText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  heroOpenText: {
    color: '#FFFFFF',
  },
  quickLaunchContainer: {
    marginBottom: 16,
    gap: 10,
  },
  quickLaunchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    ...SHADOWS.small,
  },
  quickLaunchIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickLaunchTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  quickLaunchSub: {
    fontSize: 12,
    color: '#C7D2FE',
    fontWeight: '600',
    marginTop: 2,
  },
  quickLaunchRow: {
    flexDirection: 'row',
    gap: 10,
  },
  quickLaunchMiniBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  quickLaunchMiniTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  quickLaunchMiniSub: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },
});


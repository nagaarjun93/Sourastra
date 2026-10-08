import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { COLORS, SHADOWS } from '../constants/theme';
import { SpeechService } from '../services/speechService';
import proverbsData from '../data/sourashtra_proverbs.json';
import verifiedWordsData from '../data/verified_seed_words.json';

interface PodcastItem {
  id: string;
  category: string;
  sourashtra: string;
  sourashtraScript: string;
  pronunciation: string;
  tamil: string;
  tanglish: string;
  english: string;
}

const PODCAST_CATEGORIES = [
  'All Items (அனைத்தும்)',
  'Greetings & Essentials',
  'Family & Household',
  'Food & Dining',
  'Action Verbs',
  'Proverbs & Wisdom',
];

export default function AudioPodcastScreen({ navigation }: { navigation: any }) {
  const [selectedCategory, setSelectedCategory] = useState('All Items (அனைத்தும்)');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.85); // 0.85x clear
  const [intervalDelay, setIntervalDelay] = useState<number>(2000); // 2s pause
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [sleepTimeRemaining, setSleepTimeRemaining] = useState<number | null>(null);
  const [repeatMode, setRepeatMode] = useState<'all' | 'one' | 'shuffle'>('all');
  const [playPhase, setPlayPhase] = useState<'idle' | 'sourashtra' | 'pause1' | 'tamil' | 'pause2'>('idle');

  const timerRef = useRef<any>(null);
  const sleepTimerRef = useRef<any>(null);
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  // Build high-yield curated podcast playlist
  const playlist: PodcastItem[] = useMemo(() => {
    const list: PodcastItem[] = [
      {
        id: 'pod_g1',
        category: 'Greetings & Essentials',
        sourashtra: 'நமஸ்காரு! தும்ஹி சொக்கட் அஸா?',
        sourashtraScript: 'ꢥꢪꢱ꣄ꢒꢵꢬꢸ! ꢢꢸꢪ꣄ꢲꢶ ꢗꣁꢒ꣄ꢒꢜ꣄ ꢂꢱꢵ?',
        pronunciation: 'Namaskaaru! Thumhi chokkat asaa?',
        tamil: 'வணக்கம்! நீங்கள் நன்றாக இருக்கிறீர்களா?',
        tanglish: 'Vanakkam! Neengal nandraaga irukkireergalaa?',
        english: 'Hello! Are you doing well?',
      },
      {
        id: 'pod_g2',
        category: 'Greetings & Essentials',
        sourashtra: 'ஹொவ், மீ சொக்கட் அஸா! தந்யவாது!',
        sourashtraScript: 'ꢲꣁꢮ꣄, ꢪꢷ ꢗꣁꢒ꣄ꢒꢜ꣄ ꢂꢱꢵ! ꢣꢥ꣄ꢫꢮꢵꢢꢸ!',
        pronunciation: 'Hov, mee chokkat asaa! Dhanyavaadhu!',
        tamil: 'ஆம், நான் நன்றாக இருக்கிறேன்! நன்றி!',
        tanglish: 'Aam, naan nandraaga irukkiren! Nandri!',
        english: 'Yes, I am doing well! Thank you!',
      },
      {
        id: 'pod_g3',
        category: 'Greetings & Essentials',
        sourashtra: 'தும்ஹொ நாவ் கீ?',
        sourashtraScript: 'ꢢꢸꢪ꣄ꢲꣁ ꢥꢵꢮ꣄ ꢒꢷ?',
        pronunciation: 'Thumho naav kee?',
        tamil: 'உங்கள் பெயர் என்ன?',
        tanglish: 'Ungal peyar enna?',
        english: 'What is your name?',
      },
      {
        id: 'pod_g4',
        category: 'Greetings & Essentials',
        sourashtra: 'தாள், ஏக் மினிட்! ஜா2க்ரதே!',
        sourashtraScript: 'ꢢꢵꢭ꣄, ꢂꢒ꣄ ꢪꢶꢥꢶꢜ꣄! ꢙꢵꢒ꣄ꢬꢢꢾ!',
        pronunciation: 'Taal, ek minute! Jaagrade!',
        tamil: 'காத்திரு, ஒரு நிமிடம்! ஜாக்கிரதை!',
        tanglish: 'Kaathiru, oru nimidam! Jaakkiradhai!',
        english: 'Wait a minute! Be careful!',
      },
      {
        id: 'pod_f1',
        category: 'Family & Household',
        sourashtra: 'அம்மா, பாபு, பாவோ, பஹினி',
        sourashtraScript: 'ꢂꢪ꣄ꢪꢵ, ꢩꢵꢩꢸ, ꢩꢵꢮꣁ, ꢩꢲꢶꢥꢶ',
        pronunciation: 'Ammaa, Baabu, Bhaavo, Bahini',
        tamil: 'தாய், தந்தை, அண்ணன், தங்கை',
        tanglish: 'Thaai, Thandhai, Annan, Thangai',
        english: 'Mother, Father, Brother, Sister',
      },
      {
        id: 'pod_f2',
        category: 'Family & Household',
        sourashtra: 'மீ கே4ர்கு ஜாத் அஸா',
        sourashtraScript: 'ꢪꢷ ꢓꢾꢬ꣄ꢒꢸ ꢙꢵꢢ꣄ ꢂꢱꢵ',
        pronunciation: 'Mee gherku jaat asaa',
        tamil: 'நான் வீட்டுக்கு போகிறேன்',
        tanglish: 'Naan veettukku pogiren',
        english: 'I am going home',
      },
      {
        id: 'pod_d1',
        category: 'Food & Dining',
        sourashtra: 'நீரு திய்யா, பா3த்து காத் அஸா',
        sourashtraScript: 'ꢥꢷꢬꢸ ꢢꢶꢫ꣄ꢫꢵ, ꢩꢵꢢ꣄ꢢꢸ ꢒꢵꢢ꣄ ꢂꢱꢵ',
        pronunciation: 'Neeru dhiyya, baathu khaat asaa',
        tamil: 'தண்ணீர் கொடுங்கள், சாதம் சாப்பிடுகிறேன்',
        tanglish: 'Thanneer kodungal, saadham saappidugiren',
        english: 'Please give water, I am eating food',
      },
      {
        id: 'pod_d2',
        category: 'Food & Dining',
        sourashtra: 'தூ3த் பீ, சாய் பீ',
        sourashtraScript: 'ꢣꢹꢢ꣄ ꢩꢷ, ꢗꢵꢫ꣄ ꢩꢷ',
        pronunciation: 'Doot pee, chaai pee',
        tamil: 'பால் குடி, டீ குடி',
        tanglish: 'Paal kudi, tea kudi',
        english: 'Drink milk, drink tea',
      },
      {
        id: 'pod_v1',
        category: 'Action Verbs',
        sourashtra: 'கர், கா, பீ, ஜா, ஆவ்',
        sourashtraScript: 'ꢒꢬ꣄, ꢒꢵ, ꢩꢷ, ꢙꢵ, ꢂꢮ꣄',
        pronunciation: 'Kar, Khaa, Pee, Jaa, Aav',
        tamil: 'செய், சாப்பிடு, குடி, போ, வா',
        tanglish: 'Sei, Saappidu, Kudi, Po, Vaa',
        english: 'Do, Eat, Drink, Go, Come',
      },
      {
        id: 'pod_v2',
        category: 'Action Verbs',
        sourashtra: 'தூ கா3வுங்கு ஜாத் அஸா?',
        sourashtraScript: 'ꢢꢹ ꢒꢵꢮꢸꢁꢒꢸ ꢙꢵꢢ꣄ ꢂꢱꢵ?',
        pronunciation: 'Thu gaavungu jaat asaa?',
        tamil: 'நீ ஊருக்கு போகிறாயா?',
        tanglish: 'Nee oorukku pogiraayaa?',
        english: 'Are you going to town?',
      },
    ];

    // Merge authentic proverbs
    if (proverbsData && Array.isArray(proverbsData)) {
      proverbsData.forEach((p: any) => {
        list.push({
          id: p.id,
          category: 'Proverbs & Wisdom',
          sourashtra: p.sourashtra,
          sourashtraScript: p.sourashtraScript || '',
          pronunciation: p.pronunciation || p.sourashtra,
          tamil: p.tamil,
          tanglish: p.tanglish || '',
          english: p.english,
        });
      });
    }

    return list;
  }, []);

  const filteredPlaylist = useMemo(() => {
    if (selectedCategory === 'All Items (அனைத்தும்)') {
      return playlist;
    }
    return playlist.filter((item) => item.category === selectedCategory);
  }, [playlist, selectedCategory]);

  const currentItem = filteredPlaylist[currentIndex] || filteredPlaylist[0];

  // Clean up audio & timers on unmount
  useEffect(() => {
    return () => {
      stopPlaybackLoop();
      SpeechService.stop();
    };
  }, []);

  // Sleep timer ticker
  useEffect(() => {
    if (sleepTimerMinutes === null) {
      setSleepTimeRemaining(null);
      if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
      return;
    }

    setSleepTimeRemaining(sleepTimerMinutes * 60);

    sleepTimerRef.current = setInterval(() => {
      setSleepTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
          stopPlaybackLoop();
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
    };
  }, [sleepTimerMinutes]);

  const stopPlaybackLoop = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    SpeechService.stop();
    setPlayPhase('idle');
  };

  const playSequence = (itemIndex: number) => {
    if (!isPlayingRef.current) return;

    const item = filteredPlaylist[itemIndex];
    if (!item) return;

    // 1. Play Sourashtra speech
    setPlayPhase('sourashtra');
    SpeechService.speakSourashtra(item.sourashtra, item.pronunciation);

    // Wait for speech to complete + user pause delay
    const sourashtraWait = 2500;

    timerRef.current = setTimeout(() => {
      if (!isPlayingRef.current) return;

      // 2. Short pause
      setPlayPhase('pause1');

      timerRef.current = setTimeout(() => {
        if (!isPlayingRef.current) return;

        // 3. Play Tamil speech
        setPlayPhase('tamil');
        SpeechService.speakTamil(item.tamil);

        const tamilWait = 2500;

        timerRef.current = setTimeout(() => {
          if (!isPlayingRef.current) return;

          // 4. Pause before next item
          setPlayPhase('pause2');

          timerRef.current = setTimeout(() => {
            if (!isPlayingRef.current) return;

            // 5. Advance to next index
            let nextIdx = itemIndex + 1;
            if (repeatMode === 'one') {
              nextIdx = itemIndex;
            } else if (repeatMode === 'shuffle') {
              nextIdx = Math.floor(Math.random() * filteredPlaylist.length);
            } else if (nextIdx >= filteredPlaylist.length) {
              nextIdx = 0; // Loop around
            }

            setCurrentIndex(nextIdx);
            playSequence(nextIdx);
          }, intervalDelay);
        }, tamilWait);
      }, intervalDelay / 2);
    }, sourashtraWait);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      stopPlaybackLoop();
    } else {
      setIsPlaying(true);
      isPlayingRef.current = true;
      playSequence(currentIndex);
    }
  };

  const handleSkipNext = () => {
    stopPlaybackLoop();
    const nextIdx = (currentIndex + 1) % filteredPlaylist.length;
    setCurrentIndex(nextIdx);
    if (isPlaying) {
      setTimeout(() => playSequence(nextIdx), 300);
    }
  };

  const handleSkipPrev = () => {
    stopPlaybackLoop();
    const prevIdx = currentIndex === 0 ? filteredPlaylist.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIdx);
    if (isPlaying) {
      setTimeout(() => playSequence(prevIdx), 300);
    }
  };

  const formatRemainingTime = (sec: number | null) => {
    if (sec === null || sec <= 0) return 'Off';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Header with Back Navigation */}
      <Header
        title="Hands-Free Podcast"
        subtitle="தானியங்கி ஆடியோ பயிற்சி முறை"
        onBack={() => {
          stopPlaybackLoop();
          navigation.goBack();
        }}
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {PODCAST_CATEGORIES.map((cat, idx) => (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.8}
              onPress={() => {
                setSelectedCategory(cat);
                setCurrentIndex(0);
                if (isPlaying) {
                  stopPlaybackLoop();
                  setTimeout(() => playSequence(0), 300);
                }
              }}
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

        {/* Big Audio Player Card */}
        <Card style={styles.playerCard}>
          {/* Animated Vinyl Disc Visual */}
          <View style={styles.discContainer}>
            <View style={[styles.outerDisc, isPlaying && styles.outerDiscSpinning]}>
              <View style={styles.innerGroove}>
                <View style={[styles.centerDiscLabel, { backgroundColor: isPlaying ? '#4F46E5' : '#64748B' }]}>
                  <Ionicons
                    name={isPlaying ? 'headset' : 'musical-notes'}
                    size={28}
                    color="#FFFFFF"
                  />
                </View>
              </View>
            </View>

            {/* Current Phase Badge */}
            <View style={styles.phaseBadgeWrapper}>
              <View
                style={[
                  styles.phaseDot,
                  isPlaying ? { backgroundColor: '#10B981' } : { backgroundColor: '#94A3B8' },
                ]}
              />
              <Text style={styles.phaseText}>
                {!isPlaying
                  ? 'Paused / தற்காலிக நிறுத்தம்'
                  : playPhase === 'sourashtra'
                  ? '🗣️ Speaking Sourashtra...'
                  : playPhase === 'tamil'
                  ? '🇮🇳 Speaking Tamil Meaning...'
                  : '⏳ Transitioning...'}
              </Text>
            </View>
          </View>

          {/* Current Track Content Display */}
          {currentItem && (
            <View style={styles.wordDisplayBox}>
              <Badge label={currentItem.category} variant="secondary" />

              {currentItem.sourashtraScript ? (
                <Text style={styles.nativeScriptText}>{currentItem.sourashtraScript}</Text>
              ) : null}

              <Text style={styles.sourashtraWordText}>{currentItem.sourashtra}</Text>
              <Text style={styles.pronunciationText}>🗣️ [{currentItem.pronunciation}]</Text>

              <View style={styles.translationsContainer}>
                <View style={styles.transLine}>
                  <Text style={styles.langLabel}>🇮🇳 தமிழ்:</Text>
                  <Text style={styles.langVal}>{currentItem.tamil}</Text>
                </View>
                {currentItem.tanglish ? (
                  <View style={styles.transLine}>
                    <Text style={styles.langLabelTanglish}>🅰️ Tanglish:</Text>
                    <Text style={styles.langValTanglish}>{currentItem.tanglish}</Text>
                  </View>
                ) : null}
                <View style={styles.transLine}>
                  <Text style={styles.langLabel}>🇬🇧 English:</Text>
                  <Text style={styles.langVal}>{currentItem.english}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Progress Indicator */}
          <View style={styles.trackCounterRow}>
            <Text style={styles.trackCounterText}>
              Track {currentIndex + 1} of {filteredPlaylist.length}
            </Text>
            {sleepTimerMinutes !== null && (
              <Text style={styles.sleepTimerCounter}>
                🌙 Sleep: {formatRemainingTime(sleepTimeRemaining)}
              </Text>
            )}
          </View>

          {/* Player Transport Controls */}
          <View style={styles.controlsRow}>
            {/* Previous */}
            <TouchableOpacity
              style={styles.transportBtn}
              activeOpacity={0.7}
              onPress={handleSkipPrev}
            >
              <Ionicons name="play-skip-back" size={26} color="#1E293B" />
            </TouchableOpacity>

            {/* Play / Pause Giant Button */}
            <TouchableOpacity
              style={[styles.mainPlayBtn, isPlaying && styles.mainPlayBtnPlaying]}
              activeOpacity={0.85}
              onPress={handleTogglePlay}
            >
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={34}
                color="#FFFFFF"
                style={{ marginLeft: isPlaying ? 0 : 3 }}
              />
            </TouchableOpacity>

            {/* Next */}
            <TouchableOpacity
              style={styles.transportBtn}
              activeOpacity={0.7}
              onPress={handleSkipNext}
            >
              <Ionicons name="play-skip-forward" size={26} color="#1E293B" />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Podcast Tuning Controls */}
        <Card style={styles.settingsCard}>
          <Text style={styles.settingsHeader}>🎧 Hands-Free Listening Settings</Text>

          {/* Pause Interval Setting */}
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Pause Delay Between Words</Text>
              <Text style={styles.settingSub}>சொற்களுக்கு இடையிலான இடைவெளி</Text>
            </View>
            <View style={styles.pillsRow}>
              {[1500, 2000, 3500].map((ms) => (
                <TouchableOpacity
                  key={ms}
                  onPress={() => setIntervalDelay(ms)}
                  style={[
                    styles.smallPill,
                    intervalDelay === ms && styles.smallPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.smallPillText,
                      intervalDelay === ms && styles.smallPillTextActive,
                    ]}
                  >
                    {ms / 1000}s
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sleep Timer */}
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Sleep Timer (தூக்க நேரம்)</Text>
              <Text style={styles.settingSub}>Auto pause while resting</Text>
            </View>
            <View style={styles.pillsRow}>
              {[null, 5, 15, 30].map((mins, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setSleepTimerMinutes(mins)}
                  style={[
                    styles.smallPill,
                    sleepTimerMinutes === mins && styles.smallPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.smallPillText,
                      sleepTimerMinutes === mins && styles.smallPillTextActive,
                    ]}
                  >
                    {mins === null ? 'Off' : `${mins}m`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Repeat / Mode */}
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Play Mode</Text>
              <Text style={styles.settingSub}>வரிசை அல்லது சீரற்ற முறை</Text>
            </View>
            <View style={styles.pillsRow}>
              {[
                { key: 'all', label: 'Loop All' },
                { key: 'one', label: 'Repeat 1' },
                { key: 'shuffle', label: 'Shuffle' },
              ].map((m) => (
                <TouchableOpacity
                  key={m.key}
                  onPress={() => setRepeatMode(m.key as any)}
                  style={[
                    styles.smallPill,
                    repeatMode === m.key && styles.smallPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.smallPillText,
                      repeatMode === m.key && styles.smallPillTextActive,
                    ]}
                  >
                    {m.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>

        {/* Tips Card */}
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 Commute & Walking Tip</Text>
          <Text style={styles.tipText}>
            Plug in your headphones while commuting or walking. The app speaks the Sourashtra pronunciation first, gives you time to repeat it in your mind, and then speaks the Tamil meaning automatically!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  categoryScroll: {
    marginBottom: 16,
  },
  categoryScrollContent: {
    gap: 8,
  },
  categoryPill: {
    backgroundColor: '#1E293B',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
  },
  playerCard: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    ...SHADOWS.large,
  },
  discContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  outerDisc: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#334155',
  },
  outerDiscSpinning: {
    borderColor: '#6366F1',
  },
  innerGroove: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
  centerDiscLabel: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phaseBadgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginTop: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  phaseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  phaseText: {
    fontSize: 12,
    color: '#E2E8F0',
    fontWeight: '600',
  },
  wordDisplayBox: {
    width: '100%',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 10,
  },
  nativeScriptText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#818CF8',
    marginTop: 10,
    letterSpacing: 1,
  },
  sourashtraWordText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
    textAlign: 'center',
  },
  pronunciationText: {
    fontSize: 14,
    color: '#34D399',
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 12,
  },
  translationsContainer: {
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  transLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  langLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
    width: 90,
  },
  langVal: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  langLabelTanglish: {
    fontSize: 13,
    fontWeight: '700',
    color: '#38BDF8',
    width: 90,
  },
  langValTanglish: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#7DD3FC',
  },
  trackCounterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
    marginVertical: 12,
  },
  trackCounterText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  sleepTimerCounter: {
    fontSize: 12,
    color: '#FBBF24',
    fontWeight: '700',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
    marginTop: 6,
    marginBottom: 8,
  },
  transportBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  mainPlayBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  mainPlayBtnPlaying: {
    backgroundColor: '#EF4444',
  },
  settingsCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  settingsHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 14,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  settingSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  smallPill: {
    backgroundColor: '#0F172A',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  smallPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  smallPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  smallPillTextActive: {
    color: '#FFFFFF',
  },
  tipCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FBBF24',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
  },
});

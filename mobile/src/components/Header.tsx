import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SHADOWS } from '../constants/theme';
import { ProgressService } from '../services/progressService';

interface HeaderProps {
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
  onBack?: () => void;
  showStats?: boolean;
}

const MENU_ITEMS = [
  {
    id: 'home',
    title: 'Home (முகப்பு)',
    subtitle: 'Dashboard & Quick Highlights',
    icon: 'home',
    iconBg: '#4F46E5',
    screen: 'MainTabs',
    tab: 'HomeTab',
  },
  {
    id: 'learn',
    title: 'Learn Chapters (பாடங்கள்)',
    subtitle: '8 Structured Chapters Curriculum',
    icon: 'book',
    iconBg: '#6366F1',
    screen: 'Learn',
    badge: 'Curriculum',
  },
  {
    id: 'phrases',
    title: 'Conversations & Phrases (வாக்கியங்கள்)',
    subtitle: 'Daily Dialogues & Speaking Lines',
    icon: 'chatbubbles',
    iconBg: '#0284C7',
    screen: 'Phrases',
    badge: 'Essential',
  },
  {
    id: 'flashcards',
    title: 'Flashcards (ஃப்ளாஷ்கார்டுகள்)',
    subtitle: 'Interactive 3D Memory Retention',
    icon: 'albums',
    iconBg: '#EA580C',
    screen: 'Flashcards',
    badge: 'Interactive',
  },
  {
    id: 'quiz',
    title: 'Practice & Quizzes (பயிற்சி)',
    subtitle: 'Dynamic Multiple Question Quizzes',
    icon: 'trophy',
    iconBg: '#D97706',
    screen: 'Quiz',
    badge: 'Quizzes',
  },
  {
    id: 'stories',
    title: 'Duolingo Stories (உரையாடல் கதைகள்)',
    subtitle: 'Interactive Scenario Dialogues & Quizzes',
    icon: 'chatbubbles',
    iconBg: '#58CC02',
    screen: 'Stories',
    badge: '🦉 Duolingo',
  },
  {
    id: 'challenge',
    title: '14-Day Challenge (14-நாள் சவால்)',
    subtitle: 'Structured Pathway & Level 2 Unlock Gate',
    icon: 'ribbon',
    iconBg: '#312E81',
    screen: 'Challenge',
    badge: '📅 14-Day',
  },
  {
    id: 'podcast',
    title: 'Hands-Free Podcast (ஆடியோ பயிற்சி)',
    subtitle: 'Continuous Listening & Speaking Player',
    icon: 'headset',
    iconBg: '#0F172A',
    screen: 'Podcast',
    badge: '🎧 Audio',
  },
  {
    id: 'proverbs',
    title: 'Proverbs & Wisdom (ஜுன்னவாசு)',
    subtitle: 'Authentic Sourashtra Proverbs & Idioms',
    icon: 'bookmark',
    iconBg: '#B45309',
    screen: 'Proverbs',
    badge: '📜 Junnavaachu',
  },
  {
    id: 'gotra',
    title: 'Gothru & Lineage (கோத்ரங்கள்)',
    subtitle: '65 Rishis & 1,129 Family Surnames',
    icon: 'people',
    iconBg: '#7C3AED',
    screen: 'GotraFinder',
    badge: '🔱 Gothru',
  },
  {
    id: 'heritage',
    title: 'Heritage & Culture (நெசவு & மரபு)',
    subtitle: 'Weaving Handloom & Marriage Rituals',
    icon: 'sparkles',
    iconBg: '#0D9488',
    screen: 'Heritage',
    badge: '🏺 Heritage',
  },
  {
    id: 'dictionary',
    title: 'Dictionary (அகராதி)',
    subtitle: '8,585+ Verified Master Words',
    icon: 'search',
    iconBg: '#059669',
    screen: 'MainTabs',
    tab: 'DictionaryTab',
  },
  {
    id: 'ai_tutor',
    title: 'AI Tutor (சௌராஷ்ட்ர ஆசிரியர்)',
    subtitle: 'Google Gemini Conversational AI',
    icon: 'hardware-chip',
    iconBg: '#9333EA',
    screen: 'MainTabs',
    tab: 'AITutorTab',
  },
  {
    id: 'progress',
    title: 'My Progress (முன்னேற்றம்)',
    subtitle: 'Track Lessons, Words & XP Stats',
    icon: 'stats-chart',
    iconBg: '#475569',
    screen: 'MainTabs',
    tab: 'ProgressTab',
  },
];

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  rightAction,
  onBack,
  showStats = true,
}) => {
  const navigation = useNavigation<any>();
  const [menuVisible, setMenuVisible] = useState(false);
  const [liveXp, setLiveXp] = useState<number>(0);
  const [liveStreak, setLiveStreak] = useState<number>(1);

  useEffect(() => {
    let isMounted = true;
    ProgressService.loadProgress().then((p) => {
      if (isMounted && p) {
        setLiveXp(p.totalXp ?? 0);
        setLiveStreak(p.streakDays ?? 1);
      }
    });

    const unsubscribe = ProgressService.subscribe((p) => {
      if (isMounted && p) {
        setLiveXp(p.totalXp ?? 0);
        setLiveStreak(p.streakDays ?? 1);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const isHomeScreen = title === 'Sourashtra Learn' || title === 'Home';
  const showBackButton = onBack !== undefined ? !!onBack : !isHomeScreen;

  const handleBackPress = () => {
    if (onBack) {
      onBack();
    } else if (navigation && navigation.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs', { screen: 'HomeTab' });
    }
  };

  const handleNavigate = (item: typeof MENU_ITEMS[0]) => {
    setMenuVisible(false);
    if (item.tab) {
      navigation.navigate(item.screen, { screen: item.tab });
    } else {
      navigation.navigate(item.screen);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainRow}>
        {/* Left Side: Back button OR Prominent Menu toggle button */}
        {showBackButton ? (
          <TouchableOpacity onPress={handleBackPress} style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color="#0F172A" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => setMenuVisible(true)}
            style={styles.prominentMenuBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="menu" size={22} color="#FFFFFF" />
            <Text style={styles.menuBtnLabel}>Menu</Text>
          </TouchableOpacity>
        )}

        {/* Center Title and Subtitle */}
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
        </View>

        {/* Right Side: Action OR Quick Stats + Menu Button */}
        {rightAction ? (
          <View style={styles.rightAction}>{rightAction}</View>
        ) : (
          <View style={styles.statsRow}>
            {showStats && (
              <>
                <View style={styles.xpPill}>
                  <Ionicons name="diamond" size={13} color="#6366F1" />
                  <Text style={styles.xpText}>{liveXp} XP</Text>
                </View>
                <View style={styles.streakPill}>
                  <Ionicons name="flame" size={13} color="#EA580C" />
                  <Text style={styles.streakText}>{liveStreak}d</Text>
                </View>
              </>
            )}

            {/* Menu icon on the right if back button is showing on sub-screens */}
            {showBackButton && (
              <TouchableOpacity
                onPress={() => setMenuVisible(true)}
                style={styles.subScreenMenuBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="grid-outline" size={18} color="#4338CA" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Top Navbar Menu Drawer Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.overlayBackdrop}
            activeOpacity={1}
            onPress={() => setMenuVisible(false)}
          />

          <View style={[styles.drawerContainer, SHADOWS.large]}>
            <SafeAreaView style={{ flex: 1 }}>
              {/* Drawer Top Header */}
              <View style={styles.drawerHeader}>
                <View style={styles.drawerHeaderLeft}>
                  <Image
                    source={require('../../assets/app_logo.png')}
                    style={styles.drawerAppLogo}
                    resizeMode="contain"
                  />
                  <View>
                    <Text style={styles.drawerAppTitle}>Sourashtra Learn</Text>
                    <Text style={styles.drawerAppSub}>Learn • Practice • Grow</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setMenuVisible(false)}
                  style={styles.drawerCloseBtn}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={22} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* User XP & Streak Highlight in Menu */}
              <View style={styles.drawerStatsBanner}>
                <View style={styles.drawerStatItem}>
                  <Ionicons name="diamond" size={18} color="#6366F1" />
                  <View>
                    <Text style={styles.drawerStatVal}>120 XP</Text>
                    <Text style={styles.drawerStatLabel}>Total Earned</Text>
                  </View>
                </View>
                <View style={styles.drawerStatDivider} />
                <View style={styles.drawerStatItem}>
                  <Ionicons name="flame" size={18} color="#EA580C" />
                  <View>
                    <Text style={styles.drawerStatVal}>3 Days</Text>
                    <Text style={styles.drawerStatLabel}>Active Streak</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.menuSectionLabel}>EXPLORE MODULES:</Text>

              {/* Scrollable Menu Items */}
              <ScrollView
                style={styles.menuScroll}
                contentContainerStyle={styles.menuScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {MENU_ITEMS.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.menuItemCard}
                    onPress={() => handleNavigate(item)}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.menuItemIconBox, { backgroundColor: item.iconBg }]}>
                      <Ionicons name={item.icon as any} size={20} color="#FFFFFF" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.menuItemTitleRow}>
                        <Text style={styles.menuItemTitle}>{item.title}</Text>
                        {item.badge && (
                          <View style={styles.menuItemBadge}>
                            <Text style={styles.menuItemBadgeText}>{item.badge}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Drawer Footer */}
              <View style={styles.drawerFooter}>
                <Text style={styles.drawerFooterText}>
                  📖 160-Page Verified Curriculum • v2.0 PRO
                </Text>
              </View>
            </SafeAreaView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: {
    marginRight: 8,
    padding: 4,
  },
  prominentMenuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 10,
    gap: 4,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  menuBtnLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  menuIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  subScreenMenuBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    marginLeft: 6,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
    fontWeight: '500',
  },
  rightAction: {
    marginLeft: 10,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 8,
  },
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    gap: 4,
  },
  xpText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4338CA',
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDBA74',
    gap: 3,
  },
  streakText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#C2410C',
  },
  // Modal Drawer Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    flexDirection: 'row',
  },
  overlayBackdrop: {
    flex: 1,
  },
  drawerContainer: {
    width: '85%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    height: '100%',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 16,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  drawerHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  drawerAppLogo: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  drawerAppIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerAppTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  drawerAppSub: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  drawerCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerStatsBanner: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  drawerStatItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  drawerStatVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  drawerStatLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  drawerStatDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 8,
  },
  menuSectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 8,
  },
  menuScroll: {
    flex: 1,
  },
  menuScrollContent: {
    gap: 8,
    paddingBottom: 20,
  },
  menuItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 12,
  },
  menuItemIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  menuItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
  },
  menuItemBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  menuItemBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#4338CA',
  },
  menuItemSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  drawerFooter: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    alignItems: 'center',
  },
  drawerFooterText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
});



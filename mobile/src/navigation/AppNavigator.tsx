import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import LearnScreen from '../screens/LearnScreen';
import PhrasesScreen from '../screens/PhrasesScreen';
import DictionaryScreen from '../screens/DictionaryScreen';
import AITutorScreen from '../screens/AITutorScreen';
import QuizScreen from '../screens/QuizScreen';
import FlashcardsScreen from '../screens/FlashcardsScreen';
import ProgressScreen from '../screens/ProgressScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DuolingoStoriesScreen from '../screens/DuolingoStoriesScreen';
import FourteenDayChallengeScreen from '../screens/FourteenDayChallengeScreen';
import AudioPodcastScreen from '../screens/AudioPodcastScreen';
import ProverbsScreen from '../screens/ProverbsScreen';
import GotraFinderScreen from '../screens/GotraFinderScreen';
import HeritageScreen from '../screens/HeritageScreen';

import { COLORS, SHADOWS } from '../constants/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ name, focused }: { name: keyof typeof Ionicons.glyphMap; focused: boolean }) {
  return (
    <View style={[styles.tabIconWrapper, focused && styles.tabIconWrapperActive]}>
      <Ionicons
        name={name}
        size={22}
        color={focused ? COLORS.primary : '#94A3B8'}
      />
    </View>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F1F5F9',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 86 : 68,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          paddingTop: 8,
          ...SHADOWS.medium,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="DictionaryTab"
        component={DictionaryScreen}
        options={{
          tabBarLabel: 'Dictionary',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'search' : 'search-outline'} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="AITutorTab"
        component={AITutorScreen}
        options={{
          tabBarLabel: 'AI Tutor',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'hardware-chip' : 'hardware-chip-outline'} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="ProgressTab"
        component={ProgressScreen}
        options={{
          tabBarLabel: 'Progress',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'stats-chart' : 'stats-chart-outline'} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen name="Learn" component={LearnScreen} />
        <Stack.Screen name="LearnTab" component={LearnScreen} />
        <Stack.Screen name="Phrases" component={PhrasesScreen} />
        <Stack.Screen name="PhrasesTab" component={PhrasesScreen} />
        <Stack.Screen name="Flashcards" component={FlashcardsScreen} />
        <Stack.Screen name="FlashcardsTab" component={FlashcardsScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="QuizTab" component={QuizScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Stories" component={DuolingoStoriesScreen} />
        <Stack.Screen name="DuolingoStories" component={DuolingoStoriesScreen} />
        <Stack.Screen name="Challenge" component={FourteenDayChallengeScreen} />
        <Stack.Screen name="FourteenDayChallenge" component={FourteenDayChallengeScreen} />
        <Stack.Screen name="Podcast" component={AudioPodcastScreen} />
        <Stack.Screen name="AudioPodcast" component={AudioPodcastScreen} />
        <Stack.Screen name="Proverbs" component={ProverbsScreen} />
        <Stack.Screen name="SourashtraProverbs" component={ProverbsScreen} />
        <Stack.Screen name="GotraFinder" component={GotraFinderScreen} />
        <Stack.Screen name="Heritage" component={HeritageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  tabIconWrapperActive: {
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
    paddingHorizontal: 8,
  },
});

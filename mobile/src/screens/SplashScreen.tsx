import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/theme';
import { ProgressService } from '../services/progressService';

export default function SplashScreen({ navigation }: any) {
  useEffect(() => {
    // Automatically record daily login & calculate Day Streak and XP bonus
    ProgressService.recordDailyLogin();

    const timer = setTimeout(() => {
      navigation.replace('MainTabs');
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/app_logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.tagline}>Learn • Practice • Grow</Text>
        <Text style={styles.tamilTitle}>சௌராஷ்ட்ர பாஷை கற்போம்</Text>
      </View>
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.footerText}>Loading verified language base...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  logoImage: {
    width: 240,
    height: 240,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  tamilTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6366F1',
    marginTop: 6,
  },
  footer: {
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});

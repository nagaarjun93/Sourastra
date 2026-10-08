import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import { Card } from '../components/Card';
import { ProgressService } from '../services/progressService';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please enter both email and password.');
      return;
    }
    const { progress, bonusXp } = await ProgressService.recordDailyLogin();
    const bonusMsg = bonusXp > 0 ? ` (+${bonusXp} XP Login Bonus!)` : '';
    Alert.alert(
      'Welcome!',
      `Logged in successfully as ${email}!\n\n🔥 Day Streak: ${progress.streakDays} Day(s)\n💎 Total XP: ${progress.totalXp} XP${bonusMsg}`,
      [
        {
          text: 'Continue Learning',
          onPress: () => navigation.replace('MainTabs'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue learning Sourashtra</Text>
        </View>

        <Card style={styles.formCard}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="name@example.com"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginBtnText}>Sign In</Text>
          </TouchableOpacity>
        </Card>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  formCard: {
    padding: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    height: 46,
    paddingHorizontal: 14,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    color: COLORS.textPrimary,
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
});

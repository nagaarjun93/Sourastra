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

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please complete all registration fields.');
      return;
    }
    // Auth flow (will connect to /api/auth/register in Stage 9/11)
    Alert.alert('Account Created', `Welcome to Sourashtra Learn, ${name}!`);
    navigation.replace('MainTabs');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start learning Sourashtra with verified materials</Text>
        </View>

        <Card style={styles.formCard}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={setName}
          />

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

          <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
            <Text style={styles.registerBtnText}>Create Account</Text>
          </TouchableOpacity>
        </Card>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Sign In</Text>
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
  registerBtn: {
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  registerBtnText: {
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
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
});

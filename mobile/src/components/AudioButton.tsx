import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS } from '../constants/theme';
import { SpeechService } from '../services/speechService';

interface AudioButtonProps {
  word: string;
  pronunciation?: string;
  tamil?: string;
  size?: 'small' | 'medium';
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  word,
  pronunciation,
  tamil,
  size = 'small',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePress = () => {
    setIsPlaying(true);

    // Speak the Sourashtra phonetic pronunciation
    SpeechService.speakSourashtra(word, pronunciation);

    setTimeout(() => {
      setIsPlaying(false);
    }, 1200);
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        size === 'medium' && styles.buttonMedium,
        isPlaying && styles.buttonPlaying,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Listen to ${word}`}
    >
      <Text style={styles.icon}>{isPlaying ? '🔊' : '🔈'}</Text>
      <Text style={[styles.label, isPlaying && styles.labelPlaying]}>
        {isPlaying ? 'Playing...' : pronunciation ? pronunciation : 'Listen'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignSelf: 'flex-start',
  },
  buttonMedium: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  buttonPlaying: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  icon: {
    fontSize: 14,
    marginRight: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  labelPlaying: {
    color: '#16A34A',
  },
});

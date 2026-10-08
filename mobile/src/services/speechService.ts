import { Platform } from 'react-native';
import * as Speech from 'expo-speech';

export interface SpeakOptions {
  language?: string;
  pitch?: number;
  rate?: number;
  volume?: number;
}

export const SpeechService = {
  /**
   * Speak phonetic pronunciation or word text with native speech or web speech synthesis
   */
  speak: (text: string, options?: SpeakOptions) => {
    if (!text || text.trim() === '') return;

    const lang = options?.language || 'en-IN';
    const rate = options?.rate || 0.85; // Slightly slower for clear pronunciation
    const pitch = options?.pitch || 1.0;
    const volume = options?.volume || 1.0;

    // 1. Web Speech Synthesis (when running in web mode)
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = volume;
        window.speechSynthesis.speak(utterance);
        return;
      } catch (err) {
        console.warn('Web speech error:', err);
      }
    }

    // 2. Native Expo Speech (Mobile Phone - Android / iOS)
    try {
      Speech.stop();
      Speech.speak(text, {
        language: lang,
        pitch: pitch,
        rate: rate,
        volume: volume,
        onError: (err) => console.warn('Speech error:', err),
        onDone: () => console.log('Speech playback completed'),
      });
    } catch (err) {
      console.warn('ExpoSpeech native error:', err);
    }
  },

  /**
   * Specifically pronounce Sourashtra word with phonetic clarity on mobile phone
   */
  speakSourashtra: (sourashtraText: string, pronunciation?: string) => {
    const textToSpeak = pronunciation ? pronunciation : sourashtraText;
    const isPhonetic = !!pronunciation;
    
    SpeechService.speak(textToSpeak, {
      language: isPhonetic ? 'en-IN' : 'ta-IN',
      rate: 0.8,
      volume: 1.0,
    });
  },

  /**
   * Pronounce Tamil meaning
   */
  speakTamil: (tamilText: string) => {
    SpeechService.speak(tamilText, {
      language: 'ta-IN',
      rate: 0.85,
      volume: 1.0,
    });
  },

  /**
   * Pronounce English meaning
   */
  speakEnglish: (englishText: string) => {
    SpeechService.speak(englishText, {
      language: 'en-US',
      rate: 0.9,
      volume: 1.0,
    });
  },

  /**
   * Stop any playing speech
   */
  stop: () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    try {
      Speech.stop();
    } catch (e) {}
  },
};

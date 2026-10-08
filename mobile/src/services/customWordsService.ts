import AsyncStorage from '@react-native-async-storage/async-storage';
import seedWords from '../data/verified_seed_words.json';

const CUSTOM_WORDS_KEY = '@sourashtra_custom_learned_words_v1';

export interface CustomWord {
  id: string;
  sourashtra: string;
  tamil: string;
  english: string;
  pronunciation?: string;
  category: string;
  source: string;
  sourcePage?: number | string;
  verified: boolean;
  examples?: Array<{
    sourashtra: string;
    tamil: string;
    english: string;
  }>;
  createdAt: number;
}

export class CustomWordsService {
  /**
   * Get all custom learned words from AsyncStorage
   */
  static async getCustomWords(): Promise<CustomWord[]> {
    try {
      const data = await AsyncStorage.getItem(CUSTOM_WORDS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Error loading custom words from storage:', e);
    }
    return [];
  }

  /**
   * Get merged dataset (Base 1,126+ seed words + all user/AI learned words)
   */
  static async getAllWords(): Promise<any[]> {
    const custom = await this.getCustomWords();
    return [...custom, ...(seedWords as any[])];
  }

  /**
   * Add a newly learned AI word to the app's dictionary
   */
  static async addCustomWord(newWord: {
    sourashtra: string;
    tamil: string;
    english: string;
    pronunciation?: string;
    category?: string;
    exampleSourashtra?: string;
    exampleTamil?: string;
    exampleEnglish?: string;
  }): Promise<CustomWord> {
    const current = await this.getCustomWords();

    const wordEntry: CustomWord = {
      id: `ai_learned_${Date.now()}`,
      sourashtra: newWord.sourashtra.trim(),
      tamil: newWord.tamil.trim(),
      english: newWord.english.trim(),
      pronunciation: newWord.pronunciation?.trim() || newWord.sourashtra.trim(),
      category: newWord.category?.trim() || 'AI Learned',
      source: 'Google Gemini AI Live Tutor',
      sourcePage: 'AI',
      verified: true,
      examples:
        newWord.exampleSourashtra && newWord.exampleTamil && newWord.exampleEnglish
          ? [
              {
                sourashtra: newWord.exampleSourashtra,
                tamil: newWord.exampleTamil,
                english: newWord.exampleEnglish,
              },
            ]
          : [
              {
                sourashtra: `${newWord.sourashtra} (அர்த்தம்)`,
                tamil: `${newWord.tamil}`,
                english: `${newWord.english}`,
              },
            ],
      createdAt: Date.now(),
    };

    // Avoid duplicate entries
    const exists = current.some(
      (w) =>
        w.sourashtra.toLowerCase() === wordEntry.sourashtra.toLowerCase() ||
        (w.english.toLowerCase() === wordEntry.english.toLowerCase() &&
          w.tamil === wordEntry.tamil)
    );

    if (!exists) {
      const updated = [wordEntry, ...current];
      await AsyncStorage.setItem(CUSTOM_WORDS_KEY, JSON.stringify(updated));

      // Attempt background sync to backend
      this.syncToBackend(wordEntry);
    }

    return wordEntry;
  }

  /**
   * Sync custom word to Node backend API if reachable
   */
  private static async syncToBackend(word: CustomWord) {
    try {
      await fetch('http://localhost:8080/api/words/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(word),
      });
    } catch (e) {
      // Offline fallback
    }
  }

  /**
   * Delete a custom word
   */
  static async removeCustomWord(id: string): Promise<void> {
    const current = await this.getCustomWords();
    const filtered = current.filter((w) => w.id !== id);
    await AsyncStorage.setItem(CUSTOM_WORDS_KEY, JSON.stringify(filtered));
  }
}

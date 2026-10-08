import AsyncStorage from '@react-native-async-storage/async-storage';

export interface QuizHistoryEntry {
  id: string;
  category: string;
  score: number;
  total: number;
  percentage: number;
  date: string;
}

export interface UserProgressData {
  totalXp: number;
  wordsLearned: number;
  quizzesTaken: number;
  streakDays: number;
  lastActiveDate: string;
  completedChapters: string[];
  completedStoryIds?: string[];
  completedChallengeDays?: number[];
  quizHistory: QuizHistoryEntry[];
}

const DEFAULT_PROGRESS: UserProgressData = {
  totalXp: 120,
  wordsLearned: 38,
  quizzesTaken: 3,
  streakDays: 2,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedChapters: ['chap_1'],
  completedStoryIds: ['story_1'],
  quizHistory: [
    {
      id: 'q_init_1',
      category: 'Foundation',
      score: 8,
      total: 10,
      percentage: 80,
      date: new Date().toLocaleDateString(),
    },
  ],
};

const STORAGE_KEY = '@sourashtra_learn_user_progress_v2';

const listeners: Set<(data: UserProgressData) => void> = new Set();

function notifyListeners(data: UserProgressData) {
  listeners.forEach((cb) => {
    try {
      cb(data);
    } catch (err) {
      console.warn('Listener error in ProgressService:', err);
    }
  });
}

function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export const ProgressService = {
  /**
   * Subscribe to live progress updates across components (e.g., Header XP & streak pills)
   */
  subscribe: (callback: (data: UserProgressData) => void): (() => void) => {
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
    };
  },

  /**
   * Load user progress from AsyncStorage with fallback to default
   */
  loadProgress: async (): Promise<UserProgressData> => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Error loading progress:', err);
    }
    return DEFAULT_PROGRESS;
  },

  /**
   * Save complete progress object and notify all active UI subscribers
   */
  saveProgress: async (progress: UserProgressData): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      notifyListeners(progress);
    } catch (err) {
      console.warn('Error saving progress:', err);
    }
  },

  /**
   * Track daily user login / session and accurately calculate consecutive Day Streak and Daily Bonus XP
   */
  recordDailyLogin: async (): Promise<{ progress: UserProgressData; bonusXp: number; isNewDay: boolean }> => {
    const current = await ProgressService.loadProgress();
    const todayStr = getTodayString();

    if (current.lastActiveDate === todayStr) {
      // User has already opened/logged into the app today; preserve streak without duplicating daily bonus
      return { progress: current, bonusXp: 0, isNewDay: false };
    }

    let newStreak = 1;
    let bonusXp = 15; // Standard daily login reward

    if (current.lastActiveDate) {
      // Calculate calendar days difference
      const last = new Date(current.lastActiveDate);
      const today = new Date(todayStr);
      const diffMs = today.getTime() - last.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive calendar day! Streak continues: increment streak
        newStreak = (current.streakDays || 0) + 1;
        bonusXp = 15 + Math.min(newStreak * 2, 40); // Scaling streak bonus
      } else if (diffDays > 1) {
        // Missed one or more days: reset streak back to Day 1
        newStreak = 1;
        bonusXp = 10;
      }
    } else {
      // First login ever: initialize streak to 1 with welcome XP
      newStreak = 1;
      bonusXp = 25;
    }

    const updated: UserProgressData = {
      ...current,
      totalXp: (current.totalXp || 0) + bonusXp,
      streakDays: newStreak,
      lastActiveDate: todayStr,
    };

    await ProgressService.saveProgress(updated);
    return { progress: updated, bonusXp, isNewDay: true };
  },

  /**
   * Record a completed quiz result and award XP
   */
  recordQuizResult: async (category: string, score: number, total: number): Promise<UserProgressData> => {
    const current = await ProgressService.loadProgress();
    const percentage = Math.round((score / Math.max(total, 1)) * 100);
    const xpGained = score * 10 + (percentage === 100 ? 50 : 20);

    const todayStr = getTodayString();
    let newStreak = current.streakDays;
    if (current.lastActiveDate !== todayStr) {
      newStreak = current.streakDays + 1;
    }

    const newHistory: QuizHistoryEntry = {
      id: `quiz_${Date.now()}`,
      category: category || 'General',
      score,
      total,
      percentage,
      date: new Date().toLocaleDateString(),
    };

    const updated: UserProgressData = {
      ...current,
      totalXp: current.totalXp + xpGained,
      quizzesTaken: current.quizzesTaken + 1,
      wordsLearned: Math.min(11488, current.wordsLearned + score),
      streakDays: newStreak,
      lastActiveDate: todayStr,
      quizHistory: [newHistory, ...(current.quizHistory || []).slice(0, 19)],
    };

    await ProgressService.saveProgress(updated);
    return updated;
  },

  /**
   * Mark chapter as completed and award XP
   */
  completeChapter: async (chapterId: string): Promise<UserProgressData> => {
    const current = await ProgressService.loadProgress();
    const completed = new Set(current.completedChapters);
    completed.add(chapterId);

    const todayStr = getTodayString();
    const updated: UserProgressData = {
      ...current,
      totalXp: current.totalXp + 100,
      completedChapters: Array.from(completed),
      lastActiveDate: todayStr,
    };

    await ProgressService.saveProgress(updated);
    return updated;
  },

  /**
   * Add XP to the user's progress
   */
  addXp: async (xp: number): Promise<UserProgressData> => {
    const current = await ProgressService.loadProgress();
    const todayStr = getTodayString();
    let newStreak = current.streakDays;
    if (current.lastActiveDate !== todayStr) {
      newStreak = current.streakDays + 1;
    }
    const updated: UserProgressData = {
      ...current,
      totalXp: current.totalXp + xp,
      streakDays: newStreak,
      lastActiveDate: todayStr,
    };
    await ProgressService.saveProgress(updated);
    return updated;
  },

  /**
   * Complete a Duolingo story, award XP, and save completed status
   */
  completeStory: async (storyId: string, xpGained: number): Promise<UserProgressData> => {
    const current = await ProgressService.loadProgress();
    const completedSet = new Set(current.completedStoryIds || ['story_1']);
    completedSet.add(storyId);

    const todayStr = getTodayString();
    let newStreak = current.streakDays;
    if (current.lastActiveDate !== todayStr) {
      newStreak = current.streakDays + 1;
    }

    const updated: UserProgressData = {
      ...current,
      totalXp: current.totalXp + xpGained,
      streakDays: newStreak,
      lastActiveDate: todayStr,
      completedStoryIds: Array.from(completedSet),
    };
    await ProgressService.saveProgress(updated);
    return updated;
  },

  /**
   * Complete a 14-Day Challenge day, award XP, and save completed days
   */
  completeChallengeDay: async (day: number, xpGained: number = 25): Promise<UserProgressData> => {
    const current = await ProgressService.loadProgress();
    const completedSet = new Set(current.completedChallengeDays || []);
    completedSet.add(day);

    const todayStr = getTodayString();
    let newStreak = current.streakDays;
    if (current.lastActiveDate !== todayStr) {
      newStreak = current.streakDays + 1;
    }

    const updated: UserProgressData = {
      ...current,
      totalXp: current.totalXp + xpGained,
      streakDays: newStreak,
      lastActiveDate: todayStr,
      completedChallengeDays: Array.from(completedSet).sort((a, b) => a - b),
    };
    await ProgressService.saveProgress(updated);
    return updated;
  },
};


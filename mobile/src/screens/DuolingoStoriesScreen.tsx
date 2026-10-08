import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { SpeechService } from '../services/speechService';
import { ProgressService } from '../services/progressService';
import { getTanglish } from '../utils/tanglish';
import storiesData from '../data/duolingo_stories.json';

interface DuolingoStoriesScreenProps {
  navigation: any;
}

export default function DuolingoStoriesScreen({ navigation }: DuolingoStoriesScreenProps) {
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [questionStatus, setQuestionStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [revealedDialogues, setRevealedDialogues] = useState<any[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

  // Completed stories tracking for sequential progression
  const [completedStoryIds, setCompletedStoryIds] = useState<string[]>(['story_1']);

  useEffect(() => {
    ProgressService.loadProgress().then((p) => {
      if (p && p.completedStoryIds && p.completedStoryIds.length > 0) {
        setCompletedStoryIds(p.completedStoryIds);
      }
    });
  }, []);

  const activeStory = useMemo(() => {
    return storiesData.find((s: any) => s.id === activeStoryId) || null;
  }, [activeStoryId]);

  const activeStoryIndex = useMemo(() => {
    return storiesData.findIndex((s: any) => s.id === activeStoryId);
  }, [activeStoryId]);

  const nextStory = useMemo(() => {
    if (activeStoryIndex >= 0 && activeStoryIndex < storiesData.length - 1) {
      return storiesData[activeStoryIndex + 1];
    }
    return null;
  }, [activeStoryIndex]);

  const currentStep = activeStory ? activeStory.steps[stepIndex] : null;
  const totalSteps = activeStory ? activeStory.steps.length : 1;
  const progressPercent = activeStory ? Math.round(((stepIndex + 1) / totalSteps) * 100) : 0;

  // Start a story
  const handleStartStory = (story: any) => {
    setActiveStoryId(story.id);
    setStepIndex(0);
    setSelectedOption(null);
    setQuestionStatus('idle');
    setIsCompleted(false);
    setEarnedXp(story.xpReward || 35);

    // Reveal first dialogue step
    if (story.steps[0].type === 'dialogue') {
      setRevealedDialogues([story.steps[0]]);
    } else {
      setRevealedDialogues([]);
    }
  };

  // Exit story back to list
  const handleExitStory = () => {
    SpeechService.stop();
    setActiveStoryId(null);
    setStepIndex(0);
    setRevealedDialogues([]);
    setIsCompleted(false);
  };

  // Play voice ONLY when user taps speaker button
  const handlePlayVoice = (text: string, pronunciation?: string) => {
    SpeechService.speakSourashtra(text, pronunciation);
  };

  // Check answer for interactive questions
  const handleCheckAnswer = () => {
    if (!currentStep || selectedOption === null) return;
    if (selectedOption === currentStep.correctIndex) {
      setQuestionStatus('correct');
    } else {
      setQuestionStatus('wrong');
    }
  };

  // Advance to next dialogue / question step
  const handleNextStep = () => {
    if (!activeStory) return;
    SpeechService.stop();
    setQuestionStatus('idle');
    setSelectedOption(null);

    const nextIdx = stepIndex + 1;
    if (nextIdx >= activeStory.steps.length) {
      // Completed the story!
      setIsCompleted(true);
      ProgressService.completeStory(activeStory.id, earnedXp).then((updated) => {
        if (updated?.completedStoryIds) {
          setCompletedStoryIds(updated.completedStoryIds);
        }
      });
      return;
    }

    setStepIndex(nextIdx);
    const nextStep = activeStory.steps[nextIdx];
    if (nextStep.type === 'dialogue') {
      setRevealedDialogues((prev) => [...prev, nextStep]);
    }
  };

  const completedCount = completedStoryIds.length;
  const overallPathwayPercent = Math.round((completedCount / storiesData.length) * 100);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {!activeStory ? (
        // STORIES DASHBOARD LIST (PATHWAY)
        <View style={{ flex: 1 }}>
          <Header
            title="Duolingo Stories"
            subtitle={`சௌராஷ்ட்ர உரையாடல் கதைகள் (${storiesData.length} Stories)`}
            onBack={() => (navigation?.goBack ? navigation.goBack() : null)}
          />

          <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
            {/* Duolingo Mascot & Progress Banner */}
            <View style={styles.mascotBanner}>
              <View style={styles.owlIconBox}>
                <Text style={styles.owlEmoji}>🦉</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.mascotTitle}>Duolingo Conversation Pathway</Text>
                <Text style={styles.mascotSub}>
                  Complete one real-life conversation to unlock the next! Earn XP, badges, and speaking confidence.
                </Text>

                {/* Overall Pathway Progress */}
                <View style={styles.pathwayProgressBox}>
                  <View style={styles.pathwayProgressRow}>
                    <Text style={styles.pathwayProgressLabel}>
                      🎯 Progress: {completedCount} / {storiesData.length} Stories Done
                    </Text>
                    <Text style={styles.pathwayProgressPercent}>{overallPathwayPercent}%</Text>
                  </View>
                  <View style={styles.pathwayProgressTrack}>
                    <View style={[styles.pathwayProgressFill, { width: `${overallPathwayPercent}%` }]} />
                  </View>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>SELECT A STORY SCENARIO ({storiesData.length} STORIES):</Text>

            {storiesData.map((story: any, idx: number) => {
              // Sequential unlocking: Story 1 is always unlocked.
              // Story N is unlocked if Story N-1 has been completed!
              const isUnlocked =
                idx === 0 ||
                completedStoryIds.includes(story.id) ||
                (idx > 0 && completedStoryIds.includes(storiesData[idx - 1].id));
              const isDone = completedStoryIds.includes(story.id);

              return (
                <TouchableOpacity
                  key={story.id}
                  style={[
                    styles.storyCard,
                    !isUnlocked && styles.storyCardLocked,
                    isDone && styles.storyCardCompleted,
                  ]}
                  onPress={() => {
                    if (isUnlocked) {
                      handleStartStory(story);
                    } else {
                      Alert.alert(
                        '🔒 Story Locked',
                        `Please complete Story ${idx}: "${storiesData[idx - 1].title}" first to unlock this conversation!`,
                        [{ text: 'Got it' }]
                      );
                    }
                  }}
                  activeOpacity={isUnlocked ? 0.85 : 0.95}
                >
                  <View style={styles.storyCardTop}>
                    <View style={[styles.storyIconBox, !isUnlocked && styles.storyIconBoxLocked, isDone && styles.storyIconBoxDone]}>
                      <Ionicons
                        name={isUnlocked ? (story.icon as any) : 'lock-closed'}
                        size={22}
                        color={isDone ? '#16A34A' : isUnlocked ? '#58CC02' : '#94A3B8'}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.storyNumberRow}>
                        <Text style={styles.storyNumberText}>STORY {idx + 1}</Text>
                        {isDone && (
                          <View style={styles.completedPill}>
                            <Ionicons name="checkmark-circle" size={12} color="#16A34A" />
                            <Text style={styles.completedPillText}>COMPLETED</Text>
                          </View>
                        )}
                        {!isUnlocked && (
                          <View style={styles.lockedPill}>
                            <Ionicons name="lock-closed" size={11} color="#64748B" />
                            <Text style={styles.lockedPillText}>LOCKED</Text>
                          </View>
                        )}
                      </View>

                      <Text style={[styles.storyTitle, !isUnlocked && styles.storyTitleLocked]}>
                        {story.title}
                      </Text>
                      <Text style={styles.storyTanglishTitle}>🅰️ {story.tanglishTitle || getTanglish(story.title)}</Text>
                      <Text style={styles.storySourTitle}>{story.sourashtraTitle} • {story.englishTitle}</Text>
                    </View>

                    <View style={styles.xpBadge}>
                      <Ionicons name="sparkles" size={13} color="#D97706" />
                      <Text style={styles.xpBadgeText}>+{story.xpReward} XP</Text>
                    </View>
                  </View>

                  {/* Character Avatars */}
                  <View style={styles.characterRow}>
                    <Text style={styles.characterLabel}>Characters:</Text>
                    <View style={styles.avatarsList}>
                      {story.characters.map((c: any) => (
                        <View key={c.id} style={styles.avatarPill}>
                          <Text style={styles.avatarEmoji}>{c.avatar}</Text>
                          <Text style={styles.avatarName}>{c.name}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Card Footer Button */}
                  <View style={styles.storyCardFooter}>
                    <Badge label={story.category} variant="source" />
                    <Badge label={story.difficulty} variant={isUnlocked ? 'primary' : 'secondary'} />
                    <View style={[styles.startBtn, !isUnlocked && styles.startBtnLocked, isDone && styles.startBtnDone]}>
                      <Text style={styles.startBtnText}>
                        {isDone ? 'Replay 🔄' : isUnlocked ? 'Start Story' : 'Locked 🔒'}
                      </Text>
                      {isUnlocked && <Ionicons name="play" size={12} color="#FFFFFF" />}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      ) : isCompleted ? (
        // STORY COMPLETION CELEBRATION
        <View style={styles.completedContainer}>
          <Text style={styles.trophyEmoji}>🏆</Text>
          <Text style={styles.completedTitle}>Story Completed!</Text>
          <Text style={styles.completedTamil}>கதை வெற்றிகரமாக முடிந்தது!</Text>
          <Text style={styles.completedSub}>
            You mastered the conversation in "{activeStory.title}".
          </Text>

          <View style={styles.rewardCard}>
            <View style={styles.rewardItem}>
              <Ionicons name="sparkles" size={24} color="#D97706" />
              <Text style={styles.rewardVal}>+{earnedXp} XP</Text>
              <Text style={styles.rewardLabel}>Earned</Text>
            </View>
            <View style={styles.rewardDivider} />
            <View style={styles.rewardItem}>
              <Ionicons name="flame" size={24} color="#EA580C" />
              <Text style={styles.rewardVal}>+1</Text>
              <Text style={styles.rewardLabel}>Daily Streak</Text>
            </View>
          </View>

          {/* Next Story Unlock Banner & Quick Action */}
          {nextStory ? (
            <View style={styles.nextStoryCard}>
              <View style={styles.nextStoryHeader}>
                <Ionicons name="lock-open" size={18} color="#16A34A" />
                <Text style={styles.nextStoryTag}>NEXT STORY UNLOCKED!</Text>
              </View>
              <Text style={styles.nextStoryTitle}>
                Story {nextStory.storyNumber}: {nextStory.title}
              </Text>
              <Text style={styles.nextStorySub}>
                {nextStory.sourashtraTitle} • {nextStory.englishTitle}
              </Text>

              <TouchableOpacity
                style={styles.continueBigBtn}
                onPress={() => handleStartStory(nextStory)}
                activeOpacity={0.85}
              >
                <Text style={styles.continueBigBtnText}>PLAY NEXT STORY ➡️</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.viewAllBtn}
                onPress={handleExitStory}
                activeOpacity={0.7}
              >
                <Text style={styles.viewAllBtnText}>View All Stories 📚</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ width: '100%' }}>
              <View style={styles.allDoneBanner}>
                <Text style={styles.allDoneTitle}>🎉 Congratulations!</Text>
                <Text style={styles.allDoneSub}>You have completed all {storiesData.length} Duolingo Stories in the curriculum!</Text>
              </View>
              <TouchableOpacity style={styles.continueBigBtn} onPress={handleExitStory}>
                <Text style={styles.continueBigBtnText}>BACK TO STORIES</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        // INTERACTIVE STORY PLAYER
        <View style={{ flex: 1 }}>
          {/* Top Progress Bar & Close Button */}
          <View style={styles.storyTopNav}>
            <TouchableOpacity onPress={handleExitStory} style={styles.exitBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color="#64748B" />
            </TouchableOpacity>

            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>

            <View style={styles.storyXpBadge}>
              <Ionicons name="sparkles" size={13} color="#D97706" />
              <Text style={styles.storyXpText}>+{earnedXp}</Text>
            </View>
          </View>

          {/* Conversation & Questions Flow */}
          <ScrollView
            style={styles.storyContentScroll}
            contentContainerStyle={styles.storyContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Story Title Header */}
            <View style={styles.activeStoryHeader}>
              <Text style={styles.activeStoryTitle}>{activeStory.title}</Text>
              <Text style={styles.activeStorySub}>
                {activeStory.sourashtraTitle} • {activeStory.englishTitle}
              </Text>
            </View>

            {/* Revealed Dialogue Bubbles */}
            {revealedDialogues.map((item, idx) => {
              const char = activeStory.characters.find((c: any) => c.id === item.speaker);
              return (
                <View key={idx} style={styles.dialogueRow}>
                  <View style={styles.speakerAvatarBox}>
                    <Text style={styles.speakerAvatarEmoji}>{char?.avatar || '👤'}</Text>
                  </View>

                  <View style={styles.speechBubbleWrapper}>
                    <View style={styles.speakerNameRow}>
                      <Text style={styles.speakerNameText}>{char?.name || 'Speaker'}</Text>
                      {/* Audio Button: plays ONLY when user clicks */}
                      <TouchableOpacity
                        style={styles.speechAudioBtn}
                        onPress={() => handlePlayVoice(item.sourashtra, item.pronunciation)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="volume-medium" size={16} color="#58CC02" />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.dialogueSourashtra}>{item.sourashtra}</Text>
                    {item.pronunciation && (
                      <Text style={styles.dialoguePronounce}>[{item.pronunciation}]</Text>
                    )}

                    <View style={styles.dialogueTransBox}>
                      <Text style={styles.dialogueTamil}>{item.tamil}</Text>
                      <View style={styles.dialogueTanglishRow}>
                        <Text style={styles.dialogueTanglishTag}>🅰️ Tanglish:</Text>
                        <Text style={styles.dialogueTanglish}>{item.tanglish || getTanglish(item.tamil)}</Text>
                      </View>
                      <Text style={styles.dialogueEnglish}>{item.english}</Text>
                    </View>
                  </View>
                </View>
              );
            })}

            {/* Interactive Question Step */}
            {currentStep?.type === 'question' && (
              <Card style={styles.questionCard}>
                <View style={styles.questionBadgeRow}>
                  <Ionicons name="help-circle" size={18} color="#4F46E5" />
                  <Text style={styles.questionBadgeText}>
                    {currentStep.questionType === 'fill_blank' ? 'FILL IN THE BLANK' : 'COMPREHENSION CHECK'}
                  </Text>
                </View>

                <Text style={styles.questionPrompt}>{currentStep.questionText}</Text>
                <Text style={styles.questionTanglishPrompt}>
                  🅰️ Tanglish: {currentStep.tanglishQuestion || getTanglish(currentStep.questionText)}
                </Text>
                {currentStep.englishQuestion && (
                  <Text style={styles.questionEnglishPrompt}>{currentStep.englishQuestion}</Text>
                )}
                {currentStep.promptSentence && (
                  <View style={styles.promptSentenceBox}>
                    <Text style={styles.promptSentenceText}>{currentStep.promptSentence}</Text>
                  </View>
                )}

                {/* Option Tiles */}
                <View style={styles.optionsList}>
                  {currentStep.options?.map((option: string, optIdx: number) => {
                    const isSelected = selectedOption === optIdx;
                    return (
                      <TouchableOpacity
                        key={optIdx}
                        style={[styles.optionTile, isSelected && styles.optionTileSelected]}
                        onPress={() => {
                          if (questionStatus === 'idle') setSelectedOption(optIdx);
                        }}
                        activeOpacity={0.8}
                      >
                        <View style={[styles.optionRadio, isSelected && styles.optionRadioSelected]}>
                          {isSelected && <View style={styles.optionRadioInner} />}
                        </View>
                        <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </Card>
            )}
          </ScrollView>

          {/* Duolingo Bottom Action Sheet */}
          <View style={[
            styles.bottomSheet,
            questionStatus === 'correct' && styles.bottomSheetCorrect,
            questionStatus === 'wrong' && styles.bottomSheetWrong,
          ]}>
            {questionStatus === 'idle' ? (
              currentStep?.type === 'dialogue' ? (
                <TouchableOpacity style={styles.continueBtn} onPress={handleNextStep}>
                  <Text style={styles.continueBtnText}>CONTINUE</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.checkBtn, selectedOption === null && styles.checkBtnDisabled]}
                  onPress={handleCheckAnswer}
                  disabled={selectedOption === null}
                >
                  <Text style={styles.checkBtnText}>CHECK</Text>
                </TouchableOpacity>
              )
            ) : questionStatus === 'correct' ? (
              <View style={styles.feedbackContainer}>
                <View style={styles.feedbackTextRow}>
                  <Ionicons name="checkmark-circle" size={24} color="#58CC02" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.feedbackTitleCorrect}>Amazing! சரியானது!</Text>
                    {currentStep?.explanation && (
                      <View>
                        <Text style={styles.feedbackExplanation}>{currentStep.explanation}</Text>
                        <Text style={styles.feedbackTanglishExplanation}>
                          🅰️ {currentStep.tanglishExplanation || getTanglish(currentStep.explanation)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <TouchableOpacity style={styles.continueBtnGreen} onPress={handleNextStep}>
                  <Text style={styles.continueBtnText}>CONTINUE</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.feedbackContainer}>
                <View style={styles.feedbackTextRow}>
                  <Ionicons name="close-circle" size={24} color="#FF4B4B" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.feedbackTitleWrong}>Not quite right!</Text>
                    <Text style={styles.feedbackSolution}>
                      Correct: {currentStep?.options && currentStep.correctIndex !== undefined ? currentStep.options[currentStep.correctIndex] : ''}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.continueBtnRed} onPress={handleNextStep}>
                  <Text style={styles.continueBtnText}>GOT IT</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  mascotBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    marginBottom: 16,
    gap: 12,
  },
  owlIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  owlEmoji: {
    fontSize: 26,
  },
  mascotTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#166534',
  },
  mascotSub: {
    fontSize: 12,
    color: '#15803D',
    marginTop: 2,
    lineHeight: 16,
  },
  pathwayProgressBox: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  pathwayProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  pathwayProgressLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
  },
  pathwayProgressPercent: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
  },
  pathwayProgressTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  pathwayProgressFill: {
    height: '100%',
    backgroundColor: '#58CC02',
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  storyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  storyCardLocked: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.7,
  },
  storyCardCompleted: {
    borderColor: '#86EFAC',
    backgroundColor: '#F0FDF4',
  },
  storyCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  storyIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyIconBoxLocked: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  storyIconBoxDone: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  storyNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  storyNumberText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  completedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    gap: 3,
  },
  completedPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#16A34A',
  },
  lockedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    gap: 3,
  },
  lockedPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  storyTitleLocked: {
    color: '#64748B',
  },
  storyTanglishTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
    marginTop: 1,
  },
  storySourTitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  xpBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  characterRow: {
    marginTop: 4,
    marginBottom: 12,
  },
  characterLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 6,
  },
  avatarsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  avatarPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  avatarEmoji: {
    fontSize: 14,
  },
  avatarName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  storyCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#58CC02',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  startBtnLocked: {
    backgroundColor: '#94A3B8',
  },
  startBtnDone: {
    backgroundColor: '#16A34A',
  },
  startBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Active Story Player Styles
  storyTopNav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  exitBtn: {
    padding: 4,
  },
  progressBarTrack: {
    flex: 1,
    height: 12,
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#58CC02',
    borderRadius: 6,
  },
  storyXpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 3,
  },
  storyXpText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  storyContentScroll: {
    flex: 1,
  },
  storyContent: {
    padding: 16,
    paddingBottom: 120,
  },
  activeStoryHeader: {
    marginBottom: 16,
    alignItems: 'center',
  },
  activeStoryTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  activeStorySub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  dialogueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
    gap: 10,
  },
  speakerAvatarBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  speakerAvatarEmoji: {
    fontSize: 20,
  },
  speechBubbleWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  speakerNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  speakerNameText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4F46E5',
  },
  speechAudioBtn: {
    padding: 4,
  },
  dialogueSourashtra: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 24,
  },
  dialoguePronounce: {
    fontSize: 12,
    color: '#64748B',
    marginVertical: 2,
    fontWeight: '500',
  },
  dialogueTransBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    marginTop: 6,
    gap: 2,
  },
  dialogueTamil: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  dialogueTanglishRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginVertical: 1,
  },
  dialogueTanglishTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  dialogueTanglish: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
    flex: 1,
  },
  dialogueEnglish: {
    fontSize: 12,
    color: '#64748B',
  },

  // Question Card Styles
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginTop: 8,
    borderWidth: 2,
    borderColor: '#818CF8',
  },
  questionBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  questionBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 0.5,
  },
  questionPrompt: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  questionTanglishPrompt: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  questionEnglishPrompt: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
  },
  promptSentenceBox: {
    backgroundColor: '#EEF2FF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  promptSentenceText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#312E81',
    textAlign: 'center',
  },
  optionsList: {
    gap: 10,
  },
  optionTile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  optionTileSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
  },
  optionRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionRadioSelected: {
    borderColor: '#4F46E5',
  },
  optionRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4F46E5',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
  },
  optionTextSelected: {
    color: '#4F46E5',
  },

  // Bottom Sheet
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 2,
    borderTopColor: '#E2E8F0',
    padding: 16,
    paddingBottom: 32,
  },
  bottomSheetCorrect: {
    backgroundColor: '#D7FFB8',
    borderTopColor: '#58CC02',
  },
  bottomSheetWrong: {
    backgroundColor: '#FFDFE0',
    borderTopColor: '#FF4B4B',
  },
  continueBtn: {
    backgroundColor: '#58CC02',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  continueBtnGreen: {
    backgroundColor: '#58CC02',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  continueBtnRed: {
    backgroundColor: '#FF4B4B',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  continueBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  checkBtn: {
    backgroundColor: '#58CC02',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  checkBtnDisabled: {
    backgroundColor: '#E2E8F0',
  },
  checkBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  feedbackContainer: {
    gap: 10,
  },
  feedbackTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  feedbackTitleCorrect: {
    fontSize: 16,
    fontWeight: '900',
    color: '#58CC02',
  },
  feedbackTitleWrong: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FF4B4B',
  },
  feedbackExplanation: {
    fontSize: 12,
    color: '#166534',
    marginTop: 2,
  },
  feedbackTanglishExplanation: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '700',
    marginTop: 1,
  },
  feedbackSolution: {
    fontSize: 12,
    color: '#991B1B',
    fontWeight: '700',
    marginTop: 2,
  },

  // Completion Screen Styles
  completedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  trophyEmoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  completedTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
  },
  completedTamil: {
    fontSize: 16,
    fontWeight: '700',
    color: '#58CC02',
    marginTop: 4,
  },
  completedSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  rewardCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    width: '100%',
    marginBottom: 16,
  },
  rewardItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  rewardVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  rewardLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  rewardDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
  },

  // Next Story Unlocked Card
  nextStoryCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 2,
    borderColor: '#86EFAC',
    marginBottom: 16,
  },
  nextStoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  nextStoryTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16A34A',
    letterSpacing: 0.5,
  },
  nextStoryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  nextStorySub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 14,
  },
  continueBigBtn: {
    width: '100%',
    backgroundColor: '#58CC02',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#58CC02',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  continueBigBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  viewAllBtn: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  viewAllBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  allDoneBanner: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 16,
    alignItems: 'center',
  },
  allDoneTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#92400E',
  },
  allDoneSub: {
    fontSize: 13,
    color: '#78350F',
    textAlign: 'center',
    marginTop: 4,
  },
});

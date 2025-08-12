import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// Voice prompts for different languages
const voicePrompts = {
  en: [
    "Does my voice sound flirty or nerdy?",
    "Can you fall for a voice like mine?", 
    "What does my voice make you feel?"
  ],
  hi: [
    "क्या मेरी आवाज़ तुम्हारा दिल छू सकती है?",
    "इस आवाज़ में कोई जादू है क्या?",
    "बोलूं या फिर तुम्हें पिघलने दूं?"
  ]
};

export default function VoiceScoreScreen({ navigation, route }) {
  const { selectedLanguage = 'en' } = route.params || {};
  
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [voiceScore, setVoiceScore] = useState(null);
  const [displayScore, setDisplayScore] = useState(0);
  const [isCountingScore, setIsCountingScore] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  
  // Android device tracking for voice crush attempts (24-hour reset)
  const [deviceId, setDeviceId] = useState('');
  const [voiceCrushCount, setVoiceCrushCount] = useState(0);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    initializeVoiceScore();
    startEntryAnimation();
  }, []);

  const initializeVoiceScore = async () => {
    try {
      // Generate or get Android device ID for tracking
      let storedDeviceId = await AsyncStorage.getItem('androidDeviceId');
      if (!storedDeviceId) {
        storedDeviceId = 'android_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
        await AsyncStorage.setItem('androidDeviceId', storedDeviceId);
      }
      setDeviceId(storedDeviceId);
      
      // FORCE RESET for debugging - clear any corrupted data
      await AsyncStorage.removeItem(`voiceCrushCount_${storedDeviceId}`);
      await AsyncStorage.removeItem('voiceCrushResetDate');
      await AsyncStorage.setItem(`voiceCrushCount_${storedDeviceId}`, '0');
      console.log('FORCE RESET: Cleared all voice crush data and reset to 0');
      setVoiceCrushCount(0);
      
      // Check voice crush attempts (24-hour reset)
      const today = new Date().toDateString();
      const lastResetDate = await AsyncStorage.getItem('voiceCrushResetDate');
      const savedCount = await AsyncStorage.getItem(`voiceCrushCount_${storedDeviceId}`);
      
      if (lastResetDate !== today) {
        // Reset count for new day
        await AsyncStorage.setItem('voiceCrushResetDate', today);
        await AsyncStorage.setItem(`voiceCrushCount_${storedDeviceId}`, '0');
        console.log('RESET: Voice crush count reset to 0 for new day');
        setVoiceCrushCount(0);
      } else {
        // Parse saved count properly, ensuring it's never negative
        const parsedCount = savedCount ? parseInt(savedCount, 10) : 0;
        const finalCount = Math.max(0, parsedCount); // Ensure never negative
        console.log('INIT: Voice crush count loaded:', finalCount, 'from saved:', savedCount);
        setVoiceCrushCount(finalCount);
      }
      
      // Get random prompt
      getRandomPrompt();
    } catch (error) {
      console.warn('Error initializing voice score:', error);
    }
  };

  const startEntryAnimation = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
      }),
    ]).start();
  };

  const getRandomPrompt = () => {
    const prompts = voicePrompts[selectedLanguage] || voicePrompts.en;
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setCurrentPrompt(randomPrompt);
  };

  const startRecording = () => {
    setIsRecording(true);
    startPulseAnimation();
    
    // Auto-stop after 5 seconds
    setTimeout(() => {
      stopRecording();
    }, 5000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    pulseAnim.stopAnimation();
    analyzeVoice();
  };

  const startPulseAnimation = () => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (isRecording) pulse();
      });
    };
    pulse();
  };

  const analyzeVoice = async () => {
    // Check voice crush limit for mobile app (3 attempts per Android device per 24 hours)
    const userProfile = await AsyncStorage.getItem('userProfile');
    
    if (!userProfile) {
      if (voiceCrushCount >= 3) {
        setShowSignupModal(true);
        return;
      }
      
      // Increment attempts for this Android device
      const newCount = voiceCrushCount + 1;
      setVoiceCrushCount(newCount);
      await AsyncStorage.setItem(`voiceCrushCount_${deviceId}`, newCount.toString());
    }

    setIsAnalyzing(true);
    setIsCountingScore(true);
    setDisplayScore(0);

    // Create suspense music and score animation
    createSuspenseAnimation();
    
    const finalScore = Math.floor(Math.random() * 40) + 60; // 60-100 range
    const duration = 2500;
    const steps = 50;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const counterInterval = setInterval(() => {
      currentStep++;
      
      if (currentStep < steps) {
        const randomScore = Math.floor(Math.random() * 100) + 1;
        setDisplayScore(randomScore);
      } else {
        setDisplayScore(finalScore);
        setIsCountingScore(false);
        setVoiceScore({
          score: finalScore,
          verdict: getScoreVerdict(finalScore),
          crushHint: getScoreCrushHint(finalScore)
        });
        setIsAnalyzing(false);
        clearInterval(counterInterval);
      }
    }, stepDuration);
  };

  const createSuspenseAnimation = () => {
    // Simple animated scaling for suspense effect
    const suspenseScale = new Animated.Value(1);
    
    const suspenseLoop = () => {
      Animated.sequence([
        Animated.timing(suspenseScale, {
          toValue: 1.05,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(suspenseScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (isCountingScore) suspenseLoop();
      });
    };
    
    suspenseLoop();
  };

  const getScoreVerdict = (score) => {
    if (score >= 90) return "This voice could cause butterflies!";
    if (score >= 70) return "Smooth, confident, and definitely sexy!";
    if (score >= 40) return "You've got something going on!";
    return "Cute but keep working it!";
  };

  const getScoreCrushHint = (score) => {
    if (score >= 90) return "Warning: Voice may cause instant attraction!";
    if (score >= 70) return "Your voice could break 7 hearts in one phone call!";
    if (score >= 40) return "There's charm in that voice!";
    return "Practice makes perfect, darling!";
  };

  const handleSignupComplete = async () => {
    // Reset voice crush count after successful signup
    if (deviceId) {
      await AsyncStorage.setItem(`voiceCrushCount_${deviceId}`, '0');
      setVoiceCrushCount(0);
    }
    setShowSignupModal(false);
    Alert.alert('Success!', 'Now you have unlimited Voice Crush attempts!');
  };

  const resetAndTryAgain = () => {
    setVoiceScore(null);
    setDisplayScore(0);
    setIsCountingScore(false);
    setIsAnalyzing(false);
    getRandomPrompt();
  };

  return (
    <LinearGradient
      colors={colors.gradient.primary}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            
            <Text style={styles.title}>Voice Crush</Text>
            <Text style={styles.subtitle}>Know sexiness score of your voice</Text>
            
            {/* Voice Crush Attempts Progress (Mobile App Only) */}
            {deviceId && (
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Voice Crush Attempts</Text>
                  <Text style={styles.progressCount}>{voiceCrushCount}/3</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { width: `${(voiceCrushCount / 3) * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {voiceCrushCount < 3 
                    ? `${3 - voiceCrushCount} attempts remaining today` 
                    : 'Sign up for unlimited attempts!'
                  }
                </Text>
              </View>
            )}
          </View>

          {/* Prompt Card */}
          <View style={styles.promptCard}>
            <Text style={styles.promptTitle}>
              {selectedLanguage === 'hi' ? 'यह लाइन पढ़ें:' : 'Read this line:'}
            </Text>
            <Text style={styles.promptText}>"{currentPrompt}"</Text>
          </View>

          {/* Score Display or Recording Button */}
          {voiceScore || isCountingScore ? (
            <View style={styles.scoreContainer}>
              <LinearGradient
                colors={[colors.neonPink, colors.neonPurple]}
                style={styles.scoreCard}
              >
                <Text style={[styles.scoreText, isCountingScore && styles.animatedScore]}>
                  🎙️ {displayScore}/100
                </Text>
                <Text style={styles.scoreLabel}>
                  Sexy Score {isCountingScore && '🎵'}
                </Text>
                
                {voiceScore && (
                  <>
                    <Text style={styles.verdictText}>"{voiceScore.verdict}"</Text>
                    <Text style={styles.hintText}>🔍 {voiceScore.crushHint}</Text>
                  </>
                )}
              </LinearGradient>
              
              {voiceScore && (
                <TouchableOpacity
                  style={styles.tryAgainButton}
                  onPress={resetAndTryAgain}
                >
                  <Text style={styles.tryAgainText}>Try Again</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.recordingContainer}>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <TouchableOpacity
                  style={[
                    styles.recordButton,
                    isRecording && styles.recordButtonActive
                  ]}
                  onPress={isRecording ? stopRecording : startRecording}
                  disabled={isAnalyzing}
                >
                  <LinearGradient
                    colors={isRecording 
                      ? [colors.error, '#ff4444'] 
                      : [colors.neonBlue, colors.electricBlue]
                    }
                    style={styles.recordGradient}
                  >
                    <Ionicons 
                      name={isRecording ? "stop" : "mic"} 
                      size={40} 
                      color={colors.primary} 
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
              
              <Text style={styles.recordingText}>
                {isRecording 
                  ? 'Recording... (auto-stops in 5 seconds)' 
                  : isAnalyzing 
                    ? 'Analyzing your voice...' 
                    : 'Tap to start recording'
                }
              </Text>
            </div>
          )}
        </Animated.View>

        {/* Voice Crush Signup Modal */}
        <Modal
          visible={showSignupModal}
          transparent
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <LinearGradient
                colors={[colors.secondary, colors.tertiary]}
                style={styles.modalContent}
              >
                <Text style={styles.modalTitle}>Voice Crush Limit Reached</Text>
                <Text style={styles.modalSubtitle}>
                  You've used all 3 voice crush attempts for today (3/3)
                </Text>
                
                <View style={styles.benefitsCard}>
                  <Text style={styles.benefitsTitle}>Sign up for unlimited:</Text>
                  <Text style={styles.benefitItem}>🎙️ Unlimited Voice Crush attempts</Text>
                  <Text style={styles.benefitItem}>💬 AI Companion Chat</Text>
                  <Text style={styles.benefitItem}>📱 Share your Voice Score</Text>
                </View>
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.signupButton}
                    onPress={handleSignupComplete}
                  >
                    <LinearGradient
                      colors={[colors.neonBlue, colors.electricBlue]}
                      style={styles.signupGradient}
                    >
                      <Text style={styles.signupButtonText}>Sign Up Now</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setShowSignupModal(false)}
                  >
                    <Text style={styles.cancelButtonText}>Maybe Later</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
  },
  progressContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neonBlue,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: colors.neonBlue,
    fontWeight: '600',
  },
  progressCount: {
    fontSize: 14,
    color: colors.neonBlue,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.tertiary,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.neonBlue,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: colors.neonBlue,
    textAlign: 'center',
  },
  promptCard: {
    backgroundColor: colors.secondary,
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  promptTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  promptText: {
    fontSize: 20,
    color: colors.textPrimary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 28,
  },
  recordingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    marginBottom: 20,
  },
  recordButtonActive: {
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  recordGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingText: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
  },
  scoreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreCard: {
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  animatedScore: {
    // Add pulsing animation styles
  },
  scoreLabel: {
    fontSize: 20,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 15,
  },
  verdictText: {
    fontSize: 18,
    color: colors.textPrimary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  hintText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  tryAgainButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.neonBlue,
  },
  tryAgainText: {
    color: colors.neonBlue,
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width - 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 25,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 20,
  },
  benefitsCard: {
    backgroundColor: colors.tertiary,
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
    width: '100%',
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  benefitItem: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
    textAlign: 'center',
  },
  modalButtons: {
    width: '100%',
  },
  signupButton: {
    marginBottom: 12,
    borderRadius: 25,
    overflow: 'hidden',
  },
  signupGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  signupButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
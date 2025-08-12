import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import Sound from 'react-native-sound';

// Import logo image
const logoImage = require('../assets/images/vyakti-logo.png');
const welcomeAudio = require('../assets/audio/welcome-audio.mp3');

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Landing'>;

const { width, height } = Dimensions.get('window');

const LandingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;
  const soundRef = useRef<Sound | null>(null);

  useEffect(() => {
    // Initialize welcome audio
    soundRef.current = new Sound(welcomeAudio, (error) => {
      if (error) {
        console.log('Failed to load welcome audio:', error);
        return;
      }
      
      // Auto-play welcome message
      setTimeout(() => {
        soundRef.current?.play((success) => {
          if (!success) {
            console.log('Welcome audio playback failed');
          }
        });
      }, 1000);
    });

    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();

    // Cleanup audio on unmount
    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.release();
      }
    };
  }, [fadeAnim, slideAnim]);

  const handleGetStarted = () => {
    // Stop welcome audio when navigating
    if (soundRef.current) {
      soundRef.current.stop();
    }
    navigation.navigate('LanguageGender');
  };

  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <View style={styles.backgroundGradient} />
      
      {/* Floating bubbles decoration */}
      <View style={styles.bubblesContainer}>
        <Animated.View style={[styles.bubble, styles.bubble1, { opacity: fadeAnim }]} />
        <Animated.View style={[styles.bubble, styles.bubble2, { opacity: fadeAnim }]} />
        <Animated.View style={[styles.bubble, styles.bubble3, { opacity: fadeAnim }]} />
      </View>

      {/* Main content */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image source={logoImage} style={styles.logo} resizeMode="contain" />
        </View>

        {/* Title */}
        <Text style={styles.title}>Vyakti AI</Text>
        <Text style={styles.subtitle}>Your Personal AI Companion</Text>
        
        {/* Features */}
        <View style={styles.featuresContainer}>
          <Text style={styles.feature}>💬 Chat in 4 Languages</Text>
          <Text style={styles.feature}>🎙️ Voice Conversations</Text>
          <Text style={styles.feature}>🎭 Multiple AI Personalities</Text>
          <Text style={styles.feature}>🔥 Voice Scoring & Analytics</Text>
        </View>
      </Animated.View>

      {/* Get Started Button */}
      <Animated.View style={[styles.buttonContainer, { transform: [{ translateY: slideAnim }] }]}>
        <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
        
        <Text style={styles.disclaimer}>
          Chat with AI companions in Hindi, English, Tamil & Bengali
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
  },
  bubblesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bubble: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
  },
  bubble1: {
    width: 80,
    height: 80,
    top: height * 0.15,
    right: width * 0.1,
  },
  bubble2: {
    width: 60,
    height: 60,
    top: height * 0.25,
    left: width * 0.05,
  },
  bubble3: {
    width: 100,
    height: 100,
    bottom: height * 0.3,
    right: width * 0.15,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#00FFFF',
    textAlign: 'center',
    marginBottom: 50,
    fontWeight: '500',
  },
  featuresContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  feature: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '400',
  },
  buttonContainer: {
    paddingHorizontal: 30,
    paddingBottom: 60,
    alignItems: 'center',
  },
  getStartedButton: {
    backgroundColor: 'linear-gradient(135deg, #00FFFF, #0080FF)',
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#00FFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  disclaimer: {
    color: '#888888',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
});

export default LandingScreen;
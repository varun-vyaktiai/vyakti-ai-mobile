import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, animations } from '../theme/theme';

const { width, height } = Dimensions.get('window');

export default function LandingScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Continuous glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const handleGetStarted = () => {
    navigation.navigate('AvatarSelection');
  };

  const glowInterpolate = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  return (
    <LinearGradient
      colors={colors.gradient.primary}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Animated background elements */}
        <View style={styles.backgroundElements}>
          {[...Array(5)].map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.floatingElement,
                {
                  left: Math.random() * width,
                  top: Math.random() * height,
                  opacity: fadeAnim,
                },
              ]}
            />
          ))}
        </View>

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Logo/Icon */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [{ scale: pulseAnim }],
                shadowRadius: glowInterpolate,
              },
            ]}
          >
            <LinearGradient
              colors={[colors.neonBlue, colors.electricBlue]}
              style={styles.logoGradient}
            >
              <Ionicons
                name="chatbubble-ellipses"
                size={60}
                color={colors.primary}
              />
            </LinearGradient>
          </Animated.View>

          {/* Title */}
          <Text style={styles.title}>Vyakti AI</Text>
          <Text style={styles.subtitle}>Your Intelligent Companion</Text>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <FeatureItem
              icon="mic-circle"
              title="Voice Conversations"
              subtitle="Natural voice interactions"
            />
            <FeatureItem
              icon="people-circle"
              title="Multiple Personalities"
              subtitle="Choose your perfect companion"
            />
            <FeatureItem
              icon="globe"
              title="Multilingual Support"
              subtitle="Chat in your preferred language"
            />
          </View>

          {/* Get Started Button */}
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.neonBlue, colors.electricBlue]}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.buttonText}>Get Started</Text>
              <Ionicons
                name="arrow-forward-circle"
                size={24}
                color={colors.primary}
                style={styles.buttonIcon}
              />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

function FeatureItem({ icon, title, subtitle }) {
  return (
    <View style={styles.featureItem}>
      <Ionicons name={icon} size={32} color={colors.neonBlue} />
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  backgroundElements: {
    ...StyleSheet.absoluteFillObject,
  },
  floatingElement: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: colors.neonBlue,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    marginBottom: 40,
    shadowColor: colors.neonBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    elevation: 10,
  },
  logoGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: colors.neonBlue,
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 50,
    textAlign: 'center',
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 50,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  featureText: {
    marginLeft: 20,
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  featureSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  getStartedButton: {
    width: '100%',
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: colors.neonBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 10,
  },
  buttonIcon: {
    marginLeft: 10,
  },
});
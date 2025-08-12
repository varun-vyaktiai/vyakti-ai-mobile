import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/theme';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 60) / 2;

const avatarData = [
  { 
    id: 'priya', 
    name: 'Priya', 
    emoji: '💕', 
    description: 'Your caring companion',
    gradient: [colors.neonPink, colors.neonPurple],
  },
  { 
    id: 'game-host', 
    name: 'Game Host', 
    emoji: '🎮', 
    description: 'Play games',
    gradient: [colors.neonGreen, colors.neonBlue],
  },
  { 
    id: 'guruji', 
    name: 'Guruji', 
    emoji: '🧘', 
    description: 'Spiritual Talks',
    gradient: [colors.neonPurple, colors.deepBlue],
  },
  { 
    id: 'gk-buddy', 
    name: 'GK Buddy', 
    emoji: '🧠', 
    description: 'Explore GK',
    gradient: [colors.electricBlue, colors.neonBlue],
  },
  { 
    id: 'english-sir', 
    name: 'English Sir', 
    emoji: '📚', 
    description: 'Learn English',
    gradient: [colors.neonBlue, colors.royalBlue],
  },
  { 
    id: 'gym-trainer', 
    name: 'Gym Trainer', 
    emoji: '💪', 
    description: 'Stay Fit',
    gradient: [colors.neonGreen, colors.success],
  },
  { 
    id: 'therapist', 
    name: 'Therapist', 
    emoji: '🌸', 
    description: 'Feel safe',
    gradient: [colors.neonPink, colors.neonPurple],
  },
  { 
    id: 'nani', 
    name: 'Nani', 
    emoji: '👵', 
    description: 'Parenting Talks',
    gradient: [colors.warning, colors.neonGreen],
  },
  { 
    id: 'shravan-putra', 
    name: 'Shravan Putra', 
    emoji: '🙏', 
    description: 'Elderly care',
    gradient: [colors.royalBlue, colors.neonBlue],
  },
];

export default function AvatarSelectionScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleAvatarSelect = (avatar) => {
    navigation.navigate('Chat', { selectedAvatar: avatar });
  };

  const renderAvatar = ({ item, index }) => {
    const animationDelay = index * 100;
    
    return (
      <AvatarCard
        avatar={item}
        onPress={() => handleAvatarSelect(item)}
        animationDelay={animationDelay}
      />
    );
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
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Choose Your Expert Friend</Text>
            <Text style={styles.subtitle}>
              Select the perfect companion for your conversation
            </Text>
          </View>

          {/* Avatar Grid */}
          <FlatList
            data={avatarData}
            renderItem={renderAvatar}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.gridContainer}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

function AvatarCard({ avatar, onPress, animationDelay }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        damping: 15,
        stiffness: 150,
        useNativeDriver: true,
      }).start();
    }, animationDelay);

    // Subtle pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
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
  }, [animationDelay]);

  return (
    <Animated.View
      style={[
        styles.avatarContainer,
        {
          transform: [{ scale: scaleAnim }, { scale: pulseAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.avatarCard}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={avatar.gradient}
          style={styles.avatarGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Avatar Icon */}
          <View style={styles.avatarIcon}>
            <Text style={styles.emoji}>{avatar.emoji}</Text>
          </View>

          {/* Avatar Info */}
          <View style={styles.avatarInfo}>
            <Text style={styles.avatarName}>{avatar.name}</Text>
            <Text style={styles.avatarDescription}>{avatar.description}</Text>
          </View>

          {/* Selection Indicator */}
          <View style={styles.selectionIndicator}>
            <Ionicons
              name="arrow-forward-circle"
              size={24}
              color={colors.primary}
            />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
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
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginVertical: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: colors.neonBlue,
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  gridContainer: {
    paddingBottom: 30,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  avatarContainer: {
    width: ITEM_WIDTH,
  },
  avatarCard: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: colors.neonBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  avatarGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarIcon: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  emoji: {
    fontSize: 28,
  },
  avatarInfo: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  avatarName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowRadius: 2,
  },
  avatarDescription: {
    fontSize: 14,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowRadius: 2,
  },
  selectionIndicator: {
    marginTop: 10,
  },
});

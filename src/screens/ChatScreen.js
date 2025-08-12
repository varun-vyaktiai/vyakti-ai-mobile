import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/theme';

const { width } = Dimensions.get('window');

// Mock chat data for preview
const initialMessages = [
  {
    id: '1',
    text: 'Hello! I\'m here to chat about life, love, goals, or just have a relaxed conversation. How are you feeling today?',
    sender: 'bot',
    timestamp: new Date().toISOString(),
  },
];

export default function ChatScreen({ route, navigation }) {
  const { selectedAvatar } = route.params || {};
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: inputText.trim(),
        sender: 'user',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      setIsTyping(true);

      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: (Date.now() + 1).toString(),
          text: `That's interesting! I understand you said "${inputText.trim()}". Tell me more about that...`,
          sender: 'bot',
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const renderMessage = ({ item, index }) => {
    return <MessageBubble message={item} animationDelay={index * 50} />;
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;
    return <TypingIndicator />;
  };

  return (
    <LinearGradient
      colors={colors.gradient.primary}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Chat Header */}
            <View style={styles.chatHeader}>
              <View style={styles.avatarInfo}>
                <LinearGradient
                  colors={selectedAvatar?.gradient || [colors.neonPink, colors.neonPurple]}
                  style={styles.avatarCircle}
                >
                  <Text style={styles.avatarEmoji}>
                    {selectedAvatar?.emoji || '💕'}
                  </Text>
                </LinearGradient>
                <View style={styles.headerText}>
                  <Text style={styles.avatarName}>
                    {selectedAvatar?.name || 'Priya'}
                  </Text>
                  <Text style={styles.onlineStatus}>Online</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.voiceButton}
                onPress={() => navigation.navigate('VoiceScore')}
              >
                <Ionicons name="mic-circle" size={32} color={colors.neonBlue} />
              </TouchableOpacity>
            </View>

            {/* Messages List */}
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              style={styles.messagesList}
              contentContainerStyle={styles.messagesContainer}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => 
                flatListRef.current?.scrollToEnd({ animated: true })
              }
              ListFooterComponent={renderTypingIndicator}
            />

            {/* Input Bar */}
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={[colors.secondary, colors.tertiary]}
                style={styles.inputGradient}
              >
                <TextInput
                  style={styles.textInput}
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Type your message..."
                  placeholderTextColor={colors.textMuted}
                  multiline
                  maxLength={500}
                />
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    { opacity: inputText.trim() ? 1 : 0.5 }
                  ]}
                  onPress={sendMessage}
                  disabled={!inputText.trim()}
                >
                  <LinearGradient
                    colors={[colors.neonBlue, colors.electricBlue]}
                    style={styles.sendGradient}
                  >
                    <Ionicons name="send" size={20} color={colors.primary} />
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function MessageBubble({ message, animationDelay }) {
  const slideAnim = useRef(new Animated.Value(20)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }, animationDelay);
  }, [animationDelay]);

  const isUser = message.sender === 'user';

  return (
    <Animated.View
      style={[
        styles.messageWrapper,
        isUser ? styles.userMessageWrapper : styles.botMessageWrapper,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={
          isUser
            ? [colors.neonBlue, colors.electricBlue]
            : [colors.secondary, colors.tertiary]
        }
        style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.botBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isUser ? styles.userText : styles.botText,
          ]}
        >
          {message.text}
        </Text>
      </LinearGradient>
    </Animated.View>
  );
}

function TypingIndicator() {
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDots = () => {
      Animated.sequence([
        Animated.timing(dot1Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(dot2Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(dot3Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(dot1Anim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(dot2Anim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(dot3Anim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => animateDots());
    };
    animateDots();
  }, []);

  return (
    <View style={styles.typingContainer}>
      <LinearGradient
        colors={[colors.secondary, colors.tertiary]}
        style={styles.typingBubble}
      >
        <View style={styles.typingDots}>
          <Animated.View style={[styles.dot, { opacity: dot1Anim }]} />
          <Animated.View style={[styles.dot, { opacity: dot2Anim }]} />
          <Animated.View style={[styles.dot, { opacity: dot3Anim }]} />
        </View>
      </LinearGradient>
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
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.tertiary,
  },
  avatarInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  avatarEmoji: {
    fontSize: 20,
  },
  headerText: {
    flex: 1,
  },
  avatarName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  onlineStatus: {
    fontSize: 14,
    color: colors.neonGreen,
    marginTop: 2,
  },
  voiceButton: {
    padding: 5,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContainer: {
    paddingVertical: 20,
  },
  messageWrapper: {
    marginVertical: 5,
    maxWidth: '80%',
  },
  userMessageWrapper: {
    alignSelf: 'flex-end',
  },
  botMessageWrapper: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    borderBottomRightRadius: 5,
  },
  botBubble: {
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: colors.primary,
    fontWeight: '500',
  },
  botText: {
    color: colors.textPrimary,
  },
  typingContainer: {
    alignSelf: 'flex-start',
    marginVertical: 5,
  },
  typingBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 5,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.neonBlue,
    marginHorizontal: 2,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: colors.tertiary,
  },
  inputGradient: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    minHeight: 50,
  },
  textInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    marginLeft: 10,
  },
  sendGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, Alert, Platform } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Audio } from 'expo-av';

// Screens
import LandingScreen from './src/screens/LandingScreen';
import ChatScreen from './src/screens/ChatScreen';
import AvatarSelectionScreen from './src/screens/AvatarSelectionScreen';

// Theme
import { darkTheme } from './src/theme/theme';

const Stack = createStackNavigator();

// Custom navigation theme
const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#000000',
    card: '#111111',
    text: '#ffffff',
    border: '#333333',
    primary: '#00ffff',
  },
};

export default function App() {
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        // Request microphone permission
        const { status: audioStatus } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        
        if (audioStatus === 'granted') {
          // Configure audio session
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
          });
          
          setPermissionsGranted(true);
        } else {
          Alert.alert(
            'Permission Required',
            'Vyakti AI needs microphone access to provide voice features. Please grant permission in your device settings.',
            [
              { text: 'Try Again', onPress: requestPermissions },
              { text: 'Continue Without Voice', onPress: () => setPermissionsGranted(true) }
            ]
          );
        }
      } else {
        // For iOS, permissions are handled automatically
        setPermissionsGranted(true);
      }
    } catch (error) {
      console.log('Permission error:', error);
      setPermissionsGranted(true); // Continue anyway
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#00ffff', fontSize: 18, fontWeight: 'bold' }}>Setting up Vyakti AI...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={darkTheme}>
        <NavigationContainer theme={navigationTheme}>
          <StatusBar style="light" backgroundColor="#000000" />
          <Stack.Navigator
            initialRouteName="Landing"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#000000',
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 1,
                borderBottomColor: '#333333',
              },
              headerTintColor: '#00ffff',
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 18,
              },
              cardStyle: { backgroundColor: '#000000' },
              animationTypeForReplace: 'push',
              gestureEnabled: true,
            }}
          >
            <Stack.Screen 
              name="Landing" 
              component={LandingScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="AvatarSelection" 
              component={AvatarSelectionScreen}
              options={{ 
                title: 'Choose Your Companion',
                headerBackTitleVisible: false,
              }}
            />
            <Stack.Screen 
              name="Chat" 
              component={ChatScreen}
              options={{ 
                title: 'Vyakti AI',
                headerBackTitleVisible: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
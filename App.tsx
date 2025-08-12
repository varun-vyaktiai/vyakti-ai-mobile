import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

// Import screens
import LandingScreen from './src/screens/LandingScreen';
import LanguageGenderScreen from './src/screens/LanguageGenderScreen';
import AvatarSelectionScreen from './src/screens/AvatarSelectionScreen';
import ChatScreen from './src/screens/ChatScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import VoiceScoreScreen from './src/screens/VoiceScoreScreen';
import AuthScreen from './src/screens/AuthScreen';

// Navigation types
export type RootStackParamList = {
  Landing: undefined;
  LanguageGender: undefined;
  AvatarSelection: { language: string; gender: string };
  Chat: { 
    language: string; 
    gender: string; 
    avatar: any; 
    topics: string[] 
  };
  Profile: undefined;
  VoiceScore: undefined;
  Auth: { mode: 'signup' | 'signin' };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  useEffect(() => {
    // Hide splash screen after app loads
    const hideSplash = setTimeout(() => {
      SplashScreen.hide();
    }, 2000);

    // Request permissions for Android
    if (Platform.OS === 'android') {
      requestPermissions();
    }

    return () => clearTimeout(hideSplash);
  }, []);

  const requestPermissions = async () => {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ];

      const results = await PermissionsAndroid.requestMultiple(permissions);
      
      // Log permission results for debugging
      console.log('Permission results:', results);
    } catch (error) {
      console.warn('Permission request error:', error);
    }
  };

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#000000"
        translucent={false}
      />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Landing"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            animationDuration: 300,
          }}>
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="LanguageGender" component={LanguageGenderScreen} />
          <Stack.Screen name="AvatarSelection" component={AvatarSelectionScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="VoiceScore" component={VoiceScoreScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});

export default App;
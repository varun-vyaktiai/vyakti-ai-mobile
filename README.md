# Vyakti AI Mobile App

A React Native mobile application for Vyakti AI - your personal multilingual AI companion.

## Features

- 🗣️ **Multilingual Chat**: Support for Hindi, English, Tamil, and Bengali
- 🎙️ **Voice Conversations**: High-quality voice synthesis and recognition
- 🎭 **Multiple AI Personalities**: Chat with different AI avatars
- 🔥 **Voice Scoring**: Advanced voice analytics and scoring
- 📱 **Native Android App**: Optimized for Android devices
- 🔐 **Secure Authentication**: Phone number-based authentication

## Google Play Store Ready

This app meets all 2025 Google Play Store requirements:
- ✅ Target SDK 35 (Android 15)
- ✅ Android App Bundle (AAB) format
- ✅ 16KB page size compatibility
- ✅ Proper permissions and security

## Building the App

### Option 1: Cloud Build (Recommended)

No local setup required - builds happen in GitHub Actions:

1. Push code to GitHub repository
2. GitHub Actions automatically builds APK and AAB
3. Download from Releases section

### Option 2: Local Build

If you have Android development environment set up:

```bash
# Install dependencies
npm install

# Build release APK
npm run build:android

# Build release AAB (for Play Store)
npm run build:aab
```

## Installation

1. Download the APK from GitHub Releases
2. Enable "Install from unknown sources" on your Android device
3. Install the APK file
4. Grant necessary permissions (microphone, storage)

## Architecture

- **Framework**: React Native 0.73.6
- **Navigation**: React Navigation 6
- **Audio**: react-native-sound, react-native-tts
- **Voice**: @react-native-voice/voice
- **Storage**: AsyncStorage
- **Permissions**: react-native-permissions

## Development

```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# Run on Android device/emulator
npm run android
```

## Permissions

The app requires the following permissions:
- **Microphone**: For voice conversations
- **Storage**: For caching audio files
- **Network**: For API communications
- **Device ID**: For voice attempt tracking

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@vyaktiai.com or visit https://vyaktiai.com
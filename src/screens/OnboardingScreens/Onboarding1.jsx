// src/screens/Onboarding/Onboarding1.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Button,
} from 'react-native';

// Replace with your own illustration for Screen 1
import backgroundImage from '../../assets/logo.png';

export default function Onboarding1({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={styles.imageBackground}
      >
        {/* Semi-transparent overlay */}
        <View style={styles.overlay} />

        <View style={styles.contentContainer}>
          <Button title="Change Language" onPress={() => { navigation.navigate('LanguageSelectScreen') }} />
          {/* Title */}
          <Text style={styles.title}>Welcome to Zugado</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Your ultimate app for services, products, and deliveries. Fast, reliable, and convenient.
          </Text>

          {/* Pagination Dots */}
          <View style={styles.paginationContainer}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          {/* Next Button */}
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => navigation.navigate('Onboarding2')}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>

          {/* Sign In Link */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
            style={{ marginTop: 15 }}
          >
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text style={styles.signInLink}>Sign in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

// -------------------- Styles --------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  contentContainer: {
    paddingHorizontal: 25,
    paddingBottom: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E0E0',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 5,
  },
  activeDot: {
    width: 20,
    backgroundColor: '#FFA500',
  },
  nextButton: {
    backgroundColor: '#156778',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerText: {
    color: '#E0E0E0',
    fontSize: 15,
  },
  signInLink: {
    color: '#FFA500',
    fontWeight: 'bold',
  },
});

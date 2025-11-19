// src/screens/Onboarding/Onboarding3.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
} from 'react-native';
import image from '../../assets/logo.png';

const backgroundImage = image;

export default function Onboarding3({ navigation }) {
  const handleGetStarted = () => {
    navigation.navigate('Onboarding4'); // Or your main app screen, e.g., 'Home'
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={styles.imageBackground}>
        {/* Semi-transparent overlay */}
        <View style={styles.overlay} />

        <View style={styles.contentContainer}>
          <Text style={styles.title}>Discover Zugado</Text>
          <Text style={styles.subtitle}>
            Explore the best services, deals, and experiences all in one place with Zugado.
          </Text>

          {/* Pagination Dots */}
          <View style={styles.paginationContainer}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
          </View>

          {/* Get Started Button */}
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={handleGetStarted}>
            <Text style={styles.getStartedButtonText}>Get Started</Text>
          </TouchableOpacity>

          {/* Sign In Link */}
          <TouchableOpacity onPress={() => navigation.navigate('Auth', { screen: 'Login' })}>
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
    paddingBottom: 40,
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
    backgroundColor: '#FFA500',
    width: 20,
  },
  getStartedButton: {
    backgroundColor: '#156778',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  getStartedButtonText: {
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

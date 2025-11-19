// src/screens/Onboarding/Onboarding4.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Image,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import image from '../../assets/logo.png';

// A new placeholder image for the auth screen.
const backgroundImage = image;

export default function Onboarding4({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={styles.imageBackground}>
        {/* Semi-transparent overlay for better text readability */}
        <View style={styles.overlay} />

        <View style={styles.contentContainer}>
          <Text style={styles.title}>Let's Join with Us</Text>
          <Text style={styles.subtitle}>
            Find and book Beauty, Salon, Barber and Spa services anywhere, anytime
          </Text>

          {/* Join with Google Button */}
          <TouchableOpacity
            style={[styles.button, styles.googleButton]}
            onPress={() => console.log('Join with Google pressed')}>
            <Image
              source={require('../../assets/logo.png')} // Make sure you have this asset
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Join with Google</Text>
          </TouchableOpacity>

          {/* Join with Email Button */}
          <TouchableOpacity
            style={[styles.button, styles.emailButton]}
            onPress={() =>  navigation.navigate('Auth', { screen: 'Register' })}>
            <Feather name="mail" size={20} color="#FFFFFF" style={styles.icon} />
            <Text style={styles.emailButtonText}>Join with Email</Text>
          </TouchableOpacity>

          {/* Sign In Link */}
          <TouchableOpacity onPress={() =>  navigation.navigate('Auth', { screen: 'Login' })}>
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
    justifyContent: 'flex-end', // Aligns content to the bottom
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Covers the entire parent
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Dark overlay
  },
  contentContainer: {
    paddingHorizontal: 25,
    paddingBottom: 40, // Space from the bottom edge
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
    marginBottom: 40,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 30,
    width: '100%',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
  },
  emailButton: {
    backgroundColor: '#156778', // Teal color
  },
  googleIcon: {
    width: 22,
    height: 22,
    marginRight: 12,
  },
  icon: {
    marginRight: 12,
  },
  googleButtonText: {
    color: '#333333',
    fontWeight: '600',
    fontSize: 16,
  },
  emailButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerText: {
    color: '#E0E0E0',
    fontSize: 15,
    marginTop: 15,
  },
  signInLink: {
    color: '#FFA500', // Orange color
    fontWeight: 'bold',
  },
});

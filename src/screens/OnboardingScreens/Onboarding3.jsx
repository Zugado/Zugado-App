import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PaginationDots from '../../components/PaginationDots';
import illustration from '../../assets/onboarding3.png'; 

export default function Onboarding3({ navigation }) {
  const handleNavigation = () => {
    navigation.navigate('Auth', { screen: 'Login' }); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F7F9" />

      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={handleNavigation} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <Image source={illustration} style={styles.illustration} resizeMode="contain" />

        <Text style={styles.title}>Stay Connected. Finish Tasks Faster.</Text>
        
        <Text style={styles.subtitle}>
          Limited chat before acceptance, full chat after. manage tasks easily and track updates.
        </Text>

          <PaginationDots currentIndex={2} />
      </View>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={handleNavigation}>
          <Text style={styles.getStartedButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F9',
  },
  skipContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  skipButton: {
    padding: 5,
  },
  skipText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: -50,
  },
  illustration: {
    width: '100%',
    height: 250, 
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '700', 
    color: '#333333',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonWrapper: {
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  getStartedButton: {
    backgroundColor: '#000000',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  getStartedButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
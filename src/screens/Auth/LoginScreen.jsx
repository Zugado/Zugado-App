import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  ScrollView,
} from 'react-native';
// Import icons
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/slices/authSlice'; // ✅ import thunk

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  
  const [mobile, setMobile] = useState('');

  const handleGetOtpText = () => {
    // Add logic for text-based OTP
    console.log('Get OTP on Text for:', mobile);
    navigation.navigate('OtpVerification');
  };

  const handleGetOtpWhatsapp = () => {
    // Add logic for WhatsApp-based OTP
    console.log('Get OTP on WhatsApp for:', mobile);
  };

  const handleSkip = () => {
    navigation.replace('Main'); // Or your main app screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* Illustration */}
        <Image
          // *** REPLACE WITH YOUR IMAGE FILE ***
          source={require('../../assets/illustration.png')} 
          style={styles.illustration}
          resizeMode="contain"
        />

        {/* Logo */}
        <Image
          // *** REPLACE WITH YOUR LOGO FILE ***
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Text Content */}
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>
          Welcome To Zugado, where you manage your daily tasks
        </Text>

        {/* Input Field */}
        <Text style={styles.inputLabel}>Mobile No.</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.countryCode}>+91</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Mobile No."
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={mobile}
            onChangeText={setMobile}
            maxLength={10}
          />
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={[styles.button, styles.buttonBlack]}
          onPress={handleGetOtpText}>
          <Text style={[styles.buttonText, styles.buttonTextWhite]}>
            Get OTP On Text
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonGreen]}
          onPress={handleGetOtpWhatsapp}>
          <Text style={[styles.buttonText, styles.buttonTextWhite]}>
            Get OTP On Whatsapp
          </Text>
        </TouchableOpacity>

        {/* Agreement Text */}
        <View style={styles.agreementContainer}>
          <MaterialCommunityIcons
            name="checkbox-marked"
            size={20}
            color="#333"
          />
          <Text style={styles.agreementText}>
            Registration Continuing, You Agree to Our{' '}
            <Text style={styles.linkText}>Terms of & Privacy Policy.</Text>
          </Text>
        </View>

        {/* Skip Button */}
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>SKIP</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- STYLES ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  illustration: {
    width: 300,
    height: 220, // Adjust height as needed
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 40, // Adjust height as needed
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  inputLabel: {
    alignSelf: 'flex-start',
    color: '#555',
    marginBottom: 5,
    fontSize: 14,
    marginLeft: 5, // Align with input container padding
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  countryCode: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRightWidth: 1,
    borderColor: '#ddd',
    color: '#333',
    fontSize: 16,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 30, // For fully rounded corners
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonBlack: {
    backgroundColor: '#000',
  },
  buttonGreen: {
    backgroundColor: '#25D366', // WhatsApp-like green
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextWhite: {
    color: '#fff',
  },
  agreementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
    paddingHorizontal: 10, // To give it some space
  },
  agreementText: {
    marginLeft: 10,
    color: '#555',
    fontSize: 12,
    flex: 1, // Allows text to wrap
    lineHeight: 18,
  },
  linkText: {
    color: '#000',
    fontWeight: 'bold',
    // textDecorationLine: 'underline', // Optional
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    color: '#777',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
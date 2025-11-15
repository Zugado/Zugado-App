import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image, // <--- Import Image component
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

export default function OtpVerification() {
  const otpInputs = useRef([]);

  const handleOtpChange = (text, index) => {
    if (text.length === 1 && index < otpInputs.current.length - 1) {
      otpInputs.current[index + 1].focus();
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>


        {/* --- REPLACED MAIN GRAPHIC WITH IMAGE --- */}
        <Image
          source={require('../../assets/otpImage.png')} // <--- Adjust this path to your image
          style={styles.mainGraphicImage}
        />
        {/* --- END IMAGE REPLACEMENT --- */}

        {/* Logo */}
        {/* If your image already contains the 'zugado' logo, you might remove this Text component */}
       <Image
          source={require('../../assets/logo.png')} // <--- Adjust this path to your logo image
          style={{ width: 160, height: 50, marginBottom: 60 }}
          resizeMode="contain"
        />

        {/* OTP Verification Text */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>OTP Verification</Text>
          <Text style={styles.description}>
            Thank you for registering with you. Please type the OTP as shared on your Mobile
            <Text style={styles.phoneNumber}> +91 XXXXXX5471</Text>
          </Text>
        </View>

        {/* OTP Input Fields */}
        <View style={styles.otpInputContainer}>
          {[0, 1, 2, 3].map((index) => (
            <TextInput
              key={index}
              ref={(el) => (otpInputs.current[index] = el)}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              onChangeText={(text) => handleOtpChange(text, index)}
            />
          ))}
        </View>

        {/* Resend OTP */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>OTP not received? </Text>
          <TouchableOpacity>
            <Text style={styles.resendLink}>RESEND</Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
    position: 'relative',
  },
  // --- NEW STYLE FOR THE IMAGE ---
  mainGraphicImage: {
    width: '100%',  // Adjust width as needed
    height: 250, // Adjust height as needed
    resizeMode: 'cover', // Or 'cover', 'stretch', 'center' based on your image
    marginTop: 60,
    marginBottom: 10,
    },

  logo: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  phoneNumber: {
    fontWeight: 'bold',
    color: '#000',
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 40,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  resendContainer: {
    flexDirection: 'row',
    marginBottom: 60,
  },
  resendText: {
    fontSize: 14,
    color: '#555',
  },
  resendLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#000',
    width: '90%',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
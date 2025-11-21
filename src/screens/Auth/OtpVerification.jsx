import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Image,
  ScrollView,
  Keyboard,
} from 'react-native';
import { verifyOtp } from '../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';

export default function OtpVerification({ route, navigation }) {
  const { mobile, exposedOTP } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpInputs = useRef([]);

  const dispatch = useDispatch();

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text.length === 1 && index < otpInputs.current.length - 1) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = ({ nativeEvent: { key } }, index) => {
    if (key === 'Backspace' && index > 0) {
      if (otp[index] === '') {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        otpInputs.current[index - 1].focus();
      }
    }
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    console.log(otp);
    dispatch(
      verifyOtp({
        mobileOrEmail: mobile,
        otp: otp.join(''),
      })
    );
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <Image
          source={require('../../assets/otpImage.png')}
          style={styles.mainGraphicImage}
        />

        <Image
          source={require('../../assets/logo.png')}
          style={{ width: 160, height: 50, marginBottom: 60 }}
          resizeMode="contain"
        />

        <Text style={{color: 'green'}}>OTP is: {exposedOTP}</Text>

        <View style={styles.textContainer}>
          <Text style={styles.title}>OTP Verification</Text>
          <Text style={styles.description}>
            Please enter the OTP sent to
            <Text style={styles.phoneNumber}> +91 {mobile} </Text>
          </Text>
        </View>

        {/* OTP Input Fields */}
        <View style={styles.otpInputContainer}>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <TextInput
              key={index}
              ref={(el) => (otpInputs.current[index] = el)}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              value={otp[index]} // Controlled input
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(event) => handleKeyPress(event, index)}
              onFocus={() => {
              }}
            />
          ))}
        </View>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>OTP not received? </Text>
          <TouchableOpacity>
            <Text style={styles.resendLink}>RESEND</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  mainGraphicImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    marginTop: 60,
    marginBottom: 10,
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
    width: '90%',
    marginBottom: 40,
  },
  otpInput: {
    width: 45,
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
    marginBottom: 40, 
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
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
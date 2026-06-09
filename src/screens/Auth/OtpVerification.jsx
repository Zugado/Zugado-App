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
  KeyboardAvoidingView,
  Keyboard,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { sendOtp, verifyOtp} from '../../store/thunks/authThunk';
import { useDispatch, useSelector } from 'react-redux';
import Snackbar from '../../components/Snackbar';

export default function OtpVerification({ route, navigation }) {
  const { mobile, exposedOTP } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [currentExposedOTP, setCurrentExposedOTP] = useState(exposedOTP);
  const [otpError, setOtpError] = useState('');
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', type: 'success' });
  const otpInputs = useRef([]);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleOtpChange = (text, index) => {
    const digit = text.replace(/\D/g, '');
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setOtpError('');
    if (digit.length === 1 && index < otpInputs.current.length - 1) {
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

  const handleSubmit = async () => {
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      setOtpError('Please enter all 6 digits');
      return;
    }
    if (!/^\d{6}$/.test(otpValue)) {
      setOtpError('OTP must contain numbers only');
      return;
    }
    const data = { mobileOrEmail: mobile, otp: otpValue };
    
    try {
      const response = await dispatch(verifyOtp(data));

      if (verifyOtp.fulfilled.match(response)) {
        console.log("OTP Verification successful");
        setSnackbar({ visible: true, message: response?.payload?.message || 'OTP verified successfully', type: 'success' });
      } else {
        console.log("in  try = ", response );
        setSnackbar({ visible: true, message: response?.payload?.message || 'OTP verification failed', type: 'error' });
      }
    } catch (error) {
              console.log("in catch = OTP Verification failed");

      setSnackbar({ visible: true, message: 'OTP verification failed', type: 'error' });
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await dispatch(sendOtp({ mobileOrEmail: mobile, method: 'sms' }));
      
      if (sendOtp.fulfilled.match(response)) {
        const newExposedOTP = response?.payload?.data?.exposedOTP;
        setCurrentExposedOTP(newExposedOTP);
        setOtp(['', '', '', '', '', '']);
        setSnackbar({ visible: true, message: 'New OTP sent successfully', type: 'success' });
      } else {
        setSnackbar({ visible: true, message: response?.payload?.message || 'Failed to resend OTP', type: 'error' });
      }
    } catch (error) {
      setSnackbar({ visible: true, message: 'Failed to resend OTP', type: 'error' });
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
      >
        <View style={styles.container}>
        <Image
          source={require('../../assets/Icons/OtpGraphic.png')}
          style={styles.mainGraphicImage}
        />

        <Image
          source={require('../../assets/logo.png')}
          style={{ width: 160, height: 50, marginBottom: 60 }}
          resizeMode="contain"
        />

        <Text style={{color: 'green'}}>OTP is: {currentExposedOTP}</Text>

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
              style={[styles.otpInput, otpError ? styles.otpInputError : null]}
              keyboardType="number-pad"
              maxLength={1}
              value={otp[index]}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(event) => handleKeyPress(event, index)}
              onFocus={() => {}}
            />
          ))}
        </View>
        {otpError ? <Text style={styles.otpErrorText}>{otpError}</Text> : null}

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>OTP not received? </Text>
          <TouchableOpacity onPress={handleResendOtp} disabled={loading}>
            <Text style={[styles.resendLink, loading && { opacity: 0.5 }]}>RESEND</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={1}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit</Text>
          )}
        </TouchableOpacity>
        </View>
        
        <Snackbar
          visible={snackbar.visible}
          message={snackbar.message}
          type={snackbar.type}
          onHide={() => setSnackbar({ ...snackbar, visible: false })}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
  otpInputError: {
    borderColor: '#EF4444',
  },
  otpErrorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: -30,
    marginBottom: 20,
    alignSelf: 'flex-start',
    marginLeft: '5%',
  },
});
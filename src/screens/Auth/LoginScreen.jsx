import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp, setGuestMode } from '../../redux/slices/authSlice';

export default function LoginScreen({ navigation }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [mobile, setMobile] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleToggleAgreement = () => {
    setAgreed(!agreed);
  };

  const handleGetOtp = (method) => {
    if (mobile.length !== 10) {
      Alert.alert(t('error'), t('please_enter_valid_mobile'));
      return;
    }

    if (!agreed) {
      Alert.alert(t('error'), t('please_agree_to_terms'));
      return;
    }

  dispatch(sendOtp({ mobileOrEmail: mobile }))
  .unwrap()
  .then((res) => { // <-- res is now the object { message: '...', exposedOTP: '...' }
    console.log("EXPOSED OTP:", res.data.exposedOTP); // <-- res.data is WRONG
    navigation.navigate('OtpVerification', { mobile, exposedOTP: res.data.exposedOTP }); // <-- res.data is WRONG
  })
  };

  const handleGetOtpText = () => handleGetOtp('text');
  const handleGetOtpWhatsapp = () => handleGetOtp('whatsapp');

  const handleSkip = () => {
    dispatch(setGuestMode());
  };

  const isButtonEnabled = mobile.length === 10 && agreed;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={require('../../assets/illustration.png')}
          style={styles.illustration}
          resizeMode="contain"
        />

        {/* Logo */}
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Text Content */}
        <Text style={styles.title}>{t('login')}</Text>
        <Text style={styles.subtitle}>{t('login_subtitle')}</Text>

        {/* Input Field */}
        <Text style={styles.inputLabel}>{t('mobile_number')}</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.countryCode}>+91</Text>
          <TextInput
            style={styles.input}
            placeholder={t('enter_mobile')}
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={mobile}
            onChangeText={setMobile}
            maxLength={10}
          />
        </View>

        {/* Agreement Text and Checkbox */}
        <TouchableOpacity style={styles.agreementContainer} onPress={handleToggleAgreement}>
          <MaterialCommunityIcons 
            name={agreed ? "checkbox-marked" : "checkbox-blank-outline"} 
            size={20} 
            color={agreed ? "#000" : "#666"} 
          />
          <Text style={styles.agreementText}>
            {t('agreement_text')} <Text style={styles.linkText}>{t('terms_privacy')}</Text>
          </Text>
        </TouchableOpacity>

        {/* Buttons */}
        <TouchableOpacity
          style={[
            styles.button, 
            styles.buttonBlack, 
            !isButtonEnabled && styles.buttonDisabled // Apply disabled style
          ]}
          onPress={handleGetOtpText}
          disabled={!isButtonEnabled} // Disable button
        >
          <Text style={[styles.buttonText, styles.buttonTextWhite]}>
            {t('get_otp_text')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button, 
            styles.buttonGreen,
            !isButtonEnabled && styles.buttonDisabled // Apply disabled style
          ]}
          onPress={handleGetOtpWhatsapp}
          disabled={!isButtonEnabled} // Disable button
        >
          <Text style={[styles.buttonText, styles.buttonTextWhite]}>
            {t('get_otp_whatsapp')}
          </Text>
        </TouchableOpacity>

        {/* Skip Button */}
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>{t('skip')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { alignItems: 'center', padding: 20, paddingBottom: 40 },
  illustration: { width: 300, height: 220, marginBottom: 20 },
  logo: { width: 150, height: 40, marginBottom: 30 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#000', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30, paddingHorizontal: 20 },
  inputLabel: { alignSelf: 'flex-start', color: '#555', marginBottom: 5, fontSize: 14, marginLeft: 5 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 12, width: '100%', marginBottom: 20, backgroundColor: '#fff' },
  countryCode: { paddingHorizontal: 15, paddingVertical: 12, borderRightWidth: 1, borderColor: '#ddd', color: '#333', fontSize: 16 },
  input: { flex: 1, padding: 12, fontSize: 16, color: '#000' },
  button: { width: '100%', paddingVertical: 16, borderRadius: 30, alignItems: 'center', marginBottom: 15 },
  buttonBlack: { backgroundColor: '#000' },
  buttonGreen: { backgroundColor: '#25D366' },
  buttonDisabled: { backgroundColor: '#ccc' }, // New style for disabled buttons
  buttonText: { fontSize: 16, fontWeight: 'bold' },
  buttonTextWhite: { color: '#fff' },
  // Changed agreementContainer to use TouchableOpacity style conventions
  agreementContainer: { flexDirection: 'row', alignItems: 'flex-start', width: '100%', marginBottom: 30, paddingHorizontal: 5 }, 
  agreementText: { marginLeft: 10, color: '#555', fontSize: 12, flex: 1, lineHeight: 18, paddingTop: 1 }, // Added minor padding adjustment
  linkText: { color: '#000', fontWeight: 'bold' },
  skipButton: { padding: 10 },
  skipText: { color: '#777', fontSize: 14, fontWeight: 'bold' },
});
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
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, sendOtp, setGuestMode } from '../../redux/slices/authSlice';

export default function LoginScreen({ navigation }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [mobile, setMobile] = useState('');

  const handleGetOtpText = () => {
    dispatch(sendOtp({ mobileOrEmail: mobile }));
    navigation.navigate('OtpVerification', { mobile });
  };

  const handleGetOtpWhatsapp = () => {
    dispatch(sendOtp({ mobileOrEmail: mobile }));
    navigation.navigate('OtpVerification', { mobile });
  };

  const handleSkip = () => {
    dispatch(setGuestMode());
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* Illustration */}
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

        {/* Buttons */}
        <TouchableOpacity
          style={[styles.button, styles.buttonBlack]}
          onPress={handleGetOtpText}>
          <Text style={[styles.buttonText, styles.buttonTextWhite]}>
            {t('get_otp_text')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonGreen]}
          onPress={handleGetOtpWhatsapp}>
          <Text style={[styles.buttonText, styles.buttonTextWhite]}>
            {t('get_otp_whatsapp')}
          </Text>
        </TouchableOpacity>

        {/* Agreement Text */}
        <View style={styles.agreementContainer}>
          <MaterialCommunityIcons name="checkbox-marked" size={20} color="#333" />
          <Text style={styles.agreementText}>
            {t('agreement_text')} <Text style={styles.linkText}>{t('terms_privacy')}</Text>
          </Text>
        </View>

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
  buttonText: { fontSize: 16, fontWeight: 'bold' },
  buttonTextWhite: { color: '#fff' },
  agreementContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 30, paddingHorizontal: 10 },
  agreementText: { marginLeft: 10, color: '#555', fontSize: 12, flex: 1, lineHeight: 18 },
  linkText: { color: '#000', fontWeight: 'bold' },
  skipButton: { padding: 10 },
  skipText: { color: '#777', fontSize: 14, fontWeight: 'bold' },
});

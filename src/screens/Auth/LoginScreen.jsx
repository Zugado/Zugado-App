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
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { setGuestMode } from '../../store/slices/authSlice';
import { sendOtp } from '../../store/thunks/authThunk';
import { useSnackbar } from '../../contexts/SnackbarContext';
import MyStatusBar from '../../components/MyStatusbar';

export default function LoginScreen({ navigation }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [mobile, setMobile] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loadingButton, setLoadingButton] = useState(null);
  const { showSnackbar } = useSnackbar();

  const handleToggleAgreement = () => {
    setAgreed(!agreed);
  };

  const handleGetOtp = async (method) => {
    if (mobile.length !== 10) {
      showSnackbar(t('please_enter_valid_mobile'), 'error');
      return;
    }

    if (!agreed) {
      showSnackbar(t('please_agree_to_terms'), 'error');
      return;
    }

    setLoadingButton(method);
    try {
      const response = await dispatch(sendOtp({ mobileOrEmail: mobile, method }));
      
      if (sendOtp.fulfilled.match(response)) {
        const exposedOTP = response?.payload?.data?.exposedOTP;
        showSnackbar(response?.payload?.message || 'OTP sent successfully', 'success');
        // Use setTimeout to ensure navigation happens after state updates
        setTimeout(() => {
          navigation.navigate('OtpVerification', { mobile, exposedOTP });
        }, 100);
      } else {
        showSnackbar(response?.payload?.message || 'Failed to send OTP', 'error');
      }
    } catch (error) {
      showSnackbar('Failed to send OTP', 'error');
    } finally {
      setLoadingButton(null);
    }
  };

  const handleGetOtpText = () => handleGetOtp('sms');
  const handleGetOtpWhatsapp = () => handleGetOtp('whatsapp');

  const handleSkip = () => {
    dispatch(setGuestMode());
  };

  const isButtonEnabled = mobile.length === 10 && agreed;

  return (
    <SafeAreaView style={styles.container}>
        <MyStatusBar/>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={require('../../assets/illustration.png')}
          style={styles.illustration}
          resizeMode="contain"
        />

        {/* Logo */}
        <Image
          source={require('../../assets/Icons/LogoLogin.png')}
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
          ]}
          onPress={handleGetOtpText}
          disabled={loadingButton !== null}
          activeOpacity={0.7}
        >
          {loadingButton === 'sms' ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={[styles.buttonText, styles.buttonTextWhite]}>
              {t('get_otp_text')}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button, 
            styles.buttonGreen,
          ]}
          onPress={handleGetOtpWhatsapp}
          disabled={loadingButton !== null}
          activeOpacity={1}
        >
          {loadingButton === 'whatsapp' ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={[styles.buttonText, styles.buttonTextWhite]}>
              {t('get_otp_whatsapp')}
            </Text>
          )}
        </TouchableOpacity>

        {/* Skip Button */}
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip} activeOpacity={0.7}>
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
  title: { fontSize: 24, fontWeight: '700', color: '#1a1a1a', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 25, paddingHorizontal: 10, lineHeight: 20 },
  inputLabel: { alignSelf: 'flex-start', color: '#333', marginBottom: 6, fontSize: 13, fontWeight: '500', marginLeft: 2 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e8e8e8',
    borderRadius: 14,
    width: '100%',
    marginBottom: 18,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  countryCode: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
    color: '#2c2c2c',
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  button: { width: '100%', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  buttonBlack: { backgroundColor: '#000' },
  buttonGreen: { backgroundColor: '#25D366' },
  buttonText: { fontSize: 15, fontWeight: '600' },
  buttonTextWhite: { color: '#fff' },
  agreementContainer: { flexDirection: 'row', alignItems: 'flex-start', width: '100%', marginBottom: 25, paddingHorizontal: 2 }, 
  agreementText: { marginLeft: 8, color: '#666', fontSize: 11, flex: 1, lineHeight: 16, paddingTop: 2 },
  linkText: { color: '#1a1a1a', fontWeight: '600' },
  skipButton: { padding: 10 },
  skipText: { color: '#888', fontSize: 13, fontWeight: '500' },
});
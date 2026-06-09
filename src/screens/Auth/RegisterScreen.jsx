import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../store/thunks/authThunk';
import Snackbar from '../../components/Snackbar';
import MyStatusBar from '../../components/MyStatusbar';

export default function RegisterScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.auth);
  const scrollViewRef = React.useRef(null);
  const fistNameRef = React.useRef(null);
  const middleNameRef = React.useRef(null);
  const lastNameRef = React.useRef(null);
  const emailRef = React.useRef(null);
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    type: 'success',
  });

  const NAME_REGEX = /^[a-zA-Z\s'-]{2,50}$/;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    else if (!NAME_REGEX.test(firstName.trim())) newErrors.firstName = 'Enter a valid first name (letters only)';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    else if (!NAME_REGEX.test(lastName.trim())) newErrors.lastName = 'Enter a valid last name (letters only)';
    if (middleName.trim() && !NAME_REGEX.test(middleName.trim())) newErrors.middleName = 'Enter a valid middle name';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!EMAIL_REGEX.test(email.trim())) newErrors.email = 'Enter a valid email address';
    return newErrors;
  };

  const handleRegister = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    const userData = { firstName, middleName, lastName, email };

    try {
      const response = await dispatch(register(userData));

      if (register.fulfilled.match(response)) {
        console.log('User registered successful');
        setSnackbar({
          visible: true,
          message: response?.payload?.message || 'Registration successful!',
          type: 'success',
        });
      } else {
        setSnackbar({
          visible: true,
          message: response?.payload?.message || 'Registration failed',
          type: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        visible: true,
        message: 'Registration failed',
        type: 'error',
      });
    }
  };
  const scrollToInput = (inputRef, scrollViewRef) => {
    if (inputRef && scrollViewRef.current) {
      setTimeout(() => {
        inputRef.measureLayout(
          scrollViewRef.current,
          (x, y, width, height) => {
            const keyboardHeight = Platform.OS === 'ios' ? 300 : 250;

            const scrollY = y - keyboardHeight + height + 50;

            scrollViewRef.current.scrollTo({
              y: Math.max(0, scrollY),
              animated: true,
            });
          },
          error => {
            console.log(error);
          },
        );
      }, 200);
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <MyStatusBar />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Feather
            name="circle"
            size={24}
            color="#000"
            style={styles.headerIconLeft}
          />
          <View style={styles.headerRightIcons}>
            <Feather
              name="star"
              size={18}
              color="#000"
              style={styles.starIcon}
            />
            <Feather
              name="plus"
              size={18}
              color="#000"
              style={styles.plusIcon}
            />
          </View>
        </View>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require('../../assets/illustration.png')}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>

        {/* Logo & Titles */}
        <Text style={styles.logo}>Zugado</Text>
        <Text style={styles.signupTitle}>Signup</Text>
        <Text style={styles.signupSubtitle}>Please Fill Your Details</Text>

        {/* Name Inputs */}
        <View style={styles.nameGroup}>
          <View style={styles.nameInputContainer}>
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
              style={[styles.input, errors.firstName && styles.inputError]}
              placeholder="First"
              value={firstName}
              onChangeText={v => { setFirstName(v); setErrors(e => ({ ...e, firstName: '' })); }}
              placeholderTextColor="#999"
              onFocus={() => scrollToInput(fistNameRef.current, scrollViewRef)}
            />
            {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}
          </View>
          <View style={styles.nameInputContainer}>
            <Text style={styles.inputLabel}>Middle Name</Text>
            <TextInput
              style={[styles.input, errors.middleName && styles.inputError]}
              placeholder="Middle"
              value={middleName}
              onChangeText={v => { setMiddleName(v); setErrors(e => ({ ...e, middleName: '' })); }}
              placeholderTextColor="#999"
              onFocus={() => scrollToInput(middleNameRef.current, scrollViewRef)}
            />
            {errors.middleName ? <Text style={styles.errorText}>{errors.middleName}</Text> : null}
          </View>
          <View style={styles.nameInputContainer}>
            <Text style={styles.inputLabel}>Last Name</Text>
            <TextInput
              style={[styles.input, errors.lastName && styles.inputError]}
              placeholder="Last"
              value={lastName}
              onChangeText={v => { setLastName(v); setErrors(e => ({ ...e, lastName: '' })); }}
              placeholderTextColor="#999"
              onFocus={() => scrollToInput(lastNameRef.current, scrollViewRef)}
            />
            {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}
          </View>
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="example@mail.com"
            value={email}
            onChangeText={text => { setEmail(text.toLowerCase()); setErrors(e => ({ ...e, email: '' })); }}
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => scrollToInput(emailRef.current, scrollViewRef)}
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        </View>

        {/* Mobile 
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Mobile</Text>
          <TextInput
            style={styles.input}
            placeholder="+91 XXXX-XXX-XXX"
            value={mobile}
            onChangeText={setMobile}
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </View> */}

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.continueButton, loading && { opacity: 0.7 }]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.continueButtonText}>Continue</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onHide={() => setSnackbar({ ...snackbar, visible: false })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 200, alignItems: 'center' },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 20,
  },
  headerIconLeft: { opacity: 0.5 },
  headerRightIcons: { flexDirection: 'row', gap: 15 },
  starIcon: { transform: [{ rotate: '45deg' }], opacity: 0.5 },
  plusIcon: { opacity: 0.5 },
  illustrationContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  illustrationImage: { width: 250, height: 150 },
  logo: { fontSize: 34, fontWeight: 'bold', color: '#000', marginBottom: 20 },
  signupTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  signupSubtitle: { fontSize: 14, color: '#666', marginBottom: 40 },
  inputGroup: { width: '100%', marginBottom: 25 },
  inputLabel: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  nameGroup: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    gap: 10,
  },
  nameInputContainer: { flex: 1 },
  continueButton: {
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  errorText: { color: '#EF4444', fontSize: 11, marginTop: 4, marginLeft: 2 },
  inputError: { borderColor: '#EF4444' },
});

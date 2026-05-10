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
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    type: 'success',
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleRegister = async () => {
    if (!firstName || !lastName || !email) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

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
              style={styles.input}
              placeholder="First"
              value={firstName}
              onChangeText={setFirstName}
              placeholderTextColor="#999"
              onFocus={() => scrollToInput(fistNameRef.current, scrollViewRef)}
            />
          </View>
          <View style={styles.nameInputContainer}>
            <Text style={styles.inputLabel}>Middle Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Middle"
              value={middleName}
              onChangeText={setMiddleName}
              placeholderTextColor="#999"
              onFocus={() =>
                scrollToInput(middleNameRef.current, scrollViewRef)
              }
            />
          </View>
          <View style={styles.nameInputContainer}>
            <Text style={styles.inputLabel}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Last"
              value={lastName}
              onChangeText={setLastName}
              placeholderTextColor="#999"
              onFocus={() => scrollToInput(lastNameRef.current, scrollViewRef)}
            />
          </View>
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="example@mail.com"
            value={email}
            onChangeText={text => setEmail(text.toLowerCase())}
            placeholderTextColor="#999"
            keyboardType="email-address"
            onFocus={() => scrollToInput(emailRef.current, scrollViewRef)}
          />
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
});

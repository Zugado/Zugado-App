import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
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
  const { loading } = useSelector((state) => state.auth);
  const scrollRef = useRef(null);
  
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', type: 'success' });


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  const handleRegister = async () => {
    if (!firstName || !lastName || !email ) {
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
        console.log("User registered successful");
        setSnackbar({ visible: true, message: response?.payload?.message || 'Registration successful!', type: 'success' });
      } else {
        setSnackbar({ visible: true, message: response?.payload?.message || 'Registration failed', type: 'error' });
      }
    } catch (error) {
      setSnackbar({ visible: true, message: 'Registration failed', type: 'error' });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <MyStatusBar backgroundColor="#fff" barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Feather name="circle" size={20} color="#000" style={styles.headerIconLeft} />
            <View style={styles.headerRightIcons}>
              <Feather name="star" size={16} color="#000" style={styles.starIcon} />
              <Feather name="plus" size={16} color="#000" style={styles.plusIcon} />
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

          {/* First Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>First Name <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Enter first name"
              value={firstName}
              onChangeText={setFirstName}
              placeholderTextColor="#999"
              returnKeyType="next"
            />
          </View>

          {/* Middle Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Middle Name <Text style={styles.optional}>(Optional)</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Enter middle name"
              value={middleName}
              onChangeText={setMiddleName}
              placeholderTextColor="#999"
              returnKeyType="next"
            />
          </View>

          {/* Last Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Last Name <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Enter last name"
              value={lastName}
              onChangeText={setLastName}
              placeholderTextColor="#999"
              returnKeyType="next"
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="example@mail.com"
              value={email}
              onChangeText={text => setEmail(text.toLowerCase())}
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="done"
            />
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[styles.continueButton, loading && styles.continueButtonDisabled]}
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
      </KeyboardAvoidingView>

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
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerIconLeft: { opacity: 0.4 },
  headerRightIcons: { flexDirection: 'row', gap: 12 },
  starIcon: { transform: [{ rotate: '45deg' }], opacity: 0.4 },
  plusIcon: { opacity: 0.4 },
  illustrationContainer: { width: '100%', alignItems: 'center', marginVertical: 12 },
  illustrationImage: { width: 200, height: 110 },
  logo: { fontSize: 28, fontWeight: 'bold', color: '#000', marginBottom: 4 },
  signupTitle: { fontSize: 22, fontWeight: 'bold', color: '#000', marginBottom: 2 },
  signupSubtitle: { fontSize: 13, color: '#666', marginBottom: 24 },
  inputGroup: { width: '100%', marginBottom: 18 },
  inputLabel: { fontSize: 14, color: '#000', fontWeight: '600', marginBottom: 8 },
  required: { color: '#e74c3c', fontWeight: '700' },
  optional: { fontSize: 12, color: '#999', fontWeight: '400' },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fafafa',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#333',
  },
  continueButton: {
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  continueButtonDisabled: { opacity: 0.6 },
  continueButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

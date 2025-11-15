import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather'; // For the top-left circle icon

export default function SignupScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Top Header Icons */}
      <View style={styles.header}>
        <Feather name="circle" size={24} color="#000" style={styles.headerIconLeft} />
        <View style={styles.headerRightIcons}>
          <Feather name="star" size={18} color="#000" style={styles.starIcon} />
          <Feather name="plus" size={18} color="#000" style={styles.plusIcon} />
        </View>
      </View>

      {/* Illustration Section */}
      <View style={styles.illustrationContainer}>
        {/*
          Since React Native doesn't directly support SVG like web,
          and to maintain the exact look of the image, we will use
          a static image asset for the illustration.
          You would need to save the illustration image (e.g., as a PNG)
          in your project's assets folder (e.g., assets/signup_illustration.png)
          and update the 'source' prop accordingly.

          For now, I'll use a placeholder image from Unsplash.
          In a real app, you'd extract the actual illustration or
          convert it to an SVG and use an SVG library like react-native-svg.
        */}
        <Image
          source={{ uri: 'https://i.imgur.com/k28b0L9.png' }} // Placeholder for the illustration
          style={styles.illustrationImage}
          resizeMode="contain"
        />
      </View>

      {/* Logo Text */}
      <Text style={styles.logo}>zugado</Text>

      {/* Signup Title */}
      <Text style={styles.signupTitle}>signup</Text>
      <Text style={styles.signupSubtitle}>Please Fill Your Details</Text>

      {/* Input Field */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Name"
          placeholderTextColor="#999"
        />
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 20,
  },
  headerIconLeft: {
    opacity: 0.5, // To match the lighter look
  },
  headerRightIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  starIcon: {
    transform: [{ rotate: '45deg' }], // Rotate star for the 'plus' look
    opacity: 0.5,
  },
  plusIcon: {
    opacity: 0.5,
  },
  illustrationContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30, // Space below illustration
    marginTop: 20, // Space below header
  },
  illustrationImage: {
    width: 250, // Adjust width as needed
    height: 150, // Adjust height as needed
  },
  logo: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  signupTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  signupSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 40,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 30,
  },
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
  continueButton: {
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20, // Space above the button
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
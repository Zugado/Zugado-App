import React, { useEffect } from 'react';
import { View, Image, StyleSheet, StatusBar } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    // Timer to navigate to the Login screen after 2 seconds
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2000); // 2000ms = 2 seconds

    // Clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Set status bar to light text on a dark background */}
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* *** REPLACE WITH YOUR WHITE LOGO FILE *** */}
      <Image 
        source={require('../assets/logo1.png')} 
        style={styles.logo} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Changed to black to match image
  },
  logo: {
    width: 220, // Adjusted width to better fit the logo shape
    height: 80, // Adjusted height
    resizeMode: 'contain',
  },
});
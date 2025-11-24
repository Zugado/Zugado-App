import React, { useEffect } from 'react';
import { View, Image, StyleSheet, StatusBar } from 'react-native';
import { loadUserFromStorage } from '../store/store';

export default function SplashScreen() {
  useEffect(() => {
    StatusBar.setBarStyle('dark-content', true);
    loadUserFromStorage();
  }, []);
  
  return (
    <View style={styles.container}>
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
    backgroundColor: '#000',
  },
  logo: {
    width: 220,
    height: 80,
    resizeMode: 'contain',
  },
});
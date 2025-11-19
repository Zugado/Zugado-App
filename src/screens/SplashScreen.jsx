import React, { useEffect } from 'react';
import { View, Image, StyleSheet, StatusBar } from 'react-native';

export default function SplashScreen() {
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
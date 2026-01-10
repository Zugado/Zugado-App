import { View, Text, StatusBar, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyStatusBar from '../components/MyStatusbar';
export default function NotificationScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
        <MyStatusBar/>
      <View style={styles.container}>
        <Text>NotificationScreen</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
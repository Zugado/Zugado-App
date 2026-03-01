import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyStatusBar from '../components/MyStatusbar';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { Colors } from '../styles/commonStyles';

export default function ChatingScreen() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safeAreaBlack}>
      <MyStatusBar />
      {/* Header */}
      <Header showSearch={false} navigation={navigation} />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaBlack: {
    flex: 1,
    backgroundColor: Colors.bodyBackColor,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: -20,
    backgroundColor: Colors.bodyBackColor,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
});

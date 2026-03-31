import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import MyStatusBar from '../../components/MyStatusbar';
import { Colors } from '../../styles/commonStyles';

export default function DraftChoiceScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const handleResumeDraft = async () => {
    setLoading(true);
    try {
      const draft = await AsyncStorage.getItem('jobDraft');
      if (draft) {
        const draftData = JSON.parse(draft);
        navigation.replace('CreateJobScreen', { draftData, loadDraft: true });
      } else {
        navigation.replace('CreateJobScreen');
      }
    } catch (error) {
      console.log('Error loading draft:', error);
      navigation.replace('CreateJobScreen');
    }
  };

  const handleNewForm = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem('jobDraft');
      navigation.replace('CreateJobScreen', { loadDraft: false });
    } catch (error) {
      console.log('Error clearing draft:', error);
      navigation.replace('CreateJobScreen', { loadDraft: false });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <MyStatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Feather name="file-text" size={64} color={Colors.primary} />
        </View>
        
        <Text style={styles.title}>Draft Found</Text>
        <Text style={styles.message}>
          You have an unfinished job posting. Would you like to continue where you left off or start fresh?
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleResumeDraft}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Feather name="play" size={20} color="#fff" />
                <Text style={styles.primaryButtonText}>Resume Draft</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleNewForm}
            disabled={loading}
          >
            <Feather name="plus" size={20} color={Colors.primary} />
            <Text style={styles.secondaryButtonText}>Start New</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

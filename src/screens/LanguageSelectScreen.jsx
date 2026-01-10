import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import i18n from "../i18n/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import Feather from 'react-native-vector-icons/Feather';

export default function LanguageSelectScreen({ navigation, onComplete }) {  
  const { t } = useTranslation();

  const languages = [
    { key: 'en', label: 'English', flag: '🇺🇸', subtitle: 'United States' },
    { key: 'hi', label: 'हिन्दी', flag: '🇮🇳', subtitle: 'India' },
    { key: 'bn', label: 'বাংলা', flag: '🇧🇩', subtitle: 'Bangladesh' },
  ];

  const handleLanguageChange = async (lang) => {
    i18n.changeLanguage(lang);
    await AsyncStorage.setItem("appLanguage", lang);

    if (onComplete) {
      onComplete(lang);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Feather name="globe" size={48} color="#4A90E2" />
        </View>
        <Text style={styles.title}>Choose Your Language</Text>
        <Text style={styles.subtitle}>Select your preferred language to continue</Text>
      </View>

      <View style={styles.languageContainer}>
        {languages.map(item => (
          <TouchableOpacity
            key={item.key}
            style={styles.languageButton}
            onPress={() => handleLanguageChange(item.key)}
            activeOpacity={0.7}
          >
            <View style={styles.languageContent}>
              <Text style={styles.flag}>{item.flag}</Text>
              <View style={styles.textContainer}>
                <Text style={styles.languageLabel}>{item.label}</Text>
                <Text style={styles.countryLabel}>{item.subtitle}</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#666" />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>You can change this later in settings</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  languageContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  languageButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  flag: {
    fontSize: 32,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  languageLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  countryLabel: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

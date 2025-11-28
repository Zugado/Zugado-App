import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import i18n from "../i18n/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

export default function LanguageSelectScreen({ navigation, onComplete }) {  
  const { t } = useTranslation();

  const languages = [
    { key: 'en', label: 'English' },
    { key: 'hi', label: 'हिन्दी' },
    { key: 'bn', label: 'বাংলা' },
  ];

  const handleLanguageChange = async (lang) => {
    i18n.changeLanguage(lang);
    await AsyncStorage.setItem("appLanguage", lang);

    if (onComplete) {
      onComplete(lang);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("select_language")}</Text>

      {languages.map(item => (
        <TouchableOpacity
          key={item.key}
          style={styles.btn}
          onPress={() => handleLanguageChange(item.key)}
        >
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#fff' },
  title: { fontSize:24, fontWeight:'700', marginBottom:30 },
  btn: {
    width:'70%',
    padding:15,
    borderWidth:1,
    borderRadius:12,
    alignItems:'center',
    marginBottom:15
  },
  label: { fontSize:18, fontWeight:'600' }
});

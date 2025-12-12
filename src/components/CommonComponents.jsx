
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { Colors } from '../styles/commonStyles';

export const CommonAppBar = ({ title, onBackPress, navigation }) => {
  return (
    <View style={styles.header}>
        <TouchableOpacity onPress={onBackPress || (() => navigation?.goBack())}>
          <Feather name="arrow-left" size={24} color={Colors.blackColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 24 }} />
      </View>
  );
};

export const TypeSelectorButtons = ({ type, setType, options = [] }) => {
  return (
    <View style={styles.TypeContainer}>
      {options.map((option, index) => (
        <TouchableOpacity
          activeOpacity={0.7}
          key={index}
          style={[
            styles.TypeButton,
            type === option.value && styles.selectedButton,
          ]}
          onPress={() => setType(option.value)}
        >
          <Text
            style={[
              styles.TypebuttonText,
              type === option.value && styles.selectedButtonText,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
    TypeContainer: {
    marginBottom: 10,    
    flexDirection: "row",
    gap: 10,
  },
  TypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
  },

  TypebuttonText: {
    fontSize: 12,
    color: "#555",
  },
   selectedButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  selectedButtonText: {
    color: "white",
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.extraLightGrayColor,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.blackColor,
  },
});
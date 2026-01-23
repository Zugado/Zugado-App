import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SelectorToggleButton = ({ 
  options, 
  selectedValue, 
  onValueChange,
  backgroundColor= '#000',
  selectedTextColor= '#000',
  unselectedTextColor= '#fff',
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {options?.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.button,
            selectedValue === option && styles.selectedButton
          ]}
          onPress={() => onValueChange(option)}
        >
          <Text
            style={[
              styles.buttonText,
              { color: selectedValue === option ? selectedTextColor : unselectedTextColor },
              selectedValue === option && styles.selectedText
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#b5b5b5',
    padding: 4,
    // marginVertical: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 2,
  },
  selectedButton: {
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
     fontSize: 14,
     fontWeight: '500',
  },
  selectedText: {
      fontWeight: '700',
    // Additional selected text styles if needed
  },
});

export default SelectorToggleButton;
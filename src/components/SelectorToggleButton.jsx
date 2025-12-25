import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SelectorToggleButton = ({ 
  options, 
  selectedValue, 
  onValueChange
}) => {
  return (
    <View style={styles.container}>
      {options.map((option, index) => (
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
    borderColor: '#dadada',
    backgroundColor: '#000',
    padding: 5,
    marginTop: 10,
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
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  selectedText: {
    color: '#000',
  },
});

export default SelectorToggleButton;
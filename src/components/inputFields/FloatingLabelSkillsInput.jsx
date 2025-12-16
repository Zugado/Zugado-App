import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const FloatingLabelSkillsInput = ({ 
  label, 
  selectedSkills = [], 
  onSkillsChange, 
  availableTags = [],
  placeholder = "Type to search skills...",
  maxSkills = 10,
  onFocus,
  required = false
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const animated = useState(new Animated.Value(selectedSkills.length > 0 ? 1 : 0))[0];

  // Animation effect - matches FloatingLabelInput exactly
  useEffect(() => {
    if (selectedSkills.length > 0 && selectedSkills.length > 0) {
      animated.setValue(1);
    } else {
      animated.setValue(0);
    }
  }, [selectedSkills]);

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animated, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    if (onFocus && inputRef.current) {
      onFocus(inputRef.current);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (selectedSkills.length === 0) {
      Animated.timing(animated, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    // Delay hiding suggestions to allow for selection
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  // Label style - matches FloatingLabelInput exactly
  const labelStyle = {
    top: animated.interpolate({
      inputRange: [0, 1],
      outputRange: [14, -8], // Same as FloatingLabelInput
    }),
    fontSize: animated.interpolate({
      inputRange: [0, 1],
      outputRange: [14, 11],
    }),
    color: animated.interpolate({
      inputRange: [0, 1],
      outputRange: ["#6b7280", isFocused ? "#111827" : "#6b7280"],
    }),
  };

  const starStyle = {
    color: animated.interpolate({
      inputRange: [0, 1],
      outputRange: ["#6b7280", isFocused ? "#ef4444" : "#6b7280"],
    }),
  };

  // Suggestions logic
  useEffect(() => {
    if (inputValue.trim()) {
      const allSkills = [];
      
      availableTags.forEach(tagItem => {
        allSkills.push(tagItem.tag);
        if (tagItem.subTags && Array.isArray(tagItem.subTags)) {
          tagItem.subTags.forEach(subTag => {
            allSkills.push(subTag);
          });
        }
      });

      const filtered = allSkills.filter(skill => 
        skill.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedSkills.includes(skill)
      );

      const uniqueFiltered = [...new Set(filtered)];

      if (!uniqueFiltered.some(skill => 
        skill.toLowerCase() === inputValue.toLowerCase()
      )) {
        uniqueFiltered.unshift(inputValue.trim());
      }

      setFilteredSuggestions(uniqueFiltered);
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, availableTags, selectedSkills]);

  const handleSkillSelect = (skill) => {
    if (selectedSkills.length < maxSkills && !selectedSkills.includes(skill)) {
      const newSkills = [...selectedSkills, skill];
      onSkillsChange(newSkills);
    }
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSkillRemove = (skillToRemove) => {
    const newSkills = selectedSkills.filter(skill => skill !== skillToRemove);
    onSkillsChange(newSkills);
  };

  const handleInputChange = (text) => {
    setInputValue(text);
  };

  return (
    <View style={styles.fieldContainer}>
      {/* Label - exactly like FloatingLabelInput */}
      <Animated.Text style={[styles.label, labelStyle]}>
        {label.replace(' *', '')}
        {required && <Animated.Text style={starStyle}> *</Animated.Text>}
      </Animated.Text>

      <View style={styles.inputWrapper}>
        {/* Main input container - matches FloatingLabelInput structure */}
        <View style={[
          styles.input,
          isFocused && styles.focusedBorder,
        ]}>
          {/* Skills container */}
          <View style={styles.skillsContainer}>
            {selectedSkills.map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillTagText}>{skill}</Text>
                <TouchableOpacity
                  onPress={() => handleSkillRemove(skill)}
                  style={styles.removeButton}
                >
                  <Feather name="x" size={12} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
            
            {/* Text input */}
            <TextInput
              ref={inputRef}
              style={styles.textInput}
              value={inputValue}
              onChangeText={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={selectedSkills.length === 0 ? placeholder : ""}
              placeholderTextColor="#9ca3af"
              editable={selectedSkills.length < maxSkills}
            />
          </View>
        </View>
      </View>

      {/* Suggestions dropdown - positioned outside like FloatingLabelInput button */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <ScrollView 
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            {filteredSuggestions.map((suggestion, index) => {
              const isUserTyped = suggestion === inputValue.trim() && 
                !availableTags.some(tag => {
                  if (tag.tag.toLowerCase() === suggestion.toLowerCase()) {
                    return true;
                  }
                  if (tag.subTags && Array.isArray(tag.subTags)) {
                    return tag.subTags.some(subTag => 
                      subTag.toLowerCase() === suggestion.toLowerCase()
                    );
                  }
                  return false;
                });

              return (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => handleSkillSelect(suggestion)}
                >
                  <View style={styles.suggestionContent}>
                    <Feather 
                      name={isUserTyped ? "edit-3" : "tag"} 
                      size={14} 
                      color={isUserTyped ? "#f59e0b" : "#6b7280"} 
                    />
                    <Text style={[
                      styles.suggestionText,
                      isUserTyped && styles.userTypedText
                    ]}>
                      {suggestion}
                    </Text>
                    {isUserTyped && (
                      <Text style={styles.customLabel}>Custom</Text>
                    )}
                  </View>
                  <Feather name="plus" size={14} color="#6b7280" />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Skills counter */}
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>
          {selectedSkills.length}/{maxSkills} skills selected
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Base styles - exactly matching FloatingLabelInput
  fieldContainer: {
    marginBottom: 20,
    position: "relative",
  },
  label: {
    position: "absolute",
    left: 14,
    backgroundColor: "#fff",
    paddingHorizontal: 4,
    zIndex: 1,
  },
  inputWrapper: {
    position: "relative",
  },
  input: {
    minHeight: 44,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    color: "#111827",
  },
  focusedBorder: {
    borderColor: "#111827",
  },
  
  // Skills-specific styles
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    minHeight: 20,
  },
  skillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  skillTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  removeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    minWidth: 120,
    paddingVertical: 4,
  },
  
  // Suggestions dropdown
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderColor: '#e5e7eb',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 1000,
  },
  suggestionsList: {
    flex: 1,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  suggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  suggestionText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  userTypedText: {
    color: '#f59e0b',
    fontWeight: '500',
  },
  customLabel: {
    fontSize: 10,
    color: '#f59e0b',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    fontWeight: '500',
  },
  counterContainer: {
    marginTop: 8,
    alignItems: 'flex-end',
  },
  counterText: {
    fontSize: 12,
    color: '#6b7280',
  },
  requiredStar: {
    color: '#ef4444',
  },
});

export default FloatingLabelSkillsInput;
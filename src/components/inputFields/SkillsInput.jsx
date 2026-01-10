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

const SkillsInput = ({ 
  label, 
  selectedSkills = [], 
  onSkillsChange, 
  availableTags = [],
  placeholder = "Type to search skills...",
  maxSkills = 10 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const animated = useState(new Animated.Value(selectedSkills.length > 0 ? 1 : 0))[0];

  useEffect(() => {
    if (selectedSkills.length > 0 || isFocused) {
      Animated.timing(animated, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animated, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [selectedSkills.length, isFocused]);

  useEffect(() => {
    console.log('Input value changed:', inputValue);
    console.log('Available tags:', availableTags);
    
    if (inputValue.trim()) {
      // Create a flat array of all tags and subtags for suggestions
      const allSkills = [];
      
      availableTags.forEach(tagItem => {
        // Add main tag
        allSkills.push(tagItem.tag);
        // Add all subtags if they exist
        if (tagItem.subTags && Array.isArray(tagItem.subTags)) {
          tagItem.subTags.forEach(subTag => {
            allSkills.push(subTag);
          });
        }
      });

      console.log('All skills:', allSkills);

      // Filter suggestions based on input
      const filtered = allSkills.filter(skill => 
        skill.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedSkills.includes(skill)
      );

      // Remove duplicates
      const uniqueFiltered = [...new Set(filtered)];

      // Add user's typed word as an option if it doesn't match any suggestion
      if (!uniqueFiltered.some(skill => 
        skill.toLowerCase() === inputValue.toLowerCase()
      )) {
        uniqueFiltered.unshift(inputValue.trim());
      }

      console.log('Filtered suggestions:', uniqueFiltered);
      setFilteredSuggestions(uniqueFiltered.slice(0, 8)); // Limit to 8 suggestions
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

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for selection
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  const labelStyle = {
    top: animated.interpolate({
      inputRange: [0, 1],
      outputRange: [20, -8], // Increased from 16 to 20 to match input padding
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

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.label, labelStyle]}>
        {label}
      </Animated.Text>

      <View style={[
        styles.inputContainer,
        isFocused && styles.focusedContainer,
        showSuggestions && styles.containerWithSuggestions
      ]}>
        {/* Selected Skills Tags */}
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
          
          {/* Input Field */}
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

      {/* Suggestions Dropdown - Outside input container */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
            <ScrollView 
              style={styles.suggestionsList}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {filteredSuggestions.map((suggestion, index) => {
                const isUserTyped = suggestion === inputValue.trim() && 
                  !availableTags.some(tag => {
                    // Check if it matches main tag
                    if (tag.tag.toLowerCase() === suggestion.toLowerCase()) {
                      return true;
                    }
                    // Check if it matches any subtag
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

      {/* Skills Counter */}
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>
          {selectedSkills.length}/{maxSkills} skills selected
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    position: 'relative',
    zIndex: 1000,
  },
  label: {
    position: 'absolute',
    left: 14,
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    zIndex: 10, // Higher z-index to ensure it's above input
  },
  inputContainer: {
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#fff',
    position: 'relative',
    zIndex: 1001,
  },
  focusedContainer: {
    borderColor: '#111827',
  },
  containerWithSuggestions: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: 14, // Increased padding to match FloatingLabelInput
    paddingTop: 16, // Extra top padding for label space
    minHeight: 44,
    gap: 8,
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
    zIndex: 1002,
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
});

export default SkillsInput;
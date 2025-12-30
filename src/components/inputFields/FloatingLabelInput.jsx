import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';

const FloatingLabelInput = ({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
  secureTextEntry = false,
  editable = true,
  multiline = false,
  numberOfLines = 1,
  showButton = false,
  buttonText = 'Button',
  onButtonPress,
  buttonStyle,
  onFocus,
  required = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedRef = React.useRef(new Animated.Value(value ? 1 : 0));
  const animated = animatedRef.current;
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    if (value && value.trim() !== '') {
      animated.setValue(1);
    } else if (!isFocused) {
      animated.setValue(0);
    }
  }, [value, isFocused]);

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
    if (!value || !value.trim()) {
      Animated.timing(animated, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const labelStyle = {
    top: animated.interpolate({
      inputRange: [0, 1],
      outputRange: [multiline ? 16 : 14, -8],
    }),
    fontSize: animated.interpolate({
      inputRange: [0, 1],
      outputRange: [12, 11],
    }),
    color: animated.interpolate({
      inputRange: [0, 1],
      outputRange: ['#6b7280', isFocused ? '#111827' : '#6b7280'],
    }),
  };

  const starStyle = {
    color: animated.interpolate({
      inputRange: [0, 1],
      outputRange: ['#6b7280', isFocused ? '#ef4444' : '#6b7280'],
    }),
  };

  return (
    <View style={styles.fieldContainer}>
      <Animated.Text style={[styles.label, labelStyle]}>
        {label.replace(' *', '')}
        {required && <Animated.Text style={starStyle}> *</Animated.Text>}
      </Animated.Text>

      <View style={styles.inputWrapper}>
        <TextInput
          {...props}
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          style={[
            multiline ? styles.textarea : styles.input,
            isFocused && styles.focusedBorder,
            !editable && styles.disabledInput,
            showButton && styles.inputWithButton,
          ]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
          placeholder={isFocused && !value ? props.placeholder : ''}
          placeholderTextColor="#9ca3af"
        />

        {showButton && (
          <TouchableOpacity
            style={[styles.button, buttonStyle]}
            onPress={onButtonPress}
          >
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FloatingLabelInput;

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 20,
    position: 'relative',
  },

  label: {
    position: 'absolute',
    left: 14,
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    zIndex: 1,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    height: 46,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 12,
    color: '#111827',
  },
  inputWithButton: {
    paddingRight: 80,
  },
  textarea: {
    minHeight: 90,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 12,
    fontSize: 12,
    color: '#111827',
    textAlignVertical: 'top',
  },
  focusedBorder: {
    borderColor: '#111827',
  },
  disabledInput: {
    backgroundColor: '#f9fafb',
    color: '#6b7280',
  },
  button: {
    position: 'absolute',
    right: 8,
    top: '50%',
    transform: [{ translateY: -14 }],
    backgroundColor: '#111827',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  requiredStar: {
    color: '#ef4444',
  },
});

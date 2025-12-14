import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { Colors, commonStyles } from '../styles/commonStyles';

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
export function ButtonWithLoader({
  name,
  loadingName,
  isLoading,
  method,
  color = Colors.primary,
}) {
  return isLoading ? (
    <View style={{ ...commonStyles.button, flexDirection: 'row', gap: 10 }}>
      <ActivityIndicator size="small" color={Colors.whiteColor} />
      <Text style={{ ...commonStyles.buttonText }}>{loadingName}</Text>
    </View>
  ) : (
    <TouchableOpacity
      activeOpacity={0.9}
      style={{ ...commonStyles.button, backgroundColor: color }}
      onPress={method}
    >
      <Text style={{ ...commonStyles.buttonText }}>{name}</Text>
    </TouchableOpacity>
  );
}
export function InputBox({
  value,
  setter,
  placeholder,
  label,
  optional,
  type,
  editable = true,
}) {
  return (
    <>
      {commonLabel(label, optional)}
      <TextInput
        style={[
          styles.boxInput,
          { backgroundColor: editable ? '#f5f5f5' : '#ffdfdfff' },
        ]}
        placeholder={placeholder}
        placeholderTextColor="gray"
        value={value}
        editable={editable ?? true}
        onChangeText={text => setter(text)}
        keyboardType={type}
      />
    </>
  );
}
export function commonLabel(label, optional) {
  return (
    <Text style={styles.sectionLabel}>
      {label}
      {optional ? (
        <Text style={styles.optional}> (Optional)</Text>
      ) : (
        <Text style={styles.label}>*</Text>
      )}
    </Text>
  );
}
export function FaddedIcon({}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
      }}
    >
      <Image
        source={require('../assets/Icons/LogoLogin.png')}
        style={{
          width: 200,
          height: 50,
           resizeMode: 'contain',
          marginLeft: 10,
          opacity: 0.2,
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  TypeContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    gap: 10,
  },
  TypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 5,
  },
  label: {
    fontSize: 12,
    color: '#F4721E',
    marginBottom: 5,
  },
  optional: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#888',
  },
  boxInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 12,

    marginBottom: 15,
    height: 45,
  },
  textAreaInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 12,
    backgroundColor: '#f5f5f5',
    marginBottom: 15,
    height: 100,
  },

  TypebuttonText: {
    fontSize: 12,
    color: '#555',
  },
  selectedButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  selectedButtonText: {
    color: 'white',
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

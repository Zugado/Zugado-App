import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,

} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// You'll need react-native-vector-icons for this
import Feather from 'react-native-vector-icons/Feather';

export default function CreateJob({ navigation }) {
  // State to manage which experience level is selected
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [tags, setTags] = useState(['Tag-1', 'Tag-2']); // Example tags

  // Helper component for the radio button
  const RadioButton = ({ label, selected, onPress }) => (
    <TouchableOpacity style={styles.option} onPress={onPress}>
      <View style={styles.radio}>
        {selected && <View style={styles.radioSelected} />}
      </View>
      <Text style={styles.optionText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* --- Header --- */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => {navigation.goBack()}} style={styles.backButton}>
              <Feather name="arrow-left" size={20} color="#000" />
            </TouchableOpacity>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar} />
            </View>
            <Text style={styles.progressText}>1/3</Text>
          </View>

          {/* --- Title --- */}
          <Text style={styles.title}>Create and Customize Your Job Posting</Text>

          {/* --- Form --- */}
          <View style={styles.form}>
            {/* Job Title */}
            <Text style={styles.label}>Job Title</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter Title"
              placeholderTextColor="#888"
            />

            {/* Job Category */}
            <Text style={styles.label}>Job Category</Text>
            <View style={styles.categoryBox}>
              <Text style={styles.categoryPlaceholder}>Choose Category</Text>
              <View style={styles.tagsContainer}>
                {tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                    <TouchableOpacity
                      onPress={() =>
                        setTags((prevTags) => prevTags.filter((t) => t !== tag))
                      }
                    >
                      <Feather name="x" size={14} color="#555" style={styles.tagClose} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            {/* Job Description */}
            <Text style={styles.label}>Job Description</Text>
            <TextInput
              style={[styles.textInput, styles.descriptionInput]}
              placeholder="Enter Description"
              placeholderTextColor="#888"
              multiline
              numberOfLines={4}
            />

            {/* Skill Required */}
            <Text style={styles.label}>Skill Required</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter Skill"
              placeholderTextColor="#888"
            />

            {/* Experience Level */}
            <Text style={styles.label}>Experience Level</Text>
            <View style={styles.experienceBox}>
              <RadioButton
                label="Beginner"
                selected={experienceLevel === 'Beginner'}
                onPress={() => setExperienceLevel('Beginner')}
              />
              <RadioButton
                label="Intermediate"
                selected={experienceLevel === 'Intermediate'}
                onPress={() => setExperienceLevel('Intermediate')}
              />
              <RadioButton
                label="Advanced"
                selected={experienceLevel === 'Advanced'}
                onPress={() => setExperienceLevel('Advanced')}
              />
            </View>
          </View>
        </ScrollView>

        {/* --- Next Button --- */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120, // Add ample padding for the sticky button
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 20,
  },
  progressContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginHorizontal: 15,
  },
  progressBar: {
    width: '33.33%', // 1/3
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#888',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top', // For multiline input
  },
  categoryBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    minHeight: 100,
  },
  categoryPlaceholder: {
    color: '#888',
    fontSize: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  tagText: {
    fontSize: 14,
    color: '#000',
  },
  tagClose: {
    marginLeft: 5,
  },
  experienceBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  radio: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 5, // A square with rounded corners
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 14,
    height: 14,
    backgroundColor: '#000',
    borderRadius: 2, // A smaller square inside
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#fff', // Ensures no content from behind peeks through
  },
  nextButton: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
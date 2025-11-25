import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';

// Mock data for uploaded files
const mockMediaFiles = [
  { id: 1, type: 'image', description: 'Office image' },
  { id: 2, type: 'video', description: 'Meeting video' },
  { id: 3, type: 'image', description: 'Working on laptop' },
];

export default function CreateJobPageThree({ navigation, route }) {
  const { jobData } = route.params;
  const [mediaFiles, setMediaFiles] = useState(mockMediaFiles);

  const handleRemoveMedia = (id) => {
    setMediaFiles(prevFiles => prevFiles.filter(file => file.id !== id));
  };

  const MediaThumbnail = ({ file }) => (
    <View style={styles.thumbnailContainer}>
      <View style={styles.thumbnailPlaceholder}>
        {/* Placeholder for the image/video */}
        {/* Replace this View with an <Image> component using the actual file URI */}
        <Text style={styles.placeholderText}>
          {file.type === 'video' ? '' : ``}
        </Text>
      </View>
      
      {/* Remove Button (X) */}
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => handleRemoveMedia(file.id)}
      >
        <Feather name="x" size={14} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.container}>
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
              {/* Progress set to 3/3 */}
              <View style={[styles.progressBar, { width: '100%' }]} />
            </View>
            <Text style={styles.progressText}>3/3</Text>
          </View>

          {/* --- Title --- */}
          <Text style={styles.title}>Add Media & Finalize Posting</Text>

          {/* --- Upload Box --- */}
          <View style={styles.uploadSection}>
            <Text style={styles.label}>Upload Images & Videos</Text>
            <TouchableOpacity style={styles.uploadBox} onPress={() => console.log('Browse File Pressed')}>
              <Feather name="upload-cloud" size={30} color="#000" />
              <Text style={styles.browseFileText}>Browse File</Text>
            </TouchableOpacity>
          </View>
          
          {/* --- Media Thumbnails --- */}
          {mediaFiles.length > 0 && (
            <View style={styles.mediaContainer}>
              {mediaFiles.map(file => (
                <MediaThumbnail key={file.id} file={file} />
              ))}
            </View>
          )}

        </ScrollView>

        {/* --- Submit Button --- */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={() => console.log('Submit Job Posting')}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // --- General/Reused Styles ---
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Padding for the sticky button
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
    // Width set inline in component for 3/3 (100%)
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
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
    fontWeight: '600',
  },
  
  // --- Upload Section Styles ---
  uploadSection: {
    marginBottom: 30,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'solid', // Using solid as a clean alternative to the subtle dashed line in the image
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    minHeight: 150,
  },
  browseFileText: {
    fontSize: 16,
    color: '#000',
    marginTop: 10,
    fontWeight: '600',
  },

  // --- Media Thumbnail Styles ---
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  thumbnailContainer: {
    position: 'relative',
    width: 100, // Fixed width for thumbnails
    height: 100, // Fixed height for thumbnails
    borderRadius: 10,
    overflow: 'hidden',
  },
  thumbnailPlaceholder: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Placeholder background color
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 10,
    textAlign: 'center',
    color: '#888',
    padding: 5,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#000000AA', // Black with some transparency
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },

  // --- Button Styles ---
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  submitButton: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
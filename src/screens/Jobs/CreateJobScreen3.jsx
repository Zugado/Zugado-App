import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import MediaPicker from '../../components/MediaPicker';

export default function CreateJobPageThree({ navigation, route }) {
  const { jobData } = route.params;
  const [mediaFiles, setMediaFiles] = useState([]);

  console.log('Job Data from Previous Screens:', jobData);

  const handleRemoveMedia = (id) => {
    setMediaFiles(prev => prev.filter(file => file.id !== id));
  };

  const MediaThumbnail = ({ file }) => (
    <View style={styles.thumbnailContainer}>
      {/* Show Image or Video Placeholder */}
      {file.type === 'image' ? (
        <Image
          source={{ uri: file.uri }}
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <View style={styles.thumbnailPlaceholder}>
          <Feather name="video" size={26} color="#777" />
        </View>
      )}

      {/* Remove Button */}
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
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={20} color="#000" />
            </TouchableOpacity>

            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: '100%' }]} />
            </View>

            <Text style={styles.progressText}>3/3</Text>
          </View>

          {/* --- Title --- */}
          <Text style={styles.title}>Add Media & Finalize Posting</Text>

          {/* --- Upload Section --- */}
          <View style={styles.uploadSection}>
            <Text style={styles.label}>Upload Images & Videos</Text>

            {/* Use Reusable Component */}
            <MediaPicker
              onSelect={(selected) => {
                setMediaFiles(prev => [...prev, ...selected]);
              }}
            >
              <View style={styles.uploadBox}>
                <Feather name="upload-cloud" size={30} color="#000" />
                <Text style={styles.browseFileText}>Browse File</Text>
              </View>
            </MediaPicker>
          </View>

          {/* --- Uploaded Media Thumbnails --- */}
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
  container: { flex: 1, backgroundColor: '#fff' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },

  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  backButton: { backgroundColor: '#f0f0f0', padding: 10, borderRadius: 20 },

  progressContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginHorizontal: 15,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 4,
  },
  progressText: { fontSize: 14, color: '#888' },

  title: { fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 30 },
  label: { fontSize: 16, color: '#000', marginBottom: 10, fontWeight: '600' },

  uploadSection: { marginBottom: 30 },
  uploadBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    minHeight: 150,
  },
  browseFileText: { fontSize: 16, color: '#000', marginTop: 10, fontWeight: '600' },

  mediaContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
  thumbnailContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
  },
  thumbnailPlaceholder: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#000000AA',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },

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
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

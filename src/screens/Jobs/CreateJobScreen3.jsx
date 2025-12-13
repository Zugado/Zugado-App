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
import ImagePickerSheet from '../../components/ImagePickerSheet';
import MyStatusBar from '../../components/MyStatusbar';
import { useImagePicker } from '../../utils/useImagePicker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

export default function CreateJobPageThree({ navigation, route }) {
  const { jobData } = route.params;
  const { openCamera, openGallery } = useImagePicker();

  const [mediaFiles, setMediaFiles] = useState([]);
  const [pickerSheetVisible, setPickerSheetVisible] = useState(false);
  const [currentMediaType, setCurrentMediaType] = useState('image');
  console.log('Job Data from Previous Screens:', jobData);
  const pickVideo = async (source) => {
    try {
      if (mediaFiles.length >= 3) {
        alert('Maximum 3 media files allowed');
        return;
      }

      const options = {
        mediaType: 'video',
        videoQuality: 'medium',
        durationLimit: 60, // 60 seconds max
        includeBase64: false,
      };

      let result;
      if (source === 'camera') {
        result = await launchCamera(options);
      } else {
        result = await launchImageLibrary(options);
      }

      if (result.didCancel || result.cancelled) return;
      if (result.errorCode || result.error) {
        console.log('Video picker error:', result.errorMessage || result.error);
        return;
      }

      const asset = result.assets?.[0];
      if (asset?.uri) {
        const newFile = {
          id: Date.now().toString(),
          uri: asset.uri,
          type: 'video',
          fileName: asset.fileName || 'video.mp4'
        };
        setMediaFiles([...mediaFiles, newFile]);
      }
    } catch (error) {
      console.log('Error picking video:', error);
    } finally {
      setPickerSheetVisible(false);
    }
  };

  const pickImage = async (source) => {
    try {
      if (mediaFiles.length >= 3) {
        alert('Maximum 3 media files allowed');
        return;
      }

      let result;
      if (source === 'camera') {
        result = await openCamera('freeform');
      } else {
        result = await openGallery('freeform');
      }

      if (result?.uri) {
        const newFile = {
          id: Date.now().toString(),
          uri: result.uri,
          type: 'image',
          fileName: result.fileName || 'image.jpg'
        };
        setMediaFiles([...mediaFiles, newFile]);
      }
    } catch (error) {
      console.log('Error picking image:', error);
    } finally {
      setPickerSheetVisible(false);
    }
  };


  const handleRemoveMedia = id => {
    setMediaFiles(prev => prev.filter(file => file.id !== id));
  };

  const MediaThumbnail = ({ file }) => (
    <View style={styles.thumbnailContainer}>
      {/* Show Image or Video Thumbnail */}
      {file.type === 'image' ? (
        <Image
          source={{ uri: file.uri }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.videoThumbnailContainer}>
          <Image
            source={{ uri: file.uri }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          <View style={styles.videoOverlay}>
            <Feather name="play" size={20} color="#fff" />
          </View>
        </View>
      )}

      {/* Remove Button */}
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveMedia(file.id)}
      >
        <Feather name="x" size={14} color='#fd6363ff' />
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.safeAreaBlack}>
        <MyStatusBar />
        <View style={styles.container}>
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
              <View style={styles.uploadButtonsContainer}>
                <TouchableOpacity 
                  onPress={() => {
                    setCurrentMediaType('image');
                    setPickerSheetVisible(true);
                  }} 
                  style={[styles.uploadBox, styles.uploadButton]}
                  disabled={mediaFiles.length >= 3}
                >
                  <Feather name="camera" size={24} color={mediaFiles.length >= 3 ? "#ccc" : "#000"} />
                  <Text style={[styles.browseFileText, {color: mediaFiles.length >= 3 ? "#ccc" : "#000"}]}>Add Photo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => {
                    setCurrentMediaType('video');
                    setPickerSheetVisible(true);
                  }} 
                  style={[styles.uploadBox, styles.uploadButton]}
                  disabled={mediaFiles.length >= 3}
                >
                  <Feather name="video" size={24} color={mediaFiles.length >= 3 ? "#ccc" : "#000"} />
                  <Text style={[styles.browseFileText, {color: mediaFiles.length >= 3 ? "#ccc" : "#000"}]}>Add Video</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.mediaCountText}>{mediaFiles.length}/3 media files</Text>
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
        </View>
      </SafeAreaView>
      {/* --- Media Picker Sheet --- */}
      <ImagePickerSheet
        visible={pickerSheetVisible}
        onClose={() => setPickerSheetVisible(false)}
        onCamera={() => {
          if (currentMediaType === 'video') {
            pickVideo('camera');
          } else {
            pickImage('camera');
          }
        }}
        onGallery={() => {
          if (currentMediaType === 'video') {
            pickVideo('gallery');
          } else {
            pickImage('gallery');
          }
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeAreaBlack: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: { flex: 1, backgroundColor: '#fff' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },

  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  backButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

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

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: { fontSize: 14, color: '#000', marginBottom: 10, fontWeight: '600' },

  uploadSection: { marginBottom: 30 },
  uploadButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    minHeight: 150,
  },
  uploadButton: {
    flex: 1,
    paddingVertical: 20,
    minHeight: 80,
  },
  mediaCountText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  browseFileText: {
    fontSize: 14,
    color: '#000',
    marginTop: 10,
    fontWeight: '600',
  },

  mediaContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
  thumbnailContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#c0c0c0ff',
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 3 },
    shadowColor: '#000',
    elevation: 3,
  },
  thumbnailPlaceholder: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoThumbnailContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#ffffffaa',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fd6363ff',
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
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

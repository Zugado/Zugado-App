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
import { useSnackbar } from '../../contexts/SnackbarContext';
import { useDispatch } from 'react-redux';
import { createJob, uploadJobAttachmentsById } from '../../store/thunks/jobThunk';
import { FaddedIcon } from '../../components/CommonComponents';

export default function CreateJobPageThree({ navigation, route }) {
  const { jobData } = route.params;
  const { openCamera, openGallery } = useImagePicker();
  const { showSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const [mediaFiles, setMediaFiles] = useState([]);
  const [pickerSheetVisible, setPickerSheetVisible] = useState(false);
  const [currentMediaType, setCurrentMediaType] = useState('image');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Log job data on component render
  useEffect(() => {
    console.log('=== CREATE JOB SCREEN 3 - JOB DATA SUMMARY ===');
    console.log('Complete Job Data:', JSON.stringify(jobData, null, 2));
    console.log('\n=== INDIVIDUAL FIELD BREAKDOWN ===');
    console.log('Job For:', jobData?.jobFor);
    console.log('Purpose:', jobData?.purpose);
    console.log('Title:', jobData?.title);
    console.log('Description:', jobData?.description);
    console.log('Category/Skills:', jobData?.category);
    console.log('Requirements:', jobData?.requirements);
    console.log('Experience Level:', jobData?.experienceLevel);
    console.log('Job Type:', jobData?.jobType);
    console.log('Location Type:', jobData?.locationType);
    console.log('Location:', jobData?.location);
    console.log('Timing Type:', jobData?.timingType);
    console.log('Timing Details:', jobData?.timingDetails);
    console.log('Amount:', jobData?.amount);
    console.log('=== END JOB DATA SUMMARY ===\n');
  }, [jobData]);
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

  const handleSubmitJob = async () => {
    setIsSubmitting(true);
    try {
      // Format timing details based on timing type
      let formattedTimingDetails = {};
      
      switch (jobData.timingType) {
        case 'fixed':
          formattedTimingDetails = {
            date: jobData.timingDetails.date,
            startTime: jobData.timingDetails.startTime,
            endTime: jobData.timingDetails.endTime
          };
          break;
        case 'multiday':
          formattedTimingDetails = {
            startDate: jobData.timingDetails.startDate,
            endDate: jobData.timingDetails.endDate,
            dailyHours: jobData.timingDetails.dailyHours
          };
          break;
        case 'deadline':
          formattedTimingDetails = {
            deadline: jobData.timingDetails.deadline
          };
          break;
        case 'flexible':
          formattedTimingDetails = {
            estimatedHours: jobData.timingDetails.estimatedHours
          };
          break;
      }

      // Format job data according to API structure
      const formattedJobData = {
        jobFor: jobData.jobFor,
        title: jobData.title,
        description: jobData.description,
        tags: jobData.category || [], // Using category from first screen as tags
        requirements: jobData.requirements || '',
        experienceLevel: jobData.experienceLevel,
        locationType: jobData.locationType,
        location: jobData.location,
        jobType: jobData.jobType,
        timingType: jobData.timingType,
        timingDetails: formattedTimingDetails,
        amount: {
          value: jobData.amount?.value || 0,
          disclose: jobData.amount?.disclose || false
        }
      };

      console.log('=== JOB CREATION START ===');
      console.log('Formatted Job Data:', JSON.stringify(formattedJobData, null, 2));
      console.log('Media Files Count:', mediaFiles.length);

      // Create job first
      const jobResponse = await dispatch(createJob(formattedJobData));
      
      console.log('=== JOB CREATION RESPONSE ===');
      console.log('Full Job Response:', JSON.stringify(jobResponse, null, 2));
      console.log('Response Type:', jobResponse.type);
      console.log('Response Payload:', JSON.stringify(jobResponse.payload, null, 2));
      
      if (createJob.fulfilled.match(jobResponse)) {
        // Try multiple ways to extract job ID
        const jobId = jobResponse.payload?.data?.id || 
                     jobResponse.payload?.data?._id || 
                     jobResponse.payload?.id || 
                     jobResponse.payload?._id ||
                     jobResponse.payload?.job?.id ||
                     jobResponse.payload?.job?._id;
        
        console.log('=== JOB ID EXTRACTION ===');
        console.log('Extracted Job ID:', jobId);
        console.log('Job ID Type:', typeof jobId);
        
        if (!jobId) {
          console.error('=== JOB ID NOT FOUND ===');
          console.error('Available payload keys:', Object.keys(jobResponse.payload || {}));
          if (jobResponse.payload?.data) {
            console.error('Available data keys:', Object.keys(jobResponse.payload.data));
          }
        }
        
        // Upload media files if any and jobId exists
        if (mediaFiles.length > 0 && jobId) {
          console.log('=== MEDIA UPLOAD START ===');
          console.log('Uploading', mediaFiles.length, 'media files for job:', jobId);
          await uploadMediaFiles(jobId);
        } else if (mediaFiles.length > 0 && !jobId) {
          console.warn('=== MEDIA UPLOAD SKIPPED ===');
          console.warn('Media files exist but no job ID found');
        }
        
        showSnackbar('Job posted successfully!', 'success');
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs', params: { screen: 'Home' } }],
        });
      } else {
        console.error('=== JOB CREATION FAILED ===');
        console.error('Error Response:', JSON.stringify(jobResponse, null, 2));
        throw new Error(jobResponse.payload?.message || 'Failed to create job');
      }
    } catch (error) {
      console.error('=== JOB SUBMISSION ERROR ===');
      console.error('Error Details:', error);
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
      showSnackbar('Failed to post job. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadMediaFiles = async (jobId) => {
    try {
      console.log('=== MEDIA UPLOAD FUNCTION START ===');
      console.log('Job ID for upload:', jobId);
      console.log('Media files to upload:', mediaFiles.length);
      
      const formData = new FormData();
      
      mediaFiles.forEach((file, index) => {
        console.log(`Adding file ${index + 1}:`, {
          uri: file.uri,
          type: file.type,
          fileName: file.fileName
        });
        
        formData.append('documents', {
          uri: file.uri,
          type: file.type === 'image' ? 'image/jpeg' : 'video/mp4',
          name: file.fileName
        });
      });
      
      console.log('=== CALLING UPLOAD THUNK ===');
      console.log('Upload payload:', { jobId });
      
      const uploadResponse = await dispatch(uploadJobAttachmentsById({
        jobId,
        formData
      }));
      
      console.log('=== UPLOAD RESPONSE ===');
      console.log('Upload Response Type:', uploadResponse.type);
      console.log('Upload Response Payload:', JSON.stringify(uploadResponse.payload, null, 2));
      
      if (uploadJobAttachmentsById.fulfilled.match(uploadResponse)) {
        console.log('=== MEDIA UPLOAD SUCCESS ===');
        console.log('Media files uploaded successfully');
      } else {
        console.error('=== MEDIA UPLOAD FAILED ===');
        console.error('Upload failed response:', JSON.stringify(uploadResponse, null, 2));
        showSnackbar('Job created but media upload failed', 'warning');
      }
    } catch (error) {
      console.error('=== MEDIA UPLOAD ERROR ===');
      console.error('Upload error details:', error);
      console.error('Upload error message:', error.message);
      console.error('Upload error stack:', error.stack);
      showSnackbar('Job created but media upload failed', 'warning');
    }
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
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <SafeAreaView style={styles.safeAreaBlack}>
        <MyStatusBar />
        <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
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
          
          {/* Job Summary */}
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Job Summary</Text>
            <Text style={styles.summaryText}>Title: {jobData.title}</Text>
            <Text style={styles.summaryText}>Type: {jobData.jobType} • {jobData.jobFor}</Text>
            <Text style={styles.summaryText}>Location: {jobData.locationType}</Text>
            {jobData.amount?.disclose && (
              <Text style={styles.summaryText}>
                Amount: ₹{jobData.amount.value}
              </Text>
            )}
          </View>

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
          <FaddedIcon/>
        </ScrollView>

        {/* --- Submit Button --- */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && { opacity: 0.7 }]}
            onPress={handleSubmitJob}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Text>
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
  scrollContent: { padding: 20, paddingBottom: 120 },

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
    marginBottom: 20,
    textAlign: 'center',
  },
  summaryContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
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

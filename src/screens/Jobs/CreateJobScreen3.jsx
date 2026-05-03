import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../styles/commonStyles';

export default function CreateJobPageThree({ navigation, route }) {
  const { jobData } = route.params;
  const { openCamera, openGallery } = useImagePicker();
  const { showSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const [mediaFiles, setMediaFiles] = useState([]);
  const [pickerSheetVisible, setPickerSheetVisible] = useState(false);
  const [currentMediaType, setCurrentMediaType] = useState('image');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  
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
    console.log('\n=== FINAL JOB SUBMISSION - SCREEN 3 ===');
    console.log('Complete Job Data:', JSON.stringify(jobData, null, 2));
    console.log('Media Files Count:', mediaFiles.length);
    console.log('Media Files Details:', mediaFiles.map(f => ({ id: f.id, type: f.type, fileName: f.fileName })));
    
    // Check for any draft data still in storage
    try {
      const draftData = await AsyncStorage.getItem('jobDraft');
      console.log('\n=== DRAFT DATA CHECK ===');
      if (draftData) {
        console.log('Draft Data Found:', JSON.parse(draftData));
      } else {
        console.log('No Draft Data Found');
      }
      console.log('=== END DRAFT CHECK ===\n');
    } catch (error) {
      console.log('Error checking draft:', error);
    }
    
    setIsSubmitting(true);
    try {
      // Format timing details based on timing type and jobFor
      let formattedTimingDetails = {};
      
      console.log('\n=== TIMING DETAILS FORMATTING ===');
      console.log('Job For:', jobData?.jobFor);
      console.log('Timing Type:', jobData?.timingType);
      console.log('Raw Timing Details:', JSON.stringify(jobData?.timingDetails, null, 2));
      
      if (jobData?.jobFor === 'person') {
        switch (jobData?.timingType) {
          case 'fixed':
            formattedTimingDetails = {
              date: jobData?.timingDetails?.date,
              startTime: jobData?.timingDetails?.startTime,
              endTime: jobData?.timingDetails?.endTime
            };
            break;
          case 'multiday':
            formattedTimingDetails = {
              startDate: jobData?.timingDetails?.startDate,
              endDate: jobData?.timingDetails?.endDate,
              dailyHours: jobData?.timingDetails?.dailyHours
            };
            break;
          case 'deadline':
            formattedTimingDetails = {
              deadline: jobData?.timingDetails?.deadline
            };
            break;
          case 'flexible':
            formattedTimingDetails = {
              estimatedHours: jobData?.timingDetails?.estimatedHours
            };
            break;
        }
      } else {
        // Thing timing details
        switch (jobData?.timingType) {
          case 'needed-by-date':
            formattedTimingDetails = {
              date: jobData?.timingDetails?.thingDate,
              startTime: jobData?.timingDetails?.thingStartTime,
              endTime: jobData?.timingDetails?.thingEndTime
            };
            break;
          case 'start-end-date':
            formattedTimingDetails = {
              startDate: jobData?.timingDetails?.thingStartDate,
              endDate: jobData?.timingDetails?.thingEndDate,
              dailyHours: jobData?.timingDetails?.thingDailyHours
            };
            break;
          case 'deadline':
            formattedTimingDetails = {
              deadline: jobData?.timingDetails?.thingDeadline
            };
            break;
          case 'flexible':
            formattedTimingDetails = {
              estimatedHours: jobData?.timingDetails?.thingEstimatedHours
            };
            break;
        }
      }
      
      console.log('Formatted Timing Details:', JSON.stringify(formattedTimingDetails, null, 2));
      console.log('=== END TIMING FORMATTING ===\n');

      // Format job data according to API structure
      const formattedJobData = {
        jobFor: jobData?.jobFor,
        purpose: jobData?.purpose || null,
        title: jobData?.title || null,
        description: jobData?.description || null,
        tags: jobData?.category || null,
        requirements: jobData?.requirements || null,
        experienceLevel: jobData?.experienceLevel,
        locationType: jobData?.locationType || null,
        location: jobData?.location,
        jobType: jobData?.jobType,
        timingType: jobData?.timingType,
        timingDetails: formattedTimingDetails,
        amount: {
          value: jobData?.amount?.value || null,
          unit: jobData?.amount?.unit || null,
          disclose: jobData?.amount?.disclose || false,
          negotiable: jobData?.amount?.negotiable || false
         
        }
      };

      console.log('\n=== FINAL FORMATTED JOB DATA FOR API ===');
      console.log(JSON.stringify(formattedJobData, null, 2));
      console.log('=== END FORMATTED DATA ===\n');
      
      console.log('\n=== FIELD-BY-FIELD BREAKDOWN ===');
      console.log('Job For:', formattedJobData.jobFor);
      console.log('Purpose:', formattedJobData.purpose);
      console.log('Title:', formattedJobData.title);
      console.log('Description Length:', formattedJobData.description?.length);
      console.log('Tags/Categories:', formattedJobData.tags);
      console.log('Requirements:', formattedJobData.requirements);
      console.log('Experience Level:', formattedJobData.experienceLevel);
      console.log('Location Type:', formattedJobData.locationType);
      console.log('Location Coordinates:', formattedJobData.location?.coordinates);
      console.log('Job Type:', formattedJobData.jobType);
      console.log('Timing Type:', formattedJobData.timingType);
      console.log('Amount Disclose:', formattedJobData.amount.disclose);
      console.log('Amount Negotiable:', formattedJobData.amount.negotiable);
      console.log('Amount Value:', formattedJobData.amount.value);
      console.log('Amount Unit:', formattedJobData.amount.unit);
      console.log('Amount Range:', formattedJobData.amount.range);
      console.log('=== END FIELD BREAKDOWN ===\n');

      const jobResponse = await dispatch(createJob(formattedJobData));
      
      if (createJob.fulfilled.match(jobResponse)) {
        const jobId = jobResponse.payload?.data?.id || jobResponse.payload?.data?._id || jobResponse.payload?.id;
        console.log('\n=== JOB CREATED SUCCESSFULLY ===');
        console.log('Job ID:', jobId);
        console.log('Media Files to Upload:', mediaFiles.length);
        console.log('Media Files = :', mediaFiles);
        
        if (mediaFiles.length > 0 && jobId) {
          console.log('Uploading', mediaFiles.length, 'media files...');
          await uploadMediaFiles(jobId);
        }
        
        try {
          await AsyncStorage.removeItem('jobDraft');
          console.log('Draft cleared after successful job posting');
        } catch (error) {
          console.log('Error clearing draft:', error);
        }
        
        console.log('\n=== JOB SUBMISSION COMPLETE ===\n');
        showSnackbar('Task posted successfully!', 'success');
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs', params: { screen: 'Home' } }],
        });
      } else {
        throw new Error(jobResponse.payload?.message || 'Failed to create job');
      }
      
    } catch (error) {
      console.error('\n=== JOB SUBMISSION ERROR ===');
      console.error('Error Details:', error);
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
      console.error('=== END ERROR LOG ===\n');
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
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveMedia(file.id)}
      >
        <Feather name="x" size={14} color='#fd6363ff' />
      </TouchableOpacity>
    </View>
  );

  const PreviewSection = ({ icon, title, children }) => (
    <View style={styles.previewSection}>
      <View style={styles.previewHeader}>
        <Feather name={icon} size={18} color="#000" />
        <Text style={styles.previewTitle}>{title}</Text>
      </View>
      <View style={styles.previewContent}>{children}</View>
    </View>
  );

  const PreviewRow = ({ label, value }) => (
    value ? (
      <View style={styles.previewRow}>
        <Text style={styles.previewLabel}>{label}</Text>
        <Text style={styles.previewValue}>{value}</Text>
      </View>
    ) : null
  );

  if (showPreview) {
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
              <View style={styles.header}>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={styles.backButton}
                >
                  <Feather name="arrow-left" size={20} color="#000" />
                </TouchableOpacity>
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBar, { width: '100%' }]} />
                </View>
                <Text style={styles.progressText}>3/3</Text>
              </View>

              <Text style={styles.title}>Review Your Posting</Text>
              <Text style={styles.subtitle}>Please review all details before submitting</Text>

              {/* Basic Info */}
              <PreviewSection icon="briefcase" title="Basic Information">
                <PreviewRow label="Task For" value={jobData?.jobFor === 'person' ? 'Person' : 'Thing'} />
                <PreviewRow label="Type" value={jobData?.jobType === 'quick' ? 'Urgent' : 'Standard'} />
                <PreviewRow label="Title" value={jobData?.title} />
                <PreviewRow label="Description" value={jobData?.description} />
                {jobData?.purpose && <PreviewRow label="Purpose" value={jobData?.purpose} />}
                {jobData?.requirements && <PreviewRow label="Requirements" value={jobData?.requirements} />}
                {jobData?.experienceLevel && (
                  <PreviewRow 
                    label="Experience Level" 
                    value={jobData?.experienceLevel.charAt(0).toUpperCase() + jobData?.experienceLevel.slice(1)} 
                  />
                )}
                {jobData?.category?.length > 0 && (
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>Categories</Text>
                    <View style={styles.tagsContainer}>
                      {jobData.category.map((tag, idx) => (
                        <View key={idx} style={styles.tag}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </PreviewSection>

              {/* Location */}
              <PreviewSection icon="map-pin" title="Location">
                {jobData?.locationType && (
                  <PreviewRow 
                    label="Type" 
                    value={jobData.locationType.charAt(0).toUpperCase() + jobData.locationType.slice(1)} 
                  />
                )}
                {jobData?.location?.address && (
                  <PreviewRow label="Address" value={jobData.location.address} />
                )}
              </PreviewSection>

              {/* Timing */}
              <PreviewSection icon="clock" title="Timing">
                <PreviewRow 
                  label="Type" 
                  value={jobData?.timingType?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} 
                />
                {jobData?.timingDetails?.date && <PreviewRow label="Date" value={jobData.timingDetails.date} />}
                {jobData?.timingDetails?.startTime && <PreviewRow label="Start Time" value={jobData.timingDetails.startTime} />}
                {jobData?.timingDetails?.endTime && <PreviewRow label="End Time" value={jobData.timingDetails.endTime} />}
                {jobData?.timingDetails?.startDate && <PreviewRow label="Start Date" value={jobData.timingDetails.startDate} />}
                {jobData?.timingDetails?.endDate && <PreviewRow label="End Date" value={jobData.timingDetails.endDate} />}
                {jobData?.timingDetails?.dailyHours && <PreviewRow label="Daily Hours" value={jobData.timingDetails.dailyHours} />}
                {jobData?.timingDetails?.deadline && (
                  <PreviewRow
                    label="Deadline"
                    value={
                      jobData.timingDetails.deadline.includes('T')
                        ? new Date(jobData.timingDetails.deadline).toLocaleString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit', hour12: true,
                            timeZone: 'Asia/Kolkata',
                          })
                        : jobData.timingDetails.deadline
                    }
                  />
                )}
                {jobData?.timingDetails?.estimatedHours && <PreviewRow label="Estimated Hours" value={jobData.timingDetails.estimatedHours} />}
              </PreviewSection>

              {/* Payment */}
              {jobData?.amount?.disclose && (
                <PreviewSection icon="dollar-sign" title="Payment">
                  <PreviewRow label="Amount" value={`₹${jobData.amount.value}`} />
                  {jobData?.amount?.unit && <PreviewRow label="Unit" value={jobData.amount.unit} />}
                  <PreviewRow label="Negotiable" value={jobData?.amount?.negotiable ? 'Yes' : 'No'} />
                  {jobData?.amount?.deposit && <PreviewRow label="Deposit" value={`₹${jobData.amount.deposit}`} />}
                </PreviewSection>
              )}

              <FaddedIcon />
            </ScrollView>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('CreateJobScreen')}
              >
                <Feather name="edit-2" size={16} color="#000" />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.continueButton}
                onPress={() => setShowPreview(false)}
              >
                <Text style={styles.continueButtonText}>Continue</Text>
                <Feather name="arrow-right" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }

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
          <FaddedIcon />
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
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  
  // Preview Styles
  previewSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    overflow: 'hidden',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  previewContent: {
    padding: 16,
  },
  previewRow: {
    marginBottom: 12,
  },
  previewLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  previewValue: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tagText: {
    fontSize: 12,
    color: '#000',
    fontWeight: '500',
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
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 30,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  editButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButton: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

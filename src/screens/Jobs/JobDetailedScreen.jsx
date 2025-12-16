import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, FlatList, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyStatusBar from '../../components/MyStatusbar';
import { getJobById } from '../../store/thunks/jobThunk';
import { addToWishlist, removeFromWishlist } from '../../store/thunks/wishlistThunk';
import { selectWishlist } from '../../store/selector';
import { useSnackbar } from '../../contexts/SnackbarContext';
import Video from 'react-native-video';
import { selectToken } from '../../store/selector';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock data for Task Details section
const jobDetailsData = [
  { key: 'Timing Type', value: 'Fixed', icon: 'clock' },
  { key: 'Experience', value: 'Intermediate', icon: 'briefcase' },
  { key: 'Duration', value: '3-4 Weeks', icon: 'clock' },
  { key: 'Team Size', value: '1 Person', icon: 'users' },
];

// Component for a single metadata item
const MetaItem = ({ icon, text }) => (
  <View style={styles.metaItem}>
    <Feather name={icon} size={16} color="#4B5563" />
    <Text style={styles.metaText}>{text}</Text>
  </View>
);

// Component for a job detail row
const DetailRow = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <View style={styles.detailLabel}>
      <Feather name={icon} size={16} color="#6B7280" style={{ marginRight: 8 }} />
      <Text style={styles.detailLabelText}>{label}</Text>
    </View>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

// Component for a tag
const Tag = ({ text }) => (
  <View style={styles.tag}>
    <Text style={styles.tagText}>{text}</Text>
  </View>
);

// Helper functions
const formatTime = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};

const getTimingText = (timingType, timingDetails) => {
  if (!timingType || !timingDetails) return 'NA';
  
  switch (timingType) {
    case 'fixed':
      const formattedDate = formatDate(timingDetails.date);
      const startTime = formatTime(timingDetails.startTime);
      const endTime = formatTime(timingDetails.endTime);
      return `${formattedDate}, ${startTime} - ${endTime}`;
    case 'multiday':
      const startDate = formatDate(timingDetails.startDate);
      const endDate = formatDate(timingDetails.endDate);
      return `${startDate} to ${endDate} (${timingDetails.dailyHours}h daily)`;
    case 'deadline':
      const deadlineDate = new Date(timingDetails.deadline);
      const formattedDeadline = deadlineDate.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      return `Due by ${formattedDeadline}`;
    case 'flexible':
      return `Flexible timing (${timingDetails.estimatedHours} hours total)`;
    default:
      return 'NA';
  }
};

const getExperienceText = (level) => {
  switch (level) {
    case 'entry': return 'Entry Level (0-2 years)';
    case 'intermediate': return 'Intermediate (2-5 years)';
    case 'expert': return 'Expert Level (5+ years)';
    default: return 'NA';
  }
};

const getLocationIcon = (locationType) => {
  switch (locationType) {
    case 'remote': return 'home';
    case 'onsite': return 'map-pin';
    case 'hybrid': return 'globe';
    default: return 'map-pin';
  }
};

const { width } = Dimensions.get('window');

export default function JobDetailedScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const wishlist = useSelector(selectWishlist);
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [jobData, setJobData] = useState(null);
  const [previewModal, setPreviewModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const intervalRef = useRef(null);
  const jobId = route.params?.jobId;
  
  const isWishlisted = wishlist?.some(job => job._id === jobId) || false;
  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  console.log("Token = ", AsyncStorage.getItem('token'));
  console.log("jobData = ", JSON.stringify(jobData, null, 2))

  // Auto-scroll disabled
  // useEffect(() => {
  //   if (jobData?.attachments && jobData.attachments.length > 1) {
  //     intervalRef.current = setInterval(() => {
  //       setCurrentIndex(prevIndex => {
  //         const nextIndex = (prevIndex + 1) % jobData.attachments.length;
  //         flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
  //         return nextIndex;
  //       });
  //     }, 3000);
  //     return () => {
  //       if (intervalRef.current) {
  //         clearInterval(intervalRef.current);
  //       }
  //     };
  //   }
  // }, [jobData?.attachments?.length]);


  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getJobById(jobId));
      if (response.payload?.success) {
        setJobData(response.payload.data);
      }
    } catch (error) {
      console.log('Error fetching job details:', error);
    } finally {
      setLoading(false);
    }
  };

  const openPreview = (media) => {
    setSelectedMedia(media);
    setPreviewModal(true);
  };

  const handleWishlistToggle = async () => {
    try {
      if (isWishlisted) {
        await dispatch(removeFromWishlist(jobId)).unwrap();
        showSnackbar('Job removed from wishlist', 'success');
      } else {
        await dispatch(addToWishlist(jobId)).unwrap();
        showSnackbar('Job added to wishlist', 'success');
      }
    } catch (error) {
      showSnackbar('Failed to update wishlist', 'error');
    }
  };

  const isVideo = (url) => {
    return url.toLowerCase().includes('.mp4') || url.toLowerCase().includes('.mov') || url.toLowerCase().includes('.avi');
  };

  const renderAttachment = useCallback(({ item }) => (
    <TouchableOpacity 
      style={styles.attachmentItem}
      onPress={() => openPreview(item)}
    >
      {isVideo(item.url) ? (
        <View style={styles.videoThumbnail}>
          <Video
            source={{ uri: item.url }}
            style={styles.attachmentImage}
            paused={true}
            resizeMode="cover"
          />
          <View style={styles.playIcon}>
            <Feather name="play" size={24} color="#fff" />
          </View>
        </View>
      ) : (
        <Image source={{ uri: item.url }} style={styles.attachmentImage} />
      )}
    </TouchableOpacity>
  ), []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <MyStatusBar />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Loading job details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!jobData) {
    return (
      <SafeAreaView style={styles.container}>
        <MyStatusBar />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Task not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
          <MyStatusBar/>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Details</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="bell" size={24} color="#111827" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Attachments Carousel */}
        {jobData.attachments && jobData.attachments.length > 0 ? (
          <View style={styles.attachmentsContainer}>
            <FlatList
              ref={flatListRef}
              data={jobData.attachments}
              renderItem={renderAttachment}
              keyExtractor={(item) => item._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToInterval={width}
              decelerationRate="fast"
              getItemLayout={(data, index) => ({
                length: width,
                offset: width * index,
                index,
              })}
              removeClippedSubviews={true}
              maxToRenderPerBatch={3}
              windowSize={3}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / width);
                if (index !== currentIndex) {
                  setCurrentIndex(index);
                }
              }}
            />
            <TouchableOpacity style={styles.bookmarkButton} onPress={handleWishlistToggle}>
              <Feather name="heart" size={20} color={isWishlisted ? "#ff4444" : "#fff"} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.imageContainer}>
            <Image 
              source={require('../../assets/jobImage.png')} 
              style={styles.image} 
            />
            <TouchableOpacity style={styles.bookmarkButton} onPress={handleWishlistToggle}>
              <Feather name="heart" size={20} color={isWishlisted ? "#ff4444" : "#fff"} />
            </TouchableOpacity>
          </View>
        )}

        {/* Pagination Dots - Outside Image */}
        {jobData.attachments && jobData.attachments.length > 1 && (
          <View style={styles.paginationContainerExternal}>
            {jobData.attachments.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDotExternal,
                  index === currentIndex && styles.paginationDotExternalActive
                ]}
              />
            ))}
          </View>
        )}

        <View style={styles.content}>
          {/* Task Title and Status */}
          <View style={styles.titleRow}>
            <Text style={styles.jobTitle}>{jobData.title || 'NA'}</Text>
            {jobData.jobType === 'quick' && (
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Urgent</Text>
              </View>
            )}
          </View>

          {/* Metadata Row */}
          <View style={styles.metaRow}>
            <MetaItem icon="clock" text={jobData.timingType? jobData.timingType.charAt(0).toUpperCase() + jobData.timingType.slice(1):'NA'} />
            <MetaItem icon={getLocationIcon(jobData.locationType)} text={jobData.locationType ? jobData.locationType.charAt(0).toUpperCase() + jobData.locationType.slice(1) : 'NA'} />
            <MetaItem icon="user" text={jobData.createdBy?.firstName && jobData.createdBy?.lastName ? `${jobData.createdBy.firstName} ${jobData.createdBy.lastName}` : 'NA'} />
          </View>

          {/* Tags Row */}
          <View style={styles.tagsRow}>
            {jobData.tags?.length > 0 ? (
              jobData.tags.map((tagItem, index) => (
                <Tag key={index} text={tagItem || 'NA'} />
              ))
            ) : (
              <Tag text="NA" />
            )}
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.sectionText}>
              {jobData.description || 'NA'}
            </Text>
          </View>



          {/* Requirements */}
          {jobData.requirements && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Requirements</Text>
              <Text style={styles.sectionText}>
                {jobData.requirements}
              </Text>
            </View>
          )}

          {/* Task Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Task Details</Text>
            <DetailRow icon="briefcase" label="Task For" value={jobData.jobFor ? jobData.jobFor.charAt(0).toUpperCase() + jobData.jobFor.slice(1) : 'NA'} />
            <DetailRow icon="zap" label="Task Type" value={jobData.jobType ? jobData.jobType.charAt(0).toUpperCase() + jobData.jobType.slice(1) : 'NA'} />
            <DetailRow icon="award" label="Experience" value={getExperienceText(jobData.experienceLevel)} />
            <DetailRow icon={getLocationIcon(jobData.locationType)} label="Location Type" value={jobData.locationType ? jobData.locationType.charAt(0).toUpperCase() + jobData.locationType.slice(1) : 'NA'} />
            <DetailRow icon="clock" label="Timing" value={getTimingText(jobData.timingType, jobData.timingDetails)} />
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Budget */}
        <View>
          <Text style={styles.budgetLabel}>Budget</Text>
          <Text style={styles.budgetValue}>
            <FontAwesome name="dollar" size={16} color="#16A34A" /> {jobData.amount?.disclose && (jobData.amount?.min > 0 || jobData.amount?.max > 0) ? `${jobData.amount.min}-${jobData.amount.max}` : 'Not Disclosed'}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconAction}>
            <Feather name="message-square" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton}>
            <Text style={styles.applyText}>Apply</Text>
            <Text style={styles.applyArrow}>⌄</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Preview Modal */}
      <Modal
        visible={previewModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPreviewModal(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalClose}
            onPress={() => setPreviewModal(false)}
          >
            <Feather name="x" size={24} color="#fff" />
          </TouchableOpacity>
          
          {selectedMedia && (
            <View style={styles.modalContent}>
              {isVideo(selectedMedia.url) ? (
                <Video
                  source={{ uri: selectedMedia.url }}
                  style={styles.modalVideo}
                  controls={true}
                  resizeMode="contain"
                  paused={false}
                  muted={false}
                  playInBackground={false}
                  playWhenInactive={false}
                />
              ) : (
                <Image 
                  source={{ uri: selectedMedia.url }} 
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              )}
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  iconButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },
  notificationDot: { position: 'absolute', top: 4, right: 4, width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444' },

  scrollContent: { paddingBottom: 100 },
  imageContainer: { position: 'relative', height: 200 },
  image: { width: '100%', height: '100%' },
  bookmarkButton: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 999, zIndex: 10 },
  
  // Attachments Carousel Styles
  attachmentsContainer: { position: 'relative', height: 200 },
  attachmentItem: { width: width, height: 200 },
  attachmentImage: { width: '100%', height: '100%' },
  videoThumbnail: { position: 'relative', width: '100%', height: '100%' },
  playIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 8,
  },
  
  // External Pagination Dots
  paginationContainerExternal: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  paginationDotExternal: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
  },
  paginationDotExternalActive: {
    backgroundColor: '#111827',
    width: 24,
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  modalContent: {
    width: '90%',
    height: '70%',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalVideo: {
    width: '100%',
    height: '100%',
  },

  content: { padding: 16 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  jobTitle: { fontSize: 22, fontWeight: '700', flex: 1, paddingRight: 8 },
  statusBadge: { backgroundColor: '#EF4444', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600' },

  metaRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 12, marginBottom: 6 },
  metaText: { marginLeft: 4, fontSize: 12, color: '#4B5563', fontWeight: '500' },

  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  tag: { backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, marginRight: 6, marginBottom: 6 },
  tagText: { fontSize: 12, color: '#4B5563', fontWeight: '600' },

  section: { marginTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4, color: '#111827' },
  sectionText: { fontSize: 14, lineHeight: 20, color: '#4B5563' },
  list: { marginLeft: 12 },
  listItem: { fontSize: 14, lineHeight: 20, color: '#4B5563', marginBottom: 2 },

  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  detailLabel: { flexDirection: 'row', alignItems: 'center' },
  detailLabelText: { fontSize: 14, fontWeight: '500', color: '#111827' },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#111827' },

  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB', backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: -2 }, shadowRadius: 4 },
  budgetLabel: { fontSize: 12, fontWeight: '500', color: '#6B7280' },
  budgetValue: { fontSize: 22, fontWeight: '800', color: '#16A34A' },

  actions: { flexDirection: 'row', alignItems: 'center' },
  iconAction: { backgroundColor: '#111827', padding: 12, borderRadius: 999, marginRight: 8 },
  applyButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111827', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 999 },
  applyText: { color: '#fff', fontSize: 16, fontWeight: '700', marginRight: 6 },
  applyArrow: { color: '#fff', fontSize: 18, lineHeight: 18 },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#666' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 18, color: '#666', marginBottom: 20 },
  backButton: { backgroundColor: '#000', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
  backButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

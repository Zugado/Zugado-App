import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';
import { CommonAppBar } from '../../components/CommonComponents';
import MyStatusBar from '../../components/MyStatusbar';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { selectWishlistIds } from '../../store/selector';
import { getJobById, deleteJobById } from '../../store/thunks/jobThunk';
import { getWishlist } from '../../store/thunks/wishlistThunk';
import { getLocationFromCoordinates } from '../../utils/locationUtils';
import { handleWishlistToggle } from '../../utils/wishlistUtils';
// Chat thunk — initiates or retrieves existing conversation before navigating
import { startNewChat } from '../../store/thunks/chatThunk';
import { Colors } from '../../styles/commonStyles';
import { WarningWithButton } from '../../components/lottie/WarningWithButton';

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
      <Feather
        name={icon}
        size={16}
        color="#6B7280"
        style={{ marginRight: 8 }}
      />
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
const formatTime = time => {
  if (!time) return '';
  return time;
};

const formatDate = dateStr => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
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
        hour12: true,
      });
      return `Due by ${formattedDeadline}`;
    case 'flexible':
      return `Flexible timing (${timingDetails.estimatedHours} hours total)`;
    default:
      return 'NA';
  }
};

const getExperienceText = level => {
  switch (level) {
    case 'entry':
      return 'Entry Level (0-2 years)';
    case 'intermediate':
      return 'Intermediate (2-5 years)';
    case 'expert':
      return 'Expert Level (5+ years)';
    default:
      return 'NA';
  }
};

const getLocationIcon = locationType => {
  switch (locationType) {
    case 'remote':
      return 'home';
    case 'onsite':
      return 'map-pin';
    case 'hybrid':
      return 'globe';
    default:
      return 'map-pin';
  }
};

const { width } = Dimensions.get('window');

export default function JobDetailedScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const wishlistIds = useSelector(selectWishlistIds);
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [jobData, setJobData] = useState(null);
  const [previewModal, setPreviewModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [locationText, setLocationText] = useState('Loading...');
  // const [hasBidded, setHasBidded] = useState(hasBiddedOnJob(route.params?.jobId));
  // const [hasCreated, setHasCreated] = useState(hasCreatedJob(route.params?.jobId));
  // Track chat button loading state to prevent double-taps
  const [chatLoading, setChatLoading] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const flatListRef = useRef(null);
  const intervalRef = useRef(null);
  const jobId = route.params?.jobId;
  const appliedJobs = useSelector(
    state => state.job?.myAllBids || [],
    shallowEqual,
  );
  const { user, isGuest } = useSelector(state => state.auth);
  const isUrgent = jobData?.jobType === 'quick';
  const isCreator = jobData?.createdBy?._id === (user?._id || user?.id);
  const alreadyApplied = appliedJobs.some(
    item => item?.job?._id === jobId || item?.jobId === jobId,
  );
  const hideApply = isCreator || alreadyApplied;
  const disableApply = isGuest;
  const disableChat =
    isCreator || isGuest || jobData?.bid?.status === 'rejected';
  const isWishlisted = wishlistIds.includes(jobId);

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    }
    dispatch(getWishlist());
  }, [jobId, dispatch]);

  useEffect(() => {
    if (jobData?.location?.coordinates) {
      getLocationFromCoordinates(jobData.location.coordinates).then(
        ({ country, city, state }) => {
          setLocationText(` ${city}, ${state},${country}`);
          2;
        },
      );
    }
  }, [jobData?.location?.coordinates]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getJobById(jobId));
      if (response.payload?.success) {
        setJobData(response.payload.data);
        console.log('Fetched job details:', response.payload.data);
      }
    } catch (error) {
      console.log('Error fetching job details:', error);
    } finally {
      setLoading(false);
    }
  };
  console.log('Job data in render:', jobData);

  /**
   * Initiate or retrieve an existing chat for this job.
   * POST /api/chat/initiate  { jobId, participantId: jobData.createdBy._id }
   * Navigates to ChatingScreen with the returned conversation object.
   */
  const handleChatPress = async () => {
    if (chatLoading || !jobData?.createdBy?._id) return;
    setChatLoading(true);
    try {
      const result = await dispatch(
        startNewChat({
          jobId: jobData._id,
          participantId: jobData.createdBy._id,
        }),
      ).unwrap();
      if (result?.data) {
        //  console.log("Rendering chat item in job detail screen:", result.data);
        navigation.navigate('ChatingScreen', { chatData: result.data });
      }
    } catch (err) {
      showSnackbar('Could not open chat. Try again.', 'error');
    } finally {
      setChatLoading(false);
    }
  };

  const handleDeleteJob = async () => {
    if (deleteLoading) return;
    setDeleteLoading(true);
    try {
      const response = await dispatch(deleteJobById(jobId)).unwrap();
      if (response?.success) {
        showSnackbar(
          response?.message || 'Job deleted successfully',
          'success',
        );
       navigation.pop(2);
      }
    } catch (error) {
      const errorMessage =
        error?.error?.details ||
        error?.error?.message ||
        error?.message ||
        'Failed to delete job';
      showSnackbar(errorMessage, 'error');
    } finally {
      setDeleteLoading(false);
      setShowDeleteWarning(false);
    }
  };

  const openPreview = media => {
    setSelectedMedia(media);
    setPreviewModal(true);
  };

  const onWishlistToggle = () => {
    handleWishlistToggle(dispatch, jobId, isWishlisted, showSnackbar);
  };

  const isVideo = url => {
    return (
      url.toLowerCase().includes('.mp4') ||
      url.toLowerCase().includes('.mov') ||
      url.toLowerCase().includes('.avi')
    );
  };
  const StarRating = ({ rating, totalRatings }) => {
    const filled = Math.round(rating || 0);
    return (
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map(i => (
          <FontAwesome
            key={i}
            name={i <= filled ? 'star' : 'star-o'}
            size={14}
            color={i <= filled ? '#F59E0B' : '#D1D5DB'}
            style={{ marginRight: 2 }}
          />
        ))}
        <Text style={styles.ratingText}>
          {rating > 0 ? ` ${rating.toFixed(1)}` : ' No ratings'}
          {totalRatings > 0 ? ` (${totalRatings})` : ''}
        </Text>
      </View>
    );
  };
  const renderAttachment = useCallback(({ item }) => {
    if (!item?.url) return null;

    return (
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
    );
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <MyStatusBar />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Loading task details...</Text>
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MyStatusBar />
      {/* Header */}
      <CommonAppBar
        title="Task Details"
        onBackPress={() => navigation.goBack()}
        showNotificationIcon={true}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Attachments Carousel */}
        {jobData.attachments && jobData.attachments.length > 0 ? (
          <View style={styles.attachmentsContainer}>
            <FlatList
              ref={flatListRef}
              data={jobData.attachments}
              renderItem={renderAttachment}
              keyExtractor={item => item._id}
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
              onMomentumScrollEnd={event => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / width,
                );
                if (index !== currentIndex) {
                  setCurrentIndex(index);
                }
              }}
            />
            <TouchableOpacity
              style={styles.bookmarkButton}
              onPress={onWishlistToggle}
            >
              <Image
                source={
                  isWishlisted
                    ? require('../../assets/Icons/SavedGolden.png')
                    : require('../../assets/Icons/Saved.png')
                }
                style={styles.bookmarkIcon}
              />
            </TouchableOpacity>
            {isUrgent && (
              <View style={styles.urgentTag}>
                <Image
                  source={require('../../assets/Icons/urgentTag.png')}
                  style={styles.urgentTagImage}
                />
                <Text style={styles.urgentText}>Urgent</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/noImage.png')}
              style={styles.image}
            />
            <TouchableOpacity
              style={styles.bookmarkButton}
              onPress={onWishlistToggle}
            >
              <Image
                source={
                  isWishlisted
                    ? require('../../assets/Icons/SavedGolden.png')
                    : require('../../assets/Icons/Saved.png')
                }
                style={styles.bookmarkIcon}
              />
            </TouchableOpacity>
            {isUrgent && (
              <View style={styles.urgentTag}>
                <Image
                  source={require('../../assets/Icons/urgentTag.png')}
                  style={styles.urgentTagImage}
                />
                <Text style={styles.urgentText}>Urgent</Text>
              </View>
            )}
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
                  index === currentIndex && styles.paginationDotExternalActive,
                ]}
              />
            ))}
          </View>
        )}

        <View style={styles.content}>
          {/* Task Title and Status */}
          <View style={styles.titleRow}>
            <Text style={styles.jobTitle}>{jobData.title || 'NA'}</Text>
          </View>
          {/* Creator Info + Rating */}
          <View style={styles.creatorRow}>
            <FontAwesome name="user-circle" size={36} color="#6B7280" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.creatorName}>
                {jobData.createdBy?.firstName} {jobData.createdBy?.lastName}
              </Text>

              {/* types of rating to be added in job data */}
              {/* "ratings": {
      "averageRating": 0,
      "totalRatings": 0,
      "taskCreatorRating": 0,
      "taskWorkerRating": 0
    }, */}
              <StarRating
                rating={
                  jobData.createdBy?.ratings?.averageRating ||
                  jobData.creatorRating ||
                  0
                }
                totalRatings={jobData.createdBy?.ratings?.totalRatings || 0}
              />
            </View>
          </View>
          {/* Metadata Row */}
          <View style={styles.metaRow}>
            <MetaItem
              icon="clock"
              text={
                jobData.timingType
                  ? jobData.timingType.charAt(0).toUpperCase() +
                    jobData.timingType.slice(1)
                  : 'NA'
              }
            />
            <MetaItem
              icon={getLocationIcon(jobData.locationType)}
              text={
                jobData.locationType
                  ? jobData.locationType.charAt(0).toUpperCase() +
                    jobData.locationType.slice(1)
                  : 'NA'
              }
            />
            {/* <MetaItem
              icon="user"
              text={
                jobData.createdBy?.firstName && jobData.createdBy?.lastName
                  ? `${jobData.createdBy.firstName} ${jobData.createdBy.lastName}`
                  : 'NA'
              }
            /> */}
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
              <Text style={styles.sectionText}>{jobData.requirements}</Text>
            </View>
          )}

          {/* Task Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Task Details</Text>
            <DetailRow
              icon="briefcase"
              label="Task For"
              value={
                jobData.jobFor
                  ? jobData.jobFor.charAt(0).toUpperCase() +
                    jobData.jobFor.slice(1)
                  : 'NA'
              }
            />
            <DetailRow
              icon="zap"
              label="Task Type"
              value={
                jobData.jobType
                  ? jobData.jobType.charAt(0).toUpperCase() +
                    jobData.jobType.slice(1)
                  : 'NA'
              }
            />
            <DetailRow
              icon="award"
              label="Experience"
              value={getExperienceText(jobData.experienceLevel)}
            />

            <DetailRow
              icon="clock"
              label="Timing"
              value={getTimingText(jobData.timingType, jobData.timingDetails)}
            />
            {jobData.location ? (
              <TouchableOpacity
                style={styles.detailRow}
                onPress={() =>
                  navigation.navigate('ApproximateLocationMap', {
                    coordinates: jobData.location.coordinates,
                    address: locationText,
                  })
                }
                activeOpacity={0.7}
              >
                <View style={styles.detailLabel}>
                  <Feather
                    name="map-pin"
                    size={16}
                    color="#6B7280"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.detailLabelText}>Location</Text>
                </View>
                <View style={styles.locationValueContainer}>
                  <Text style={[styles.detailValue, { color: '#002880' }]}>
                    {locationText}
                  </Text>
                  <View
                    style={{
                      marginLeft: 4,
                      padding: 4,
                      backgroundColor: '#E5E7EB',
                      borderRadius: 12,
                      shadowColor: '#000',
                      shadowOpacity: 0.1,
                      shadowOffset: { width: 0, height: 1 },
                      shadowRadius: 2,
                      elevation: 2,
                      flexDirection: 'row',
                    }}
                  >
                    {/* <Text style={{fontSize: 10,marginLeft: 4 }}>View On map</Text> */}
                    <Feather
                      name="chevron-right"
                      size={16}
                      color="#00308f"
                      // style={{ marginLeft: 4 }}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ) : (
              <DetailRow
                icon={getLocationIcon(jobData.locationType)}
                label="Location"
                value={
                  jobData.locationType
                    ? jobData.locationType.charAt(0).toUpperCase() +
                      jobData.locationType.slice(1)
                    : 'NA'
                }
              />
            )}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Budget */}
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 4,
            }}
          >
            <Text style={styles.budgetLabel}>Budget</Text>
            <Text
              style={{
                fontSize: 10,
                fontWeight: '500',
                color: '#6B7280',
                marginLeft: 8,
                paddingHorizontal: 6,
                paddingVertical: 2,
                backgroundColor: jobData.amount?.negotiable
                  ? '#c5f7d6'
                  : '#ffd1c6d6',
                borderRadius: 12,
              }}
            >
              {jobData.amount?.negotiable ? 'Negotiable' : 'Non Negotiable'}
            </Text>
          </View>
          <Text style={styles.budgetValue}>
            <FontAwesome name="rupee" size={16} color="#16A34A" />{' '}
            {jobData?.amount?.disclose
              ? jobData.amount?.min >= 0 && jobData.amount?.max >= 0
                ? `${jobData.amount.min} - ${jobData.amount.max}`
                : jobData.amount?.value >= 0
                ? `${jobData.amount.value}`
                : 'Not Disclosed'
              : 'Not Disclosed'}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.iconAction, disableChat && { opacity: 0.4 }]}
            onPress={handleChatPress}
            disabled={chatLoading || disableChat}
          >
            <Feather
              name={chatLoading ? 'loader' : 'message-square'}
              size={18}
              color="#fff"
            />
          </TouchableOpacity>
          {isGuest ? (
            <TouchableOpacity
              onPress={() => dispatch(logout())}
              style={styles.applyButton}
            >
              <Text style={styles.applyText}>Login to Apply</Text>
            </TouchableOpacity>
          ) : isCreator ? (
            <TouchableOpacity
              onPress={() => setShowDeleteWarning(true)}
              style={[styles.applyButton, styles.deleteButton]}
              disabled={deleteLoading}
            >
              <Feather
                name={deleteLoading ? 'loader' : 'trash-2'}
                size={16}
                color="#fff"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.applyText}>
                {deleteLoading ? 'Deleting...' : 'Delete Job'}
              </Text>
            </TouchableOpacity>
          ) : !hideApply ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('BidPlacementScreen', { job: jobData })
              }
              style={styles.applyButton}
            >
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          ) : null}
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

      {/* Delete Warning Modal */}
      {showDeleteWarning && (
        <WarningWithButton
          message="Are you sure you want to delete this job? All pending bids will be cancelled."
          onYes={handleDeleteJob}
          onClose={() => setShowDeleteWarning(false)}
          yesText="Delete"
          noText="Cancel"
        />
      )}
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  iconButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },
  notificationDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },

  scrollContent: { paddingBottom: 100 },
  imageContainer: { position: 'relative', height: 200 },
  image: { width: '100%', height: '100%' },
  bookmarkButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(151, 149, 149, 0.33)',
    padding: 8,
    borderRadius: 999,
    zIndex: 10,
  },
  bookmarkIcon: { width: 23, height: 23, resizeMode: 'contain' },

  // Attachments Carousel Styles
  attachmentsContainer: {
    position: 'relative',
    height: 200,
    overflow: 'visible',
  },
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
  titleRow: {
    marginBottom: 12,
  },
  jobTitle: { fontSize: 22, fontWeight: '700', flex: 1, paddingRight: 8 },
  statusBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600' },

  metaRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 6,
  },
  metaText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },

  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: { fontSize: 12, color: '#4B5563', fontWeight: '600' },

  section: { marginTop: 16 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#111827',
  },
  sectionText: { fontSize: 12, lineHeight: 20, color: '#4B5563' },
  list: { marginLeft: 12 },
  listItem: { fontSize: 12, lineHeight: 20, color: '#4B5563', marginBottom: 2 },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailLabel: { flexDirection: 'row', alignItems: 'center' },
  detailLabelText: { fontSize: 12, fontWeight: '700', color: '#111827' },
  detailValue: { fontSize: 12, fontWeight: '500', color: '#111827' },
  locationValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 4,
  },
  budgetLabel: { fontSize: 12, fontWeight: '500', color: '#6B7280' },
  budgetValue: { fontSize: 16, fontWeight: '800', color: '#16A34A' },

  actions: { flexDirection: 'row', alignItems: 'center' },
  iconAction: {
    backgroundColor: '#111827',
    padding: 12,
    borderRadius: 999,
    marginRight: 8,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  applyText: { color: '#fff', fontSize: 12, fontWeight: '700', marginRight: 6 },
  applyArrow: { color: '#fff', fontSize: 18, lineHeight: 18 },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#666' },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: { fontSize: 18, color: '#666', marginBottom: 20 },
  backButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
  },
  creatorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  starsRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 12, color: '#6B7280', marginLeft: 4 },
  urgentTag: {
    position: 'absolute',
    top: 12,
    right: -1,
  },

  urgentTagImage: {
    width: 75,
    height: 16,
  },

  urgentText: {
    position: 'absolute',
    right: 20,
    top: 1,
    fontSize: 10,
    color: Colors.whiteColor,
    fontWeight: '700',
  },
});

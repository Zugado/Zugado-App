import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { Colors } from '../styles/commonStyles';
import { selectWishlistIds } from '../store/selector';
import { handleWishlistToggle } from '../utils/wishlistUtils';
import { useSnackbar } from '../contexts/SnackbarContext';
import { getRelativeTime } from '../utils/timeUtils';
import { formatDistance } from '../utils/distanceUtils';
import { getLocationFromCoordinates } from '../utils/locationUtils';
import DotLoader from './DotLoader';
import { trimText } from '../utils/commonMethods';
// Chat thunk — used to initiate or retrieve an existing conversation before navigating
import { startNewChat } from '../store/thunks/chatThunk';

const JobCard = ({ job, showButttons = true }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const wishlistIds = useSelector(selectWishlistIds);
  const { showSnackbar } = useSnackbar();
  const [isScrolling, setIsScrolling] = useState(false);
  const [cityName, setCityName] = useState('');
  const [isLoadingCity, setIsLoadingCity] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [jobData, setJobData] = useState(job);
  const [jobLoading, setJobLoading] = useState(false);

  // useEffect(() => {
  //   if (job ) {
  //     // only jobId passed, fetch full data
  //     //  console.log("job ==>",job)
  //     setJobLoading(true);
  //     dispatch(getJobById(job?._id))
  //       .then(res => {
  //         if (res.payload?.success) setJobData(res.payload.data);
  //         // console.log("job data on card==>",JSON.stringify(res.payload.data,null,2));
  //       })
  //       .finally(() => setJobLoading(false));
  //   } else {
  //     setJobLoading(false);
  //   }
  // }, [job]);

  const isWishlisted = wishlistIds.includes(jobData?._id);
  const isUrgent = jobData?.jobType === 'quick';
  const { width } = Dimensions.get('window');
  const cardWidth = width - 30;

  const imageList = jobData?.attachments?.map(a => a.url);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems?.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 60,
  }).current;

  const onWishlistToggle = () => {
    handleWishlistToggle(dispatch, jobData?._id, isWishlisted, showSnackbar);
  };

  const handleChatPress = async () => {
    if (chatLoading || !jobData?.createdBy?._id) return;
    setChatLoading(true);
    try {
      const result = await dispatch(
        startNewChat({ jobId: jobData._id, participantId: jobData.createdBy._id }),
      ).unwrap();
      if (result?.data) {
        navigation.navigate('ChatingScreen', { chatData: result.data });
      }
    } catch (err) {
      showSnackbar('Could not open chat. Try again.', 'error');
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    if (jobData?.location?.coordinates) {
      setIsLoadingCity(true);
      const timer = setTimeout(() => {
        getLocationFromCoordinates(jobData.location.coordinates)
          .then(({ city }) => {
            setCityName(city);
            setIsLoadingCity(false);
          })
          .catch(() => setIsLoadingCity(false));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [jobData?.location?.coordinates]);

  const getLocationDisplay = () => {
    if (jobData?.locationType === 'remote') return 'Remote';
    if (isLoadingCity) return null;
    if (cityName && jobData?.distanceFromUser !== null && jobData?.distanceFromUser !== undefined) {
      return `${cityName} - ${formatDistance(jobData.distanceFromUser)}`;
    }
     if ( jobData?.distanceFromUser !== null && jobData?.distanceFromUser !== undefined) {
      return `${formatDistance(jobData?.distanceFromUser)}`;
    }
    return 'Distance N/A';
  };

  if (jobLoading) {
    return (
      <View style={[styles.cardContainer, { height: 120, justifyContent: 'center', alignItems: 'center' }]}>
        <DotLoader color="#000" size={6} />
      </View>
    );
  }

  return (
    <View style={styles.cardContainer}>
      {/* ---------- IMAGE SLIDER ---------- */}
      {imageList?.length > 0 && (
        <View>
          <FlatList
            ref={sliderRef}
            data={imageList}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={showButttons ? 1 : 0.7}
                disabled={!showButttons}
                onPress={() => showButttons && navigation.navigate('JobDetailedScreen', { jobId: jobData?._id })}
              >
                <Image
                  source={{ uri: item }}
                  style={[styles.cardImage, { width: cardWidth }]}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
          />
          {/* Dots */}
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.91)']}
            style={styles.gradientOverlay}
          >
            <View style={styles.overlayContent}>
              <View style={styles.infoRow}>
                <MaterialIcons name="watch-later" style={styles.locationIcon} />
                <Text style={styles.overlayText}>
                  {jobData?.createdAt ? getRelativeTime(jobData.createdAt) : '23 hrs left'}
                </Text>
              </View>
              {imageList?.length > 1 && (
                <View style={styles.dotsWrapper}>
                  {imageList?.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.dot,
                        index === currentIndex && styles.activeDot,
                      ]}
                    />
                  ))}
                </View>
              )}
              <View style={styles.infoRow}>
                <MaterialIcons name="location-on" style={styles.locationIcon} />
                {isLoadingCity ? (
                  <DotLoader color="#fff" size={4} />
                ) : (
                  <Text style={styles.overlayText}>{getLocationDisplay()}</Text>
                )}
              </View>
            </View>
          </LinearGradient>
        </View>
      )}
      {/* ---------- This is to make height ---------- */}
      {imageList?.length === 0 && <View style={styles.emptyImageHeight} />}
      {/* ---------- URGENT TAG ---------- */}
      {isUrgent && (
        <View style={styles.urgentTag}>
          <Image
            source={require('../assets/Icons/urgentTag.png')}
            style={styles.urgentTagImage}
          />
          <Text style={styles.urgentText}>Urgent</Text>
        </View>
      )}

      {/* ---------- SAVE BUTTON ---------- */}
      <TouchableOpacity style={styles.saveTag} onPress={onWishlistToggle}>
        <Image
          source={
            isWishlisted
              ? require('../assets/Icons/SavedGolden.png')
              : require('../assets/Icons/SavedBlack.png')
          }
          style={styles.saveTagImage}
        />
      </TouchableOpacity>

      {/* ---------- CONTENT ---------- */}
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={!showButttons}
        onPress={() => showButttons && navigation.navigate('JobDetailedScreen', { jobId: jobData?._id })}
      >
        <View style={styles.contentContainer}>
          {/* Title + Price */}
          <View style={styles.row}>
            <Text style={styles.title}>{trimText(jobData?.title, 40) || 'Job Title'}</Text>
            <Text style={styles.price}>
              {jobData?.amount?.disclose && jobData?.amount?.max ? `₹ ${jobData.amount.max}` : 'Not disclosed'}
            </Text>
          </View>

          {/* Description */}
          <Text style={styles.description}>{jobData?.description || 'No description available'}</Text>

          <View style={styles.badgeRow}>
            {jobData?.jobType && (
              <View style={styles.badge}>
                <Feather name="zap" size={11} color="#fff" />
                <Text style={styles.badgeText}>{jobData.jobType.charAt(0).toUpperCase() + jobData.jobType.slice(1)}</Text>
              </View>
            )}
            {jobData?.timingType && (
              <View style={[styles.badge, { backgroundColor: '#6B7280' }]}>
                <Feather name="clock" size={11} color="#fff" />
                <Text style={styles.badgeText}>{jobData.timingType.charAt(0).toUpperCase() + jobData.timingType.slice(1)}</Text>
              </View>
            )}
          </View>

          {/* this is the place to put location for without image card */}
          {imageList?.length === 0 && (
            <View style={styles.noImageInfoContainer}>
              <View style={styles.infoRow}>
                <MaterialIcons name="watch-later" style={styles.noImageIcon} />
                <Text style={styles.noImageText}>{jobData?.createdAt ? getRelativeTime(jobData.createdAt) : '23 hrs left'}</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons name="location-on" style={styles.noImageIcon} />
                {isLoadingCity ? (
                  <DotLoader color="#000" size={4} />
                ) : (
                  <Text style={styles.noImageText}>{getLocationDisplay()}</Text>
                )}
              </View>
            </View>
          )}
          
          {/* Vendor + Ratings */}
          <View style={styles.row}>
            <Text style={styles.vendorName}>
              {jobData?.createdBy ? `${jobData.createdBy.firstName} ${jobData.createdBy.lastName}` : 'Unknown'}
            </Text>
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" style={styles.starIcon} />
              <Text style={styles.ratingText}>
                {jobData?.creatorRating !== undefined && jobData?.creatorRating !== null ? jobData.creatorRating : 'N/A'}
              </Text>
            </View>
          </View>

          {/* Buttons */}
          {!showButttons && <View style={{ marginVertical: 4 }} />}

          {showButttons && (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.bidButton}
                onPress={() => navigation.navigate('BidPlacementScreen', { job: jobData })}
              >
                <Text style={styles.bidButtonText}>Bid</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.chatButton}
                onPress={handleChatPress}
                disabled={chatLoading}
              >
                <Text style={styles.chatButtonText}>
                  {chatLoading ? '...' : 'Chat'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    marginHorizontal: 15,
    marginVertical: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  // ---------- IMAGE SLIDER ----------
  cardImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  dotsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ---------- GRADIENT OVERLAY ----------
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },

  overlayContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  overlayText: {
    color: Colors.whiteColor,
    fontWeight: '700',
    fontSize: 12,
  },

  // ---------- NO IMAGE STYLES ----------
  emptyImageHeight: {
    height: 30,
  },

  noImageInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  noImageIcon: {
    color: Colors.blackColor,
    fontSize: 16,
    marginRight: 5,
  },

  noImageText: {
    color: Colors.grayColor,
    fontWeight: '700',
    fontSize: 12,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.whiteColor,
    marginHorizontal: 4,
  },

  activeDot: {
    width: 9,
    height: 9,
    backgroundColor: '#ff8808ff',
  },

  // ---------- TAGS ----------
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

  saveTag: {
    position: 'absolute',
    top: 12,
    left: 15,
  },

  saveTagImage: {
    width: 18,
    height: 20,
  },

  // ---------- CONTENT ----------
  contentContainer: {
    padding: 12,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },

  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginRight: 8,
  },

  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
  },

  description: {
    color: '#555',
    fontSize: 12,
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#111827',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },

  locationIcon: {
    color: '#ffffffff',
    fontSize: 20,
    marginRight: 5,
  },

  locationText: {
    color: '#888',
    fontSize: 12,
  },

  vendorName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  starIcon: {
    color: '#ff8808ff',
    fontSize: 12,
    marginRight: 4,
  },

  ratingText: {
    color: '#666',
    fontSize: 12,
  },

  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
  },

  bidButton: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 25,
    paddingVertical: 8,
    alignItems: 'center',
    marginRight: 8,
  },

  bidButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  chatButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingVertical: 8,
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: '#fff',
  },

  chatButtonText: {
    color: '#444',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default JobCard;

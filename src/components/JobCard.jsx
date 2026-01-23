// components/JobCard.js
import React, { useRef, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { Colors } from '../styles/commonStyles';
import { selectWishlistIds } from '../store/selector';
import { handleWishlistToggle } from '../utils/wishlistUtils';
import { useSnackbar } from '../contexts/SnackbarContext';
import { getRelativeTime } from '../utils/timeUtils';

const JobCard = ({ job }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const wishlistIds = useSelector(selectWishlistIds);
  const { showSnackbar } = useSnackbar();
  const [isScrolling, setIsScrolling] = useState(false);

  const isWishlisted = wishlistIds.includes(job?._id);
  const isUrgent = job?.jobType === 'quick' || job?.jobType !== 'standard';
  const { width } = Dimensions.get('window');
  const cardWidth = width - 30; // Account for margins

  const imageList =
    job?.attachments?.length > 0
      ? job.attachments.map(a => a.url)
      : [
          'https://images.unsplash.com/photo-1766068472854-3184eda0d376?q=80',
          'https://images.unsplash.com/photo-1761839256951-10c4468c3621?q=80',
          'https://plus.unsplash.com/premium_photo-1765927690120-94a4484a90a8?q=80',
        ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 60,
  }).current;

  const onWishlistToggle = () => {
    handleWishlistToggle(dispatch, job?._id, isWishlisted, showSnackbar);
  };

  return (
    <View style={styles.cardContainer}>
      {/* ---------- IMAGE SLIDER ---------- */}
      {imageList.length > 0 && (
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
                activeOpacity={1}
                onPress={() => {
                  navigation.navigate('JobDetailedScreen', { jobId: job?._id  });
                }}
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
                <Text style={styles.overlayText}>{job?.createdAt ? getRelativeTime(job.createdAt) : "23 hrs left"}</Text>
              </View>
              {imageList.length > 1 && (
                <View style={styles.dotsWrapper}>
                  {imageList.map((_, index) => (
                    <View
                      key={index}
                      style={[styles.dot, index === currentIndex && styles.activeDot]}
                    />
                  ))}
                </View>
              )}
              <View style={styles.infoRow}>
                <MaterialIcons name="location-on" style={styles.locationIcon} />
                <Text style={styles.overlayText}>
                  {job?.location?.address || 'Location 500 m'}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      )}
      {/* ---------- This is to make height ---------- */}
      {imageList.length === 0 && <View style={styles.emptyImageHeight} />}
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
        onPress={() =>
          navigation.navigate('JobDetailedScreen', { jobId: job?._id })
        }
      >
        <View style={styles.contentContainer}>
          {/* Title + Price */}
          <View style={styles.row}>
            <Text style={styles.title}>{job?.title || 'Job Title'}</Text>

            <Text style={styles.price}>
              {job?.amount?.disclose && job?.amount?.value
                ? `₹ ${job.amount.value}`
                : 'Price on request'}
            </Text>
          </View>

          {/* Description */}
          <Text style={styles.description}>
            {job?.description || 'No description available'}
          </Text>

          {/* this is the place to put location for without image card */}
          {imageList.length === 0 && (
            <View style={styles.noImageInfoContainer}>
              <View style={styles.infoRow}>
                <MaterialIcons name="watch-later" style={styles.noImageIcon} />
                <Text style={styles.noImageText}>{job?.createdAt ? getRelativeTime(job.createdAt) : "23 hrs left"}</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons name="location-on" style={styles.noImageIcon} />
                <Text style={styles.noImageText}>
                    
                
                  {job?.location?.address || 'Location 500 m'}
                </Text>
              </View>
            </View>
          )}
          {/* Vendor + Ratings */}
          <View style={styles.row}>
            <Text style={styles.vendorName}>
              {job?.createdBy
                ? `${job.createdBy.firstName} ${job.createdBy.lastName}`
                : 'Unknown'}
            </Text>

            <View style={styles.ratingContainer}>
              <FontAwesome name="star" style={styles.starIcon} />
              <Text style={styles.ratingText}>4.9 (2.2K)</Text>
            </View>
          </View>

          {/* Buttons */}
        
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.bidButton}
              onPress={() => console.log('Bid clicked')}
            >
              <Text style={styles.bidButtonText}>Bid</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => console.log('Chat clicked')}
            >
              <Text style={styles.chatButtonText}>Chat</Text>
            </TouchableOpacity>
          </View>
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
    marginVertical: 10,
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
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
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

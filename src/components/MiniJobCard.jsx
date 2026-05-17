// components/JobCard.js
import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from '../contexts/SnackbarContext';
import { selectWishlistIds } from '../store/selector';
import { Colors } from '../styles/commonStyles';
import { trimText } from '../utils/commonMethods';
import { getRelativeTime } from '../utils/timeUtils';
import { handleWishlistToggle } from '../utils/wishlistUtils';

const MiniJobCard = ({ jobData }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // console.log('Received jobData in MiniJobCard:', JSON.stringify(jobData, null, 2));
  const wishlistIds = useSelector(selectWishlistIds);
  const { showSnackbar } = useSnackbar();
  const [isScrolling, setIsScrolling] = useState(false);

  const job = jobData?.job;
  const isWishlisted = wishlistIds.includes(job?._id);
  const isUrgent = job?.jobType === 'quick';
  const { width } = Dimensions.get('window');
  const cardWidth = width - 30; // Account for margins

  const imageList = [
    // 'https://images.unsplash.com/photo-1766068472854-3184eda0d376?q=80',
    // 'https://images.unsplash.com/photo-1761839256951-10c4468c3621?q=80',
    // 'https://plus.unsplash.com/premium_photo-1765927690120-94a4484a90a8?q=80',
    // 'https://images.unsplash.com/photo-1766068472854-3184eda0d376?q=80',
    // 'https://images.unsplash.com/photo-1761839256951-10c4468c3621?q=80',
    // 'https://plus.unsplash.com/premium_photo-1765927690120-94a4484a90a8?q=80',
  ];

  const displayImages = imageList.map((image, index) => ({
    id: index,
    url: image,
  }));
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
      {isUrgent && (
        <View style={styles.urgentTag}>
          <Image
            source={require('../assets/Icons/urgentTag.png')}
            style={styles.urgentTagImage}
          />
          <Text style={styles.urgentText}>Urgent</Text>
        </View>
      )}

      {/* ---------- CONTENT ---------- */}
      <View>
        <View style={styles.contentContainer}>
          {/* Title + Price */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text ellipsizeMode="tail" numberOfLines={1} style={styles.title}>
              {trimText(job?.title, 40) || 'Job Title'}
            </Text>
          </View>

          <View style={{ flexDirection: 'column', marginTop: 4, gap: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons name="location-on" style={styles.locationIcon} />
              <Text style={styles.overlayText}>
                {job?.location?.address || 'Location 500 m'}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons
                name="watch-later"
                style={[styles.locationIcon, { fontSize: 16, marginLeft: 2 }]}
              />
              <Text style={styles.overlayText}>
                {job?.createdAt
                  ? getRelativeTime(job.createdAt)
                  : '23 hrs left'}
              </Text>
            </View>
          </View>

          {/* Buttons */}

          <View style={styles.buttonRow}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              {displayImages.map((image, index) => (
                <View
                  key={image.id}
                  style={[
                    styles.miniImagesContainer,
                    { marginLeft: index > 0 ? -10 : 0 },
                  ]}
                >
                  <Image source={{ uri: image.url }} style={styles.miniImage} />
                </View>
              ))}
            </View>

            <View style={styles.detailButton}>
              <Text style={styles.detailButtonText}>View Detail</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 15,
    marginVertical: 2,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
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
  contentContainer: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  overlayText: {
    color: Colors.blackColor,
    fontSize: 12,
    flex: 1,
    flexWrap: 'wrap',
  },
  locationIcon: {
    color: Colors.grayColor,
    fontSize: 20,
    marginRight: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  detailButton: {
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingVertical: 6,
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: '#fff',
  },
  detailButtonText: {
    color: '#444',
    fontWeight: '700',
    fontSize: 12,
  },
  miniImagesContainer: {
    height: 30,
    width: 30,
    backgroundColor: Colors.lightGrayColor,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.whiteColor,
    borderWidth: 2,
  },
  miniImage: {
    height: 28,
    width: 28,
    borderRadius: 14,
  },
});

export default MiniJobCard;

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../styles/commonStyles';
import { getRelativeTime } from '../utils/timeUtils';
import { CommonAppBar } from '../components/CommonComponents';
import Feather from 'react-native-vector-icons/Feather';

const CreatedByMeJobDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { jobData } = route.params || {};
  console.log('Received jobData: ManageJobDetailScreen==>', jobData);

  const job = jobData?.job;
  const bid = jobData?.bids?.[0];
  console.log('Extracted job:', job);
  console.log('Extracted bid:', bid);
  const bidStatus = bid?.status || 'pending';
  const isUrgent = job?.jobType === 'quick';

  const displayImages = [
    'https://images.unsplash.com/photo-1766068472854-3184eda0d376?q=80',
    'https://images.unsplash.com/photo-1761839256951-10c4468c3621?q=80',
    'https://plus.unsplash.com/premium_photo-1765927690120-94a4484a90a8?q=80',
  ].map((url, index) => ({ id: index, url }));

  const JobInfoSection = ({ children }) => (
    <View style={styles.cardContainer}>
      <View style={styles.contentContainer}>{children}</View>
    </View>
  );

  const InfoRow = ({ icon, text, iconStyle }) => (
    <View style={styles.infoRow}>
      <MaterialIcons name={icon} style={[styles.locationIcon, iconStyle]} />
      <Text style={styles.overlayText}>{text}</Text>
    </View>
  );

  const ImageGallery = () => (
    <View style={styles.imageGallery}>
      {displayImages?.map((image, index) => (
        <View
          key={image?.id}
          style={[
            styles.miniImagesContainer,
            { marginLeft: index > 0 ? -30 : 0 },
          ]}
        >
          <Image
            source={{ uri: image?.url }}
            style={styles.miniImage}
            resizeMode="cover"
          />
        </View>
      ))}
    </View>
  );

  const VendorInfo = () => (
    <View style={styles.vendorContainer}>
      <Text style={styles.vendorName}>Vendor Name</Text>
      <Text style={styles.vendorService}>Service name</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.bodyBackColor}
      />
      <CommonAppBar
        borderBottomColor={Colors.whiteColor}
        navigation={navigation}
        title="Posted Job Detail"
      />

      {/* Job Details Card */}
      <JobInfoSection>
        {isUrgent && (
          <View style={styles.urgentTag}>
            <Image
              source={require('../assets/Icons/urgentTag.png')}
              style={styles.urgentTagImage}
            />
            <Text style={styles.urgentText}>Urgent</Text>
          </View>
        )}

        <Text style={styles.title}>{job?.title || 'Job Title'}</Text>

        <View style={styles.infoContainer}>
          <InfoRow
            icon="location-on"
            text={job?.location?.address || 'Location not available'}
          />
          <InfoRow
            icon="watch-later"
            text={job?.createdAt ? getRelativeTime(job?.createdAt) : 'N/A'}
            iconStyle={{ fontSize: 16, marginLeft: 2 }}
          />
        </View>

        <View style={styles.buttonRow}>
          <ImageGallery />
          <VendorInfo />
        </View>

        <Text style={styles.description}>
          {job?.description || 'No description available'}
        </Text>
      </JobInfoSection>

      {/* Bid Status Header */}
      <Text style={styles.bidHeader}>
        Your Bids
        {/* <Text style={styles.bidStatus}></Text> */}
      </Text>
      {workers?.()}
      {workers?.()}
      {workers?.()}
    </ScrollView>
  );
  function workers() {
    return (
      <View style={styles.bidCard}>
        {/* Header Section with Avatar and Time */}
        <View style={styles.bidCardHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Feather name="user" size={20} color="#fff" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>User Name</Text>
              <Text style={styles.userPhone}>+91 970857168</Text>
            </View>
          </View>

          {/* Negotiation Status Badge */}
          <View>
            <View
              style={[
                styles.negotiationBadge,
                bid?.isNegotiable
                  ? styles.negotiableBadge
                  : styles.nonNegotiableBadge,
              ]}
            >
              <View
                style={[
                  styles.negotiationDot,
                  bid?.isNegotiable
                    ? { backgroundColor: '#4CAF50' }
                    : { backgroundColor: '#FF7043' },
                ]}
              />
              <Text style={styles.negotiationText}>
                {bid?.isNegotiable ? 'Negotiable' : 'Not Negotiable'}
              </Text>
            </View>
          </View>
        </View>

        {/* Bid Details Section */}
        <View style={styles.bidDetailsSection}>
          <View style={styles.bidDetailRow}>
            <Text style={styles.bidLabel}>Bid Amount</Text>
            <Text style={styles.bidAmount}>₹ 500</Text>
          </View>

          <View style={styles.divider} />
          <View style={styles.bidDetailRow}>
          <Text style={styles.timeAgo}>Created At : 2h ago</Text>
          <Text style={styles.timeAgo}>Updated At : 2h ago</Text>
          </View>
           <View style={styles.divider} />
          <View style={styles.messageSection}>
            <Text style={styles.messageLabel}>Message</Text>
            <Text style={styles.messageText}>
              I can do this job for you. Please consider my bid.
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.bidActionsContainer}>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.acceptBidButton}>
              <Feather name="check" size={14} color="#fff" />
              <Text style={styles.acceptBidText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rejectBidButton}>
              <Feather name="x" size={14} color="#333" />
              <Text style={styles.rejectBidText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
};

export default CreatedByMeJobDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bodyBackColor,
    paddingHorizontal: 16,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginVertical: 2,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  contentContainer: {
    padding: 12,
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
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  infoContainer: {
    flexDirection: 'column',
    marginTop: 4,
    gap: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overlayText: {
    color: Colors.blackColor,
    fontSize: 12,
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
  imageGallery: {
    flexDirection: 'row',
  },
  miniImagesContainer: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.whiteColor,
    borderWidth: 2,
  },
  miniImage: {
    height: 40,
    width: 60,
    borderRadius: 14,
  },
  vendorContainer: {
    flexDirection: 'column',
    marginLeft: 10,
    flex: 1,
    justifyContent: 'center',
  },
  vendorName: {
    fontSize: 12,
    fontWeight: '700',
  },
  vendorService: {
    fontSize: 12,
    color: Colors.grayColor,
  },
  description: {
    fontSize: 10,
    color: Colors.grayColor,
    marginTop: 10,
    marginBottom: 8,
  },
  actionButtonsRow: {
    flexDirection: 'row',
  },
  AcceptButton: {
    paddingHorizontal: 14,
    borderWidth: 1,
    flex: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: Colors.primary,
  },
  AcceptButtonText: {
    color: Colors.whiteColor,
    fontWeight: '700',
    fontSize: 12,
  },
  RejectButton: {
    flex: 1,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: Colors.whiteColor,
  },
  RejectButtonText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 12,
  },
  bidHeader: {
    fontSize: 14,
    fontWeight: '700',
    marginVertical: 10,
  },
  bidStatus: {
    color: Colors.grayColor,
    fontWeight: '500',
  },
  statusBanner: {
    marginTop: 10,
    marginBottom: 8,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  statusTitle: {
    fontWeight: '700',
    fontSize: 14,
  },
  statusSubtitle: {
    fontWeight: '500',
    fontSize: 12,
  },
  proposalTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginVertical: 4,
  },
  editBidButton: {
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // backgroundColor:"#c17676",
    borderTopColor: Colors.extraLightGrayColor,
    paddingTop: 10,
    marginTop: 10,
  },
  NegotiableText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '500',
    color: Colors.blackColor,
  },
  mainActionButton: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainActionButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  refundText: {
    fontSize: 14,
    textAlign: 'center',
    color: Colors.grayColor,
  },
  refundBold: {
    color: Colors.secondary,
    fontWeight: '700',
  },
  // Beautiful Bid Card Styles
  bidCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  bidCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 12,
    color: Colors.grayColor,
    fontWeight: '500',
  },
  timeAgo: {
    fontSize: 12,
    color: Colors.grayColor,
    fontWeight: '500',
    paddingVertical: 2,
  },
  bidDetailsSection: {
    marginBottom: 14,
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 12,
  },
  bidDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bidLabel: {
    fontSize: 12,
    color: Colors.grayColor,
    fontWeight: '500',
  },
  bidAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  messageSection: {
    marginTop: 8,
  },
  messageLabel: {
    fontSize: 11,
    color: Colors.grayColor,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  messageText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '400',
    lineHeight: 18,
  },
  negotiationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  negotiableBadge: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4CAF50',
  },
  nonNegotiableBadge: {
    backgroundColor: '#ffebee',
    borderColor: '#FF7043',
  },
  negotiationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  negotiationText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
  },
  bidActionsContainer: {
    gap: 10,
  },
  viewProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  viewProfileText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  acceptBidButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  acceptBidText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  rejectBidButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    gap: 6,
  },
  rejectBidText: {
    color: '#333',
    fontWeight: '700',
    fontSize: 12,
  },
});

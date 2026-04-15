import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../styles/commonStyles';
import { getRelativeTime } from '../utils/timeUtils';
import { CommonAppBar } from '../components/CommonComponents';
import MyStatusBar from '../components/MyStatusbar';
import Feather from 'react-native-vector-icons/Feather';

const MyBidStatusDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { jobData } = route.params || {};
  console.log('Received jobData: MyBidStatusDetailScreen==>', JSON.stringify(jobData, null, 2));

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

  const getBidStatusConfig = () => {
    if (bidStatus === 'accepted') {
      return {
        statusText: 'Accepted',
        congratsText: 'Congratulations!',
        backgroundColor: Colors.lightGreenColor,
        textColor: Colors.greenColor,
        buttonText: 'Mark this Job as Completed',
        buttonColor: Colors.greenColor,
        buttonDisabled: false,
      };
    } else if (bidStatus === 'rejected') {
      return {
        statusText: 'Rejected',
        congratsText: 'Oops !!',
        backgroundColor: Colors.lightOrangeColor,
        textColor: Colors.secondary,
        buttonText: 'Cancel Bid',
        buttonColor: Colors.secondary,
        buttonDisabled: false,
      };
    } else {
      return {
        statusText: 'Pending',
        congratsText: 'Under Review',
        backgroundColor: '#fef8e0',
        textColor: '#F59E0B',
        buttonText: 'Waiting for Response',
        buttonColor: '#c2c3c4',
        buttonDisabled: true,
      };
    }
  };

  const statusConfig = getBidStatusConfig();

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

  const ActionButtons = ({ showChat = true }) => (
    <View style={styles.actionButtonsRow}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('JobDetailedScreen', { jobId: job?._id })
        }
        style={styles.detailButton}
      >
        <Text style={styles.detailButtonText}>View Detail</Text>
      </TouchableOpacity>
      {showChat && (
        <TouchableOpacity style={styles.chatButton}>
          <Text style={styles.chatButtonText}>Chat</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const BidStatusBanner = () => (
    <View
      style={[
        styles.statusBanner,
        { backgroundColor: statusConfig.backgroundColor },
      ]}
    >
      <Text style={[styles.statusTitle, { color: statusConfig.textColor }]}>
        {statusConfig.congratsText}{" "}
        <Text
          style={[styles.statusSubtitle, { color: statusConfig.textColor }]}
        >
          Your Bid has been {" "}{statusConfig.statusText}
        </Text>
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <MyStatusBar backgroundColor={Colors.bodyBackColor} barStyle="dark-content" />
      <ScrollView style={styles.container}>
      <CommonAppBar
        borderBottomColor={Colors.whiteColor}
        navigation={navigation}
        title="View Bid Details"
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

        {/* <View style={styles.buttonRow}>
          <ImageGallery />
          <VendorInfo />
        </View> */}

        <Text style={styles.description}>
          {job?.description || 'No description available'}
        </Text>

        <ActionButtons />
      </JobInfoSection>

      {/* Bid Status Header */}
      <Text style={styles.bidHeader}>
        Your Bid{' '}
        <Text style={styles.bidStatus}>({statusConfig.statusText})</Text>
      </Text>

      {/* Bid Details Card */}
      <JobInfoSection>
        <Text style={[styles.title, { fontSize: 24 }]}>
          ₹ {bid?.amount || 0}
        </Text>
        <Text
          style={{
            fontSize: 10,
            color: Colors.grayColor,
            position: 'absolute',
            right: 12,
            top: 12,
          }}
        >
          Updated {bid?.updatedAt ? getRelativeTime(bid.updatedAt) : 'N/A'}
        </Text>
        <InfoRow
          icon="circle"
          text={`Negotiable: ${bid?.isNegotiable ? 'Yes' : 'No'}`}
        />
        <BidStatusBanner />

        <Text style={styles.proposalTitle}>Your Proposal</Text>
        <Text style={styles.description}>
          {bid?.message || 'No proposal message'}
        </Text>

        {!(bidStatus === 'accepted') && (
          <TouchableOpacity   onPress={() => navigation.navigate('BidUpdateScreen', { job: jobData })} style={styles.editBidButton}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#9dd1c12a',
                paddingHorizontal: 8,
                paddingVertical: 6,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#a1a1a1',
               
              }}
            >
              <Feather name="edit-2" size={12} color={Colors.blackColor} />
              <Text style={styles.editBidText}>Edit Bid</Text>
            </View>
          </TouchableOpacity>
        )}
      </JobInfoSection>

      {/* Action Button */}
      <TouchableOpacity
        style={[
          styles.mainActionButton,
          {
            backgroundColor: statusConfig.buttonColor,
            borderColor: statusConfig.buttonColor,
            opacity: statusConfig.buttonDisabled ? 0.7 : 1,
          },
        ]}
        disabled={statusConfig.buttonDisabled}
      >
        <Text style={styles.mainActionButtonText}>
          {statusConfig.buttonText}
        </Text>
      </TouchableOpacity>

      <Text style={styles.refundText}>
        Your Bid Will be Refunded If you{' '}
        <Text style={styles.refundBold}>Cancel Now</Text>
      </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyBidStatusDetailScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bodyBackColor,
  },
  container: {
    flex: 1,
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
  detailButton: {
    paddingHorizontal: 14,
    borderWidth: 1,
    flex: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  detailButtonText: {
    color: '#444',
    fontWeight: '700',
    fontSize: 12,
  },
  chatButton: {
    flex: 1,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  chatButtonText: {
    color: '#ffffff',
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
    fontSize: 12,
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
  editBidText: {
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
});

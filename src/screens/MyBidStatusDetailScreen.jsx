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
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../styles/commonStyles';
import { getRelativeTime } from '../utils/timeUtils';
import { CommonAppBar } from '../components/CommonComponents';
import { WarningWithButton } from '../components/lottie/WarningWithButton';
import MyStatusBar from '../components/MyStatusbar';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import { getAllMyBids } from '../store/thunks/bidThunk';
import { startNewChat } from '../store/thunks/chatThunk';
import { useSnackbar } from '../contexts/SnackbarContext';

const MyBidStatusDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const [showCancelWarning, setShowCancelWarning] = useState(false);
  const [showMarkCompletedWarning, setShowMarkCompletedWarning] =
    useState(false);
  const { jobData } = route.params || {};
  const [chatLoading, setChatLoading] = useState(false);
  const job = jobData?.job;
  const jobId = job?._id;
  const { showSnackbar } = useSnackbar();
  console.log(
    'MyBidStatusDetailScreen received jobData:',
    JSON.stringify(jobData, null, 2),
  );
  // Always read the live bid from Redux so edits are reflected immediately on back-navigate.
  // Fall back to route.params bid only if Redux hasn't loaded yet.
  const myAllBids = useSelector(state => state.job.myAllBids || []);
  const liveBidEntry = myAllBids.find(
    item => item?.job?._id === jobId || item?.job === jobId,
  );
  const bid = liveBidEntry?.bids?.[0] ?? jobData?.bids?.[0];

  // Re-fetch on every focus so the data is always fresh (covers back-navigate from BidUpdateScreen)
  useFocusEffect(
    React.useCallback(() => {
      dispatch(getAllMyBids());
    }, [dispatch]),
  );

  const bidStatus = bid?.status || 'pending';
  const isUrgent = job?.jobType === 'quick';


  const getBidStatusConfig = () => {
    if (bidStatus === 'accepted' || bidStatus === 'approved') {
      return {
        statusText: 'Accepted',
        congratsText: 'Congratulations!',
        backgroundColor: Colors.lightGreenColor,
        textColor: Colors.greenColor,
        buttonText: 'Mark this Job as Completed',
        buttonColor: Colors.greenColor,
        buttonDisabled: false,
        method: () => setShowMarkCompletedWarning(true),
      };
    } else if (bidStatus === 'rejected') {
      return {
        statusText: 'Rejected',
        congratsText: 'Oops !!',
        backgroundColor: Colors.lightOrangeColor,
        textColor: Colors.secondary,
        buttonText: 'Cancel Bid',
        buttonColor: Colors.secondary,
        buttonDisabled: true,
        method: () => setShowCancelWarning(true),
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
        method: null,
      };
    }
  };
  const handleCancelBid = () => {
    setShowCancelWarning(false);
    // TODO: dispatch cancel bid API
  };
  const handleMarkCompleted = () => {
    console.log('Marking job as completed...');
  };


  const statusConfig = getBidStatusConfig();
  /**
   * Initiate or retrieve an existing chat for this job.
   * POST /api/chat/initiate  { jobId, participantId: jobData.createdBy._id }
   * Navigates to ChatingScreen with the returned conversation object.
   */
  const handleChatPress = async () => {
    // console.log('Chat Pressed. Job Data:', jobData);
    if (chatLoading || !jobData?.job?.createdBy) return;
    setChatLoading(true);
    try {
      const result = await dispatch(
        startNewChat({
          jobId: jobData?.job?._id,
          participantId: jobData?.job?.createdBy,
        }),
      ).unwrap();
      if (result?.data) {
        //  console.log("Rendering chat item in job detail screen:", result.data);
        navigation.navigate('ChatingScreen', { chatData: result.data });
      }
    } catch (err) {
      console.log('Errror initiating chat:', err);
      showSnackbar('Could not open chat. Try again.', 'error');
    } finally {
      setChatLoading(false);
    }
  };

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

  const VendorInfo = () => (
    <View style={styles.vendorContainer}>
      <Text style={styles.vendorName}>Vendor Name</Text>
      <Text style={styles.vendorService}>Service name</Text>
    </View>
  );

  const ActionButtons = () => (
    <View style={styles.actionButtonsRow}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('JobDetailedScreen', { jobId: job?._id })
        }
        style={styles.detailButton}
      >
        <Text style={styles.detailButtonText}>View Detail</Text>
      </TouchableOpacity>
      {bidStatus !== 'rejected' && (
        <TouchableOpacity style={styles.chatButton} onPress={handleChatPress}>
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
        {statusConfig.congratsText}{' '}
        <Text
          style={[styles.statusSubtitle, { color: statusConfig.textColor }]}
        >
          Your Bid has been {statusConfig.statusText}
        </Text>
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <MyStatusBar
        backgroundColor={Colors.bodyBackColor}
        barStyle="dark-content"
      />
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

          {!(bidStatus === 'accepted' || bidStatus === 'approved') && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('BidUpdateScreen', { job: jobData })
              }
              style={styles.editBidButton}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#9dd1c12a',
                  paddingHorizontal: 10,
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
        {!statusConfig.buttonDisabled && (
          <TouchableOpacity
            onPress={statusConfig.method}
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
        )}

        {/* Cancel row — hidden when bid is accepted */}
        {/* {((bidStatus !== 'accepted'&& bidStatus !== 'approved') && bidStatus !== 'rejected') && (
          <View style={styles.refundRow}>
            <Text style={styles.refundText}>
              Your Bid Will be Refunded If you{' '}
            </Text>
            <TouchableOpacity onPress={() => setShowCancelWarning(true)}>
              <Text style={styles.refundBold}>Cancel Now</Text>
            </TouchableOpacity>
          </View>
        )} */}
      </ScrollView>
      {showCancelWarning && (
        <WarningWithButton
          message="Are you sure you want to cancel your bid?"
          onYes={handleCancelBid}
          onClose={() => setShowCancelWarning(false)}
        />
      )}
      {showMarkCompletedWarning && (
        <WarningWithButton
          message="Are you sure you want to mark this job as completed?"
          onYes={handleMarkCompleted}
          onClose={() => setShowMarkCompletedWarning(false)}
        />
      )}
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
  refundRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  refundText: {
    fontSize: 14,
    color: Colors.grayColor,
  },
  refundBold: {
    color: Colors.secondary,
    fontWeight: '700',
  },
});

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../styles/commonStyles';
import { getRelativeTime } from '../utils/timeUtils';
import { CommonAppBar } from '../components/CommonComponents';
import MyStatusBar from '../components/MyStatusbar';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch } from 'react-redux';
import { getAllBidsByJobId, updateBidStatus } from '../store/thunks/bidThunk';
import { startNewChat } from '../store/thunks/chatThunk';
import { useSnackbar } from '../contexts/SnackbarContext';

// ── Components defined OUTSIDE parent to avoid re-creation on every render ──

const JobInfoSection = ({ children }) => (
  <View style={styles.cardContainer}>
    <View style={styles.contentContainer}>{children}</View>
  </View>
);

const InfoRow = ({ icon, text, iconStyle }) => (
  <View style={styles.infoRow}>
    <MaterialIcons name={icon} style={[styles.locationIcon, iconStyle]} />
    <Text style={styles.overlayText} numberOfLines={2}>{text}</Text>
  </View>
);

const StatBadge = ({ label, value, color }) => (
  <View style={styles.statBadge}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

/**
 * BidCard — renders a single bid with bidder info, amount, status and action buttons.
 * Receives handleBidAction and actionLoading as props so it can trigger approve/reject.
 */
const BidCard = ({ bid, actionLoading, chatLoading, onAction, onChat }) => {
  const hasAvatar = !!bid?.bidder?.profilePicture;
  const isAccepting = actionLoading === `${bid._id}_approved`;
  const isRejecting = actionLoading === `${bid._id}_rejected`;
  const isActioning = isAccepting || isRejecting;

  const statusColor =
    bid?.status === 'approved'
      ? '#4CAF50'
      : bid?.status === 'rejected'
      ? '#FF5252'
      : '#FF9800';

  // Status badge background is statusColor at 10% opacity — computed once here
  const statusBgColor = `${statusColor}18`;

  return (
    <View style={styles.bidCard}>
      {/* ── Header: avatar + name + negotiable badge ── */}
      <View style={styles.bidCardHeader}>
        <View style={styles.avatarContainer}>
          {hasAvatar ? (
            <Image source={{ uri: bid.bidder.profilePicture }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarInitial}>
                {bid?.bidder?.name?.[0]?.toUpperCase() || '?'}
              </Text>
            </View>
          )}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{bid?.bidder?.name || 'Unknown'}</Text>
            <Text style={styles.userPhone}>
              {bid?.bidder?.mobile ? `+91 ${bid.bidder.mobile}` : bid?.bidder?.email || ''}
            </Text>
            <View style={styles.ratingRow}>
              <MaterialIcons name="star" size={12} color="#FFC107" />
              <Text style={styles.ratingText}>
                {bid?.bidder?.rating?.averageRating > 0
                  ? bid.bidder.rating.averageRating.toFixed(1)
                  : 'New'}
              </Text>
            </View>
          </View>
        </View>

        {/* Negotiable badge — uses pre-defined styles, no inline */}
        <View
          style={[
            styles.negotiationBadge,
            bid?.isNegotiable ? styles.negotiableBadge : styles.nonNegotiableBadge,
          ]}>
          <View
            style={[
              styles.negotiationDot,
              bid?.isNegotiable ? styles.dotGreen : styles.dotOrange,
            ]}
          />
          <Text style={styles.negotiationText}>
            {bid?.isNegotiable ? 'Negotiable' : 'Fixed'}
          </Text>
        </View>
      </View>

      {/* ── Bid details ── */}
      <View style={styles.bidDetailsSection}>
        <View style={styles.bidDetailRow}>
          <View>
            <Text style={styles.bidLabel}>Bid Amount</Text>
            <Text style={[styles.bidAmount, { color: Colors.primary }]}>₹ {bid?.amount}</Text>
          </View>
          {/* Status badge — color values come from statusColor computed above */}
          <View style={[styles.statusBadge, { backgroundColor: statusBgColor, borderColor: statusColor }]}>
            <Text style={[styles.statusBadgeText, { color: statusColor }]}>
              {bid?.status?.charAt(0).toUpperCase() + bid?.status?.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.bidDetailRow}>
          <Text style={styles.timeAgo}>
            Placed: {bid?.createdAt ? getRelativeTime(bid.createdAt) : 'N/A'}
          </Text>
          {bid?.isUpdated && (
            <Text style={styles.timeAgo}>
              Updated: {bid?.updatedAt ? getRelativeTime(bid.updatedAt) : 'N/A'}
            </Text>
          )}
        </View>

        {!!bid?.message && (
          <>
            <View style={styles.divider} />
            <View style={styles.messageSection}>
              <Text style={styles.messageLabel}>Proposal</Text>
              <Text style={styles.messageText}>{bid.message}</Text>
            </View>
          </>
        )}
      </View>

      {/* ── Action buttons — only for pending bids ── */}
      {bid?.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.acceptBidButton, isActioning && styles.buttonDisabled]}
            onPress={() => onAction(bid._id, 'approved')}
            disabled={isActioning}>
            {isAccepting
              ? <ActivityIndicator size="small" color="#fff" />
              : <Feather name="check" size={14} color="#fff" />}
            <Text style={styles.acceptBidText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.rejectBidButton, isActioning && styles.buttonDisabled]}
            onPress={() => onAction(bid._id, 'rejected')}
            disabled={isActioning}>
            {isRejecting
              ? <ActivityIndicator size="small" color="#333" />
              : <Feather name="x" size={14} color="#333" />}
            <Text style={styles.rejectBidText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Chat button — always visible so creator can message any bidder ── */}
      {(() => {
        const isChatInitiating = chatLoading === bid._id;
        return (
          <TouchableOpacity
            style={[styles.chatButton, isChatInitiating && styles.buttonDisabled]}
            onPress={() => onChat(bid)}
            disabled={isChatInitiating}
            activeOpacity={0.85}
          >
            {isChatInitiating ? (
              <ActivityIndicator size="small" color="#fff" style={styles.chatIconMargin} />
            ) : (
              <Feather name="message-circle" size={14} color="#fff" style={styles.chatIconMargin} />
            )}
            <Text style={styles.chatButtonText}>Chat with {bid?.bidder?.name?.split(' ')[0] || 'Bidder'}</Text>
          </TouchableOpacity>
        );
      })()}
    </View>
  );
};

// ── Main screen ───────────────────────────────────────────────────────────────

const CreatedByMeJobDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();

  const { jobData } = route.params || {};
  const jobFromNav = jobData?.job;

  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState(null);
  const [bids, setBids] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [actionLoading, setActionLoading] = useState(null);
  // track which bid chat is currently initiating (by bid._id)
  const [chatLoading, setChatLoading] = useState(null);

  useEffect(() => {
    if (jobFromNav?._id) fetchBids(jobFromNav._id);
  }, [jobFromNav?._id]);

  const fetchBids = useCallback(async (jobId) => {
    setLoading(true);
    try {
      const result = await dispatch(getAllBidsByJobId(jobId)).unwrap();
      if (result?.success) {
        setJob(result.data.job);
        setBids(result.data.bids || []);
        setStats({
          total: result.data.totalBids || 0,
          pending: result.data.pendingBids || 0,
          approved: result.data.approvedBids || 0,
          rejected: result.data.rejectedBids || 0,
        });
      }
    } catch (err) {
      console.error('[CreatedByMeJobDetailScreen] fetchBids error:', err);
      setJob(jobFromNav);
    } finally {
      setLoading(false);
    }
  }, [dispatch, jobFromNav]);

  // Initiate or open existing chat between creator and a specific bidder
  const handleChatWithBidder = async (bid) => {
    if (!bid?._id || chatLoading) return;
    setChatLoading(bid._id);
    try {
      const result = await dispatch(
        startNewChat({ jobId: job._id, participantId: bid.bidder._id }),
      ).unwrap();
      if (result?.data) {
        // This screen is the creator's job details — ensure the chat screen
        // knows the current user is the job creator so custom messaging is
        // unlocked immediately (some backend chat payloads omit creator id).
        navigation.navigate('ChatingScreen', { chatData: result.data, isCreator: true });
      }
    } catch (err) {
      showSnackbar('Could not open chat. Try again.', 'error');
    } finally {
      setChatLoading(null);
    }
  };

  const handleBidAction = async (bidId, status) => {
    setActionLoading(`${bidId}_${status}`);
    try {
      const result = await dispatch(updateBidStatus({ bidId, status })).unwrap();
      if (result?.success) {
        setBids(prev => prev.map(b => (b._id === bidId ? { ...b, status } : b)));
        setStats(prev => {
          const updated = { ...prev, pending: Math.max(0, prev.pending - 1) };
          if (status === 'approved') updated.approved += 1;
          else updated.rejected += 1;
          return updated;
        });
        showSnackbar(
          `Bid ${status === 'approved' ? 'accepted' : 'rejected'} successfully`,
          'success',
        );
      }
    } catch (err) {
      console.error('[CreatedByMeJobDetailScreen] handleBidAction error:', err);
      showSnackbar('Failed to update bid status. Try again.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const isUrgent = job?.jobType === 'quick';

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <MyStatusBar backgroundColor={Colors.bodyBackColor} barStyle="dark-content" />
        <CommonAppBar navigation={navigation} title="Created Task Details" />
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MyStatusBar backgroundColor={Colors.bodyBackColor} barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
      <CommonAppBar
        borderBottomColor={Colors.whiteColor}
        navigation={navigation}
        title="Created Task Details"
      />

      {/* Tap job card to open full task detail */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('JobDetailedScreen', { jobId: job?._id })}>
        <JobInfoSection>
          {isUrgent && (
            <View style={styles.urgentTag}>
              <Image source={require('../assets/Icons/urgentTag.png')} style={styles.urgentTagImage} />
              <Text style={styles.urgentText}>Urgent</Text>
            </View>
          )}

          <Text style={styles.title}>{job?.title || 'Job Title'}</Text>

          <View style={styles.infoContainer}>
            <InfoRow
              icon="location-on"
              text={job?.locationType === 'remote' ? 'Remote' : job?.location?.address || 'N/A'}
            />
            <InfoRow
              icon="watch-later"
              text={job?.createdAt ? getRelativeTime(job.createdAt) : 'N/A'}
              iconStyle={styles.smallIcon}
            />
            {job?.timingType && (
              <InfoRow
                icon="schedule"
                text={`${job.timingType} · ${job?.timingDetails?.estimatedHours || job?.timingDetails?.dailyHours || 'N/A'} hrs`}
                iconStyle={styles.smallIcon}
              />
            )}
          </View>

          <Text style={styles.description}>{job?.description || 'No description available'}</Text>

          <View style={styles.statsRow}>
            <StatBadge label="Total"    value={stats.total}    color={Colors.blackColor} />
            <StatBadge label="Pending"  value={stats.pending}  color="#FF9800" />
            <StatBadge label="Approved" value={stats.approved} color="#4CAF50" />
            <StatBadge label="Rejected" value={stats.rejected} color="#FF5252" />
          </View>
        </JobInfoSection>
      </TouchableOpacity>

      <Text style={styles.bidHeader}>
        Bids <Text style={styles.bidCount}>({stats.total})</Text>
      </Text>

      {bids.length === 0 ? (
        <View style={styles.emptyBids}>
          <Feather name="inbox" size={40} color={Colors.extraLightGrayColor} />
          <Text style={styles.emptyBidsText}>No bids yet</Text>
        </View>
      ) : (
        bids.map(bid => (
          <BidCard
            key={bid._id}
            bid={bid}
            actionLoading={actionLoading}
            chatLoading={chatLoading}
            onAction={handleBidAction}
            onChat={handleChatWithBidder}
          />
        ))
      )}

      <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreatedByMeJobDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bodyBackColor },
  loader: { marginTop: 40 },
  bottomSpacer: { height: 30 },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginVertical: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  contentContainer: { padding: 12 },
  urgentTag: { position: 'absolute', top: 12, right: -1 },
  urgentTagImage: { width: 75, height: 16 },
  urgentText: { position: 'absolute', right: 20, top: 1, fontSize: 10, color: Colors.whiteColor, fontWeight: '700' },
  title: { fontSize: 14, fontWeight: '700', color: '#1a1a1a' },
  infoContainer: { flexDirection: 'column', marginTop: 4, gap: 4 },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  overlayText: { color: Colors.blackColor, fontSize: 12, flex: 1 },
  locationIcon: { color: Colors.grayColor, fontSize: 20, marginRight: 5 },
  smallIcon: { fontSize: 16, marginLeft: 2 },
  description: { fontSize: 10, color: Colors.grayColor, marginTop: 10, marginBottom: 8 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statBadge: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '700' },
  statLabel: { fontSize: 10, color: Colors.grayColor, marginTop: 2 },
  bidHeader: { fontSize: 14, fontWeight: '700', marginVertical: 10 },
  bidCount: { color: Colors.grayColor, fontWeight: '500' },
  emptyBids: { alignItems: 'center', paddingVertical: 40, gap: 10 },
  emptyBidsText: { fontSize: 14, color: Colors.grayColor },
  bidCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  bidCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  avatarContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  avatar: { height: 48, width: 48, borderRadius: 24, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  avatarImage: { height: 48, width: 48, borderRadius: 24 },
  avatarInitial: { fontSize: 18, fontWeight: '700', color: '#fff' },
  userInfo: { flex: 1 },
  userName: { fontSize: 14, fontWeight: '700', color: '#1a1a1a', marginBottom: 2 },
  userPhone: { fontSize: 11, color: Colors.grayColor, fontWeight: '500' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 2 },
  ratingText: { fontSize: 11, color: Colors.grayColor, fontWeight: '600' },
  negotiationBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1 },
  negotiableBadge: { backgroundColor: '#e8f5e9', borderColor: '#4CAF50' },
  nonNegotiableBadge: { backgroundColor: '#ffebee', borderColor: '#FF7043' },
  negotiationDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  dotGreen: { backgroundColor: '#4CAF50' },
  dotOrange: { backgroundColor: '#FF7043' },
  negotiationText: { fontSize: 10, fontWeight: '600', color: '#333' },
  bidDetailsSection: { marginBottom: 14, backgroundColor: '#fafafa', borderRadius: 12, padding: 12 },
  bidDetailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bidLabel: { fontSize: 11, color: Colors.grayColor, fontWeight: '500', marginBottom: 2 },
  bidAmount: { fontSize: 18, fontWeight: '700' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#e0e0e0', marginVertical: 10 },
  timeAgo: { fontSize: 11, color: Colors.grayColor, fontWeight: '500' },
  messageSection: { marginTop: 4 },
  messageLabel: { fontSize: 10, color: Colors.grayColor, fontWeight: '600', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  messageText: { fontSize: 12, color: '#333', lineHeight: 18 },
  actionButtons: { flexDirection: 'row', gap: 10 },
  acceptBidButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 12, gap: 6, elevation: 2 },
  acceptBidText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  rejectBidButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', borderRadius: 12, paddingVertical: 12, borderWidth: 1.5, borderColor: '#e0e0e0', gap: 6 },
  rejectBidText: { color: '#333', fontWeight: '700', fontSize: 12 },
  chatButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, marginTop: 8 },
  chatButtonText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  chatIconMargin: { marginRight: 8 },
  buttonDisabled: { opacity: 0.6 },
});

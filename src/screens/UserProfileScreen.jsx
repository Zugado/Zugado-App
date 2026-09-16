import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../styles/commonStyles';
import MyStatusBar from '../components/MyStatusbar';

const HARDCODED = {
  jobType: 'Full-Time',
  workingModel: 'Remote',
  level: 'Advanced',
  rating: '4.8',
  totalJobs: 12,
  balance: '2,400',
  skills: ['Plumbing', 'Electrical', 'Carpentry', 'Painting'],
  bio: 'Experienced professional with a strong track record in delivering quality work on time. Available for both short-term and long-term projects.',
  memberSince: 'Jan 2023',
  completionRate: '96%',
};

const InfoChip = ({ icon, label, value }) => (
  <View style={styles.chip}>
    <Feather name={icon} size={14} color={Colors.grayColor} />
    <View style={styles.chipText}>
      <Text style={styles.chipLabel}>{label}</Text>
      <Text style={styles.chipValue}>{value}</Text>
    </View>
  </View>
);

const StatBox = ({ value, label }) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export default function UserProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = route.params || {};

  const firstName = user?.firstName || 'User';
  const lastName = user?.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim();
  const avatar = user?.avatar || null;
  const initial = firstName?.[0]?.toUpperCase() || '?';

  return (
    <SafeAreaView style={styles.safe}>
      <MyStatusBar />

      {/* ── Black header band ── */}
      <View style={styles.headerBand}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Avatar card ── */}
        <View style={styles.avatarCard}>
          <View style={styles.avatarWrap}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Text style={styles.avatarInitial}>{initial}</Text>
              </View>
            )}
            {/* verified dot */}
            <View style={styles.verifiedDot}>
              <Feather name="check" size={9} color="#fff" />
            </View>
          </View>

          <Text style={styles.name}>{fullName}</Text>

          {/* rating + member since */}
          <View style={styles.metaRow}>
            <View style={styles.ratingPill}>
              <FontAwesome name="star" size={11} color="#FF9529" />
              <Text style={styles.ratingText}>{HARDCODED.rating}</Text>
            </View>
            <View style={styles.dot} />
            <Text style={styles.memberText}>Member since {HARDCODED.memberSince}</Text>
          </View>
        </View>

        {/* ── Stats row ── */}
        <View style={styles.statsRow}>
          <StatBox value={HARDCODED.totalJobs} label="Jobs Done" />
          <View style={styles.statDivider} />
          <StatBox value={HARDCODED.completionRate} label="Completion" />
          <View style={styles.statDivider} />
          <StatBox value={`₹${HARDCODED.balance}`} label="Earned" />
        </View>

        {/* ── Bio ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{HARDCODED.bio}</Text>
        </View>

        {/* ── Info chips ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Details</Text>
          <View style={styles.chipsGrid}>
            <InfoChip icon="briefcase" label="Job Type" value={HARDCODED.jobType} />
            <InfoChip icon="monitor" label="Work Model" value={HARDCODED.workingModel} />
            <InfoChip icon="trending-up" label="Level" value={HARDCODED.level} />
            <InfoChip icon="award" label="Completion" value={HARDCODED.completionRate} />
          </View>
        </View>

        {/* ── Skills ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsWrap}>
            {HARDCODED.skills.map(skill => (
              <View key={skill} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Verification strip ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verification</Text>
          <View style={styles.verifyRow}>
            <View style={styles.verifyItem}>
              <View style={[styles.verifyIcon, { backgroundColor: '#e8f5e9' }]}>
                <Feather name="phone" size={14} color="#4CAF50" />
              </View>
              <Text style={styles.verifyLabel}>Mobile</Text>
              <Text style={[styles.verifyStatus, { color: '#4CAF50' }]}>Verified</Text>
            </View>
            <View style={styles.verifyItem}>
              <View style={[styles.verifyIcon, { backgroundColor: '#fff3e0' }]}>
                <MaterialCommunityIcons name="card-account-details-outline" size={14} color="#FF9800" />
              </View>
              <Text style={styles.verifyLabel}>ID</Text>
              <Text style={[styles.verifyStatus, { color: '#FF9800' }]}>Pending</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  headerBand: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#000',
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#fff' },

  scroll: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContent: { paddingBottom: 40 },

  // ── Avatar card ──
  avatarCard: {
    backgroundColor: '#000',
    alignItems: 'center',
    paddingBottom: 28,
    paddingTop: 4,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  avatarWrap: { position: 'relative', marginBottom: 12 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarFallback: {
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: { fontSize: 34, fontWeight: '700', color: '#fff' },
  verifiedDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  name: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  ratingText: { fontSize: 12, fontWeight: '700', color: '#FF9529' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#555' },
  memberText: { fontSize: 12, color: '#888' },

  // ── Stats ──
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800', color: '#000', marginBottom: 2 },
  statLabel: { fontSize: 11, color: Colors.grayColor },
  statDivider: { width: 1, backgroundColor: '#eee', marginVertical: 4 },

  // ── Sections ──
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  bioText: { fontSize: 13, color: '#444', lineHeight: 20 },

  // ── Chips ──
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: '47%',
    gap: 8,
  },
  chipText: { flex: 1 },
  chipLabel: { fontSize: 10, color: Colors.grayColor, marginBottom: 1 },
  chipValue: { fontSize: 13, fontWeight: '600', color: '#000' },

  // ── Skills ──
  skillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillTag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  skillText: { fontSize: 12, fontWeight: '500', color: '#333' },

  // ── Verification ──
  verifyRow: { flexDirection: 'row', gap: 12 },
  verifyItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 10,
    gap: 8,
  },
  verifyIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyLabel: { flex: 1, fontSize: 13, fontWeight: '500', color: '#000' },
  verifyStatus: { fontSize: 11, fontWeight: '600' },
});

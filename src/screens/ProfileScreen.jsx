// ProfileScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  StatusBar,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logout } from '../redux/slices/authSlice';

// Reusable InfoBox component
const InfoBox = ({ iconName, title, value }) => (
  <View style={styles.infoBox}>
    <Feather name={iconName} size={24} color="#333" style={styles.infoIcon} />
    <Text style={styles.infoTitle}>{title}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const GuestFeature = ({ icon, title, desc }) => (
  <View style={styles.guestFeatureItem}>
    <View style={styles.guestFeatureIconBg}>
      <Feather name={icon} size={20} color="#000" />
    </View>
    <View>
      <Text style={styles.guestFeatureTitle}>{title}</Text>
      <Text style={styles.guestFeatureDesc}>{desc}</Text>
    </View>
  </View>
);

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user, isGuest } = useSelector((state) => state.auth);
  const [selectedRole, setSelectedRole] = useState('provider');

  // Guest alert handler
  const guestAction = () => {
    Alert.alert(
      "Login Required",
      "You need to login to access this feature",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Login", onPress: () =>  dispatch(logout()) },
      ]
    );
  };

  // Guest UI
 if (isGuest) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#050505ff" />
        <View style={styles.guestContainer}>
          
          {/* Top Header */}
          <View style={styles.topNav}>
            <Text style={styles.screenTitle}>Profile</Text>
          </View>

          {/* Hero Section */}
          <View style={styles.guestHero}>
            <View style={styles.guestImageWrapper}>
              <Image 
                source={{ uri: "https://cdn-icons-png.flaticon.com/512/747/747376.png" }} 
                style={styles.guestAvatar} 
              />
              <View style={styles.lockBadge}>
                <Feather name="lock" size={16} color="#fff" />
              </View>
            </View>
            <Text style={styles.guestTitle}>Unlock Your Potential</Text>
            <Text style={styles.guestSubtitle}>
              Log in to manage your profile, track jobs, and get verified.
            </Text>
          </View>

          {/* Features List */}
          <View style={styles.guestFeaturesContainer}>
            <GuestFeature 
              icon="briefcase" 
              title="Job Management" 
              desc="Apply to jobs or post new openings." 
            />
            <GuestFeature 
              icon="shield" 
              title="Verified Badge" 
              desc="Build trust with ID verification." 
            />
            <GuestFeature 
              icon="bell" 
              title="Instant Alerts" 
              desc="Never miss a new opportunity." 
            />
          </View>

          {/* Bottom Action */}
          <View style={styles.guestFooter}>
            <TouchableOpacity
              style={styles.guestBtn}
              onPress={() => dispatch(logout())}
            >
              <Text style={styles.guestBtnText}>Login / Sign Up</Text>
              <Feather name="arrow-right" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

        </View>
      </SafeAreaView>
    );
  }

  // Logged-in user UI
  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={require('../assets/profile.png')}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{user?.name || "User Name"}</Text>
        <View style={styles.subHeader}>
          <Text style={styles.ageText}>{user?.age ? `Age - ${user.age} Yrs` : "Age N/A"}</Text>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={14} color="#FF9529" />
            <Text style={styles.ratingText}>4.5</Text>
          </View>
        </View>
      </View>

      {/* Info Grid */}
      <View style={styles.infoGrid}>
        <InfoBox iconName="phone" title="Contact" value={user?.phone || "N/A"} />
        <InfoBox iconName="briefcase" title="Job Type" value={user?.jobType || "Full-Time"} />
        <InfoBox iconName="map-pin" title="Working Model" value={user?.location || "Remote"} />
        <InfoBox iconName="bar-chart-2" title="Level" value="Advanced" />
      </View>

      {/* Role Selection */}
      <View style={styles.roleSelectionContainer}>
        <TouchableOpacity
          style={[styles.roleButton, selectedRole === 'provider' && styles.selectedRole]}
          onPress={() => setSelectedRole('provider')}
        >
          <MaterialCommunityIcons
            name="account-hard-hat"
            size={30}
            style={[styles.roleIcon, selectedRole === 'provider' && styles.selectedRoleText]}
          />
          <Text style={[styles.roleText, selectedRole === 'provider' && styles.selectedRoleText]}>
            Job Provider
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleButton, selectedRole === 'seeker' && styles.selectedRole]}
          onPress={() => setSelectedRole('seeker')}
        >
          <MaterialCommunityIcons
            name="account-tie"
            size={30}
            style={[styles.roleIcon, selectedRole === 'seeker' && styles.selectedRoleText]}
          />
          <Text style={[styles.roleText, selectedRole === 'seeker' && styles.selectedRoleText]}>
            Job Seeker
          </Text>
        </TouchableOpacity>
      </View>

      {/* Verification Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Verification</Text>
        <View style={styles.verificationItem}>
          <Feather name="check-circle" size={20} color="green" />
          <Text style={styles.verificationText}>Mobile Verification</Text>
          <Text style={styles.pendingText}>Pending U2</Text>
        </View>
        <View style={styles.verificationItem}>
          <Feather name="x-circle" size={20} color="red" />
          <Text style={styles.verificationText}>ID Verification</Text>
          <Text style={styles.clickText} onPress={guestAction}>Click to verify</Text>
        </View>
      </View>

      {/* Payment Details */}
      <View style={styles.sectionContainer}>
        <TouchableOpacity style={styles.paymentButton} onPress={guestAction}>
          <Ionicons name="card-outline" size={24} color="#000" />
          <Text style={styles.sectionTitle}>Payment Details</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ------------------ Styles ------------------
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Header
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },

  // --- GUEST UI STYLES ---
  guestContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  guestHero: {
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 20, // Adjust spacing from top
    marginBottom: 40,
  },
  guestImageWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  guestAvatar: {
    width: 100,
    height: 100,
    opacity: 0.9,
  },
  lockBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#000',
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#fff',
  },
  guestTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  guestSubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Feature List
  guestFeaturesContainer: {
    paddingHorizontal: 25,
    marginBottom: 30,
  },
  guestFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 12,
  },
  guestFeatureIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  guestFeatureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  guestFeatureDesc: {
    fontSize: 13,
    color: '#666',
  },
  guestFooter: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  guestBtn: {
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  guestBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  container: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
    padding: 20,
  },
  profileHeader: {
    marginTop: 40,
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#eee',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  ageText: {
    fontSize: 16,
    color: '#555',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5E0',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 15,
  },
  ratingText: {
    color: '#FF9529',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoBox: {
    width: '48%',
    backgroundColor: '#f7f7f7',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  roleSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: 30,
  },
  roleButton: {
    alignItems: 'center',
    paddingBottom: 15,
    flex: 1,
    borderBottomWidth: 3,
    borderColor: 'transparent',
  },
  selectedRole: {
    borderColor: '#000',
  },
  roleIcon: {
    color: '#777',
  },
  roleText: {
    fontSize: 16,
    color: '#777',
    marginTop: 8,
  },
  selectedRoleText: {
    color: '#000',
    fontWeight: 'bold',
  },
  sectionContainer: {
    width: '100%',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  verificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  verificationText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 10,
    flex: 1,
  },
  pendingText: {
    fontSize: 14,
    color: 'red',
    fontStyle: 'italic',
  },
  clickText: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
  },
  paymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Guest UI styles
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  guestAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  guestTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  guestSubtitle: {
    fontSize: 15,
    color: "#777",
    marginBottom: 20,
    textAlign: 'center',
  },
  guestBtn: {
    backgroundColor: "#111",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  guestBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

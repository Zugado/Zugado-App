// ProfileScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
// Make sure you have react-native-vector-icons installed
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Reusable component for the 4 info boxes
const InfoBox = ({ iconName, title, value }) => (
  <View style={styles.infoBox}>
    <Feather name={iconName} size={24} color="#333" style={styles.infoIcon} />
    <Text style={styles.infoTitle}>{title}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

export default function ProfileScreen({ navigation }) {
  // State to track the selected role, as seen in the image
  const [selectedRole, setSelectedRole] = useState('provider');

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header: Image, Name, Age, Rating */}
      <View style={styles.profileHeader}>
        <Image
          source={require('../assets/profile.png')} // Replace with actual image path
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Mohit Sharma</Text>
        <View style={styles.subHeader}>
          <Text style={styles.ageText}>Age - 32 Yrs</Text>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={14} color="#FF9529" />
            <Text style={styles.ratingText}>4.5</Text>
          </View>
        </View>
      </View>

      {/* Info Grid: Contact, Job Type, etc. */}
      <View style={styles.infoGrid}>
        <InfoBox iconName="phone" title="Contact" value="98765 43210" />
        <InfoBox iconName="briefcase" title="Job Type" value="Full-Time" />
        <InfoBox iconName="map-pin" title="Working Model" value="Remote" />
        <InfoBox iconName="bar-chart-2" title="Level" value="Advanced" />
      </View>

      {/* Role Selection: Job Provider / Job Seeker */}
      <View style={styles.roleSelectionContainer}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            selectedRole === 'provider' && styles.selectedRole,
          ]}
          onPress={() => setSelectedRole('provider')}
        >
          <MaterialCommunityIcons
            name="account-hard-hat"
            size={30}
            style={[
              styles.roleIcon,
              selectedRole === 'provider' && styles.selectedRoleText,
            ]}
          />
          <Text
            style={[
              styles.roleText,
              selectedRole === 'provider' && styles.selectedRoleText,
            ]}
          >
            Job Provider
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleButton,
            selectedRole === 'seeker' && styles.selectedRole,
          ]}
          onPress={() => setSelectedRole('seeker')}
        >
          <MaterialCommunityIcons
            name="account-tie"
            size={30}
            style={[
              styles.roleIcon,
              selectedRole === 'seeker' && styles.selectedRoleText,
            ]}
          />
          <Text
            style={[
              styles.roleText,
              selectedRole === 'seeker' && styles.selectedRoleText,
            ]}
          >
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
          <Text style={styles.clickText}>Click to verify</Text>
        </View>
      </View>

      {/* Payment Details Section */}
      <View style={styles.sectionContainer}>
        <TouchableOpacity style={styles.paymentButton}>
          <Ionicons name="card-outline" size={24} color="#000" />
          <Text style={styles.sectionTitle}>Payment Details</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Main container styles from your original code
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
    width: '48%', // For 2 columns
    backgroundColor: '#f7f7f7',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    alignItems: 'flex-start', // Align items to the start
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
    borderColor: 'transparent', // Default transparent border
  },
  selectedRole: {
    borderColor: '#000', // Black border for selected
  },
  roleIcon: {
    color: '#777', // Default dim color
  },
  roleText: {
    fontSize: 16,
    color: '#777', // Default dim color
    marginTop: 8,
  },
  selectedRoleText: {
    color: '#000', // Black color for selected text/icon
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
    flex: 1, // To push text on the right
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 10, // Space from icon
  },
});
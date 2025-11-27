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
  TextInput,
  Modal,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../store/slices/authSlice';
import { useSnackbar } from '../contexts/SnackbarContext';
import { useImagePicker } from '../utils/useImagePicker';
import { updateProfilePicAPI } from '../store/api/userApi';
// Reusable InfoBox component with edit functionality
const InfoBox = ({ iconName, title, value, field, isEditing, onEdit, onInputChange, editValue, isDropdown, options, onDropdownSelect, showDropdown, onDropdownToggle }) => {
  const infoBoxStyles = {
    infoBox: {
      width: '48%',
      backgroundColor: '#f7f7f7',
      borderRadius: 15,
      padding: 15,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      position: 'relative',
    },
    infoIconContainer: {
      marginRight: 12,
    },
    infoTextContainer: {
      flex: 1,
    },
    infoTitle: {
      fontSize: 12,
      color: '#777',
      marginBottom: 2,
    },
    infoValue: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#000',
    },
    fieldEditButton: {
      padding: 4,
    },
    editInput: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#000',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      paddingBottom: 4,
    },
    dropdownButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    dropdownMenu: {
      position: 'absolute',
      top: 25,
      left: 0,
      right: 0,
      backgroundColor: '#fff',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd',
      zIndex: 1000,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    dropdownItem: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    dropdownText: {
      fontSize: 14,
      color: '#000',
    },
  };

  return (
    <View style={infoBoxStyles.infoBox}>
      <View style={infoBoxStyles.infoIconContainer}>
        <Feather name={iconName} size={20} color="#666" />
      </View>
      <View style={infoBoxStyles.infoTextContainer}>
        <Text style={infoBoxStyles.infoTitle}>{title}</Text>
        {isEditing ? (
          isDropdown ? (
            <View>
              <TouchableOpacity style={infoBoxStyles.dropdownButton} onPress={onDropdownToggle}>
                <Text style={infoBoxStyles.infoValue}>{editValue}</Text>
                <Feather name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
              {showDropdown && (
                <View style={infoBoxStyles.dropdownMenu}>
                  {options.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={infoBoxStyles.dropdownItem}
                      onPress={() => onDropdownSelect(field, option)}
                    >
                      <Text style={infoBoxStyles.dropdownText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ) : (
            <TextInput
              style={infoBoxStyles.editInput}
              value={editValue}
              onChangeText={(text) => onInputChange(field, text)}
              keyboardType={field === 'contact' || field === 'age' ? 'numeric' : 'default'}
            />
          )
        ) : (
          <Text style={infoBoxStyles.infoValue}>{value}</Text>
        )}
      </View>
      <TouchableOpacity style={infoBoxStyles.fieldEditButton} onPress={onEdit}>
        <Feather name={isEditing ? "check" : "edit-2"} size={16} color="#666" />
      </TouchableOpacity>
    </View>
  );
};

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
  const { showSnackbar } = useSnackbar();
  const { openCamera, openGallery } = useImagePicker();

  console.log("User = ", user); // Console log removed for cleaner output
  const [selectedRole, setSelectedRole] = useState('provider');
  const [isVerificationExpanded, setIsVerificationExpanded] = useState(false);

  const [pickerSheetVisible, setPickerSheetVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [editStates, setEditStates] = useState({
    picture: false,
    name: false,
    age: false,
    contact: false,
    jobType: false,
    workingModel: false,
    level: false,
  });
  const [editedUser, setEditedUser] = useState({
    firstName: user?.firstName || '',
    middleName: user?.middleName || '',
    lastName: user?.lastName || '',
    age: user?.age || '',
    mobile: user?.mobile || '',
    jobType: user?.jobType || 'Full-Time',
    workingModel: 'Remote',
    level: 'Advanced',
  });
  const [showDropdown, setShowDropdown] = useState(null);
  // LOV data
  const jobTypeOptions = ['Full-Time', 'Part-Time', 'Contract', 'Freelance', 'Internship'];
  const workingModelOptions = ['Remote', 'On-site', 'Hybrid'];
  const levelOptions = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  console.log("ProfileScreen Render:", { user, isGuest });

  // Guest alert handler
  const guestAction = () => {
    if (user) {
      showSnackbar('This service is under development', 'warning');
      return;
    }
    Alert.alert(
      "Login Required",
      "You need to login to access this feature",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Login", onPress: () => dispatch(logout()) },
      ]
    );
  };



  const pickImage = async source => {
    try {
      console.log('Picking image from:', source);
      let result = null;

      if (source === 'camera') {
        result = await openCamera("1:1", 0.7);
      } else {
        result = await openGallery("1:1", 0.7);
      }

      console.log('Image picker result:', result);

      if (result?.uri) {
        console.log('Image selected, uploading...');
        await uploadProfilePicture(result);
      } else {
        console.log('No image selected or cancelled');
      }
    } catch (error) {
      console.log('Error picking image:', error);
      if (error.message?.includes('permission')) {
        Alert.alert(
          'Permission Required',
          'Camera permission is required to take photos. Please enable camera permission in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Try Gallery', onPress: () => pickImage('gallery') }
          ]
        );
      } else {
        showSnackbar(`Error: ${error.message || 'Failed to pick image'}`, 'error');
      }
    } finally {
      setPickerSheetVisible(false);
    }
  };

  const uploadProfilePicture = async (imageData) => {
    setLoading(true);
    try {
      // Get the extension from imageData.fileName
      const extension = imageData.fileName
        ? imageData.fileName.substring(imageData.fileName.lastIndexOf('.') + 1)
        : 'jpg'; // fallback if no extension

      // Compose new name
      const data = {
        uri: imageData.uri,
        type: imageData.type,
        name: `avatar.${extension}`
      };

      const response = await updateProfilePicAPI(data);

      if (response.success) {
        showSnackbar('Profile picture updated successfully!', 'success');
      } else {
        showSnackbar(response?.message || 'Failed to update profile picture', 'error');
      }
    } catch (error) {
      showSnackbar('Error uploading image', 'error');
    } finally {
      setLoading(false);
    }
  };


  // Edit handlers
  const handleEditToggle = (field) => {
    if (field === 'picture') {
      setPickerSheetVisible(true);
      return;
    }
    if (editStates[field]) {
      // Save logic would go here
      showSnackbar(`${field} updated successfully`, 'success');
    }
    setEditStates(prev => ({ ...prev, [field]: !prev[field] }));
    setShowDropdown(null);
  };

  const handleInputChange = (field, value) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
  };

  const handleDropdownSelect = (field, value) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
    setShowDropdown(null);
  };

  // Logout handler
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: () => dispatch(logout()) },
      ]
    );
  };

  // Guest UI
  if (isGuest) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {/* FIX: Ensure StatusBar is set for white background/dark text here */}
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
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
    // FIX: Wrap in a simple View to correctly handle the status bar background color
    <View style={{ flex: 1, backgroundColor: '#fff' }}>

      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* <View style={styles.header}>
        <Header showSearch={false} />
        </View>
         */}
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.imageContainer}>
            <Image
              source={require('../assets/profile.png')}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.imageEditButton} onPress={() => setPickerSheetVisible(true)}>
              <Feather name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.nameContainer}>
            {editStates.name ? (
              <View style={styles.nameEditContainer}>
                <TextInput
                  style={styles.nameInput}
                  value={editedUser.firstName}
                  onChangeText={(text) => handleInputChange('firstName', text)}
                  placeholder="First Name"
                />
                <TextInput
                  style={styles.nameInput}
                  value={editedUser.lastName}
                  onChangeText={(text) => handleInputChange('lastName', text)}
                  placeholder="Last Name"
                />
              </View>
            ) : (
              <Text style={styles.profileName}>{`${user?.firstName} ${user?.middleName} ${user?.lastName}` || "User Name"}</Text>
            )}
            <TouchableOpacity style={styles.editButton} onPress={() => handleEditToggle('name')}>
              <Feather name={editStates.name ? "check" : "edit-2"} size={20} color="#000" />
            </TouchableOpacity>
          </View>
          <View style={styles.subHeader}>
            <View style={styles.ageContainer}>
              {editStates.age ? (
                <TextInput
                  style={styles.ageInput}
                  value={editedUser.age.toString()}
                  onChangeText={(text) => handleInputChange('age', text)}
                  keyboardType="numeric"
                  placeholder="Age"
                />
              ) : (
                <Text style={styles.ageText}>{user?.age ? `Age - ${user.age} Yrs` : "Age N/A"}</Text>
              )}
              <TouchableOpacity style={styles.ageEditButton} onPress={() => handleEditToggle('age')}>
                <Feather name={editStates.age ? "check" : "edit-2"} size={14} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={14} color="#FF9529" />
              <Text style={styles.ratingText}>4.5</Text>
            </View>
          </View>
        </View>

        {/* Info Grid */}
        <View style={styles.infoGrid}>
          <InfoBox
            iconName="phone"
            title="Contact"
            value={user?.mobile || "98765 43210"}
            field="contact"
            isEditing={editStates.contact}
            onEdit={() => handleEditToggle('contact')}
            onInputChange={handleInputChange}
            editValue={editedUser.mobile}
          />
          <InfoBox
            iconName="briefcase"
            title="Job Type"
            value={editedUser.jobType}
            field="jobType"
            isEditing={editStates.jobType}
            onEdit={() => handleEditToggle('jobType')}
            editValue={editedUser.jobType}
            isDropdown={true}
            options={jobTypeOptions}
            onDropdownSelect={handleDropdownSelect}
            showDropdown={showDropdown === 'jobType'}
            onDropdownToggle={() => setShowDropdown(showDropdown === 'jobType' ? null : 'jobType')}
          />
          <InfoBox
            iconName="monitor"
            title="Working Model"
            value={editedUser.workingModel}
            field="workingModel"
            isEditing={editStates.workingModel}
            onEdit={() => handleEditToggle('workingModel')}
            editValue={editedUser.workingModel}
            isDropdown={true}
            options={workingModelOptions}
            onDropdownSelect={handleDropdownSelect}
            showDropdown={showDropdown === 'workingModel'}
            onDropdownToggle={() => setShowDropdown(showDropdown === 'workingModel' ? null : 'workingModel')}
          />
          <InfoBox
            iconName="trending-up"
            title="Level"
            value={editedUser.level}
            field="level"
            isEditing={editStates.level}
            onEdit={() => handleEditToggle('level')}
            editValue={editedUser.level}
            isDropdown={true}
            options={levelOptions}
            onDropdownSelect={handleDropdownSelect}
            showDropdown={showDropdown === 'level'}
            onDropdownToggle={() => setShowDropdown(showDropdown === 'level' ? null : 'level')}
          />
        </View>

        {/* Role Selection */}
        <View style={styles.roleSelectionContainer}>
          <TouchableOpacity
            style={[styles.roleButton, selectedRole === 'provider' && styles.selectedRole]}
            onPress={() => setSelectedRole('provider')}
          >
            <MaterialCommunityIcons
              name="briefcase-variant"
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
              name="account-search"
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
          <TouchableOpacity
            style={styles.verificationButton}
            onPress={() => setIsVerificationExpanded(!isVerificationExpanded)}
          >
            <MaterialCommunityIcons name="shield-check-outline" size={24} color="#000" />
            <Text style={styles.verificationTitle}>Verification</Text>
            <View style={styles.verificationRight}>
              <Text style={styles.verificationStatus}>Pending 1/2</Text>
              <Feather
                name={isVerificationExpanded ? "chevron-up" : "chevron-down"}
                size={16}
                color="#666"
              />
            </View>
          </TouchableOpacity>
          {isVerificationExpanded && (
            <View style={styles.verificationDetails}>
              <View style={styles.verificationItem}>
                <Feather name="check-circle" size={20} color="green" />
                <Text style={styles.verificationText}>Mobile Verification</Text>
                <Text style={styles.completedText}>Completed</Text>
              </View>
              <View style={styles.verificationItem}>
                <Feather name="x-circle" size={20} color="red" />
                <Text style={styles.verificationText}>ID Verification</Text>
                <Text style={styles.clickText} onPress={guestAction}>Click to verify</Text>
              </View>
            </View>
          )}
        </View>

        {/* Payment Details */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity style={styles.paymentButton} onPress={guestAction}>
            <Ionicons name="card-outline" size={24} color="#000" />
            <Text style={styles.paymentText}>Payment Details</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Section */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Feather name="log-out" size={24} color="#ff4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>


      {/* Image Picker Modal */}
      <Modal
        visible={pickerSheetVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPickerSheetVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Image</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => pickImage('camera')}
            >
              <Feather name="camera" size={20} color="#000" />
              <Text style={styles.modalButtonText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => pickImage('gallery')}
            >
              <Feather name="image" size={20} color="#000" />
              <Text style={styles.modalButtonText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setPickerSheetVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ------------------ Styles ------------------
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000ff',
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
  header: {
    paddingTop: 50,
    paddingBottom: 120,
    backgroundColor: '#000000ff',
  },
  container: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileHeader: {
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
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 10,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  imageEditButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#000',
    padding: 8,
    borderRadius: 20,
  },
  editButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  nameEditContainer: {
    flexDirection: 'column',
    marginRight: 10,
  },
  nameInput: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 4,
    marginBottom: 5,
    minWidth: 150,
  },
  ageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ageInput: {
    fontSize: 16,
    color: '#555',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 2,
    minWidth: 80,
  },
  ageEditButton: {
    padding: 4,
    marginLeft: 8,
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
  verificationButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 10,
    flex: 1,
  },
  verificationRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationStatus: {
    fontSize: 14,
    color: 'red',
    fontWeight: '500',
    marginRight: 8,
  },
  verificationDetails: {
    marginTop: 15,
    paddingLeft: 34,
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
  completedText: {
    fontSize: 14,
    color: 'green',
    fontWeight: '500',
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
  paymentText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f5',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffebee',
  },
  logoutText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff4444',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
  },
  modalButtonText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#000',
  },
  cancelButton: {
    backgroundColor: '#ff4444',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
});
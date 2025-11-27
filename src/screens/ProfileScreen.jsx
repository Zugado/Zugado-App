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
import { logout } from '../store/slices/authSlice';
import { useSnackbar } from '../contexts/SnackbarContext';
import { useImagePicker } from '../utils/useImagePicker';
import { updateProfilePicAPI } from '../store/api/userApi';
import { updateUserDetails } from '../store/thunks/userThunk';
import Header from '../components/Header';

const InfoBox = ({ 
  iconName, 
  title, 
  value, 
  field, 
  isEditingProfile, 
  activeEditField,
  onEditFieldToggle,
  onInputChange, 
  editValue, 
  isDropdown, 
  options, 
  onDropdownSelect, 
  showDropdown, 
  onDropdownToggle 
}) => {
  
  const isFieldEditing = isEditingProfile && activeEditField === field;
  
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
      borderBottomWidth: isFieldEditing ? 1 : 0,
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
      top: 50,
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
        {isFieldEditing ? (
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
              keyboardType={field === 'mobile' || field === 'age' ? 'numeric' : 'default'}
              autoFocus={true} 
            />
          )
        ) : (
          <Text style={infoBoxStyles.infoValue}>{value}</Text>
        )}
      </View>
      
      {/* Individual Edit Toggle Button */}
      {isEditingProfile && (
        <TouchableOpacity 
          style={infoBoxStyles.fieldEditButton} 
          onPress={() => onEditFieldToggle(field)}
        >
          <Feather 
            name={isFieldEditing ? "check" : "edit-2"} 
            size={16} 
            color={isFieldEditing ? "#000" : "#666"} 
          />
        </TouchableOpacity>
      )}
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

  const [isVerificationExpanded, setIsVerificationExpanded] = useState(false);
  const [pickerSheetVisible, setPickerSheetVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Global Edit State (Header Button)
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Specific Field Edit State (Pencil Button)
  const [activeEditField, setActiveEditField] = useState(null); 

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

  // ... (guestAction, pickImage, uploadProfilePicture functions remain the same) ...
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
      let result = null;
      if (source === 'camera') {
        result = await openCamera("1:1", 0.7);
      } else {
        result = await openGallery("1:1", 0.7);
      }

      if (result?.uri) {
        await uploadProfilePicture(result);
      }
    } catch (error) {
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
      const extension = imageData.fileName
        ? imageData.fileName.substring(imageData.fileName.lastIndexOf('.') + 1)
        : 'jpg';

      const data = {
        uri: imageData.uri,
        type: imageData.type,
        name: `avatar.${extension}`
      };

      // Mock API call for update
      // const response = await updateProfilePicAPI(data);

      // if (response.success) {
      //   showSnackbar('Profile picture updated successfully!', 'success');
      // } else {
      //   showSnackbar(response?.message || 'Failed to update profile picture', 'error');
      // }
       showSnackbar('Profile picture update logic initiated (mocked success)', 'success');
    } catch (error) {
      showSnackbar('Error uploading image', 'error');
    } finally {
      setLoading(false);
    }
  };
  // ------------------------------------------------------------------

  // Global Edit Handler (Header Button)
  const handleGlobalEditToggle = () => {
    if (isEditingProfile) {
      // If we are exiting edit mode (pressing CHECK)
      // 1. Clear any active field editing state
      setActiveEditField(null);
      setShowDropdown(null);
      // 2. Perform global save logic here (e.g., dispatch(updateUserProfileAPI(editedUser)));
      showSnackbar('Profile edit mode exited.', 'success');
    }
    // Toggle the overall editing state
    setIsEditingProfile(prev => !prev);
  };
  
  // Individual Field Edit Handler (Pencil Button)
  const handleFieldEditToggle = (field) => {
    if (activeEditField === field) {
      // If the field is currently active (pressing CHECK)
      // 1. Perform individual field save logic here
      showSnackbar(`${field} saved.`, 'success');
      // 2. Clear the active field
      setActiveEditField(null);
    } else {
      // If pressing the pencil icon
      // 1. Clear any current active field/dropdown
      setActiveEditField(null);
      setShowDropdown(null);
      // 2. Set the new active field
      setActiveEditField(field);
    }
  };

  // Edit handlers
  const handleInputChange = (field, value) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
  };

  const handleDropdownSelect = (field, value) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
    setShowDropdown(null);
  };
  
  const handleDropdownToggle = (field) => {
    if (activeEditField === field) {
      setShowDropdown(showDropdown === field ? null : field);
    }
    // Only allow dropdown toggle if the specific field is active
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

  // Guest UI remains the same
  if (isGuest) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.guestContainer}>
          <View style={styles.topNav}>
            <Text style={styles.screenTitle}>Profile</Text>
          </View>
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
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header and Global Edit Button */}
      <View style={styles.header}>
        <Header showSearch={false} />

        {/* Profile Image and Edit Camera */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/profile.png')}
            style={styles.profileImage}
          />
          {isEditingProfile && (
            <TouchableOpacity style={styles.imageEditButton} onPress={() => setPickerSheetVisible(true)}>
              <Feather name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

          {/* Global edit button */}
           <TouchableOpacity style={styles.globalEditButton} onPress={handleGlobalEditToggle}>
          <Feather
            name={isEditingProfile ? "check" : "edit-2"}
            size={20}
            color="#000000ff"
          />
        </TouchableOpacity>

        <View style={styles.profileHeader}>
          <View style={styles.nameContainer}>
            {isEditingProfile && activeEditField === 'name' ? (
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
              <Text style={styles.profileName}>{`${editedUser.firstName} ${editedUser.middleName || ''} ${editedUser.lastName}` || "User Name"}</Text>
            )}
            
            {/* Name Edit Toggle */}
            {isEditingProfile && (
              <TouchableOpacity style={styles.editButton} onPress={() => handleFieldEditToggle('name')}>
                <Feather name={activeEditField === 'name' ? "check" : "edit-2"} size={20} color="#000" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.subHeader}>
            <View style={styles.ageContainer}>
              {isEditingProfile && activeEditField === 'age' ? (
                <TextInput
                  style={styles.ageInput}
                  value={editedUser.age.toString()}
                  onChangeText={(text) => handleInputChange('age', text)}
                  keyboardType="numeric"
                  placeholder="Age"
                />
              ) : (
                <Text style={styles.ageText}>{editedUser.age ? `Age - ${editedUser.age} Yrs` : "Age N/A"}</Text>
              )}
              
              {/* Age Edit Toggle */}
              {isEditingProfile && (
                <TouchableOpacity style={styles.ageEditButton} onPress={() => handleFieldEditToggle('age')}>
                  <Feather name={activeEditField === 'age' ? "check" : "edit-2"} size={14} color="#666" />
                </TouchableOpacity>
              )}
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
            value={editedUser.mobile || "98765 43210"}
            field="mobile"
            isEditingProfile={isEditingProfile}
            activeEditField={activeEditField}
            onEditFieldToggle={handleFieldEditToggle}
            onInputChange={handleInputChange}
            editValue={editedUser.mobile}
          />
          <InfoBox
            iconName="briefcase"
            title="Job Type"
            value={editedUser.jobType}
            field="jobType"
            isEditingProfile={isEditingProfile}
            activeEditField={activeEditField}
            onEditFieldToggle={handleFieldEditToggle}
            editValue={editedUser.jobType}
            isDropdown={true}
            options={jobTypeOptions}
            onDropdownSelect={handleDropdownSelect}
            showDropdown={activeEditField === 'jobType' && showDropdown === 'jobType'}
            onDropdownToggle={() => handleDropdownToggle('jobType')}
          />
          <InfoBox
            iconName="monitor"
            title="Working Model"
            value={editedUser.workingModel}
            field="workingModel"
            isEditingProfile={isEditingProfile}
            activeEditField={activeEditField}
            onEditFieldToggle={handleFieldEditToggle}
            editValue={editedUser.workingModel}
            isDropdown={true}
            options={workingModelOptions}
            onDropdownSelect={handleDropdownSelect}
            showDropdown={activeEditField === 'workingModel' && showDropdown === 'workingModel'}
            onDropdownToggle={() => handleDropdownToggle('workingModel')}
          />
          <InfoBox
            iconName="trending-up"
            title="Level"
            value={editedUser.level}
            field="level"
            isEditingProfile={isEditingProfile}
            activeEditField={activeEditField}
            onEditFieldToggle={handleFieldEditToggle}
            editValue={editedUser.level}
            isDropdown={true}
            options={levelOptions}
            onDropdownSelect={handleDropdownSelect}
            showDropdown={activeEditField === 'level' && showDropdown === 'level'}
            onDropdownToggle={() => handleDropdownToggle('level')}
          />
        </View>

        {/* Role Selection (Disabled when editing) */}
        <View style={styles.roleSelectionContainer}>
          <TouchableOpacity
            style={styles.roleButton}
            onPress={() => console.log('Job Provider selected')}
            disabled={isEditingProfile}
          >
            <MaterialCommunityIcons
              name="briefcase-variant"
              size={30}
              style={styles.roleIcon}
            />
            <Text style={styles.roleText}>
              Job Provider
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.roleButton}
            onPress={() => console.log('Job Seeker selected')}
            disabled={isEditingProfile}
          >
            <MaterialCommunityIcons
              name="account-search"
              size={30}
              style={styles.roleIcon}
            />
            <Text style={styles.roleText}>
              Job Seeker
            </Text>
          </TouchableOpacity>
        </View>

        {/* Other Sections (Disabled when editing) */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity
            style={styles.verificationButton}
            onPress={() => setIsVerificationExpanded(!isVerificationExpanded)}
            disabled={isEditingProfile}
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

        <View style={styles.sectionContainer}>
          <TouchableOpacity style={styles.paymentButton} onPress={guestAction} disabled={isEditingProfile}>
            <Ionicons name="card-outline" size={24} color="#000" />
            <Text style={styles.paymentText}>Payment Details</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={isEditingProfile}>
            <Feather name="log-out" size={24} color="#ff4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>


      {/* Image Picker Modal (remains the same) */}
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
  // ... (All existing styles remain, with the exception of 'editButton' and 'ageEditButton' being kept for the pencil icon)
  safeArea: {
    flex: 1,
    backgroundColor: '#000000ff',
  },
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
  guestContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  guestHero: {
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 20,
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
    paddingTop: 40,
    backgroundColor: '#000000ff',
  },
  globalEditButton: {
    position: 'absolute',
    top: -40,
    right: -10,
    zIndex: 10,
    padding: 4,
    // borderWidth: 2,
    // borderColor: '#000000ff',
    // borderRadius: 50,
  },
  container: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
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
    zIndex: 999,
    alignSelf: 'center',
    top: 55,
  },
  imageEditButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#000',
    padding: 8,
    borderRadius: 20,
  },
  // Re-used for Name edit pencil
  editButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  nameEditContainer: {
    flexDirection: 'column',
    marginRight: 10,
    alignItems: 'center',
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
    textAlign: 'center',
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
    textAlign: 'center',
  },
  // Re-used for Age edit pencil
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
    zIndex: 1,
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
  roleText: {
    fontSize: 16,
    marginTop: 8,
    fontWeight: 'bold',
  },
  sectionContainer: {
    width: '100%',
    marginBottom: 10,
  },
  verificationButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationTitle: {
    fontSize: 18,
    fontWeight: '600',
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
    fontWeight: '600',
    marginRight: 8,
  },
  verificationDetails: {
    marginTop: 10,
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
    fontWeight: '600',
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
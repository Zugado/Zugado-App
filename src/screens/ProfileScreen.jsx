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
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logout } from '../store/slices/authSlice';
import { useSnackbar } from '../contexts/SnackbarContext';
import { useImagePicker } from '../utils/useImagePicker';
import { updateProfilePicAPI } from '../store/api/userApi';
import { updateUserDetails, getUserProfile, updateProfilePic } from '../store/thunks/userThunk';
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
      padding: 12,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      position: 'relative',
      zIndex: showDropdown ? 10000 : 1,
      elevation: showDropdown ? 15 : 4,
      overflow: 'visible',

      // iOS shadow
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.15,
shadowRadius: 4,

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
      padding: 6,
      borderRadius: 12,
      backgroundColor: '#f0f0f0',
    },
    activeFieldEditButton: {
      backgroundColor: '#000',
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
      top: 40,
      left: 0,
      right: 0,
      backgroundColor: '#fff',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd',
      zIndex: 9999,
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      maxHeight: 150,
    },
    dropdownItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    dropdownText: {
      fontSize: 12,
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
          style={[
            infoBoxStyles.fieldEditButton,
            isFieldEditing && infoBoxStyles.activeFieldEditButton
          ]} 
          onPress={() => onEditFieldToggle(field)}
        >
          <Feather 
            name={isFieldEditing ? "check" : "edit-2"} 
            size={14} 
            color={isFieldEditing ? "#fff" : "#666"} 
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

  // Set status bar when screen comes into focus - MUST be at top
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle(isGuest ? 'dark-content' : 'light-content');
      StatusBar.setBackgroundColor(isGuest ? '#ffffff' : '#000000');
    }, [isGuest])
  );

  const [isVerificationExpanded, setIsVerificationExpanded] = useState(false);
  const [pickerSheetVisible, setPickerSheetVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
  const [verificationData, setVerificationData] = useState({
    documentType: '',
    documentNumber: '',
    documentImage: null
  });
  const [showDocumentDropdown, setShowDocumentDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Mapping functions for backend API - MUST be before useState
  const mapToBackend = (field, value) => {
    const mappings = {
      jobType: { 'Full-Time': 'fulltime', 'Part-Time': 'parttime', 'Casually': 'casually' },
      workingModel: { 'Remote': 'remote', 'On-site': 'onsite', 'Hybrid': 'hybrid' },
      level: { 'Beginner': 'beginner', 'Intermediate': 'intermediate', 'Advanced': 'advanced', 'Expert': 'pro' }
    };
    return mappings[field]?.[value] || value;
  };

  const mapFromBackend = (field, value) => {
    const mappings = {
      jobType: { 'fulltime': 'Full-Time', 'parttime': 'Part-Time', 'casually': 'Casually' },
      workingModel: { 'remote': 'Remote', 'onsite': 'On-site', 'hybrid': 'Hybrid' },
      level: { 'beginner': 'Beginner', 'intermediate': 'Intermediate', 'advanced': 'Advanced', 'pro': 'Expert' }
    };
    return mappings[field]?.[value] || value;
  };

  // Edit handlers
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Global Edit State (Header Button)
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Specific Field Edit State (Pencil Button)
  const [activeEditField, setActiveEditField] = useState(null); 

  const [editedUser, setEditedUser] = useState({
    firstName: user?.firstName || '',
    middleName: user?.middleName || '',
    lastName: user?.lastName || '',
    age: user?.dateOfBirth ? calculateAge(user.dateOfBirth) : (user?.age || ''),
    mobile: user?.mobile || '',
    jobType: mapFromBackend('jobType', user?.jobType) || 'Full-Time',
    workingModel: mapFromBackend('workingModel', user?.workingModel) || 'Remote',
    level: mapFromBackend('level', user?.level) || 'Advanced',
    dateOfBirth: user?.dateOfBirth || null,
  });
  const [showDropdown, setShowDropdown] = useState(null);

  // Field name formatting
  const formatFieldName = (field) => {
    const fieldNames = {
      name: 'Name',
      age: 'Age',
      mobile: 'Contact',
      jobType: 'Job Type',
      workingModel: 'Working Model',
      level: 'Level'
    };
    return fieldNames[field] || field;
  };

  // LOV data
  const jobTypeOptions = ['Full-Time', 'Part-Time', 'Casually'];
  const workingModelOptions = ['Remote', 'On-site', 'Hybrid'];
  const levelOptions = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const documentTypeOptions = ['Aadhaar Card', 'PAN Card', 'Driving License', 'Passport', 'Voter ID'];

  console.log("USER:", user);
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

  const pickImage = async (source, isVerification = false) => {
    try {
      let result = null;
      if (source === 'camera') {
        result = await openCamera(isVerification ? "freeform" : "1:1", 0.7);
      } else {
        result = await openGallery(isVerification ? "freeform" : "1:1", 0.7);
      }

      if (result?.uri) {
        if (isVerification) {
          setVerificationData(prev => ({ ...prev, documentImage: result }));
          showSnackbar('Document image selected', 'success');
        } else {
          await uploadProfilePicture(result);
        }
      }
    } catch (error) {
      if (error.message?.includes('permission')) {
        Alert.alert(
          'Permission Required',
          'Camera permission is required to take photos. Please enable camera permission in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Try Gallery', onPress: () => pickImage('gallery', isVerification) }
          ]
        );
      } else {
        showSnackbar(`Error: ${error.message || 'Failed to pick image'}`, 'error');
      }
    } finally {
      setPickerSheetVisible(false);
    }
  };

  const handleVerificationSubmit = () => {
    if (!verificationData.documentType || !verificationData.documentNumber || !verificationData.documentImage) {
      showSnackbar('Please fill all fields and select document image', 'error');
      return;
    }
    
    // API call logic here
    showSnackbar('Verification submitted successfully', 'success');
    setVerificationModalVisible(false);
    setVerificationData({ documentType: '', documentNumber: '', documentImage: null });
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

      const response = await dispatch(updateProfilePic(data));
      
      if (updateProfilePic.fulfilled.match(response)) {
        showSnackbar('Profile picture updated successfully!', 'success');
        // Refresh profile to get updated image
        await dispatch(getUserProfile());
      } else {
        showSnackbar(response?.payload?.message || 'Failed to update profile picture', 'error');
      }
    } catch (error) {
      showSnackbar('Error uploading image', 'error');
    } finally {
      setLoading(false);
    }
  };
  // ------------------------------------------------------------------

  // Pull to refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(getUserProfile());
      showSnackbar('Profile refreshed successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to refresh profile', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  // Global Edit Handler (Header Button)
  const handleGlobalEditToggle = () => {
    if (isEditingProfile) {
      // If we are exiting edit mode (pressing CHECK)
      // 1. Clear any active field editing state
      setActiveEditField(null);
      setShowDropdown(null);
      // 2. Perform global save logic here (e.g., dispatch(updateUserProfileAPI(editedUser)));
      showSnackbar('Profile edit mode turned off.', 'success');
    }else{
      showSnackbar('Profile edit mode turned on.', 'warning');

    }
    // Toggle the overall editing state
    setIsEditingProfile(prev => !prev);
  };
  
  // Individual Field Edit Handler (Pencil Button)
  const handleFieldEditToggle = async (field) => {
    if (activeEditField === field) {
      // If the field is currently active (pressing CHECK)
      try {
        setLoading(true);
        
        // Prepare data based on field type
        let updateData = {};
        
        if (field === 'name') {
          updateData = {
            firstName: editedUser.firstName,
            middleName: editedUser.middleName,
            lastName: editedUser.lastName
          };
        } else if (field === 'age') {
          updateData = {
            dateOfBirth: editedUser.dateOfBirth
          };
        } else {
          const backendValue = mapToBackend(field, editedUser[field]);
          updateData = { [field]: backendValue };
        }
        
        const response = await dispatch(updateUserDetails(updateData));
        
        if (updateUserDetails.fulfilled.match(response)) {
          const fieldName = formatFieldName(field);
          showSnackbar(`${fieldName} updated successfully`, 'success');
          setActiveEditField(null);
        } else {
          const fieldName = formatFieldName(field);
          showSnackbar(response?.payload?.message || `Failed to update ${fieldName}`, 'error');
        }
      } catch (error) {
        const fieldName = formatFieldName(field);
        showSnackbar(`Error updating ${fieldName}`, 'error');
      } finally {
        setLoading(false);
      }
    } else {
      // If pressing the pencil icon
      setActiveEditField(null);
      setShowDropdown(null);
      setActiveEditField(field);
    }
  };

  

  const handleDateSelect = (date) => {
    const age = calculateAge(date);
    setEditedUser(prev => ({ ...prev, age, dateOfBirth: date }));
    setShowDatePicker(false);
  };

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
    setShowLogoutModal(true);
  };

  // Guest UI remains the same
  if (isGuest) {
    return (
      <SafeAreaView style={styles.safeArea}>
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>

      {/* Header */}
      <View style={styles.header}>
        <Header showSearch={false} />

        {/* Profile Image and Edit Camera */}
        <View style={styles.imageContainer}>
          <Image
            source={user?.avatar ? { uri: user.avatar } : require('../assets/profile.png')}
            style={styles.profileImage}
          />
          {isEditingProfile && (
            <TouchableOpacity style={styles.imageEditButton} onPress={() => setPickerSheetVisible(true)}>
              <Feather name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#666"
            colors={['#666', '#999']}
            progressBackgroundColor="#fff"
            progressViewOffset={20}
          />
        }
      >

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
                  value={editedUser.middleName}
                  onChangeText={(text) => handleInputChange('middleName', text)}
                  placeholder="Middle Name"
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
              <TouchableOpacity 
                style={[styles.editButton, activeEditField === 'name' && styles.activeEditButton]} 
                onPress={() => handleFieldEditToggle('name')}
              >
                <Feather 
                  name={activeEditField === 'name' ? "check" : "edit-2"} 
                  size={18} 
                  color={activeEditField === 'name' ? "#fff" : "#000"} 
                />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.subHeader}>
            <View style={styles.ageContainer}>
              {isEditingProfile && activeEditField === 'age' ? (
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.datePickerText}>
                    {editedUser.dateOfBirth 
                      ? new Date(editedUser.dateOfBirth).toLocaleDateString()
                      : 'Select Date of Birth'
                    }
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.ageText}>{editedUser.age ? `Age - ${editedUser.age} Yrs` : "Age 0"}</Text>
              )}
              
              {/* Age Edit Toggle */}
              {isEditingProfile && (
                <TouchableOpacity 
                  style={[styles.ageEditButton, activeEditField === 'age' && styles.activeAgeEditButton]} 
                  onPress={() => handleFieldEditToggle('age')}
                >
                  <Feather 
                    name={activeEditField === 'age' ? "check" : "edit-2"} 
                    size={14} 
                    color={activeEditField === 'age' ? "#fff" : "#666"} 
                  />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={14} color="#FF9529" />
              <Text style={styles.ratingText}>{user?.ratings?.averageRating || '0.0'}</Text>
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
            // isEditingProfile={isEditingProfile}
            // activeEditField={activeEditField}
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
                <TouchableOpacity onPress={() => setVerificationModalVisible(true)}>
                  <Text style={styles.clickText}>Click to verify</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Settings Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={guestAction} disabled={isEditingProfile}>
            <Feather name="user" size={20} color="#000" />
            <Text style={styles.settingText}>Account Settings</Text>
            <Feather name="chevron-right" size={16} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={guestAction} disabled={isEditingProfile}>
            <Ionicons name="card-outline" size={20} color="#000" />
            <Text style={styles.settingText}>Payment Details</Text>
            <Feather name="chevron-right" size={16} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={guestAction} disabled={isEditingProfile}>
            <Feather name="globe" size={20} color="#000" />
            <Text style={styles.settingText}>Language</Text>
            <Feather name="chevron-right" size={16} color="#666" />
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
              onPress={() => pickImage('camera', verificationModalVisible)}
            >
              <Feather name="camera" size={20} color="#000" />
              <Text style={styles.modalButtonText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => pickImage('gallery', verificationModalVisible)}
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

      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        onConfirm={handleDateSelect}
        onCancel={() => setShowDatePicker(false)}
        // maximumDate={new Date()}
        maximumDate={new Date(2006, 11, 31)} // Users must be at least 18 years old
        date={editedUser.dateOfBirth ? new Date(editedUser.dateOfBirth) : new Date()}
      />

      {/* Verification Modal */}
      <Modal
        visible={verificationModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setVerificationModalVisible(false)}
      >
        <View style={styles.verificationModalOverlay}>
          <View style={styles.verificationModalContent}>
            <View style={styles.verificationModalHeader}>
              <MaterialCommunityIcons name="shield-check" size={32} color="#4CAF50" />
              <Text style={styles.verificationModalTitle}>ID Verification</Text>
              <Text style={styles.verificationModalSubtitle}>Please provide your document details</Text>
            </View>

            <ScrollView style={styles.verificationForm} showsVerticalScrollIndicator={false}>
              {/* Document Type Dropdown */}
              <View style={styles.verificationField}>
                <Text style={styles.verificationLabel}>Document Type</Text>
                <TouchableOpacity 
                  style={styles.verificationDropdown}
                  onPress={() => setShowDocumentDropdown(!showDocumentDropdown)}
                >
                  <Text style={styles.verificationDropdownText}>
                    {verificationData.documentType || 'Select Document Type'}
                  </Text>
                  <Feather name="chevron-down" size={20} color="#666" />
                </TouchableOpacity>
                
                {showDocumentDropdown && (
                  <View style={styles.verificationDropdownMenu}>
                    {documentTypeOptions.map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={styles.verificationDropdownItem}
                        onPress={() => {
                          setVerificationData(prev => ({ ...prev, documentType: type }));
                          setShowDocumentDropdown(false);
                        }}
                      >
                        <Text style={styles.verificationDropdownItemText}>{type}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Document Number */}
              <View style={styles.verificationField}>
                <Text style={styles.verificationLabel}>Document Number</Text>
                <TextInput
                  style={styles.verificationInput}
                  value={verificationData.documentNumber}
                  onChangeText={(text) => setVerificationData(prev => ({ ...prev, documentNumber: text }))}
                  placeholder="Enter document number"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Document Image */}
              <View style={styles.verificationField}>
                <Text style={styles.verificationLabel}>Document Image</Text>
                {verificationData.documentImage ? (
                  <View style={styles.selectedImageContainer}>
                    <Image 
                      source={{ uri: verificationData.documentImage.uri }} 
                      style={styles.selectedImage}
                    />
                    <TouchableOpacity 
                      style={styles.changeImageButton}
                      onPress={() => setPickerSheetVisible(true)}
                    >
                      <Text style={styles.changeImageText}>Change Image</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={styles.selectImageButton}
                    onPress={() => setPickerSheetVisible(true)}
                  >
                    <Feather name="camera" size={24} color="#666" />
                    <Text style={styles.selectImageText}>Select Document Image</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>

            <View style={styles.verificationModalActions}>
              <TouchableOpacity 
                style={styles.verificationCancelButton}
                onPress={() => {
                  setVerificationModalVisible(false);
                  setVerificationData({ documentType: '', documentNumber: '', documentImage: null });
                  setShowDocumentDropdown(false);
                }}
              >
                <Text style={styles.verificationCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.verificationSubmitButton}
                onPress={handleVerificationSubmit}
              >
                <Text style={styles.verificationSubmitText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Custom Logout Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.logoutModalOverlay}>
          <View style={styles.logoutModalContainer}>
            <View style={styles.logoutModalHeader}>
              <View style={styles.logoutIconContainer}>
                <Feather name="log-out" size={24} color="#ff6b6b" />
              </View>
              <Text style={styles.logoutModalTitle}>Logout</Text>
              <Text style={styles.logoutModalMessage}>Are you sure you want to logout from your account?</Text>
            </View>
            
            <View style={styles.logoutModalActions}>
              <TouchableOpacity 
                style={styles.logoutCancelButton}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.logoutCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.logoutConfirmButton}
                onPress={() => {
                  setShowLogoutModal(false);
                  dispatch(logout());
                }}
              >
                <Text style={styles.logoutConfirmButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={styles.loadingText}>Updating...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
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
    paddingTop: 0,
    backgroundColor: '#000',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 100,
  },
  globalEditButton: {
    position: 'absolute',
    top: -40,
    right: -10,
    zIndex: 10,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    // borderWidth: 2,
    // borderColor: '#000000ff',
    // borderRadius: 50,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: -140,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingTop: 80,
    marginBottom: 50
  },
  scrollContent: {
    paddingBottom: 120,
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
    top: 20,
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
  activeEditButton: {
    backgroundColor: '#000',
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
    padding: 6,
    marginLeft: 8,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  activeAgeEditButton: {
    backgroundColor: '#000',
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
    overflow: 'visible',
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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginBottom: 8,
  },
  settingText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 15,
    flex: 1,
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
  datePickerButton: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 4,
    minWidth: 120,
  },
  datePickerText: {
    fontSize: 16,
    color: '#555',
  },
  // Verification Modal Styles
  verificationModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  verificationModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxHeight: '85%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  verificationModalHeader: {
    alignItems: 'center',
    padding: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  verificationModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
  },
  verificationModalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  verificationForm: {
    padding: 20,
  },
  verificationField: {
    marginBottom: 20,
  },
  verificationLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  verificationDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  verificationDropdownText: {
    fontSize: 16,
    color: '#000',
  },
  verificationDropdownMenu: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    zIndex: 1000,
    elevation: 5,
    maxHeight: 300,
  },
  verificationDropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  verificationDropdownItemText: {
    fontSize: 16,
    color: '#000',
  },
  verificationInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#000',
  },
  selectImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  selectImageText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  selectedImageContainer: {
    alignItems: 'center',
  },
  selectedImage: {
    width: 120,
    height: 80,
    borderRadius: 12,
    marginBottom: 10,
  },
  changeImageButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  changeImageText: {
    fontSize: 14,
    color: '#000',
  },
  verificationModalActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  verificationCancelButton: {
    flex: 1,
    paddingVertical: 15,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    alignItems: 'center',
  },
  verificationCancelText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  verificationSubmitButton: {
    flex: 1,
    paddingVertical: 15,
    marginLeft: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    alignItems: 'center',
  },
  verificationSubmitText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  logoutModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoutModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 320,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  logoutModalHeader: {
    alignItems: 'center',
    padding: 30,
    paddingBottom: 20,
  },
  logoutIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  logoutModalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  logoutModalActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  logoutCancelButton: {
    flex: 1,
    paddingVertical: 18,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  logoutCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  logoutConfirmButton: {
    flex: 1,
    paddingVertical: 18,
    alignItems: 'center',
  },
  logoutConfirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff6b6b',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  loadingContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#000',
    marginTop: 10,
  },
});
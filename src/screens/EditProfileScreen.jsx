import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import MyStatusBar from '../components/MyStatusbar';
import { CommonAppBar } from '../components/CommonComponents';
import { Colors, screenWidth } from '../styles/commonStyles';
import ImagePickerSheet from '../components/ImagePickerSheet';
import { useImagePicker } from '../utils/useImagePicker';
import { useSnackbar } from '../contexts/SnackbarContext';
import { updateUserDetails, updateProfilePic } from '../store/thunks/userThunk';
import ImagePreviewModal from '../components/ImagePreviewModal';
import FloatingLabelInput from '../components/inputFields/FloatingLabelInput';
const EditProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { showSnackbar } = useSnackbar();
  const { openCamera, openGallery } = useImagePicker();

  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobNumber, setMobNumber] = useState('');
  const [workMode, setWorkMode] = useState('Remote');
  const [jobType, setJobType] = useState('Full-Time');
  const [level, setLevel] = useState('Beginner');
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [pickerSheetVisible, setPickerSheetVisible] = useState(false);
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpType, setOtpType] = useState('');
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const workModeOptions = ['Remote', 'On-Site', 'Hybrid'];
  const jobTypeOptions = ['Full-Time', 'Part-Time', 'Casually'];
  const levelOptions = ['Beginner', 'Intermediate', 'Experienced'];

  // Mapping functions
  const mapToBackend = (field, value) => {
    const mappings = {
      workMode: { Remote: 'remote', 'On-Site': 'onsite', Hybrid: 'hybrid' },
      jobType: {
        'Full-Time': 'fulltime',
        'Part-Time': 'parttime',
        Casually: 'casually',
      },
      level: {
        Beginner: 'beginner',
        Intermediate: 'intermediate',
        Experienced: 'advanced',
      },
    };
    return mappings[field]?.[value] || value;
  };

  const mapFromBackend = (field, value) => {
    const mappings = {
      workMode: { remote: 'Remote', onsite: 'On-Site', hybrid: 'Hybrid' },
      jobType: {
        fulltime: 'Full-Time',
        parttime: 'Part-Time',
        casually: 'Casually',
      },
      level: {
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Experienced',
      },
    };
    return mappings[field]?.[value] || value;
  };

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setMiddleName(user.middleName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setMobNumber(user.mobile || '');
      setWorkMode(mapFromBackend('workMode', user.workingModel) || 'Remote');
      setJobType(mapFromBackend('jobType', user.jobType) || 'Full-Time');
      setLevel(mapFromBackend('level', user.level) || 'Noob');
      setEmailVerified(user.emailVerified || false);
      setPhoneVerified(user.phoneVerified || false);
    }
  }, [user]);

  const pickImage = async source => {
    try {
      let result = null;
      if (source === 'camera') {
        result = await openCamera('1:1', 0.7);
      } else {
        result = await openGallery('1:1', 0.7);
      }
      if (result?.uri) {
        setProfileImage(result.uri);
        await uploadProfilePicture(result);
      }
    } catch (error) {
      showSnackbar('Error picking image', 'error');
    } finally {
      setPickerSheetVisible(false);
    }
  };

  const uploadProfilePicture = async imageData => {
    setLoading(true);
    try {
      const extension = imageData.fileName
        ? imageData.fileName.substring(imageData.fileName.lastIndexOf('.') + 1)
        : 'jpg';

      const data = {
        uri: imageData.uri,
        type: imageData.type,
        name: `avatar.${extension}`,
      };

      const response = await dispatch(updateProfilePic(data));

      if (updateProfilePic.fulfilled.match(response)) {
        showSnackbar('Profile picture updated successfully!', 'success');
      } else {
        showSnackbar(
          response?.payload?.message || 'Failed to update profile picture',
          'error',
        );
      }
    } catch (error) {
      showSnackbar('Error uploading image', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    setLoading(true);
    try {
      const updateData = {
        firstName: firstName.trim(),
        middleName: middleName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        workingModel: mapToBackend('workMode', workMode),
        jobType: mapToBackend('jobType', jobType),
        level: mapToBackend('level', level),
      };

      const response = await dispatch(updateUserDetails(updateData));

      if (updateUserDetails.fulfilled.match(response)) {
        showSnackbar('Profile updated successfully!', 'success');
        navigation.goBack();
      } else {
        showSnackbar(
          response?.payload?.message || 'Failed to update profile',
          'error',
        );
      }
    } catch (error) {
      showSnackbar('Error updating profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = () => {
    if (!email.trim()) {
      showSnackbar('Please enter email address first', 'error');
      return;
    }
    setOtpType('email');
    setShowOtpModal(true);
    showSnackbar('OTP sent to your email', 'success');
  };

  const handleVerifyPhone = () => {
    if (!mobNumber.trim()) {
      showSnackbar('Please enter phone number first', 'error');
      return;
    }
    setOtpType('phone');
    setShowOtpModal(true);
    showSnackbar('OTP sent to your phone', 'success');
  };

  const handleOtpVerification = async () => {
    if (!otp.trim() || otp.length !== 6) {
      showSnackbar('Please enter valid 6-digit OTP', 'error');
      return;
    }

    setOtpLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (otpType === 'email') {
        setEmailVerified(true);
        showSnackbar('Email verified successfully!', 'success');
      } else {
        setPhoneVerified(true);
        showSnackbar('Phone verified successfully!', 'success');
      }

      setShowOtpModal(false);
      setOtp('');
    } catch (error) {
      showSnackbar('Invalid OTP. Please try again.', 'error');
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <CommonAppBar title="Edit Profile" navigation={navigation} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, marginHorizontal: 16, marginTop: 20 }}>
          <View style={styles.avatarContainer}>
            <View>
              {profileImage || user?.avatar ? (
                <TouchableOpacity onPress={() => setImagePreviewVisible(true)}>
                  <Image
                    source={{ uri: profileImage || user.avatar }}
                    style={styles.avatar}
                  />
                </TouchableOpacity>
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Feather
                    name="user"
                    size={80}
                    color={Colors.extraLightGrayColor}
                  />
                </View>
              )}
              <TouchableOpacity
                onPress={() => setPickerSheetVisible(true)}
                style={styles.editIcon}
              >
                <Feather name="camera" size={16} color={Colors.whiteColor} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Professional Form Sections */}
          <View style={styles.formContainer}>
            {/* Personal Information Section */}
            <View style={[styles.formSection, { paddingTop: 80 }]}>
              <Text style={styles.sectionTitle}>Personal Information</Text>

              <FloatingLabelInput
                label="First Name"
                value={firstName}
                onChangeText={setFirstName}
                required={true}
              />

              <FloatingLabelInput
                label="Middle Name (Optional)"
                value={middleName}
                onChangeText={setMiddleName}
              />

              <FloatingLabelInput
                label="Last Name"
                value={lastName}
                onChangeText={setLastName}
                required={true}
              />

              <FloatingLabelInput
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                required={true}
                showButton={!emailVerified}
                buttonText="Verify"
                onButtonPress={handleVerifyEmail}
              />
              {emailVerified && (
                <View style={styles.verifiedBadge}>
                  <Feather
                    name="check-circle"
                    size={16}
                    color={Colors.greenColor}
                  />
                  <Text style={styles.verifiedText}>Email verified</Text>
                </View>
              )}

              <FloatingLabelInput
                label="Contact Number"
                value={mobNumber}
                onChangeText={setMobNumber}
                keyboardType="phone-pad"
                required={true}
                showButton={!phoneVerified}
                buttonText="Verify"
                onButtonPress={handleVerifyPhone}
              />
              {phoneVerified && (
                <View style={styles.verifiedBadge}>
                  <Feather
                    name="check-circle"
                    size={16}
                    color={Colors.greenColor}
                  />
                  <Text style={styles.verifiedText}>Phone verified</Text>
                </View>
              )}
            </View>

            {/* Professional Preferences Section */}
            <View style={[styles.formSection, {}]}>
              <Text style={styles.sectionTitle}>Professional Preferences</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Job Type<Text style={styles.required}>*</Text>
                </Text>
                <Text style={styles.helperText}>
                  Select your preferred job type
                </Text>
                <View style={styles.optionGrid}>
                  {jobTypeOptions.map(option => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionCard,
                        jobType === option && styles.selectedOption,
                      ]}
                      onPress={() => setJobType(option)}
                    >
                      <View style={styles.optionContent}>
                        <Feather
                          name="briefcase"
                          size={20}
                          color={
                            jobType === option
                              ? Colors.primary
                              : Colors.grayColor
                          }
                        />
                        <Text
                          style={[
                            styles.optionText,
                            jobType === option && styles.selectedOptionText,
                          ]}
                        >
                          {option}
                        </Text>
                      </View>
                      {jobType === option && (
                        <View style={styles.checkmark}>
                          <Feather
                            name="check"
                            size={14}
                            color={Colors.whiteColor}
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Working Model<Text style={styles.required}>*</Text>
                </Text>
                <Text style={styles.helperText}>
                  Select your preferred working arrangement
                </Text>
                <View style={styles.optionGrid}>
                  {workModeOptions.map(option => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionCard,
                        workMode === option && styles.selectedOption,
                      ]}
                      onPress={() => setWorkMode(option)}
                    >
                      <View style={styles.optionContent}>
                        <Feather
                          name={
                            option === 'Remote'
                              ? 'home'
                              : option === 'On-Site'
                              ? 'briefcase'
                              : 'shuffle'
                          }
                          size={20}
                          color={
                            workMode === option
                              ? Colors.primary
                              : Colors.grayColor
                          }
                        />
                        <Text
                          style={[
                            styles.optionText,
                            workMode === option && styles.selectedOptionText,
                          ]}
                        >
                          {option}
                        </Text>
                      </View>
                      {workMode === option && (
                        <View style={styles.checkmark}>
                          <Feather
                            name="check"
                            size={14}
                            color={Colors.whiteColor}
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Experience Level<Text style={styles.required}>*</Text>
                </Text>
                <Text style={styles.helperText}>
                  Choose your current skill level
                </Text>
                <View style={styles.optionGrid}>
                  {levelOptions.map(option => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionCard,
                        level === option && styles.selectedOption,
                      ]}
                      onPress={() => setLevel(option)}
                    >
                      <View style={styles.optionContent}>
                        <Feather
                          name="trending-up"
                          size={20}
                          color={
                            level === option ? Colors.primary : Colors.grayColor
                          }
                        />
                        <Text
                          style={[
                            styles.optionText,
                            level === option && styles.selectedOptionText,
                          ]}
                        >
                          {option}
                        </Text>
                      </View>
                      {level === option && (
                        <View style={styles.checkmark}>
                          <Feather
                            name="check"
                            size={14}
                            color={Colors.whiteColor}
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <TouchableOpacity
              style={[styles.updateButton, loading && { opacity: 0.7 }]}
              onPress={handleUpdateUser}
              disabled={loading}
            >
              <Text style={styles.updateButtonText}>
                {loading ? 'Updating Profile...' : 'Update Profile'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <ImagePickerSheet
        visible={pickerSheetVisible}
        onClose={() => setPickerSheetVisible(false)}
        onCamera={() => pickImage('camera')}
        onGallery={() => pickImage('gallery')}
        onRemove={() => {
          setProfileImage(null);
          setPickerSheetVisible(false);
        }}
      />

      <ImagePreviewModal
        image={profileImage || user?.avatar}
        visibility={imagePreviewVisible}
        setVisibility={setImagePreviewVisible}
      />

      {/* OTP Verification Modal */}
      <Modal
        visible={showOtpModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowOtpModal(false)}
      >
        <View style={styles.otpModalOverlay}>
          <View style={styles.otpModalContent}>
            <Text style={styles.otpModalTitle}>
              Verify {otpType === 'email' ? 'Email' : 'Phone'}
            </Text>
            <Text style={styles.otpModalSubtitle}>
              Enter the 6-digit OTP sent to your{' '}
              {otpType === 'email' ? 'email' : 'phone number'}
            </Text>

            <TextInput
              style={styles.otpInput}
              value={otp}
              onChangeText={setOtp}
              placeholder="Enter OTP"
              keyboardType="numeric"
              maxLength={6}
              textAlign="center"
            />

            <View style={styles.otpModalActions}>
              <TouchableOpacity
                style={styles.otpCancelButton}
                onPress={() => {
                  setShowOtpModal(false);
                  setOtp('');
                }}
              >
                <Text style={styles.otpCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.otpVerifyButton, otpLoading && { opacity: 0.7 }]}
                onPress={handleOtpVerification}
                disabled={otpLoading}
              >
                <Text style={styles.otpVerifyText}>
                  {otpLoading ? 'Verifying...' : 'Verify'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    zIndex: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.whiteColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.extraLightGrayColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.whiteColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  editIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.whiteColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  formContainer: {
    marginTop: 60,
  },
  formSection: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 16,

    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: Colors.extraLightGrayColor,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
  },
  required: {
    color: Colors.secondary,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.extraLightGrayColor,
    borderRadius: 12,
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  lockIcon: {
    marginLeft: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.blackColor,
    paddingVertical: 12,
  },
  disabledInput: {
    color: Colors.grayColor,
    backgroundColor: 'transparent',
  },
  helperText: {
    fontSize: 12,
    color: Colors.grayColor,
    marginTop: 6,
    fontStyle: 'italic',
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  optionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.whiteColor,
    borderWidth: 2,
    borderColor: Colors.extraLightGrayColor,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedOption: {
    borderColor: Colors.primary,
    backgroundColor: '#f8f9fa',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  optionContent: {
    alignItems: 'center',
  },
  optionText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.grayColor,
    marginTop: 8,
    textAlign: 'center',
  },
  selectedOptionText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  updateButtonText: {
    color: Colors.whiteColor,
    fontSize: 16,
    fontWeight: '600',
  },
  verifyButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  verifyButtonText: {
    color: Colors.whiteColor,
    fontSize: 12,
    fontWeight: '600',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: -10,
  },
  verifiedText: {
    fontSize: 12,
    color: Colors.greenColor,
    fontWeight: '500',
  },
  otpModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  otpModalContent: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
  },
  otpModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  otpModalSubtitle: {
    fontSize: 14,
    color: Colors.grayColor,
    textAlign: 'center',
    marginBottom: 24,
  },
  otpInput: {
    borderWidth: 2,
    borderColor: Colors.extraLightGrayColor,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
    letterSpacing: 4,
  },
  otpModalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  otpCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.extraLightGrayColor,
    alignItems: 'center',
  },
  otpCancelText: {
    color: Colors.grayColor,
    fontWeight: '600',
  },
  otpVerifyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  otpVerifyText: {
    color: Colors.whiteColor,
    fontWeight: '600',
  },
});

export default EditProfileScreen;

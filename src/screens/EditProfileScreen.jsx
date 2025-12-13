import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
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

const EditProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { showSnackbar } = useSnackbar();
  const { openCamera, openGallery } = useImagePicker();

  const [name, setName] = useState('');
  const [mobNumber, setMobNumber] = useState('');
  const [workMode, setWorkMode] = useState('Remote');
  const [level, setLevel] = useState('Noob');
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [pickerSheetVisible, setPickerSheetVisible] = useState(false);

  const workModeOptions = ['Remote', 'On-Site', 'Hybrid'];
  const levelOptions = ['Noob', 'Beginner', 'Intermediate', 'Experienced'];

  // Mapping functions
  const mapToBackend = (field, value) => {
    const mappings = {
      workMode: { 'Remote': 'remote', 'On-Site': 'onsite', 'Hybrid': 'hybrid' },
      level: { 'Noob': 'beginner', 'Beginner': 'beginner', 'Intermediate': 'intermediate', 'Experienced': 'advanced' }
    };
    return mappings[field]?.[value] || value;
  };

  const mapFromBackend = (field, value) => {
    const mappings = {
      workMode: { 'remote': 'Remote', 'onsite': 'On-Site', 'hybrid': 'Hybrid' },
      level: { 'beginner': 'Beginner', 'intermediate': 'Intermediate', 'advanced': 'Experienced' }
    };
    return mappings[field]?.[value] || value;
  };

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      setName(`${user.firstName || ''} ${user.middleName || ''} ${user.lastName || ''}`.trim());
      setMobNumber(user.mobile || '');
      setWorkMode(mapFromBackend('workMode', user.workingModel) || 'Remote');
      setLevel(mapFromBackend('level', user.level) || 'Noob');
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
      } else {
        showSnackbar(response?.payload?.message || 'Failed to update profile picture', 'error');
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
      const nameParts = name.trim().split(' ');
      const updateData = {
        firstName: nameParts[0] || '',
        middleName: nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '',
        lastName: nameParts.length > 1 ? nameParts[nameParts.length - 1] : '',
        workingModel: mapToBackend('workMode', workMode),
        level: mapToBackend('level', level)
      };
      
      const response = await dispatch(updateUserDetails(updateData));
      
      if (updateUserDetails.fulfilled.match(response)) {
        showSnackbar('Profile updated successfully!', 'success');
        navigation.goBack();
      } else {
        showSnackbar(response?.payload?.message || 'Failed to update profile', 'error');
      }
    } catch (error) {
      showSnackbar('Error updating profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <CommonAppBar title="Edit Profile" navigation={navigation} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, marginHorizontal: 16, marginTop: 20 }}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={() => setPickerSheetVisible(true)}>
              {profileImage || user?.avatar ? (
                <Image
                  source={{ uri: profileImage || user.avatar }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Feather
                    name="user"
                    size={80}
                    color={Colors.extraLightGrayColor}
                  />
                </View>
              )}
              <View style={styles.editIcon}>
                <Feather name="camera" size={16} color={Colors.whiteColor} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name<Text style={{ color: Colors.secondary }}>*</Text></Text>
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Enter Your Name"
                placeholderTextColor={Colors.grayColor}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contact No.<Text style={{ color: Colors.secondary }}>*</Text></Text>
              <TextInput
                style={[
                  styles.textInput,
                  { backgroundColor: Colors.extraLightGrayColor },
                ]}
                value={mobNumber}
                onChangeText={setMobNumber}
                placeholder="Enter Contact Number"
                placeholderTextColor={Colors.grayColor}
                keyboardType="phone-pad"
                editable={false}
              />
            </View>

            <View style={styles.modeSelector}>
              <Text style={styles.sectionLabel}>
                Working Model
                <Text style={{ color: Colors.secondary }}>*</Text>
              </Text>
              <View style={styles.modeButtons}>
                {workModeOptions.map(option => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.modeButton,
                      workMode === option && styles.selectedMode,
                    ]}
                    onPress={() => setWorkMode(option)}
                  >
                    <Text
                      style={[
                        styles.roleText,
                        workMode === option && styles.selectedModeText,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.statusSelector}>
              <Text style={styles.sectionLabel}>
                Select Level
                <Text style={{ color: Colors.secondary }}>*</Text>
              </Text>
              <View style={styles.statusButtons}>
                {levelOptions.map(option => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.statusButton,
                      level === option && styles.selectedStatus,
                    ]}
                    onPress={() => setLevel(option)}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        level === option && styles.selectedStatusText,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdateUser}
              disabled={loading}
            >
              <Text style={styles.updateButtonText}>
                {loading ? 'Updating...' : 'Update'}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  formCard: {
    marginTop: 60,
    padding: 16,
    paddingTop: 60,
    backgroundColor: Colors.whiteColor,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
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
    borderWidth: 2,
    borderColor: 'lightgray',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fdfcfcff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'lightgray',
  },
  editIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.whiteColor,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.extraLightGrayColor,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 12,
    color: Colors.blackColor,
    backgroundColor: Colors.whiteColor,
  },
  modeSelector: {
    marginTop: 10,
  },
  modeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGrayColor,
    backgroundColor: Colors.whiteColor,
    alignItems: 'center',
  },
  selectedMode: {
    backgroundColor: Colors.extraLightGrayColor,
    borderColor: Colors.primary,
  },
  roleText: {
    fontSize: 12,
    color: Colors.grayColor,
  },
  selectedModeText: {
    color: Colors.primary,
    fontWeight: '500',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
    color: Colors.primary,
  },
  statusSelector: {
    marginTop: 16,
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGrayColor,
    backgroundColor: Colors.whiteColor,
    alignItems: 'center',
  },
  selectedStatus: {
    backgroundColor: Colors.extraLightGrayColor,
    borderColor: Colors.primary,
  },
  statusText: {
    fontSize: 12,
    color: Colors.grayColor,
  },
  selectedStatusText: {
    color: Colors.primary,
    fontWeight: '500',
  },
  updateButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  updateButtonText: {
    color: Colors.whiteColor,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default EditProfileScreen;
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Feather from 'react-native-vector-icons/Feather';
import MyStatusBar from '../../components/MyStatusbar';
import { CommonAppBar } from '../../components/CommonComponents';
import { Colors } from '../../styles/commonStyles';

const { height } = Dimensions.get('window');

const AddNewAddressScreen = ({ navigation, route }) => {
  const { address, selectedLocation } = route.params || {};
  const [landmark, setLandmark] = useState('');
  const [addressType, setAddressType] = useState('Home');
  const [mobileNumber, setMobileNumber] = useState('');
  const [name, setName] = useState('');
  const [newAddress, setNewAddress] = useState(address);
  const addressTypes = ['Home', 'Office', 'Work', 'Other'];

  const handleSave = () => {
    if (!name.trim() || !mobileNumber.trim()) {
      alert('Please fill all required fields');
      return;
    }

    const addressData = {
      address,
      coordinates: selectedLocation,
      landmark,    
    };
    console.log('Saving address:', addressData);
    navigation.navigate('SelectAddressScreen', { newAddress: addressData });
  };

  return (
    <SafeAreaView style={styles.container}>
      <MyStatusBar />

      <CommonAppBar title="Add New Address" navigation={navigation} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={{
              latitude: selectedLocation?.latitude || 28.6139,
              longitude: selectedLocation?.longitude || 77.209,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            {selectedLocation && <Marker coordinate={selectedLocation} />}
          </MapView>
        </View>

        {/* <View style={styles.addressContainer}>
          <Text style={styles.addressLabel}>Selected Address</Text>
          <Text style={styles.addressText}>
            {address || 'No address selected'}
          </Text>
        </View> */}

        <View style={styles.formContainer}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.textAreaInput}
            placeholder="Enter Address Details"
            placeholderTextColor={Colors.grayColor}
            value={newAddress}
            onChangeText={setNewAddress}
            multiline={true}
            textAlignVertical="top"
          />
          <Text style={styles.label}>Landmark (Optional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter landmark"
            placeholderTextColor={Colors.grayColor}
            value={landmark}
            onChangeText={setLandmark}
          />

          <Text style={styles.label}>Address Type</Text>
          <View style={styles.addressTypeContainer}>
            {addressTypes.map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  addressType === type && styles.selectedTypeButton,
                ]}
                onPress={() => setAddressType(type)}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    addressType === type && styles.selectedTypeButtonText,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your name"
            placeholderTextColor={Colors.grayColor}
            value={name}
            onChangeText={setName}
          /> */}

          {/* <Text style={styles.label}>Mobile Number *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter mobile number"
            placeholderTextColor={Colors.grayColor}
            keyboardType="phone-pad"
            value={mobileNumber}
            onChangeText={setMobileNumber}
          /> */}
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={()=>navigation.pop(2)}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Address</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },

  scrollView: {
    flex: 1,
  },
  mapContainer: {
    height: height * 0.3,
    width: '100%',
  },
  map: {
    flex: 1,
  },
  addressContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.extraLightGrayColor,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.blackColor,
    marginBottom: 8,
  },
  addressText: {
    fontSize: 12,
    color: Colors.lightBlackColor,
    lineHeight: 20,
  },
  formContainer: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.blackColor,
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.extraLightGrayColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 12,
    color: Colors.blackColor,
  },
  textAreaInput: {
    borderWidth: 1,
    borderColor: Colors.extraLightGrayColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 12,
    height: 100,
    color: Colors.blackColor,
  },

  addressTypeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.extraLightGrayColor,
    borderRadius: 20,
  },
  selectedTypeButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  typeButtonText: {
    fontSize: 12,
    color: Colors.lightBlackColor,
  },
  selectedTypeButtonText: {
    color: Colors.whiteColor,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    gap: 12,
    borderTopColor: Colors.extraLightGrayColor,
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
    cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.grayColor,
    // backgroundColor: Colors.secondary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.whiteColor,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: Colors.grayColor,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddNewAddressScreen;

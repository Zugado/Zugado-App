import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Text,
  Platform,
  PermissionsAndroid,
  TextInput,
  FlatList,
  Modal,
  Keyboard,
  Linking,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyStatusBar from '../../components/MyStatusbar';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Key } from '../../constants/key';
import { Colors } from '../../styles/commonStyles';
import Feather from 'react-native-vector-icons/Feather';
import FloatingLabelInput from '../../components/inputFields/FloatingLabelInput';

const AUTOCOMPLETE_URL =
  'https://maps.googleapis.com/maps/api/place/autocomplete/json';
const DETAILS_URL = 'https://maps.googleapis.com/maps/api/place/details/json';

const LocationPickerScreen = ({ navigation, route }) => {
  const mapkey = Key.mapApiKey;
  console.log('[debug] API key loaded:', mapkey ? 'YES' : 'NO');

  const mapRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: 28.6139,
    longitude: 77.209,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [addressComponents, setAddressComponents] = useState({
    country: '',
    state: '',
    city: '',
    pincode: '',
    formattedAddress: '',
  });
  const [country, setCountry] = useState(addressComponents?.country);
  const [city, setCity] = useState(addressComponents?.city);
  const [address, setAddress] = useState(addressComponents?.formattedAddress);
  const [pinCode, setPinCode] = useState(addressComponents?.pinCode);
  const [state, setState] = useState(addressComponents?.state);
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [landmark, setLandmark] = useState('');
  const [addressType, setAddressType] = useState('Home');
  const [isConfirmed, setConfirmed] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const addressTypes = ['Home', 'Office', 'Work', 'Other'];

  const decodeAddress = addressComponents => {
    const decoded = {
      country: '',
      state: '',
      city: '',
      pincode: '',
      formattedAddress: '',
    };

    addressComponents.forEach(component => {
      const types = component.types;

      if (types.includes('country')) {
        decoded.country = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        decoded.state = component.long_name;
      } else if (
        types.includes('locality') ||
        types.includes('administrative_area_level_2')
      ) {
        decoded.city = component.long_name;
      } else if (types.includes('postal_code')) {
        decoded.pincode = component.long_name;
      }
    });

    return decoded;
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (hasPermission) {
          console.log('[perm] already granted');
          return true;
        }

        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'App needs access to your location to show nearby services',
            buttonPositive: 'Allow',
            buttonNegative: 'Deny',
          },
        );
        console.log('[perm] granted:', granted);

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('[perm] error:', err);
        return false;
      }
    }
    return true;
  };

  const getUserLocation = async () => {
    console.log('[loc] fetching user location...');
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Cannot access location');
      return;
    }

    Geolocation.getCurrentPosition(
      async position => {
        console.log('[loc] position:', position);
        const { latitude, longitude } = position.coords;
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        };

        setRegion(newRegion);
        setCurrentLocation({ latitude, longitude });
        setSelectedLocation({ latitude, longitude });
        await fetchAddressFromCoordinates(latitude, longitude);

        mapRef.current?.animateToRegion(newRegion, 1000);
      },
      error => {
        console.log('[loc] error code:', error.code);
        console.log('[loc] error message:', error.message);
        console.log('[loc] full error:', error);

        if (error.code === 1) {
          Alert.alert(
            'Permission Required',
            'Location permission is needed. Please go to Settings > Apps > Your App > Permissions and enable Location.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ],
          );
        } else if (error.code === 2) {
          Alert.alert(
            'Enable GPS',
            'GPS is turned off. Please enable Location/GPS in your device settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ],
          );
        } else if (error.code === 3) {
          Alert.alert(
            'Timeout',
            'Location request timed out. Please try again.',
          );
        } else {
          Alert.alert('Location Error', 'Could not get current location');
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  };

  const fetchAddressFromCoordinates = async (lat, lng) => {
    console.log('[geo] reverse geocode for:', lat, lng);
    setIsLoading(true);
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${mapkey}`;
      console.log('[geo] API URL:', url);

      const res = await fetch(url);
      const data = await res.json();

      // console.log('[geo] Full response:', JSON.stringify(data, null, 2));
      // console.log('[geo] Status:', data?.status);
      // console.log('[geo] Results count:', data?.results?.length);

      if (data?.status === 'OK' && data?.results?.length > 0) {
        const result = data.results[0];
        const address = result.formatted_address;
        const components = decodeAddress(result.address_components || []);
        components.formattedAddress = address;

        console.log('[geo] Found address:', address);
        console.log('[geo] Address components:', components);
        setAddress(address);
        setAddressComponents(components);
      } else {
        console.log(
          '[geo] No results or error status:',
          data?.status,
          data?.error_message,
        );
        setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }
    } catch (error) {
      console.log('[geo] Network error:', error);
      setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapPress = async event => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    console.log('[map] pressed at:', latitude, longitude);
    setSelectedLocation({ latitude, longitude });
    await fetchAddressFromCoordinates(latitude, longitude);
  };

  const debounce = (fn, delay = 350) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  };

  const runPlacesAutocomplete = async text => {
    if (!text?.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      setIsSearching(true);
      console.log('[places] query:', text);
      const url =
        `${AUTOCOMPLETE_URL}?key=${mapkey}` +
        `&input=${encodeURIComponent(text)}` +
        `&language=en` +
        `&components=country:in`;
      const res = await fetch(url);
      const data = await res.json();
      console.log(
        '[places] status:',
        data?.status,
        'predictions:',
        data?.predictions?.length,
      );
      if (data?.status === 'OK') {
        setSuggestions(data.predictions || []);
      } else {
        setSuggestions([]);
      }
    } catch (e) {
      console.log('[places] error:', e);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedAutocomplete = useCallback(
    debounce(runPlacesAutocomplete, 400),
    [],
  );

  const onChangeQuery = text => {
    setQuery(text);
    debouncedAutocomplete(text);
  };

  const handleSuggestionPress = async item => {
    try {
      console.log('[places] pick:', item?.description, item?.place_id);
      Keyboard.dismiss();
      setSuggestions([]);
      setQuery(item?.description || '');

      const url =
        `${DETAILS_URL}?key=${mapkey}` +
        `&place_id=${item.place_id}` +
        `&fields=formatted_address,geometry,address_components`;
      const res = await fetch(url);
      const data = await res.json();
      console.log('[details] status:', data?.status);
      if (data?.status === 'OK') {
        const loc = data.result.geometry?.location;
        const formatted = data.result.formatted_address || item.description;
        if (loc?.lat && loc?.lng) {
          const newRegion = {
            latitude: loc.lat,
            longitude: loc.lng,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          };
          setRegion(newRegion);
          setSelectedLocation({ latitude: loc.lat, longitude: loc.lng });
          setAddress(formatted);

          // Decode address components
          const components = decodeAddress(
            data.result.address_components || [],
          );
          components.formattedAddress = formatted;
          setAddressComponents(components);

          try {
            mapRef.current?.animateCamera({ center: newRegion, zoom: 15 });
          } catch (e) {
            console.log('[map] animateCamera error:', e);
          }
        }
      }
    } catch (e) {
      console.log('[details] error:', e);
    }
  };

  const handleAddAddress = () => {
    if (!name.trim() || !mobileNumber.trim() || !address.trim()) {
      Alert.alert(
        'Missing Fields',
        'Please fill Name, Mobile Number and ensure location is selected.',
      );
      return;
    }

    const addressData = {
      name: name.trim(),
      mobileNumber: mobileNumber.trim(),
      landmark: landmark.trim(),
      addressType,
      address: address.trim(),
      coordinates: selectedLocation,
      addressComponents,
    };

    console.log('Address Data:', JSON.stringify(addressData, null, 2));

    // Check if we need to return to CreateJobScreen2
    const { returnScreen, jobData } = route.params || {};
    if (returnScreen === 'CreateJobScreen2') {
      navigation.navigate('CreateJobScreen2', {
        jobData,
        selectedLocation: {
          address: address.trim(),
          coordinates: selectedLocation,
          addressComponents,
        },
      });
    } else {
      Alert.alert('Success', 'Address saved successfully!');
      navigation.goBack();
    }
  };

  const renderSuggestion = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSuggestionPress(item)}
    >
      <Ionicons name="location-outline" size={18} color={Colors.grayColor} />
      <Text style={styles.suggestionText} numberOfLines={1}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeAreaBlack}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={Colors.grayColor} />
          <TextInput
            value={query}
            onChangeText={onChangeQuery}
            placeholder="Search location..."
            placeholderTextColor={Colors.grayColor}
            style={styles.searchInput}
            returnKeyType="search"
          />
          {query?.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setQuery('');
                setSuggestions([]);
              }}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={Colors.grayColor}
              />
            </TouchableOpacity>
          )}
        </View>

        {(suggestions.length > 0 || isSearching) && (
          <View style={styles.suggestionsContainer}>
            {isSearching ? (
              <View style={styles.suggestionLoading}>
                <ActivityIndicator size="small" color={Colors.primary} />
                <Text style={styles.loadingText}>Searching…</Text>
              </View>
            ) : (
              <FlatList
                keyboardShouldPersistTaps="handled"
                data={suggestions}
                keyExtractor={it => it.place_id}
                renderItem={renderSuggestion}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            )}
          </View>
        )}

        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          region={region}
          onPress={handleMapPress}
          showsUserLocation={!!currentLocation}
          onMapReady={() => console.log('[map] ready')}
        >
          {selectedLocation && <Marker coordinate={selectedLocation} />}
        </MapView>

        <TouchableOpacity
          style={styles.fab}
          onPress={getUserLocation}
          activeOpacity={0.8}
        >
          <Ionicons name="locate-outline" size={22} color={Colors.whiteColor} />
        </TouchableOpacity>

        {address && !isConfirmed && (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              backgroundColor: Colors.whiteColor,
              borderTopRightRadius: 22,
              borderTopLeftRadius: 22,
              elevation: 3,
              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowRadius: 6,
              paddingTop: 10,
              paddingBottom: Platform.OS === 'ios' ? 20 : 20,
              paddingHorizontal: 16,
              maxHeight: '70%',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather
                name="map-pin"
                size={20}
                color="#000"
                style={{ marginBottom: 1 }}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  marginLeft: 4,
                }}
              >
                Selected Location
              </Text>
            </View>

            <Text
              style={{
                fontSize: 12,
                fontWeight: '400',
                marginVertical: 10,
              }}
            >
              {address}
            </Text>
            <TouchableOpacity
              style={styles.bottomBtn}
              onPress={() => setConfirmed(true)}
              activeOpacity={0.9}
            >
              <Text style={styles.bottomBtnText}>
                Confirm Location & Continue
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Modal
          visible={isConfirmed}
          transparent
          animationType="slide"
          onPress={() => setConfirmed(false)}
        >
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            // onPress={() => setConfirmed(false)}
          >
            {/* Prevent outside touch from closing when user interacts inside */}
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                backgroundColor: Colors.whiteColor,
                borderTopRightRadius: 22,
                borderTopLeftRadius: 22,
                elevation: 3,
                shadowColor: '#000',
                shadowOpacity: 0.08,
                shadowRadius: 6,
                paddingTop: 20,
                maxHeight: '80%',
              }}
            >
              {/* Drag indicator */}
              <TouchableOpacity
                onPress={() => setConfirmed(false)}
                style={{
                  height: 8,
                  width: 80,
                  backgroundColor: '#969696ff',
                  alignSelf: 'center',
                  borderRadius: 4,
                  marginBottom: 20,
                }}
              />

              {/* Close button */}
              <TouchableOpacity
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: 54,
                  backgroundColor: Colors.whiteColor,
                  borderColor: Colors.blackColor,
                  borderWidth: 1,
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => setConfirmed(false)}
                activeOpacity={0.8}
              >
                <Feather name="x" size={20} color="#000" />
              </TouchableOpacity>

              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                // style={{ paddingVertical: 20 }}
              >
                <View style={{ paddingHorizontal: 16 }}>
                  {/* Header */}
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Feather name="map-pin" size={20} color="#000" />
                    <Text
                      style={{ fontSize: 16, fontWeight: '600', marginLeft: 4 }}
                    >
                      Selected Location
                    </Text>
                  </View>

                  {/* <Text style={{ fontSize: 12, marginVertical: 10 }}>
                    {address}
                  </Text> */}

                  <View style={styles.addressComponentsContainer}>
                   
                    <Text style={styles.componentText}>
                     {addressComponents.formattedAddress}
                    </Text>
                  </View>

                  {/* Inputs */}
                  <View style={{ marginTop: 16 }}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 10,
                      }}
                    >
                      <FloatingLabelInput
                        label="Country"
                        value={country || addressComponents.country}
                        onChangeText={setCountry}
                        placeholder="Enter Country"
                        required
                      />
                      <FloatingLabelInput
                        label="State"
                        value={state || addressComponents.state}
                        onChangeText={setState}
                        placeholder="Enter State"
                        required
                      />
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 10,
                      }}
                    >
                      <FloatingLabelInput
                        label="City"
                        value={city || addressComponents.city}
                        onChangeText={setCity}
                        placeholder="Enter City"
                        required
                      />

                      <FloatingLabelInput
                        label="Pin Code"
                        value={pinCode || addressComponents.pincode}
                        onChangeText={setPinCode}
                        placeholder="Enter Pin Code"
                        keyboardType="phone-pad"
                        required
                      />
                    </View>
                    <FloatingLabelInput
                      label="Landmark"
                      value={landmark}
                      onChangeText={setLandmark}
                      placeholder="Enter landmark (optional)"
                    />

                    <FloatingLabelInput
                      label="Address"
                      required={true}
                      value={address}
                      onChangeText={setAddress}
                      multiline
                      numberOfLines={2}
                      placeholder="Enter or edit address manually"
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
                              addressType === type &&
                                styles.selectedTypeButtonText,
                            ]}
                          >
                            {type}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Save button */}
                  <TouchableOpacity
                    style={[styles.bottomBtn, { marginBottom: 40 }]}
                    onPress={handleAddAddress}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.bottomBtnText}>Save Address</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </TouchableOpacity>
        </Modal>

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default LocationPickerScreen;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  safeAreaBlack: {
    flex: 1,
    backgroundColor: '#000000',
  },
  searchContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
    color: Colors.blackColor,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 66,
    left: 16,
    right: 16,
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
    zIndex: 10,
    maxHeight: 240,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  suggestionText: {
    marginLeft: 8,
    flex: 1,
    color: Colors.lightBlackColor,
  },
  suggestionLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  loadingText: {
    marginLeft: 8,
    color: Colors.grayColor,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.extraLightGrayColor,
  },
  fab: {
    position: 'absolute',
    bottom: 250,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  bottomBtn: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  bottomBtnText: {
    color: Colors.whiteColor,
    fontWeight: '700',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  addressComponentsContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  componentText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.blackColor,
    marginBottom: 8,
    marginTop: 16,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
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
});

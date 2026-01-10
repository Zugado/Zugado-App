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
  Keyboard,
  Linking,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyStatusBar from '../../components/MyStatusbar';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Key } from '../../constants/key';
import { Colors } from '../../styles/commonStyles';
import Feather from 'react-native-vector-icons/Feather';
import {
  saveAddress,
  updateAddress,
  getSavedAddresses,
} from '../../utils/addressStorage';
import { useSelector } from 'react-redux';
import { useSnackbar } from '../../contexts/SnackbarContext';
import FloatingLabelInput from '../../components/inputFields/FloatingLabelInput';
import { CommonAppBar } from '../../components/CommonComponents';

const AUTOCOMPLETE_URL =
  'https://maps.googleapis.com/maps/api/place/autocomplete/json';
const DETAILS_URL = 'https://maps.googleapis.com/maps/api/place/details/json';

const { height: screenHeight } = Dimensions.get('window');

const LocationPickerScreen = ({ navigation, route }) => {
  const { user } = useSelector(state => state.auth);
  const { showSnackbar } = useSnackbar();
  const { editAddressId } = route.params || {};
  const mapkey = Key.mapApiKey;
  
  // Bottom sheet animation
  const bottomSheetHeight = useRef(new Animated.Value(0)).current;
  const minHeight = screenHeight * 0.4;
  const maxHeight = screenHeight * 0.8;
  
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
    streetNumber: '',
    route: '',
    sublocality: '',
    locality: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    formattedAddress: '',
  });
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [state, setState] = useState('');
  const [landmark, setLandmark] = useState('');
  const [addressType, setAddressType] = useState('Home');
  const [customAddressName, setCustomAddressName] = useState('');
  const [isConfirmed, setConfirmed] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Pan responder for drag gesture
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dy) > 10;
    },
    onPanResponderMove: (_, gestureState) => {
      const newHeight = maxHeight - gestureState.dy;
      if (newHeight >= minHeight && newHeight <= maxHeight) {
        bottomSheetHeight.setValue(newHeight);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      const velocity = gestureState.vy;
      const currentHeight = maxHeight - gestureState.dy;
      
      let targetHeight;
      if (velocity > 0.5) {
        // Fast swipe down - minimize
        targetHeight = minHeight;
      } else if (velocity < -0.5) {
        // Fast swipe up - maximize
        targetHeight = maxHeight;
      } else {
        // Slow drag - snap to nearest
        const midPoint = (minHeight + maxHeight) / 2;
        targetHeight = currentHeight > midPoint ? maxHeight : minHeight;
      }
      
      Animated.spring(bottomSheetHeight, {
        toValue: targetHeight,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }).start();
    },
  });

  const addressTypes = ['Home', 'Office', 'Work', 'Other'];

  const getReadableArea = (components) => {
    const parts = [];
    if (components?.route) parts.push(components.route);
    if (components?.sublocality) parts.push(components.sublocality);
    if (components?.locality && components?.locality !== components?.city) parts.push(components.locality);
    return parts.join(', ') || components?.formattedAddress?.split(',')[1]?.trim() || '';
  };

  const decodeAddress = addressComponents => {
    const decoded = {
      streetNumber: '',
      route: '',
      sublocality: '',
      locality: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      formattedAddress: '',
    };

    addressComponents.forEach(component => {
      const types = component.types;
      if (types.includes('street_number')) {
        decoded.streetNumber = component.long_name;
      } else if (types.includes('route')) {
        decoded.route = component.long_name;
      } else if (types.includes('sublocality_level_1') || types.includes('sublocality')) {
        decoded.sublocality = component.long_name;
      } else if (types.includes('locality')) {
        decoded.locality = component.long_name;
      } else if (types.includes('administrative_area_level_2')) {
        decoded.city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        decoded.state = component.long_name;
      } else if (types.includes('country')) {
        decoded.country = component.long_name;
      } else if (types.includes('postal_code')) {
        decoded.postalCode = component.long_name;
      }
    });

    return decoded;
  };

  useEffect(() => {
    getUserLocation();
    if (editAddressId) {
      loadAddressForEdit();
    }
  }, [editAddressId]);

  const loadAddressForEdit = async () => {
    try {
      const addresses = await getSavedAddresses(user?.id || user?._id);
      const addressToEdit = addresses.find(addr => addr.id === editAddressId);
      if (addressToEdit) {
        setAddress(addressToEdit.address);
        setLandmark(addressToEdit.landmark || '');
        setAddressType(addressToEdit.addressType);
        setSelectedLocation(addressToEdit.coordinates);
        setAddressComponents(addressToEdit.addressComponents);
        setConfirmed(true);
        bottomSheetRef.current?.expand();
      }
    } catch (error) {
      showSnackbar('Failed to load address', 'error');
    }
  };

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

  const handleAddAddress = async () => {
    if (!address.trim()) {
      Alert.alert('Missing Fields', 'Please enter house/flat/building number.');
      return;
    }

    if (addressType === 'Other' && !customAddressName.trim()) {
      Alert.alert('Missing Fields', 'Please enter a custom name for this address.');
      return;
    }

    const areaValue = getReadableArea(addressComponents);
    if (!areaValue.trim()) {
      Alert.alert('Missing Area', 'Area information is required from selected location.');
      return;
    }

    try {
      const combinedAddress = [
        address.trim(),
        areaValue.trim(),
        landmark.trim(),
        city || addressComponents?.locality || addressComponents?.city,
        state || addressComponents?.state,
        country || addressComponents?.country,
        postalCode || addressComponents?.postalCode
      ].filter(Boolean).join(', ');

      const addressData = {
        houseNumber: address.trim(),
        area: areaValue.trim(),
        landmark: landmark.trim(),
        city: city || addressComponents?.locality || addressComponents?.city,
        state: state || addressComponents?.state,
        country: country || addressComponents?.country,
        postalCode: postalCode || addressComponents?.postalCode,
        addressType: addressType === 'Other' ? customAddressName.trim() : addressType,
        fullAddress: combinedAddress,
        coordinates: selectedLocation,
        addressComponents,
      };

      if (editAddressId) {
        await updateAddress(user?.id || user?._id, editAddressId, addressData);
        showSnackbar('Address updated successfully', 'success');
      } else {
        await saveAddress(user?.id || user?._id, addressData);
        showSnackbar('Address saved successfully', 'success');
      }

      if (route.params?.returnScreen) {
        navigation.navigate(route.params.returnScreen, {
          selectedLocation: {
            address: combinedAddress,
            coordinates: selectedLocation,
            addressData: addressData
          },
          jobData: route.params?.jobData
        });
      } else {
        navigation.goBack();
      }
    } catch (error) {
      showSnackbar(
        editAddressId ? 'Failed to update address' : 'Failed to save address',
        'error',
      );
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
      <CommonAppBar title={"Select Location"} navigation={navigation}/>
     
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
          <View style={styles.confirmLocationSheet}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather name="map-pin" size={20} color="#000" />
              <Text style={styles.confirmTitle}>Selected Location</Text>
            </View>
            <Text style={styles.confirmAddress}>{address}</Text>
            <TouchableOpacity
              style={styles.bottomBtn}
              onPress={() => {
                setAddress(''); // Clear address field for user input
                setConfirmed(true);
                Animated.spring(bottomSheetHeight, {
                  toValue: maxHeight,
                  useNativeDriver: false,
                  tension: 100,
                  friction: 8,
                }).start();
              }}
              activeOpacity={0.9}
            >
              <Text style={styles.bottomBtnText}>
                Confirm Location & Continue
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {isConfirmed && (
          <View style={{flex:1,backgroundColor:"#00000083",position:"absolute",top:0,left:0,right:0,bottom:0,zIndex:9999}}>
          <Animated.View
            style={[
              styles.bottomSheet,
              {
                height: bottomSheetHeight,
                transform: [
                  {
                    translateY: Animated.subtract(screenHeight, bottomSheetHeight),
                  },
                ],
              },
            ]}
          >
            <View style={styles.dragHandle}>
              <View style={styles.dragIndicator} />
            </View>
            
            <View {...panResponder.panHandlers} style={styles.sheetHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Feather name="map-pin" size={20} color="#000" />
                <Text style={styles.sheetTitle}>Selected Location</Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setConfirmed(false);
                  bottomSheetHeight.setValue(0);
                }}
              >
                <Feather name="x" size={20} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.sheetContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 100 }}
            >
              <View style={styles.addressComponentsContainer}>
                <Text style={styles.componentText}>
                  {addressComponents?.formattedAddress}
                </Text>
              </View>

              <View style={styles.inputsContainer}>

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

                {addressType === 'Other' && (
                  <FloatingLabelInput
                    label="Custom Address Name"
                    value={customAddressName}
                    onChangeText={setCustomAddressName}
                    placeholder="Enter custom name for this address"
                    required={true}
                  />
                )}

                <FloatingLabelInput
                  label="House/Flat/Building No."
                  required={true}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter house, flat or building number"
                />

                <FloatingLabelInput
                  label="Area/Locality"
                  value={getReadableArea(addressComponents)}
                  onChangeText={() => {}}
                  placeholder="Area from selected location"
                  editable={false}
                  required={true}
                />

                <FloatingLabelInput
                  label="Landmark (Optional)"
                  value={landmark}
                  onChangeText={setLandmark}
                  placeholder="Enter nearby landmark"
                />


                <View style={styles.inputRow}>
                  <FloatingLabelInput
                    label="Country"
                    value={country || addressComponents?.country}
                    onChangeText={setCountry}
                    placeholder="Enter Country"
                    editable={false}
                    required
                  />
                  <FloatingLabelInput
                    label="State"
                    value={state || addressComponents?.state}
                    onChangeText={setState}
                    placeholder="Enter State"
                    editable={false}
                    required
                  />
                </View>
                <View style={styles.inputRow}>
                  <FloatingLabelInput
                    label="City"
                    value={city || addressComponents?.locality || addressComponents?.city}
                    onChangeText={setCity}
                    placeholder="Enter City"
                    editable={false}
                    required
                  />
                  <FloatingLabelInput
                    label="Postal Code"
                    value={postalCode || addressComponents?.postalCode}
                    onChangeText={setPostalCode}
                    placeholder="Enter Postal Code"
                    editable={false}
                    keyboardType="phone-pad"
                    required
                  />
                </View>
                
                
                

                
              </View>

              <View style={styles.buttonWrapper}>
                <TouchableOpacity
                  style={styles.bottomBtn}
                  onPress={handleAddAddress}
                  activeOpacity={0.9}
                >
                  <Text style={styles.bottomBtnText}>
                    {editAddressId ? 'Update Address' : 'Save Address'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
          </View>
        )}

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
  safeAreaBlack: {
    flex: 1,
    backgroundColor: '#ffffffff',
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
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderColor:"#9f9e9e8d",
    borderWidth:1,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 8 : 2,
    color: Colors.blackColor,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 66,
    left: 16,
    right: 16,
    backgroundColor: Colors.whiteColor,
    borderRadius: 8,
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
  confirmLocationSheet: {
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
  },
  confirmTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  confirmAddress: {
    fontSize: 12,
    fontWeight: '400',
    marginVertical: 10,
  },
  bottomBtn: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 40,
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
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  dragHandle: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  dragIndicator: {
    width: 80,
    height: 6,
    backgroundColor: '#969696',
    borderRadius: 2,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.extraLightGrayColor,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  sheetContent: {
    flex: 1,
    maxHeight: '85%',
  },
  closeButton: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: Colors.whiteColor,
    borderColor: Colors.blackColor,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressComponentsContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  componentText: {
    fontSize: 12,
    color: '#666',
  },
  inputsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
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


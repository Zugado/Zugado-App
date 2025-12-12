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
  Image,
} from 'react-native';

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Key } from '../../constants/key';
import { Colors } from '../../styles/commonStyles';

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
  const [address, setAddress] = useState('');

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  useEffect(() => {
    getUserLocation();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        // Check if permission is already granted
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
      
      console.log('[geo] Full response:', JSON.stringify(data, null, 2));
      console.log('[geo] Status:', data?.status);
      console.log('[geo] Results count:', data?.results?.length);
      
      if (data?.status === 'OK' && data?.results?.length > 0) {
        const address = data.results[0].formatted_address;
        console.log('[geo] Found address:', address);
        setAddress(address);
      } else {
        console.log('[geo] No results or error status:', data?.status, data?.error_message);
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
        `&fields=formatted_address,geometry`;
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

  const handleSubmit = () => {
    console.log(
      '[submit] selectedLocation:',
      selectedLocation,
      'address:',
      address,
    );
    if (!selectedLocation || !address) {
      Alert.alert('No Location Selected', 'Please select a location first.');
      return;
    }
    
    navigation.navigate('AddNewAddressScreen', {
      address,
      selectedLocation,
    });
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
            <Ionicons name="close-circle" size={18} color={Colors.grayColor} />
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
      {address && (
        <View
          style={{
            position: 'absolute',
            bottom: 110,
            left: 16,
            right: 16,
            minHeight: 80,
            padding: 10,
            backgroundColor: Colors.whiteColor,
            borderRadius: 12,
            elevation: 3,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 6,
          }}
        >
          <Text>
            <Text style={{ fontWeight: '700' }}>Address:</Text> {address}
          </Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.bottomBtn}
        onPress={handleSubmit}
        activeOpacity={0.9}
      >
        <Text style={styles.bottomBtnText}>Select Location</Text>
      </TouchableOpacity>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
    </View>
  );
};

export default LocationPickerScreen;

const styles = StyleSheet.create({
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
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
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
});

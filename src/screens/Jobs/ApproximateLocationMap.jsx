import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import MyStatusBar from '../../components/MyStatusbar';
import { CommonAppBar } from '../../components/CommonComponents';
import { getApproximateLocation } from '../../utils/locationUtils';

export default function ApproximateLocationMap({ navigation, route }) {
  const { coordinates, address } = route.params;
  const radiusInKm = 1;
  const radiusInMeters = radiusInKm * 1000;
  
  const [lng, lat] = getApproximateLocation(coordinates, radiusInKm);

  return (
    <SafeAreaView style={styles.container}>
      <MyStatusBar backgroundColor="#fff" barStyle="dark-content" />
      
      <CommonAppBar
        title="Approximate Location"
        onBackPress={() => navigation.goBack()}
        showNotificationIcon={false}
      />

      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
      >
        <Circle
          center={{ latitude: lat, longitude: lng }}
          radius={radiusInMeters}
          fillColor="rgba(0, 0, 0, 0.1)"
          strokeColor="rgba(0, 0, 0, 0.3)"
          strokeWidth={2}
        />
      </MapView>

      <View style={styles.infoCard}>
        <View style={styles.tagContainer}>
          <Text style={styles.tagText}>📍 Somewhere in this area</Text>
        </View>
        <Text style={styles.infoText}>{address}</Text>
        <Text style={styles.noteText}>
          Exact location will be shared after you're hired for this job
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  infoCard: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
});

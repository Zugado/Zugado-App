// components/Header.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import { selectLocationAddress } from '../store/selector';

const Header = ({ showSearch = true }) => {
  const locationAddress = useSelector(selectLocationAddress);
  const [isQuickJobFirst, setIsQuickJobFirst] = useState(true);
  return (
    <View style={styles.headerContainer}>
      {/* Row 1: Location, Logo & Icons */}
      <View style={styles.topRow}>
        <View style={styles.locationContainer}>
          <Image
            source={require('../assets/Icons/Location2.png')}
            style={styles.icon}
          />
          <View>
            <Text style={styles.locationText}>
              {locationAddress?.city || 'Noida'}
            </Text>
            <Text style={styles.pincodeText}>
              {locationAddress?.postcode || '201301'}
            </Text>
          </View>
        </View>

        <Image
          source={require('../assets/Icons/LogoSplash.png')}
          style={styles.logo}
        />

        <View style={styles.iconsContainer}>
          <TouchableOpacity>
            <Image
              source={require('../assets/Icons/Saved.png')}
              style={styles.icon}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.bellIconContainer}>
            <Image
              source={require('../assets/Icons/Notification.png')}
              style={styles.icon}
            />
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>12</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Row 2: Search bar + Job button */}
      {showSearch && (
        <View style={styles.searchWrapper}>
          <View style={styles.searchSection}>
            <Feather name="search" style={styles.searchIcon} />
            <TextInput
              placeholder="Search Here..."
              placeholderTextColor="#888"
              style={styles.searchInput}
            />
          </View>
          <TouchableOpacity 
            style={[styles.jobButton, { backgroundColor: isQuickJobFirst ? '#000' : '#22c55e' }]}
            onPress={() => setIsQuickJobFirst(!isQuickJobFirst)}
            activeOpacity={0.8}
          >
            {isQuickJobFirst ? (
              <>
                <Entypo name="flash" style={styles.jobIcon} />
                <Text style={styles.jobText}>Job</Text>
              </>
            ) : (
              <>
                <Text style={styles.jobText}>Job</Text>
                <Entypo name="flash" style={styles.jobIcon} />
              </>
            )}
          </TouchableOpacity>

        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#000',
    paddingHorizontal: 15,
    paddingTop: 0,
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pincodeText: {
    color: '#888',
    fontSize: 12,
  },
  logo: {
    flex: 1,
    resizeMode: 'contain',
    height: 30,
    marginTop: 6,
  },
  iconsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  icon: {
    width: 22,  // unified icon size
    height: 22,
    resizeMode: 'contain',
  },
  bellIconContainer: {
    marginLeft: 18,
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 12,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    overflow: 'hidden',
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
  },
  searchIcon: {
    color: '#000',
    fontSize: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#000',
    paddingVertical: 10,
    fontSize: 16,
  },
  jobButton: {
    flexDirection: 'row',
    gap: 4,
    // borderColor: '#000000ff',
    // borderWidth: 1,
    alignItems: 'center',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.3,
    // shadowRadius: 3,
    // elevation: 5,
    borderRadius: 25,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 5,
    marginVertical: 5,
  },
  jobIcon: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
    color: '#000',
    fontSize: 16,
    // marginHorizontal: 5,
  },
  jobText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default Header;

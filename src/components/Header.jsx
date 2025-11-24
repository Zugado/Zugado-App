// components/Header.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  // ScrollView is not used, you can remove it
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo'; // For the 'flash' icon

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      {/* Row 1: Location & Logo */}
      <View style={styles.topRow}>
        <View style={styles.locationContainer}>
          <MaterialIcons name="location-on" style={styles.locationIcon} />
          <View>
            <Text style={styles.locationText}>Noida</Text>
            <Text style={styles.pincodeText}>201301</Text>
          </View>
        </View>

        <Text style={styles.logo}>Zugado</Text>

        {/* --- ICONS ADDED HERE --- */}
        <View style={styles.iconsContainer}>
          <TouchableOpacity>
            <Feather name="bookmark" style={styles.icon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.bellIconContainer}>
            <Feather name="bell" style={styles.icon} />
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>12</Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* --- End of icons --- */}

      </View>

      {/* Row 2: Search & Job Button */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchSection}>
          <Feather name="search" style={styles.searchIcon} />
          <TextInput
            placeholder="Search Here..."
            placeholderTextColor="#888"
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity style={styles.jobButton}>
          <Entypo name="flash" style={styles.jobIcon} />
          <Text style={styles.jobText}>Job</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#000000',
    paddingHorizontal: 15,
    paddingVertical: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationContainer: {
    flex: 1, // Takes up 1/3 of the space
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    color: '#fff',
    fontSize: 22,
    marginRight: 5,
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
    flex: 1, // Takes up 1/3 of the space
    textAlign: 'center',
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },

  // --- NEW STYLES FOR ICONS ---
  iconsContainer: {
    flex: 1, // Takes up 1/3 of the space
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  icon: {
    color: '#fff',
    fontSize: 24,
  },
  bellIconContainer: {
    marginLeft: 20, // Space between bookmark and bell
    position: 'relative', // Needed for the badge
  },
  badgeContainer: {
    position: 'absolute',
    top: -8,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // --- END OF NEW STYLES ---

  // Styles for Search Bar (from previous step)
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    marginBottom: 15, // Adjusted from 15 to 0 as it's the last item
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
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 5,
    marginVertical: 5,
  },
  jobIcon: {
    color: '#fff',
    fontSize: 16,
    marginRight: 5,
  },
  jobText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Header;
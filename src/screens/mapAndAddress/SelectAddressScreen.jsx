import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import MyStatusBar from '../../components/MyStatusbar';
import { CommonAppBar } from '../../components/CommonComponents';
import { Colors } from '../../styles/commonStyles';
const dummyaddresses = [
  {
    id: '1',
    type: 'Home',
    address: '123 Main Street, Downtown Area, New York, NY 10001',
    landmark: 'Near Central Park',
    name: 'John Doe',
    mobile: '+1 234-567-8900',
  },
  {
    id: '2',
    type: 'Office',
    address: '456 Business Ave, Corporate District, New York, NY 10002',
    landmark: 'Next to Starbucks',
    name: 'John Doe',
    mobile: '+1 234-567-8900',
  },
  {
    id: '3',
    type: 'Work',
    address: '789 Industrial Blvd, Work Zone, New York, NY 10003',
    landmark: 'Behind Metro Station',
    name: 'John Doe',
    mobile: '+1 234-567-8900',
  },
  {
    id: '4',
    type: 'Other',
    address: '321 Random Street, Somewhere, New York, NY 10004',
    landmark: 'Near Shopping Mall',
    name: 'John Doe',
    mobile: '+1 234-567-8900',
  },
];
const SelectAddressScreen = ({ navigation, route }) => {
  const [addresses] = useState(dummyaddresses);

  const getAddressIcon = type => {
    switch (type) {
      case 'Office':
        return 'briefcase';
      case 'Work':
        return 'briefcase';
      case 'Home':
        return 'home';
      default:
        return 'map-pin';
    }
  };

  const handleAddressSelect = address => {
    console.log('Selected Address:', address);
  };

  const renderAddressCard = ({ item }) => (
    <TouchableOpacity
      style={styles.addressCard}
      onPress={() => handleAddressSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.typeContainer}>
          <Feather
            name={getAddressIcon(item.type)}
            size={16}
            color={Colors.primary}
          />
          <Text style={styles.addressType}>{item.type}</Text>
        </View>
        <Feather name="chevron-right" size={16} color={Colors.grayColor} />
      </View>

      <View style={styles.addressContent}>
        <View style={styles.addressRow}>
          <Feather name="map-pin" size={14} color={Colors.grayColor} />
          <Text style={styles.addressText}>{item.address}</Text>
        </View>

        {item.landmark && (
          <View style={styles.addressRow}>
            <Feather name="navigation" size={14} color={Colors.grayColor} />
            <Text style={styles.landmarkText}>{item.landmark}</Text>
          </View>
        )}

        <View style={styles.contactInfo}>
          <View style={styles.contactRow}>
            <Feather name="user" size={14} color={Colors.grayColor} />
            <Text style={styles.contactText}>{item.name}</Text>
          </View>
          <View style={styles.contactRow}>
            <Feather name="phone" size={14} color={Colors.grayColor} />
            <Text style={styles.contactText}>{item.mobile}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Feather name="map-pin" size={48} color={Colors.grayColor} />
      <Text style={styles.emptyTitle}>No Saved Addresses</Text>
      <Text style={styles.emptySubtitle}>
        Add your first address to get started
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <MyStatusBar />
      <CommonAppBar title="Select Address" navigation={navigation} />
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.addAddressButton}
          onPress={() => navigation.navigate('LocationPickerScreen')}
          activeOpacity={0.7}
        >
          <View style={styles.addButtonContent}>
            <Feather name="plus" size={20} color={Colors.secondary} />
            <Text style={styles.addButtonText}>Add a New Address</Text>
            {/* <Feather name="chevron-down" size={16} color={Colors.grayColor} /> */}
          </View>
        </TouchableOpacity>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Saved Addresses</Text>
        </View>

        <FlatList
          data={addresses}
          renderItem={renderAddressCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyList}
        />
      </View>
    </SafeAreaView>
  );
};
export default SelectAddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bodyBackColor,
  },
  addAddressButton: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
    marginVertical: 20,
    marginHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
   
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  addButtonText: {
    color: Colors.secondary,
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 12,
  },
  sectionHeader: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  addressCard: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
    padding: 16,
    marginBottom: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: Colors.extraLightGrayColor,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressType: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.blackColor,
    marginLeft: 8,
  },
  addressContent: {
    gap: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressText: {
    fontSize: 10,
    color: Colors.lightBlackColor,
    marginLeft: 8,
    flex: 1,
    lineHeight: 10,
  },
  landmarkText: {
    fontSize: 10,
    color: Colors.grayColor,
    marginLeft: 8,
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: Colors.extraLightGrayColor,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 10,
    color: Colors.lightBlackColor,
    marginLeft: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.blackColor,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.grayColor,
    marginTop: 8,
    textAlign: 'center',
  },
});

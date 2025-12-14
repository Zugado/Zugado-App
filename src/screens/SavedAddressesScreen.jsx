import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import MyStatusBar from '../components/MyStatusbar';
import { CommonAppBar } from '../components/CommonComponents';
import { Colors } from '../styles/commonStyles';
import { getSavedAddresses, deleteAddress } from '../utils/addressStorage';
import { useSnackbar } from '../contexts/SnackbarContext';

const SavedAddressesScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);
  const { showSnackbar } = useSnackbar();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const savedAddresses = await getSavedAddresses(user?.id || user?._id);
      setAddresses(savedAddresses);
    } catch (error) {
      showSnackbar('Failed to load addresses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = (addressId) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAddress(user?.id || user?._id, addressId);
              setAddresses(prev => prev.filter(addr => addr.id !== addressId));
              showSnackbar('Address deleted successfully', 'success');
            } catch (error) {
              showSnackbar('Failed to delete address', 'error');
            }
          }
        }
      ]
    );
  };

  const AddressCard = ({ address }) => (
    <View style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View style={styles.addressTypeContainer}>
          <Feather 
            name={address.addressType === 'Home' ? 'home' : address.addressType === 'Office' ? 'briefcase' : 'map-pin'} 
            size={16} 
            color={Colors.primary} 
          />
          <Text style={styles.addressType}>{address.addressType}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('EditAddressScreen', { address })}
          >
            <Feather name="edit-2" size={16} color={Colors.grayColor} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDeleteAddress(address.id)}
          >
            <Feather name="trash-2" size={16} color={Colors.redColor} />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.addressName}>{address.name}</Text>
      <Text style={styles.addressMobile}>{address.mobile}</Text>
      <Text style={styles.addressText}>{address.address}</Text>
      {address.landmark && (
        <Text style={styles.landmarkText}>Landmark: {address.landmark}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeAreaBlack}>
      <MyStatusBar />
      <View style={styles.container}>
        <CommonAppBar title="Saved Addresses" navigation={navigation} />
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {loading ? (
              <Text style={styles.loadingText}>Loading addresses...</Text>
            ) : addresses.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Feather name="map-pin" size={48} color={Colors.grayColor} />
                <Text style={styles.emptyTitle}>No Saved Addresses</Text>
                <Text style={styles.emptySubtitle}>Add your first address to get started</Text>
              </View>
            ) : (
              addresses.map((address) => (
                <AddressCard key={address.id} address={address} />
              ))
            )}
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('LocationPickerScreen')}
          >
            <Feather name="plus" size={20} color={Colors.whiteColor} />
            <Text style={styles.addButtonText}>Add New Address</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaBlack: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  loadingText: {
    textAlign: 'center',
    color: Colors.grayColor,
    fontSize: 16,
    marginTop: 50,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.blackColor,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.grayColor,
    textAlign: 'center',
  },
  addressCard: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.extraLightGrayColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressType: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: Colors.extraLightGrayColor,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.blackColor,
    marginBottom: 4,
  },
  addressMobile: {
    fontSize: 14,
    color: Colors.primary,
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: Colors.lightBlackColor,
    lineHeight: 20,
    marginBottom: 4,
  },
  landmarkText: {
    fontSize: 12,
    color: Colors.grayColor,
    fontStyle: 'italic',
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.extraLightGrayColor,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: Colors.whiteColor,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default SavedAddressesScreen;
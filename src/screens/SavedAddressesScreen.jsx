import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import MyStatusBar from '../components/MyStatusbar';
import { CommonAppBar } from '../components/CommonComponents';
import { Colors } from '../styles/commonStyles';
import { getSavedAddresses, deleteAddress } from '../utils/addressStorage';
import { useSnackbar } from '../contexts/SnackbarContext';
import { CustomAlert } from '../components/CustomAlert';

const SavedAddressesScreen = ({ navigation,route}) => {
  const { user } = useSelector((state) => state.auth);
  const { showSnackbar } = useSnackbar();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  useEffect(() => {
    loadAddresses();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadAddresses();
    }, [])
  );

  const loadAddresses = async () => {
    try {
      const savedAddresses = await getSavedAddresses(user?.id || user?._id);
      setAddresses(savedAddresses);
    } catch (error) {
      showSnackbar('Failed to load addresses', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAddresses();
  };

 
  const handleEditAddress = (address) => {
    const { returnScreen, jobData } = route.params || {};
    navigation.navigate('LocationPickerScreen', {
      editAddressId: address.id,
      returnScreen,
      jobData,
    });
  };

  const handleDeleteAddress = async () => {
    if (!addressToDelete) return;
    
    try {
      await deleteAddress(user?.id || user?._id, addressToDelete.id);
      setAddresses(prev => prev.filter(addr => addr.id !== addressToDelete.id));
      showSnackbar('Address deleted successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to delete address', 'error');
    } finally {
      setShowDeleteAlert(false);
      setAddressToDelete(null);
    }
  };
 

  const handleSelectAddress = (address) => {
    const { returnScreen, jobData } = route.params || {};
    if (returnScreen === 'CreateJobScreen2') {
      navigation.goBack( {
        jobData,
        selectedLocation: {
          address: address.fullAddress || address.address,
          coordinates: address.coordinates,
          addressData: address,
        },
      });
    } else {
      showSnackbar('Address selected', 'success');
      navigation.goBack();
    }
  };
  const getAddressIcon = (type) => {
    switch (type) {
      case 'Office':
      case 'Work':
        return 'briefcase';
      case 'Home':
        return 'home';
      default:
        return 'map-pin';
    }
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Feather name="map-pin" size={48} color={Colors.grayColor} />
      <Text style={styles.emptyTitle}>No Saved Addresses</Text>
      <Text style={styles.emptySubtitle}>Add your first address to get started</Text>
    </View>
  );

 const renderAddressCard = ({ item }) => {
    const { returnScreen } = route.params || {};
    const isSelectable = returnScreen === 'CreateJobScreen2';
    
    return (
      <TouchableOpacity 
        style={[styles.addressCard, isSelectable && styles.selectableCard]}
        onPress={() => isSelectable && handleSelectAddress(item)}
        disabled={!isSelectable}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.typeContainer}>
            <Feather 
              name={getAddressIcon(item.addressType)} 
              size={16} 
              color={Colors.primary} 
            />
            <Text style={styles.addressType}>{item.addressType}</Text>
          </View>
          {isSelectable ? (
            <Feather name="chevron-right" size={16} color={Colors.primary} />
          ) : (
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleEditAddress(item)}
              >
                <Feather name="edit-2" size={14} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => {
                  setAddressToDelete(item);
                  setShowDeleteAlert(true);
                }}
              >
                <Feather name="trash-2" size={14} color={Colors.redColor} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <View style={styles.addressContent}>
          <View style={styles.addressRow}>
            <Feather name="map-pin" size={14} color={Colors.grayColor} />
            <Text style={styles.addressText}>{item.fullAddress || item.address}</Text>
          </View>
          
          {item.landmark && (
            <View style={styles.addressRow}>
              <Feather name="navigation" size={14} color={Colors.grayColor} />
              <Text style={styles.landmarkText}>Near {item.landmark}</Text>
            </View>
          )}
        </View>
        
        {isSelectable && (
          <View style={styles.selectIndicator}>
            <Text style={styles.selectText}>Tap to select</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaBlack}>
      <MyStatusBar />
      <View style={styles.container}>
        <CommonAppBar title="Saved Addresses" navigation={navigation} />
        
        <View style={styles.content}>
          <TouchableOpacity 
            style={styles.addAddressButton}
            onPress={() => {
              const { returnScreen, jobData } = route.params || {};
              navigation.replace('LocationPickerScreen', {
                returnScreen,
                jobData,
              });
            }}
            activeOpacity={0.7}
          >
            <View style={styles.addButtonContent}>
              <Feather name="plus" size={20} color={Colors.primary} />
              <Text style={styles.addButtonText}>Add a New Address</Text>
            </View>
          </TouchableOpacity>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading addresses...</Text>
            </View>
          ) : (
            <FlatList
              data={addresses?.reverse()}
              renderItem={renderAddressCard}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={renderEmptyList}
              contentContainerStyle={addresses.length === 0 ? styles.emptyListContainer : null}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[Colors.primary]}
                  tintColor={Colors.primary}
                />
              }
            />
          )}
        </View>
        
        {showDeleteAlert && (
          <CustomAlert
            message="Are you sure you want to delete this address?"
            onYes={handleDeleteAddress}
            onClose={() => {
              setShowDeleteAlert(false);
              setAddressToDelete(null);
            }}
            yesText="Delete"
            noText="Cancel"
            yesButtonColor={Colors.redColor}
            iconName="trash-2"
            iconColor={Colors.redColor}
          />
        )}
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
  content: {
    flex: 1,
    padding: 16,
  },
  addAddressButton: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: Colors.primary,
   
  },
 addButtonContent: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 14,
  paddingHorizontal: 16,

 }
,
  addButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: Colors.grayColor,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: "50%",
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
    marginBottom: 4,
    borderWidth: 1,
    borderColor: Colors.extraLightGrayColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressType: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 8,
  },
  addressContent: {
    gap: 2,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressText: {
    fontSize: 12,
    color: Colors.lightBlackColor,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  landmarkText: {
    fontSize: 12,
    color: Colors.grayColor,
    marginLeft: 8,
  },
  selectableCard: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
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
  disabledButton: {
    opacity: 0.5,
  },
  selectIndicator: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.extraLightGrayColor,
  },
  selectText: {
    fontSize: 12,
    color: Colors.primary,
    textAlign: 'center',
    fontWeight: '500',
  },
  emptyListContainer: {
    flex: 1,
  },
});

export default SavedAddressesScreen;
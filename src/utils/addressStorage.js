import AsyncStorage from '@react-native-async-storage/async-storage';

const ADDRESSES_KEY = 'saved_addresses_';

// Get user-specific key
const getUserAddressKey = (userId) => `${ADDRESSES_KEY}${userId}`;

// Get all saved addresses for a user
export const getSavedAddresses = async (userId) => {
  try {
    const addresses = await AsyncStorage.getItem(getUserAddressKey(userId));
    return addresses ? JSON.parse(addresses) : [];
  } catch (error) {
    console.error('Error getting saved addresses:', error);
    return [];
  }
};

// Save a new address
export const saveAddress = async (userId, address) => {
  try {
    const existingAddresses = await getSavedAddresses(userId);
    const newAddress = {
      id: Date.now().toString(),
      ...address,
      createdAt: new Date().toISOString(),
    };
    const updatedAddresses = [...existingAddresses, newAddress];
    await AsyncStorage.setItem(getUserAddressKey(userId), JSON.stringify(updatedAddresses));
    return newAddress;
  } catch (error) {
    console.error('Error saving address:', error);
    throw error;
  }
};

// Update an existing address
export const updateAddress = async (userId, addressId, updatedData) => {
  try {
    const addresses = await getSavedAddresses(userId);
    const updatedAddresses = addresses.map(addr => 
      addr.id === addressId ? { ...addr, ...updatedData } : addr
    );
    await AsyncStorage.setItem(getUserAddressKey(userId), JSON.stringify(updatedAddresses));
    return updatedAddresses.find(addr => addr.id === addressId);
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
};

// Delete an address
export const deleteAddress = async (userId, addressId) => {
  try {
    const addresses = await getSavedAddresses(userId);
    const filteredAddresses = addresses.filter(addr => addr.id !== addressId);
    await AsyncStorage.setItem(getUserAddressKey(userId), JSON.stringify(filteredAddresses));
    return true;
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
};
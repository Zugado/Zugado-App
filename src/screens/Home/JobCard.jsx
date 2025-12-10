// components/JobCard.js
import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { useNavigation } from '@react-navigation/native';

const JobCard = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={()=>navigation.navigate('JobDetailedScreen')}>
      {/* Image */}
      <Image
        source={require('../../assets/jobCard.png')} 
        style={styles.cardImage}
        resizeMode='cover'
      />
      {/* Urgent Tag */}
      <View style={styles.urgentTag}>
        <Text style={styles.urgentText}>Urgent</Text>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {/* Title & Price */}
        <View style={styles.row}>
          <Text style={styles.title}>Job Title</Text>
          <Text style={styles.price}>₹ 500</Text>
        </View>

        {/* Description */}
        <Text style={styles.description}>
          Etiam tincidunt, ex id vestibulum ultrices, libero...
        </Text>

        {/* Location */}
        <View style={styles.locationRow}>
          <MaterialIcons name="location-on" style={styles.locationIcon} />
          <Text style={styles.locationText}>22 Km left</Text>
        </View>

        {/* Vendor & Rating */}
        <View style={styles.row}>
          <Text style={styles.vendorName}>Vendor Name</Text>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" style={styles.starIcon} />
            <Text style={styles.ratingText}>4.9 (2.2K)</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.bidButton}
           onPress={() => console.log('Bid button pressed')}
          >
            <Text style={styles.bidButtonText}>Bid</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chatButton}
          onPress={() => console.log('Chat button pressed')}
          >
            <Text style={styles.chatButtonText}>Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 12, 
    marginHorizontal: 15,
    marginVertical: 8,
    elevation: 5, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  cardImage: {
    width: '100%',
    height: 120, 
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  urgentTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#d9534f', 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 5, 
  },
  urgentText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10, 
  },
  contentContainer: {
    padding: 12, 
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6, 
  },
  title: {
    fontSize: 17, 
    fontWeight: '700', 
    color: '#1a1a1a', 
  },
  price: {
    fontSize: 17, 
    fontWeight: '700',
    color: '#1a1a1a', 
  },
  description: {
    color: '#555', 
    fontSize: 13, 
    marginBottom: 6, 
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6, 
  },
  locationIcon: {
    color: '#888',
    fontSize: 14, 
    marginRight: 5,
  },
  locationText: {
    color: '#888',
    fontSize: 13, 
  },
  vendorName: {
    fontSize: 14, 
    fontWeight: '600', 
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    color: '#FFD700',
    fontSize: 14, 
    marginRight: 4, 
  },
  ratingText: {
    color: '#666',
    fontSize: 13, 
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12, 
  },
  bidButton: {
    flex: 1,
    backgroundColor: '#000000ff', 
    borderRadius: 25, 
    paddingVertical: 10, 
    alignItems: 'center',
    marginRight: 8, 
    shadowColor: '#007aff', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  bidButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15, 
  },
  chatButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#ccc', 
    borderRadius: 25, 
    paddingVertical: 10, 
    alignItems: 'center',
    marginLeft: 8, 
    backgroundColor: '#fff',
  },
  chatButtonText: {
    color: '#444', 
    fontWeight: '700',
    fontSize: 15, 
  },
});

export default JobCard;
// components/JobCard.js
import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../styles/commonStyles';
import { selectWishlistIds } from '../../store/selector';

const JobCard = ({saved=true, urgent=false, jobData}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const wishlistIds = useSelector(selectWishlistIds);
  const isWishlisted = wishlistIds.includes(jobData?._id);
  console.log("job card = ", JSON.stringify(jobData, null, 2));
  return (
    <TouchableOpacity  activeOpacity={0.8} style={styles.cardContainer} onPress={()=>navigation.navigate('JobDetailedScreen', { jobId: jobData?._id })}>
      {/* Image */}
      {saved?(<Image
        source={require('../../assets/jobImage.png')} 
        style={styles.cardImage}
        resizeMode='cover'
      />):(
      <View style={styles.empltyImage}></View>)}
      {/* Urgent Tag */}
      {urgent && ( <View style={styles.urgentTag}>
       
          <Image
            source={require('../../assets/Icons/urgentTag.png')} 
            style={styles.urgentTagImage}
            resizeMode='cover'
          />
     
        <Text style={{position:"absolute",fontSize:10,right:20,top:1,color:Colors.whiteColor,fontWeight:"700"}}>Urgent</Text>
      </View>   ) }
       {isWishlisted && (
         <View style={styles.saveTag}>
          <Image
            source={require('../../assets/Icons/SavedGolden.png')} 
            style={styles.saveTagImage}
            resizeMode='cover'
          />
        </View>
       )}
       
      {/* Content */}
      <View style={styles.contentContainer}>
        {/* Title & Price */}
        <View style={styles.row}>
          <Text style={styles.title}>{jobData?.title || 'Job Title'}</Text>
          <Text style={styles.price}>
            {jobData?.amount?.disclose && jobData?.amount?.min 
              ? `₹ ${jobData.amount.min}${jobData.amount.max ? ` - ${jobData.amount.max}` : ''}` 
              : 'Price on request'}
          </Text>
        </View>

        {/* Description */}
        <Text style={styles.description}>
          {jobData?.description || 'No description available'}
        </Text>

        {/* Location */}
        <View style={styles.locationRow}>
          <MaterialIcons name="location-on" style={styles.locationIcon} />
          <Text style={styles.locationText}>
            {typeof jobData?.location === 'string' ? jobData.location : 'Location not specified'}
          </Text>
        </View>

        {/* Vendor & Rating */}
        <View style={styles.row}>
          <Text style={styles.vendorName}>
            {jobData?.createdBy ? `${jobData.createdBy.firstName} ${jobData.createdBy.lastName}` : 'Unknown'}
          </Text>
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
    borderRadius: 24, 
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  empltyImage:{
    width: '100%',
    height: 30,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    // backgroundColor: '#f2f2f2',
  },
 saveTagImage: {
    width:20,
    height: 23,
  
  },
urgentTagImage: {
    width:75,
    height: 16,
  
  },
  urgentTag: {
    position: 'absolute',
    top: 12,
    right: 0,
  
  },
  saveTag: {
    position: 'absolute',
    top: 12,
    left: 12,
   
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
    fontSize: 14, 
    fontWeight: '700', 
    color: '#1a1a1a', 
  },
  price: {
    fontSize: 14, 
    fontWeight: '700',
    color: '#1a1a1a', 
  },
  description: {
    color: '#555', 
    fontSize: 12, 
    marginBottom: 6, 
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6, 
  },
  locationIcon: {
    color: '#888',
    fontSize: 12, 
    marginRight: 5,
  },
  locationText: {
    color: '#888',
    fontSize: 12, 
  },
  vendorName: {
    fontSize: 12, 
    fontWeight: '600', 
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    color: '#FFD700',
    fontSize: 12, 
    marginRight: 4, 
  },
  ratingText: {
    color: '#666',
    fontSize: 12, 
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
    paddingVertical: 8, 
    alignItems: 'center',
    marginRight: 8, 
    shadowColor: '#000000ff', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  bidButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14, 
  },
  chatButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc', 
    shadowColor: '#000000ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    borderRadius: 25, 
    paddingVertical: 8, 
    alignItems: 'center',
    marginLeft: 8, 
    backgroundColor: '#fff',
  },
  chatButtonText: {
    color: '#444', 
    fontWeight: '700',
    fontSize: 14, 
  },
});

export default JobCard;
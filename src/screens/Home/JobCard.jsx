// components/JobCard.js
import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const JobCard = () => {
  return (
    <TouchableOpacity style={styles.cardContainer}>
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
          <TouchableOpacity style={styles.bidButton}>
            <Text style={styles.bidButtonText}>Bid</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chatButton}>
            <Text style={styles.chatButtonText}>Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// const styles = StyleSheet.create({
//   cardContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 15,
//     marginHorizontal: 15,
//     marginVertical: 10,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 1},
//     shadowOpacity: 0.2,
//     shadowRadius: 1.41,
//   },
//   cardImage: {
//     width: '100%',
//     height: 200,
//     borderTopLeftRadius: 15,
//     borderTopRightRadius: 15,
//   },
//   urgentTag: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     backgroundColor: '#ff6600',
//     paddingHorizontal: 10,
//     paddingVertical: 3,
//     borderRadius: 7,
//   },
//   urgentText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 12,
//   },
//   contentContainer: {
//     padding: 15,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   price: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   description: {
//     color: '#666',
//     fontSize: 14,
//     marginBottom: 10,
//   },
//   locationRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   locationIcon: {
//     color: '#888',
//     fontSize: 16,
//     marginRight: 5,
//   },
//   locationText: {
//     color: '#888',
//     fontSize: 14,
//   },
//   vendorName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   starIcon: {
//     color: '#FFD700',
//     fontSize: 16,
//     marginRight: 5,
//   },
//   ratingText: {
//     color: '#666',
//     fontSize: 14,
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 15,
//   },
//   bidButton: {
//     flex: 1,
//     backgroundColor: '#111',
//     borderRadius: 25,
//     paddingVertical: 12,
//     alignItems: 'center',
//     marginRight: 10,
//   },
//   bidButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   chatButton: {
//     flex: 1,
//     borderWidth: 1.5,
//     borderColor: '#111',
//     borderRadius: 25,
//     paddingVertical: 12,
//     alignItems: 'center',
//     marginLeft: 10,
//   },
//   chatButtonText: {
//     color: '#111',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

// components/JobCard.js - Updated Styles
const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 15,
    // Reduced vertical margin slightly
    marginVertical: 7, 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardImage: {
    // *** KEY CHANGE: Reduced Image Height from 200 to 120-130 ***
    width: '100%',
    height: 120, // Adjusted from 200
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  urgentTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ff6600',
    paddingHorizontal: 8, // Reduced padding
    paddingVertical: 2,   // Reduced padding
    borderRadius: 7,
  },
  urgentText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10, // Reduced font size slightly
  },
  contentContainer: {
    // Reduced padding from 15 to 10
    padding: 10, 
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // Reduced bottom margin
    marginBottom: 5, 
  },
  title: {
    fontSize: 16, // Reduced font size
    fontWeight: 'bold',
    color: '#333',
  },
  price: {
    fontSize: 16, // Reduced font size
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    color: '#666',
    fontSize: 13, // Reduced font size
    // Reduced bottom margin
    marginBottom: 5, 
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // Reduced bottom margin
    marginBottom: 5, 
  },
  locationIcon: {
    color: '#888',
    fontSize: 14, // Reduced icon size
    marginRight: 5,
  },
  locationText: {
    color: '#888',
    fontSize: 13, // Reduced font size
  },
  vendorName: {
    fontSize: 14, // Reduced font size
    fontWeight: 'bold',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    color: '#FFD700',
    fontSize: 14, // Reduced icon size
    marginRight: 5,
  },
  ratingText: {
    color: '#666',
    fontSize: 13, // Reduced font size
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // Reduced top margin
    marginTop: 10, 
  },
  bidButton: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 20, // Reduced border radius slightly
    paddingVertical: 8, // Reduced padding
    alignItems: 'center',
    marginRight: 8, // Reduced margin
  },
  bidButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14, // Reduced font size
  },
  chatButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#111',
    borderRadius: 20, // Reduced border radius slightly
    paddingVertical: 8, // Reduced padding
    alignItems: 'center',
    marginLeft: 8, // Reduced margin
  },
  chatButtonText: {
    color: '#111',
    fontWeight: 'bold',
    fontSize: 14, // Reduced font size
  },
});

export default JobCard;
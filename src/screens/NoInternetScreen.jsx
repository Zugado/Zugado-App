import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function NoInternetScreen() {
  return (
    <View style={styles.container}>
      {/* Icon to represent 'No Internet' */}
      <Icon 
        name="wifi-off" 
        size={80} 
        color="#888" // A neutral color for the icon
        style={styles.icon}
      />
      
      {/* Primary message */}
      <Text style={styles.title}>No Internet Connection</Text>
      
      {/* Secondary instructions or message */}
      <Text style={styles.message}>
        Please check your Wi-Fi or mobile data settings and try again.
      </Text>
    </View>
  );
}

// Styling for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center',     // Center content horizontally
    backgroundColor: '#fff',  // Use a white background
    padding: 20,
  },
  icon: {
    marginBottom: 20, // Space below the icon
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333', // Dark text color
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666', // Slightly lighter text color
    textAlign: 'center',
    paddingHorizontal: 30, // Padding for better readability on narrow screens
  },
});


// import { View, Text, StyleSheet } from 'react-native';
// import React from 'react';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// export default function NoInternetScreen() {
//   return (
//     <View style={styles.container}>
//       {/* Icon to represent 'No Internet' */}
//       <Icon 
//         name="wifi-off" 
//         size={80} 
//         color="#888" // A neutral color for the icon
//         style={styles.icon}
//       />
      
//       {/* Primary message */}
//       <Text style={styles.title}>No Internet Connection</Text>
      
//       {/* Secondary instructions or message */}
//       <Text style={styles.message}>
//         Please check your Wi-Fi or mobile data settings and try again.
//       </Text>
//     </View>
//   );
// }

// // Styling for the component
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center', // Center content vertically
//     alignItems: 'center',     // Center content horizontally
//     backgroundColor: '#fff',  // Use a white background
//     padding: 20,
//   },
//   icon: {
//     marginBottom: 20, // Space below the icon
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333', // Dark text color
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   message: {
//     fontSize: 16,
//     color: '#666', // Slightly lighter text color
//     textAlign: 'center',
//     paddingHorizontal: 30, // Padding for better readability on narrow screens
//   },
// });
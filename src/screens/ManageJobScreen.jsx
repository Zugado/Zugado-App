import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // For Arrow and Bell
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'; // For the central plus button
import { SafeAreaView } from 'react-native-safe-area-context';
import JobCard from '../screens/Home/JobCard';
import MyStatusBar from '../components/MyStatusbar';

const screenWidth = Dimensions.get('window').width;

// --- Task Card Component ---
// const TaskCard = ({ title, description, status }) => {
//   // Determine card background color based on status or style choice
//   const cardBackgroundColor = '#1C212A'; // Dark blue/black for the card
//   const statusTextColor = '#8F8F8F'; // Lighter color for 'Draft' text

//   return (
//     <View style={[styles.cardContainer, { backgroundColor: cardBackgroundColor }]}>
//       <View style={styles.cardHeader}>
//         <Text style={styles.cardTitle}>{title}</Text>
//         <Text style={{ color: statusTextColor, fontSize: 14 }}>{status}</Text>
//       </View>
//       <Text style={styles.cardDescription}>{description}</Text>

//       <View style={styles.buttonRow}>
//         <TouchableOpacity style={[styles.button, styles.editButton]}>
//           <Text style={styles.buttonText}>Edit</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.button, styles.submitButton]}>
//           <Text style={styles.buttonText}>Submit</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.button, styles.deleteButton]}>
//           <Text style={styles.buttonText}>Delete</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
//   };

// --- Tab Bar Component ---
const TabBar = ({ tabs, activeTab }) => {
  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity key={tab.key} style={styles.tabItem}>
          <Text
            style={[
              styles.tabText,
              tab.key === activeTab && styles.activeTabText,
            ]}>
            {tab.title}
          </Text>
          {/* A small dot to indicate the count/badge */}
          <View style={[styles.tabBadge, {backgroundColor: tab.count > 0 ? '#FF5757' : 'transparent'}]}>
            {tab.count > 0 && <Text style={styles.tabBadgeText}>{tab.count}</Text>}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// --- Main Screen Component ---
const ManageJobScreen = () => {
  const tabs = [
    { key: 'draft', title: 'Draft', count: 5 },
    { key: 'pending', title: 'Pending', count: 3 },
    { key: 'active', title: 'Active', count: 0 },
  ];

  return (
    <SafeAreaView style={styles.safeAreaBlack}>
        <MyStatusBar/> 
         <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Icon name="arrow-back" size={24} color="#000" />
          <Text style={styles.headerTitle}>Manage Task</Text>
          <Icon name="notifications-outline" size={24} color="#000" style={styles.bellIcon} />
        </View>

        {/* Tab Navigation */}
        <TabBar tabs={tabs} activeTab="draft" />

        {/* Content Area - Task Card Example */}
        <View style={styles.content}>
          {/* <TaskCard
            title="Website redesign"
            description="Need to redesign my portfolio website."
            status="Draft"
          /> */}
          <JobCard />
          {/* Other content goes here */}
        </View>

        {/* Bottom Navigation Bar */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Icon name="home-outline" size={24} color="#000" />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Icon name="briefcase-outline" size={24} color="#000" />
            <Text style={styles.navText}>Manage job</Text>
          </TouchableOpacity>

          {/* Central Plus Button (Icon is simulated here) */}
          <TouchableOpacity style={styles.centralButton}>
            <Icon name="add" size={30} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Icon name="mail-outline" size={24} color="#000" />
            <Text style={styles.navText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Icon name="person-outline" size={24} color="#000" />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
  safeAreaBlack: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 20, // Padding for main content area
  },
  // --- Header Styles ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
    // Note: The original image has the clock/battery status bar which is outside
    // this view, so we focus on the back arrow, title, and bell.
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  bellIcon: {
    // The red dot/badge on the bell icon is an overlay/badge
    position: 'relative',
  },

  // --- Tab Bar Styles ---
  tabBar: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1, // Optional: for a cleaner separation
    borderBottomColor: '#EEE',
  },
  tabItem: {
    paddingRight: 30, // Spacing between tabs
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    color: '#A0A0A0',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '700',
    // The underline effect is part of the styling, you could use a
    // separate View below the active tab for a clean underline.
    borderBottomWidth: 2,
    borderBottomColor: '#000', // Assuming a dark underline for active tab
  },
  tabBadge: {
    marginLeft: 5,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // --- Task Card Styles ---
  content: {
    flex: 1,
  },
  cardContainer: {
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    width: screenWidth - 40, // Match main container padding
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF', // White text on dark background
  },
  cardDescription: {
    fontSize: 14,
    color: '#A0A0A0', // Lighter grey for description
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flex: 1, // Distribute space
    marginHorizontal: 5, // Space between buttons
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#000', // Black/Dark background
  },
  submitButton: {
    backgroundColor: '#2C3A4D', // Slightly lighter/different dark color
  },
  deleteButton: {
    backgroundColor: '#2C3A4D', // Slightly lighter/different dark color
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  // --- Bottom Navigation Styles ---
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
    paddingTop: 5,
  },
  navText: {
    fontSize: 10,
    color: '#555',
  },
  centralButton: {
    backgroundColor: '#000', // Black background for the plus button
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    // Push the button up to overlap the content slightly
    transform: [{ translateY: -15 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});

export default ManageJobScreen;

// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   StatusBar,
//   TouchableOpacity,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Feather from 'react-native-vector-icons/Feather';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// export default function ManageJobScreen() {
//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Manage Jobs</Text>
//       </View>

//       {/* Main Content */}
//       <View style={styles.content}>
//         {/* Icon */}
//         <View style={styles.iconContainer}>
//           <MaterialCommunityIcons name="briefcase-outline" size={80} color="#E0E0E0" />
//           <View style={styles.toolsContainer}>
//             <Feather name="settings" size={24} color="#BDBDBD" style={styles.tool1} />
//             <Feather name="edit-3" size={20} color="#BDBDBD" style={styles.tool2} />
//             <Feather name="plus" size={18} color="#BDBDBD" style={styles.tool3} />
//           </View>
//         </View>

//         {/* Text Content */}
//         <Text style={styles.title}>Job Management Coming Soon</Text>
//         <Text style={styles.subtitle}>
//           We're building powerful tools to help you create, edit, and manage your job postings with ease.
//         </Text>

//         {/* Features List */}
//         <View style={styles.featuresList}>
//           <FeatureItem icon="plus-circle" text="Create new job postings" />
//           <FeatureItem icon="edit" text="Edit existing listings" />
//           <FeatureItem icon="users" text="Manage applications" />
//           <FeatureItem icon="bar-chart" text="Track job performance" />
//         </View>

//         {/* Action Button */}
//         <TouchableOpacity style={styles.notifyButton}>
//           <Feather name="bell" size={20} color="#666" />
//           <Text style={styles.notifyText}>Notify me when ready</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

// const FeatureItem = ({ icon, text }) => (
//   <View style={styles.featureItem}>
//     <Feather name={icon} size={16} color="#999" />
//     <Text style={styles.featureText}>{text}</Text>
//   </View>
// );

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   content: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 30,
//   },
//   iconContainer: {
//     position: 'relative',
//     marginBottom: 30,
//   },
//   toolsContainer: {
//     position: 'absolute',
//     width: 120,
//     height: 120,
//   },
//   tool1: {
//     position: 'absolute',
//     top: 10,
//     right: -10,
//   },
//   tool2: {
//     position: 'absolute',
//     bottom: 20,
//     left: -15,
//   },
//   tool3: {
//     position: 'absolute',
//     top: 30,
//     left: 10,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#000',
//     textAlign: 'center',
//     marginBottom: 15,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     lineHeight: 24,
//     marginBottom: 40,
//   },
//   featuresList: {
//     width: '100%',
//     marginBottom: 40,
//   },
//   featureItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//     paddingLeft: 20,
//   },
//   featureText: {
//     fontSize: 16,
//     color: '#555',
//     marginLeft: 15,
//   },
//   notifyButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f8f8f8',
//     paddingHorizontal: 25,
//     paddingVertical: 15,
//     borderRadius: 25,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//   },
//   notifyText: {
//     fontSize: 16,
//     color: '#666',
//     marginLeft: 10,
//     fontWeight: '500',
//   },
// });
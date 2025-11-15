import React from 'react';
import {
  StyleSheet,
  StatusBar,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Header from '../components/Header';
import JobCard from '../components/JobCard';
// We still use SafeAreaView, but in a different way
import { SafeAreaView } from 'react-native-safe-area-context'; 

const HomeScreen = () => {
  const tags = ['Tag-1', 'Tag-2', 'Tag-3', 'Tag-4'];
  return (
    // 1. This OUTER SafeAreaView sets the status bar background color
    <SafeAreaView style={styles.safeAreaBlack}>
      
      {/* 2. This configures the text/icons to be WHITE */}
      <StatusBar barStyle="light-content" />

      {/* 3. This View contains your ACTUAL app content */}
      <View style={styles.appContainer}>
        <Header />

        {/* Row 3: Tags & Sort */}
        <View style={styles.tagRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tagScroll}>
            {tags.map((tag, index) => (
              <TouchableOpacity key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.sortButton}>
            <MaterialIcons
              name="sort"
              size={20}
              color="#222"
              style={{ marginRight: 5 }}
            />
            <Text style={styles.sortText}>Sort By</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}>
          {/* Render multiple job cards */}
          <JobCard />
          <JobCard />
          <JobCard />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // NEW STYLE for the outer wrapper
  safeAreaBlack: {
    flex: 1,
    backgroundColor: '#000000', // This makes the status bar area black on iOS
  },
  // RENAMED from 'safeArea' to 'appContainer'
  appContainer: {
    flex: 1,
    backgroundColor: '#f4f4f4', // This is your app's light gray background
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80, // Ensure content isn't hidden by the FAB
  },

  tagRow: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagScroll: {
    flex: 1,
    marginRight: 10,
  },
  tag: {
    borderWidth: 2,
    borderColor: '#222',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginRight: 10,
  },
  tagText: {
    color: '#222',
    fontWeight: 'bold',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    color: '#222',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  StatusBar,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import MyStatusBar from '../../components/MyStatusbar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Header from '../../components/Header';
import JobCard from './JobCard';
import JobCardSkeleton from '../../components/JobCardSkeleton';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const tags = ['Tag-1', 'Tag-2', 'Tag-3', 'Tag-4', 'Tag-5', 'Tag-6', 'Tag-7', 'Tag-8', 'Tag-9', 'Tag-10'];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <SafeAreaView style={styles.safeAreaBlack}>
       <MyStatusBar/>
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
          {loading ? (
            // Show skeleton loaders
            <>
              <JobCardSkeleton />
              <JobCardSkeleton />
              <JobCardSkeleton />
            </>
          ) : (
            // Show actual job cards
            <>
             
              <JobCard urgent={true} />
               <JobCard saved={false} urgent={true}/>
              <JobCard />
              <JobCard />
               <JobCard saved={false}/>
              <JobCard />
              <JobCard />
              <JobCard />
              <JobCard />
              <JobCard />
               </>
          )}
        </ScrollView>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaBlack: {
    flex: 1,
    backgroundColor: '#000000',
  },
  appContainer: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },

  tagRow: {
  padding: 6,
  flexDirection: 'row',
  alignItems: 'center',

  backgroundColor: '#fff',
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 5,
  elevation: 3,
},
  tagScroll: {
    flex: 1,
    marginRight: 10,
  },
  tag: {
    borderWidth: 1, // Reduced border thickness
    borderColor: '#ddd', // Softer border color
    borderRadius: 8, // Reduced border radius for a slightly sharper look
    paddingHorizontal: 12, // Reduced padding
    paddingVertical: 4,  // Reduced padding
    marginRight: 8,
    backgroundColor: '#fff', // Added background for better contrast
  },
  tagText: {
    color: '#666', // Softer text color
    fontWeight: '500', // Adjusted font weight
    fontSize: 13,
  },
 sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5, // Added padding for better hit area
    borderRadius: 5,
  },
  sortText: {
    color: '#444', // Slightly darker for better visibility
    fontWeight: '600',
    fontSize: 14,
  },
});

export default HomeScreen;
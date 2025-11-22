import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  StatusBar,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Header from '../../components/Header';
import JobCard from './JobCard';
import JobCardSkeleton from '../../components/JobCardSkeleton';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const tags = ['Tag-1', 'Tag-2', 'Tag-3', 'Tag-4'];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <SafeAreaView style={styles.safeAreaBlack}>
      <StatusBar barStyle="light-content" backgroundColor="#050505ff" />
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
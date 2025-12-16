import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  StatusBar,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import MyStatusBar from '../../components/MyStatusbar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Header from '../../components/Header';
import JobCard from './JobCard';
import JobCardSkeleton from '../../components/JobCardSkeleton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllJobs, getAllTags } from '../../store/thunks/jobThunk';
import { getUserLocation, updateUserLocation } from '../../store/thunks/locationThunk';
import { selectJobs, selectJobsLoading, selectLocationAddress, selectTags } from '../../store/selector';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const jobs = useSelector(selectJobs);
  const loading = useSelector(selectJobsLoading);
  const locationAddress = useSelector(selectLocationAddress);
  const tags = useSelector(selectTags);
  
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    dispatch(getAllJobs({ pageNo: 1, limit: 20 }));
    dispatch(getAllTags());
  };

  const updateLocation = () => {
    return new Promise((resolve) => {
      Geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            await dispatch(updateUserLocation({ latitude, longitude }));
            await dispatch(getUserLocation());
            resolve();
          } catch (error) {
            console.log('Location update error:', error);
            resolve();
          }
        },
        (error) => {
          console.log('High accuracy failed, trying fallback:', error);
          // Fallback with lower accuracy
          Geolocation.getCurrentPosition(
            async (position) => {
              try {
                const { latitude, longitude } = position.coords;
                await dispatch(updateUserLocation({ latitude, longitude }));
                await dispatch(getUserLocation());
                resolve();
              } catch (error) {
                console.log('Location fallback error:', error);
                resolve();
              }
            },
            (fallbackError) => {
              console.log('Location fallback failed:', fallbackError);
              resolve();
            },
            { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
          );
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
      );
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      dispatch(getAllJobs({ pageNo: 1, limit: 20 })),
      dispatch(getAllTags()),
      updateLocation()
    ]);
    setRefreshing(false);
  };
  
  return (
    <SafeAreaView style={styles.safeAreaBlack}>
       <MyStatusBar/>
       <View style={styles.appContainer}>
        <Header navigation={navigation} />
        {/* Row 3: Tags & Sort */}
        <View style={styles.tagRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tagScroll}>
            {tags.map((tagItem, index) => (
              <TouchableOpacity key={tagItem._id || index} style={styles.tag}>
                <Text style={styles.tagText}>{tagItem.tag}</Text>
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
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {loading ? (
            // Show skeleton loaders
            <>
              <JobCardSkeleton />
              <JobCardSkeleton />
              <JobCardSkeleton />
            </>
          ) : jobs.length > 0 ? (
            // Show actual job cards from API
            jobs.map((job, index) => (
              <JobCard 
                key={job._id || job.id || index}
                jobData={job}
                urgent={job.jobType !== 'standard'}
                saved={true}
              />
            ))
          ) : (
            // Show empty state
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No jobs available</Text>
            </View>
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
  paddingRight:0,
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
    // marginRight: 10,
  },
  tag: {
    borderWidth: 1, // Reduced border thickness
    borderColor: '#ddd', // Softer border color
    borderRadius: 8, // Reduced border radius for a slightly sharper look
    paddingHorizontal: 12, // Reduced padding
    paddingVertical: 6,  // Reduced padding
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
//     borderRadius: 5,
borderLeftWidth:1,
// borderTopWidth:1,
// borderBottomWidth:1,
borderColor:"#838181ff"
  },
  sortText: {
    color: '#444', // Slightly darker for better visibility
    fontWeight: '600',
    fontSize: 14,
  },
});

export default HomeScreen;
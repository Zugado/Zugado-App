import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  StatusBar,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import MyStatusBar from '../../components/MyStatusbar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Header from '../../components/Header';
import JobCard from './JobCard';
import JobCardSkeleton from '../../components/JobCardSkeleton';
import LoaderCard from '../../components/LoaderCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllJobs, getAllTags } from '../../store/thunks/jobThunk';
import { getWishlist } from '../../store/thunks/wishlistThunk';
import { getUserLocation, updateUserLocation } from '../../store/thunks/locationThunk';
import { selectJobs, selectJobsLoading, selectLocationAddress, selectTags } from '../../store/selector';
import { FaddedIcon } from '../../components/CommonComponents';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const allJobs = useSelector(selectJobs);
  const loading = useSelector(selectJobsLoading);
  const locationAddress = useSelector(selectLocationAddress);
  const tags = useSelector(selectTags);
  const [isUrgentEnabled, setUrgentEnabled] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  
  // First layer: Filter urgent jobs
  const jobs = isUrgentEnabled 
    ? allJobs.filter(job => job.jobType !== 'standard')
    : allJobs;
  
  // Create tag filter list from tags and subtags
  const tagFilterList = ['All'];
  tags.forEach(tagItem => {
    tagFilterList.push(tagItem.tag);
    if (tagItem.subTags && Array.isArray(tagItem.subTags)) {
      tagFilterList.push(...tagItem.subTags);
    }
  });
  
  // Filter jobs based on selected filter
  const filteredJobs = selectedFilter === 'All' 
    ? jobs 
    : jobs.filter(job => {
        if (job.tags && typeof job.tags === 'string') {
          return job.tags.toLowerCase().includes(selectedFilter.toLowerCase());
        }
        return false;
      });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    dispatch(getAllJobs({ pageNo: 1, limit: 20 }));
    dispatch(getAllTags());
    dispatch(getWishlist());
  };

  const updateLocation = () => {
    return new Promise(resolve => {
      Geolocation.getCurrentPosition(
        async position => {
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
        error => {
          console.log('High accuracy failed, trying fallback:', error);
          // Fallback with lower accuracy
          Geolocation.getCurrentPosition(
            async position => {
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
            fallbackError => {
              console.log('Location fallback failed:', fallbackError);
              resolve();
            },
            { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 },
          );
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 },
      );
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      dispatch(getAllJobs({ pageNo: 1, limit: 20 })),
      dispatch(getAllTags()),
      dispatch(getWishlist()),
      updateLocation()
    ]);
    setRefreshing(false);
  };

  const renderJob = ({ item }) => (
    <JobCard 
      jobData={item}
      urgent={ item.jobType !== 'standard'}
      saved={true}
    />
  );

  const EmptyList = ({ message }) => (
    <View style={styles.emptyContainer}>
      <FaddedIcon />
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeAreaBlack}>
      <MyStatusBar />
      <View style={styles.appContainer}>
        <Header navigation={navigation} isUrgentEnabled={isUrgentEnabled} setUrgentEnabled={setUrgentEnabled} />
        {/* Row 3: Tags & Sort */}
        <View style={styles.tagRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tagScroll}
          >
            {tagFilterList.map((tag, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.tag,
                  selectedFilter === tag && styles.selectedTag
                ]}
                onPress={() => setSelectedFilter(tag)}
              >
                <Text style={[
                  styles.tagText,
                  selectedFilter === tag && styles.selectedTagText
                ]}>
                  {tag}
                </Text>
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

        {loading ? (
          <ScrollView>
            <LoaderCard count={5} cardHeight={12} />
          </ScrollView>
        ) : (
          <FlatList
            data={filteredJobs}
            renderItem={renderJob}
            keyExtractor={item => item._id || item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <EmptyList 
                message={
                  selectedFilter === 'All' 
                    ? 'No jobs available' 
                    : `No jobs found for "${selectedFilter}"`
                }
              />
            }
            ListFooterComponent={<>{filteredJobs.length >= 2 && <FaddedIcon />}</>}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#666"
                colors={['#666']}
              />
            }
          />
        )}
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
  listContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ccc',
    textAlign: 'center',
    marginTop: 0,
  },

  tagRow: {
    padding: 6,
    paddingRight: 0,
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
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  selectedTag: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  tagText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 13,
  },
  selectedTagText: {
    color: '#fff',
    fontWeight: '600',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5, // Added padding for better hit area
    //     borderRadius: 5,
    borderLeftWidth: 1,
    // borderTopWidth:1,
    // borderBottomWidth:1,
    borderColor: '#838181ff',
  },
  sortText: {
    color: '#444', // Slightly darker for better visibility
    fontWeight: '600',
    fontSize: 14,
  },
});

export default HomeScreen;

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import { getWishlist, removeFromWishlist } from '../store/thunks/wishlistThunk';
import { selectWishlist, selectWishlistLoading } from '../store/selector';
import { useSnackbar } from '../contexts/SnackbarContext';
import MyStatusBar from '../components/MyStatusbar';

const WishlistJobCard = ({ job, onRemove, onPress }) => (
  <TouchableOpacity style={styles.jobCard} onPress={onPress}>
    <View style={styles.jobHeader}>
      <View style={styles.jobTitleContainer}>
        <Text style={styles.jobTitle}>{job.title || 'Job Title'}</Text>
        <Text style={styles.jobCompany}>{job.company || 'Company Name'}</Text>
      </View>
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => onRemove(job._id)}
      >
        <Feather name="heart" size={20} color="#ff4444" />
      </TouchableOpacity>
    </View>
    
    <View style={styles.jobDetails}>
      <View style={styles.jobDetailItem}>
        <Feather name="map-pin" size={14} color="#666" />
        <Text style={styles.jobDetailText}>{job.location || 'Location'}</Text>
      </View>
      <View style={styles.jobDetailItem}>
        <Feather name="clock" size={14} color="#666" />
        <Text style={styles.jobDetailText}>{job.jobType || 'Full-time'}</Text>
      </View>
      <View style={styles.jobDetailItem}>
        <Feather name="dollar-sign" size={14} color="#666" />
        <Text style={styles.jobDetailText}>
          ₹{job.minAmount || '0'} - ₹{job.maxAmount || '0'}
        </Text>
      </View>
    </View>
    
    <Text style={styles.jobDescription} numberOfLines={2}>
      {job.description || 'Job description will appear here...'}
    </Text>
    
    <View style={styles.jobFooter}>
      <Text style={styles.postedTime}>
        Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
      </Text>
      <View style={styles.jobTags}>
        {job.skills?.slice(0, 2).map((skill, index) => (
          <View key={index} style={styles.skillTag}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
      </View>
    </View>
  </TouchableOpacity>
);

const EmptyWishlist = () => (
  <View style={styles.emptyContainer}>
    <View style={styles.emptyIconContainer}>
      <Feather name="heart" size={60} color="#ddd" />
    </View>
    <Text style={styles.emptyTitle}>No Saved Jobs</Text>
    <Text style={styles.emptySubtitle}>
      Jobs you save will appear here. Start exploring and save jobs you're interested in!
    </Text>
  </View>
);

export default function WishlistScreen({ navigation }) {
  const dispatch = useDispatch();
  const wishlist = useSelector(selectWishlist);
  const loading = useSelector(selectWishlistLoading);
  const { showSnackbar } = useSnackbar();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  const handleRemoveFromWishlist = async (jobId) => {
    try {
      await dispatch(removeFromWishlist(jobId)).unwrap();
      showSnackbar('Job removed from wishlist', 'success');
    } catch (error) {
      showSnackbar('Failed to remove job from wishlist', 'error');
    }
  };

  const handleJobPress = (job) => {
    navigation.navigate('JobDetailedScreen', { jobId: job._id });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(getWishlist()).unwrap();
    } catch (error) {
      showSnackbar('Failed to refresh wishlist', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  const renderJob = ({ item }) => (
    <WishlistJobCard
      job={item}
      onRemove={handleRemoveFromWishlist}
      onPress={() => handleJobPress(item)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <MyStatusBar />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wishlist</Text>
        <View style={styles.headerRight}>
          <Text style={styles.jobCount}>{wishlist.length} jobs</Text>
        </View>
      </View>

      {/* Content */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Loading wishlist...</Text>
        </View>
      ) : wishlist.length === 0 ? (
        <EmptyWishlist />
      ) : (
        <FlatList
          data={wishlist}
          renderItem={renderJob}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  jobCount: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    padding: 20,
  },
  jobCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  jobCompany: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    padding: 8,
    backgroundColor: '#fff5f5',
    borderRadius: 20,
  },
  jobDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  jobDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  jobDetailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  jobDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postedTime: {
    fontSize: 12,
    color: '#999',
  },
  jobTags: {
    flexDirection: 'row',
  },
  skillTag: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 4,
  },
  skillText: {
    fontSize: 10,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
});
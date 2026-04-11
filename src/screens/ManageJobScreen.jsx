import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MiniJobCard from '../components/MiniJobCard';
import MyStatusBar from '../components/MyStatusbar';
import { useNavigation } from '@react-navigation/native';
import { CommonAppBar, FaddedIcon } from '../components/CommonComponents';
import SwipableTabs from '../components/SwipableTabs';
import { Colors } from '../styles/commonStyles';
import LoaderCard from '../components/LoaderCard';
import SelectorToggleButton from '../components/SelectorToggleButton';
import JobCard from '../components/JobCard';
import { getAllAppliedJobs, getAllCreatedJobs } from '../store/thunks/jobThunk';
import { getAllMyBids } from '../store/thunks/bidThunk';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
// Dummy data for My Jobs (jobs I applied to)
const myJobsData = [
  {
    id: 1,
    title: 'Newspaper Collection',
    price: 500,
    description: 'Old newspapers and magazines to be collected',
    distance: '22 Km left',
    vendorName: 'Ramesh Traders',
    rating: 4.9,
    reviews: '2.2K',
    saved: true,
    urgent: true,
    status: 'Active',
  },
  {
    id: 2,
    title: 'Plastic Scrap Pickup',
    price: 350,
    description: 'Household plastic waste pickup',
    distance: '10 Km left',
    vendorName: 'Green Scrap Hub',
    rating: 4.6,
    reviews: '1.1K',
    saved: false,
    urgent: false,
    status: 'Incomplete',
  },
  {
    id: 6,
    title: 'E-Waste Collection',
    price: 800,
    description: 'Old electronics and cables',
    distance: '18 Km left',
    vendorName: 'Eco Recycle',
    rating: 4.7,
    reviews: '540',
    saved: false,
    urgent: true,
    status: 'Out for pickup',
  },
];

const EMPTY_ARRAY = [];

const EmptyList = ({ message }) => (
  <View style={styles.emptyContainer}>
    <FaddedIcon />
    <Text style={styles.emptyText}>{message}</Text>
  </View>
);

const AppliedTasksSection = ({
  isLoading,
  appliedJobs,
  refreshing,
  onRefresh,
  navigation,
}) => {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = [
    'All',
    'Pending',
    'Active',
    'Completed',
    'Cancelled',
    'Rejected',
  ];

  const getStatusFromBid = item => {
    const bidStatus = item.bids?.[0]?.status || 'pending';
    return bidStatus.charAt(0).toUpperCase() + bidStatus.slice(1);
  };

  const filteredJobs =
    selectedFilter === 'All'
      ? appliedJobs
      : appliedJobs.filter(item => getStatusFromBid(item) === selectedFilter);

  if (isLoading) {
    return (
      <ScrollView>
        <LoaderCard count={5} cardHeight={12} />
      </ScrollView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {appliedJobs.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          nestedScrollEnabled={true}
        >
          {filters?.map(filter => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.selectedFilterButton,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.selectedFilterText,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      <FlatList
        style={{ flex: 1 }}
        data={filteredJobs}
        keyExtractor={item => item.job._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              navigation.navigate('MyBidStatusDetailScreen', { jobData: item })
            }
          >
            <MiniJobCard jobData={item} />
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={<>{filteredJobs.length >= 2 && <FaddedIcon />}</>}
        ListEmptyComponent={<EmptyList message="You don't have any jobs yet" />}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const CreatedTasksSection = ({
  isLoading,
  jobs,
  refreshing,
  onRefresh,
  navigation,
}) => {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = [
    'All',
    'Pending',
    'Active',
    'Completed',
    'Cancelled',
    'Rejected',
  ];

  const getStatus = job => (job.isPublished ? 'Active' : 'Pending');

  const filteredJobs =
    selectedFilter === 'All'
      ? jobs
      : jobs.filter(job => getStatus(job) === selectedFilter);

  if (isLoading) {
    return (
      <ScrollView>
        <LoaderCard count={5} cardHeight={12} />
      </ScrollView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {jobs.length > 0 && (
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingHorizontal: 10 }}
          >
            {filters?.map(filter => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  selectedFilter === filter && styles.selectedFilterButton,
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedFilter === filter && styles.selectedFilterText,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <FlatList
        data={filteredJobs}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              navigation.navigate('CreatedByMeJobDetailScreen', {
                jobData: { job: item },
              })
            }
          >
            <MiniJobCard jobData={{ job: item }} />
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={<>{filteredJobs.length >= 2 && <FaddedIcon />}</>}
        ListEmptyComponent={
          <EmptyList message="You haven't posted any jobs yet" />
        }
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const ManageJobScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('As a Seeker');
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const createdJobs = useSelector(
    state => state.job?.createdJobs || [],
    shallowEqual,
  );
  const appliedJobs = useSelector(
    state => state.job?.myAllBids || [],
    shallowEqual,
  );

  // console.log('Created Jobs:', createdJobs); //state.job.jobs.jobs;
  console.log('Applied Jobs:', JSON.stringify(appliedJobs, null, 2)); //state.job.jobs.jobs;

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    await dispatch(getAllCreatedJobs({ pageNo: 1, limit: 20 }));
    await dispatch(getAllMyBids());
    setIsLoading(false);
  };
  const onRefresh = () => {
    setRefreshing(true);
    loadInitialData().then(() => setRefreshing(false));
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      {/* <MyStatusBar backgroundColor={Colors.primary} barStyle="dark-content" /> */}
            <MyStatusBar  />

      <CommonAppBar
        borderBottomColor={Colors.whiteColor}
        navigation={navigation}
        title="Manage Tasks"
      />
      <View style={{ paddingHorizontal: 10 }}>
        <SelectorToggleButton
          options={['As a Seeker', 'As a Creator']}
          selectedValue={selectedTab}
          onValueChange={setSelectedTab}
          backgroundColor={Colors.extraLightGrayColor}
          unselectedTextColor={Colors.blackColor}
        />
      </View>
      <View style={{ flex: 1 }}>
        {selectedTab === 'As a Seeker' ? (
          <AppliedTasksSection
            isLoading={isLoading}
            appliedJobs={appliedJobs}
            refreshing={refreshing}
            onRefresh={onRefresh}
            navigation={navigation}
          />
        ) : (
          <CreatedTasksSection
            isLoading={isLoading}
            jobs={createdJobs}
            refreshing={refreshing}
            onRefresh={onRefresh}
            navigation={navigation}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    marginVertical: 8,
    maxHeight: 30,
    paddingHorizontal: 10,
  },
  filterScrollContent: {
    paddingHorizontal: 10,
    alignItems: 'center',
    flexGrow: 1,
  },
  filterButton: {
    marginHorizontal: 2,
    borderWidth: 1,
    height: 30,
    borderColor: '#ccc',
    backgroundColor: Colors.whiteColor,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedFilterButton: {
    borderColor: Colors.primary,
    backgroundColor: Colors.extraLightGrayColor,
  },
  filterText: {
    fontSize: 10,
    color: '#555',
    textAlign: 'center',
  },
  selectedFilterText: {
    color: Colors.primary,
    fontWeight: '600',
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
    color: Colors.extraLightGrayColor,
    textAlign: 'center',
    marginTop: 0,
  },
});

export default ManageJobScreen;

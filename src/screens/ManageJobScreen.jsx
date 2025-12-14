import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import JobCard from '../screens/Home/JobCard';
import MyStatusBar from '../components/MyStatusbar';
import { CommonAppBar, FaddedIcon } from '../components/CommonComponents';
import SwipableTabs from '../components/SwipableTabs';
import { Colors } from '../styles/commonStyles';
import LoaderCard from '../components/LoaderCard';
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

// Dummy data for Posted Jobs (jobs I created)
const postedJobsData =[];

const EmptyList = ({ message }) => (
  <View style={styles.emptyContainer}>
    <FaddedIcon />
    <Text style={styles.emptyText}>{message}</Text>
  </View>
);

const MyJobsSection = ({ isLoading }) => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const filters = ['filter1', 'filter2', 'filter3', ];

  const filteredJobs =
    selectedFilter === 'All'
      ? myJobsData
      : myJobsData.filter(job => job.status === selectedFilter);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (isLoading) {
    return <LoaderCard count={5} cardHeight={12} />;
  }

  return (
    <View style={{ flex: 1 }}>
      {myJobsData>0&&(<View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {filters.map(filter => (
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
      </View>)}
      <FlatList
        data={filteredJobs}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <JobCard job={item} />}
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

const PostedJobsSection = ({ isLoading }) => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const filters = ['filter1', 'filter2', 'filter3', ];
  const filteredJobs =
    selectedFilter === 'All'
      ? postedJobsData
      : postedJobsData.filter(job => job.status === selectedFilter);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (isLoading) {
    return <LoaderCard count={5} cardHeight={12} />;
  }

  return (
    <View style={{ flex: 1 }}>
     {postedJobsData>0&&(  <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {filters.map(filter => (
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
      </View>)}

      <FlatList
        data={filteredJobs}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <JobCard job={item} />}
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

const ManageJobScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <CommonAppBar navigation={navigation} title="Manage Jobs" />
      <SwipableTabs
        titles={['My Jobs', 'Posted Jobs']}
        components={[
          <MyJobsSection isLoading={isLoading} />, 
          <PostedJobsSection isLoading={isLoading} />
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    height: 50,
    paddingVertical: 5,
    backgroundColor: Colors.whiteColor,
  },
  filterScrollContent: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  filterButton: {
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    minHeight: 30,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedFilterButton: {
    borderColor: Colors.primary,
    backgroundColor: '#f0f8ff',
  },
  filterText: {
    fontSize: 12,
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
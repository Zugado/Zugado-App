import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import { getWishlist, removeFromWishlist } from '../store/thunks/wishlistThunk';
import { selectWishlist, selectWishlistLoading } from '../store/selector';
import { useSnackbar } from '../contexts/SnackbarContext';
import MyStatusBar from '../components/MyStatusbar';
import JobCard from './Home/JobCard';
import { CommonAppBar, FaddedIcon } from '../components/CommonComponents';
import { Colors } from '../styles/commonStyles';
import LoaderCard from '../components/LoaderCard';

export default function WishlistScreen({ navigation }) {
  const dispatch = useDispatch();
  const wishlist = useSelector(selectWishlist);
  const loading = useSelector(selectWishlistLoading);
  const { showSnackbar } = useSnackbar();
  const [refreshing, setRefreshing] = useState(false);
  //  console.log("wishlist",wishlist);
  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  // console.log('Wishlist data:', wishlist);
  // console.log('Wishlist loading:', loading);
  // console.log('Wishlist length:', wishlist?.length);



  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const result = await dispatch(getWishlist()).unwrap();
      console.log('Refresh result:', result);
    } catch (error) {
      console.log('Refresh error:', error);
      showSnackbar('Failed to refresh wishlist', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  const renderJob = ({ item }) => (
    <JobCard job={item} />
  );
  const EmptyList = ({ message }) => (
    <View style={styles.emptyContainer}>
      <FaddedIcon />
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <MyStatusBar />
        <CommonAppBar title="My Wishlist" />
        <ScrollView>
          <LoaderCard count={5} cardHeight={12} />
        </ScrollView>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <MyStatusBar />

      {/* Header */}
      <CommonAppBar title="My Wishlist" />

      <FlatList
        data={wishlist}
        renderItem={renderJob}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyList message="No saved jobs in your wishlist." />
        }
        ListFooterComponent={<>{wishlist.length >= 2 && <FaddedIcon />}</>}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#666"
            colors={['#666']}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  listContainer: {
    flexGrow: 1,
    paddingHorizontal: 2,
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

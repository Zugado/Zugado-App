import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyStatusBar from '../components/MyStatusbar';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { Colors } from '../styles/commonStyles';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { getAllChats } from '../store/thunks/chatThunk';
import { FaddedIcon } from '../components/CommonComponents';

export default function AllChatScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const filters = ['All', 'Read', 'Unread'];
  const roleFilters = ['All', 'Seeker', 'Creator'];

  const { conversations, loading } = useSelector(
    state => state.chat,
    shallowEqual,
  );
  const currentUserId = useSelector(state => state.auth.user?._id);

  useEffect(() => {
    dispatch(getAllChats({ page: 1, limit: 20 }));
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(getAllChats({ page: 1, limit: 20 })).finally(() =>
      setRefreshing(false),
    );
  }, []);

  const filteredChats = conversations.filter(conv => {
    const other = conv.otherParticipant;
    const name = `${other?.firstName} ${other?.lastName}`;
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.jobId?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase());

    const myParticipant = conv.participants?.find(
      p => p.userId?._id === currentUserId,
    );
    const myRole = myParticipant?.role; // 'bidder' = seeker, 'creator' = creator

    if (selectedFilter === 'Read') {
      if (conv.unreadCount > 0) return false;
    } else if (selectedFilter === 'Unread') {
      if (conv.unreadCount === 0) return false;
    }

    if (selectedRole === 'Seeker' && myRole !== 'bidder') return false;
    if (selectedRole === 'Creator' && myRole !== 'creator') return false;

    return matchesSearch;
  });
  const renderChatItem = ({ item }) => {
    const other = item.otherParticipant;
    const name = `${other?.firstName} ${other?.lastName}`;
    const hasAvatar = !!other?.avatar;
    console.log('Rendering chat item:', item);
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('ChatingScreen', { chatData: item })}
        activeOpacity={0.9}
        style={styles.chatItem}
      >
        {hasAvatar ? (
          <Image source={{ uri: other.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarInitial}>
              {other?.firstName?.[0]?.toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>{name}</Text>
            <Text style={styles.chatTime}>
              {item.lastMessageTime
                ? new Date(item.lastMessageTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : ''}
            </Text>
          </View>
          <View style={styles.messageRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.chatJob} numberOfLines={1}>
                {item.jobId?.title}
              </Text>
              <Text style={styles.chatMessage} numberOfLines={1}>
                {item.lastMessage || 'No messages yet'}
              </Text>
            </View>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaBlack}>
      <MyStatusBar />
      {/* <StatusBar
        translucent={false}
        backgroundColor={Colors.primary}
        barStyle={'light-content'}
      /> */}
      <Header showSearch={false} navigation={navigation} />

      <View style={styles.container}>
        <Text style={styles.title}>Messages</Text>
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color={Colors.grayColor} />
          <TextInput
            placeholder="Search messages..."
            placeholderTextColor={Colors.grayColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={18} color={Colors.grayColor} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterContainer}>
          {filters.map(filter => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.roleFilterContainer}>
          {roleFilters.map((role, index) => (
            <TouchableOpacity
              key={role}
              style={styles.roleFilterButton}
              onPress={() => setSelectedRole(role)}
            >
              <Text
                style={[
                  styles.roleFilterText,
                  selectedRole === role && styles.roleFilterTextActive,
                ]}
              >
                {role}
              </Text>
              {selectedRole === role && (
                <View style={styles.roleFilterUnderline} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredChats}
          keyExtractor={item => item._id}
          renderItem={renderChatItem}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            loading ? (
              <ActivityIndicator
                style={{ marginTop: 40 }}
                size="large"
                color={Colors.primary}
              />
            ) : (
              <View />
            )
          }
          ListFooterComponent={<FaddedIcon />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaBlack: {
    flex: 1,
    backgroundColor: Colors.bodyBackColor,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: -20,
    paddingTop: 20,
    paddingHorizontal: 16,
    // backgroundColor: Colors.bodyBackColor,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.blackColor,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderColor: Colors.extraLightGrayColor,
    borderWidth: 1,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    color: Colors.blackColor,
  },
  filterContainer: {
    marginTop: 20,
    flexDirection: 'row',
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    padding: 2,
    borderColor: Colors.grayColor,
    borderWidth: 1,
  },
  filterButton: {
    flex: 1,
    padding: 6,
    borderRadius: 22,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: Colors.blackColor,
  },
  filterText: {
    fontSize: 12,
    color: Colors.blackColor,
    fontWeight: 'bold',
  },
  filterTextActive: {
    color: Colors.whiteColor,
  },
  roleFilterContainer: {
    flexDirection: 'row',
    marginTop: 12,
    backgroundColor: Colors.whiteColor,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.extraLightGrayColor,
    overflow: 'hidden',
  },
  roleFilterButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  roleFilterText: {
    fontSize: 13,
    color: Colors.grayColor,
    fontWeight: '500',
  },
  roleFilterTextActive: {
    color: Colors.blackColor,
    fontWeight: '700',
  },
  roleFilterUnderline: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 2,
    backgroundColor: Colors.blackColor,
    // borderRadius: 2,

    // paddingTop: 16,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
    marginBottom: 1,
    borderBottomColor: '#dcdcdc',
    borderBottomWidth: 0.5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.extraLightGrayColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.grayColor,
  },
  chatContent: {
    flex: 1,
    marginLeft: 12,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.blackColor,
  },
  chatTime: {
    fontSize: 11,
    color: Colors.grayColor,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatMessage: {
    fontSize: 10,
    color: Colors.grayColor,
    flex: 1,
  },
  chatJob: {
    fontSize: 10,
    color: Colors.blackColor,
    flex: 1,
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 10,
    color: Colors.whiteColor,
    fontWeight: 'bold',
  },
});

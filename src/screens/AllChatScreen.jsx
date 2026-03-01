import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyStatusBar from '../components/MyStatusbar';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { Colors } from '../styles/commonStyles';
import Feather from 'react-native-vector-icons/Feather';

const dummyChats = [
  {
    id: '1',
    name: 'John Doe',
    message: 'Hey, how are you?',
    time: '2 min ago',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    unread: 2,
    isRead: false,
  },
  {
    id: '2',
    name: 'Jane Smith',
    message: 'Thanks for the help!',
    time: '1 hour ago',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    unread: 0,
    isRead: true,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    message: 'See you tomorrow',
    time: '1 day ago',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    unread: 1,
    isRead: false,
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    message: 'Perfect, let me know',
    time: '2 days ago',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
    unread: 0,
    isRead: true,
  },
   {
    id: '5',
    name: 'Mike Johnson',
    message: 'See you tomorrow',
    time: '1 day ago',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    unread: 1,
    isRead: false,
  },
  {
    id: '6',
    name: 'Sarah Wilson',
    message: 'Perfect, let me know',
    time: '2 days ago',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
    unread: 0,
    isRead: true,
  },
   {
    id: '7',
    name: 'Mike Johnson',
    message: 'See you tomorrow',
    time: '1 day ago',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    unread: 1,
    isRead: false,
  },
  {
    id: '8',
    name: 'Sarah Wilson',
    message: 'Perfect, let me know',
    time: '2 days ago',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
    unread: 0,
    isRead: true,
  },
];

export default function AllChatScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'Read', 'Unread'];

  const filteredChats = dummyChats.filter(chat => {
    if (selectedFilter === 'Read') return chat.isRead;
    if (selectedFilter === 'Unread') return !chat.isRead;
    return true;
  });

  const renderChatItem = ({ item }) => (
    <TouchableOpacity activeOpacity={0.9} style={styles.chatItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        <View style={styles.messageRow}>
          <Text style={styles.chatMessage} numberOfLines={1}>
            {item.message}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeAreaBlack}>
      <MyStatusBar />
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

        <FlatList
          data={filteredChats}
          keyExtractor={item => item.id}
          renderItem={renderChatItem}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
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
    backgroundColor: Colors.bodyBackColor,
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
  chatList: {
    paddingTop: 16,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
    marginBottom: 1,
    borderBottomColor:"#dcdcdc",
    borderBottomWidth: 0.5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
    fontSize: 12,
    color: Colors.grayColor,
    flex: 1,
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

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyStatusBar from '../components/MyStatusbar';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import { Colors } from '../styles/commonStyles';
import { FaddedIcon } from '../components/CommonComponents';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function ChatingScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { chatData } = route.params || {};

  return (
    <SafeAreaView style={styles.safeAreaBlack}>
      <MyStatusBar />
      <Header showSearch={false} navigation={navigation} />

      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={{
              uri:
                chatData?.avatar ||
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
            }}
            style={styles.avatar}
          />
          <View style={styles.userThings}>
            <View style={styles.userHeader}>
              <Text style={styles.usernameTop}>
                {chatData?.name || 'User Name'}
              </Text>
              <TouchableOpacity style={styles.dotOption}>
                <Feather name="more-vertical" size={16} color={Colors.blackColor} />
              </TouchableOpacity>
            </View>
            <Text style={styles.jobName}>This is Job Name</Text>
            <Text style={styles.userStatus}>
              {false ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>

        <View style={styles.warningContainer}>
          <View style={styles.warningBox}>
            <MaterialIcons name="work" size={16} color={Colors.grayColor} />
            <Text style={styles.warningText}>
              Do not Share Mobile Number Untill Finalized
            </Text>
          </View>
          <View style={styles.warningBox}>
            <Feather name="lock" size={16} color={Colors.grayColor} />
            <Text style={styles.warningText}>
              Chat Will Unlock After Bidding
            </Text>
          </View>
        </View>

        <View style={styles.chatContainer}>
          <View style={styles.quickChatHeader}>
            <Text style={styles.quickChatTitle}>Quick chat</Text>
            <View style={styles.viewButton}>
              <Text style={styles.viewText}>View</Text>
              <Feather name="chevron-right" size={16} color={Colors.grayColor} />
            </View>
          </View>

          <ScrollView style={styles.scrollView}>
            <View style={styles.userBubble}>
              <View style={styles.bubbleHeader}>
                <Text>💬 Quick Chat</Text>
                <Feather name="chevron-right" size={16} color={Colors.grayColor} />
              </View>
              <View style={styles.quickChatItem}>
                <Text style={styles.quickChatText}>
                  Tell Me more About this Job?
                </Text>
                <Feather name="send" size={16} color="#418def" />
              </View>
              <View style={styles.quickChatItem}>
                <Text style={styles.quickChatText}>
                  Can we have a Quick Call ?
                </Text>
                <Feather name="send" size={16} color="#418def" />
              </View>
            </View>

            <View style={styles.AiBubble}>
              <View style={styles.bubbleHeader}>
                <Text>💬 Ai Reply</Text>
                <Feather name="chevron-right" size={16} color={Colors.grayColor} />
              </View>
              <View style={styles.aiReplyItem}>
                <Text style={styles.aiReplyText}>I'm Good !!</Text>
              </View>
            </View>

            <FaddedIcon />
          </ScrollView>

          <View style={styles.bottomButtons}>
            <View style={styles.unlockButton}>
              <Text style={styles.unlockButtonText}>Chat will Unlock After Bidding</Text>
            </View>
            <View style={styles.bidButton}>
              <Text style={styles.bidButtonText}>Place a Bid</Text>
            </View>
          </View>
        </View>
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
    marginTop: -20,
    backgroundColor: Colors.bodyBackColor,
    overflow: 'hidden',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  header: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: Colors.whiteColor,
    marginBottom: 1,
    borderBottomColor: '#bab9b9',
    borderBottomWidth: 0.5,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userThings: {
    flex: 1,
    marginLeft: 12,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  usernameTop: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.blackColor,
  },
  dotOption: {
    padding: 4,
    marginRight: 10,
  },
  userStatus: {
    fontSize: 10,
    color: false ? Colors.greenColor : Colors.secondary,
  },
  jobName: {
    fontSize: 12,
    color: Colors.blackColor,
    fontWeight: '500',
  },
  warningContainer: {
    padding: 10,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.whiteColor,
    elevation: 2,
    marginBottom: 4,
    padding: 10,
    borderRadius: 10,
    gap: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: Colors.blackColor,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    padding: 10,
  },
  quickChatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickChatTitle: {
    fontSize: 20,
    fontWeight: '500',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewText: {
    fontSize: 14,
    color: Colors.grayColor,
    marginRight: 4,
  },
  scrollView: {
    padding: 10,
    flex: 1,
  },
  userBubble: {
    alignSelf: 'flex-end',
    maxWidth: '75%',
    backgroundColor: Colors.extraLightGrayColor,
    borderBottomLeftRadius: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 10,
    marginVertical: 4,
  },
  AiBubble: {
    alignSelf: 'flex-start',
    maxWidth: '75%',
    backgroundColor: Colors.extraLightGrayColor,
    borderBottomRightRadius: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 10,
    marginVertical: 4,
  },
  bubbleHeader: {
    flexDirection: 'row',
    padding: 6,
    gap: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  quickChatItem: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    gap: 20,
    alignItems: 'center',
    marginBottom: 4,
    backgroundColor: Colors.whiteColor,
    borderRadius: 8,
  },
  quickChatText: {
    color: Colors.blackColor,
    flex: 1,
  },
  aiReplyItem: {
    padding: 10,
    marginBottom: 4,
    backgroundColor: Colors.whiteColor,
    borderRadius: 8,
  },
  aiReplyText: {
    color: Colors.blackColor,
  },
  bottomButtons: {
    paddingTop: 10,
  },
  unlockButton: {
    backgroundColor: Colors.extraLightGrayColor,
    borderWidth: 0.3,
    borderColor: Colors.grayColor,
    elevation: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  unlockButtonText: {
    color: Colors.blackColor,
  },
  bidButton: {
    backgroundColor: '#e86b18',
    borderWidth: 0.3,
    borderColor: Colors.grayColor,
    elevation: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  bidButtonText: {
    color: Colors.whiteColor,
    fontWeight: '500',
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MyStatusBar from '../components/MyStatusbar';

export default function MessageScreen() {
  return (
    <SafeAreaView style={styles.container}>
        <MyStatusBar/>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="message-outline" size={80} color="#E0E0E0" />
          <View style={styles.chatBubbles}>
            <View style={styles.bubble1} />
            <View style={styles.bubble2} />
            <View style={styles.bubble3} />
          </View>
        </View>

        {/* Text Content */}
        <Text style={styles.title}>Chat System Coming Soon</Text>
        <Text style={styles.subtitle}>
          Connect directly with job providers and seekers through our secure messaging platform.
        </Text>

        {/* Features List */}
        <View style={styles.featuresList}>
          <FeatureItem icon="message-circle" text="Real-time messaging" />
          <FeatureItem icon="image" text="Share files and images" />
          <FeatureItem icon="shield" text="Secure conversations" />
          <FeatureItem icon="clock" text="Message history" />
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.notifyButton}>
          <Feather name="bell" size={20} color="#666" />
          <Text style={styles.notifyText}>Notify me when ready</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const FeatureItem = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <Feather name={icon} size={16} color="#999" />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 30,
  },
  chatBubbles: {
    position: 'absolute',
    width: 120,
    height: 120,
  },
  bubble1: {
    position: 'absolute',
    top: 15,
    right: -5,
    width: 20,
    height: 12,
    backgroundColor: '#E8F4FD',
    borderRadius: 8,
  },
  bubble2: {
    position: 'absolute',
    bottom: 25,
    left: -10,
    width: 24,
    height: 14,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
  },
  bubble3: {
    position: 'absolute',
    top: 40,
    left: 15,
    width: 16,
    height: 10,
    backgroundColor: '#E8F4FD',
    borderRadius: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  featuresList: {
    width: '100%',
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingLeft: 20,
  },
  featureText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 15,
  },
  notifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  notifyText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
    fontWeight: '500',
  },
});
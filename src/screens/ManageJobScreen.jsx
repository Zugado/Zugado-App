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

export default function ManageJobScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Jobs</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="briefcase-outline" size={80} color="#E0E0E0" />
          <View style={styles.toolsContainer}>
            <Feather name="settings" size={24} color="#BDBDBD" style={styles.tool1} />
            <Feather name="edit-3" size={20} color="#BDBDBD" style={styles.tool2} />
            <Feather name="plus" size={18} color="#BDBDBD" style={styles.tool3} />
          </View>
        </View>

        {/* Text Content */}
        <Text style={styles.title}>Job Management Coming Soon</Text>
        <Text style={styles.subtitle}>
          We're building powerful tools to help you create, edit, and manage your job postings with ease.
        </Text>

        {/* Features List */}
        <View style={styles.featuresList}>
          <FeatureItem icon="plus-circle" text="Create new job postings" />
          <FeatureItem icon="edit" text="Edit existing listings" />
          <FeatureItem icon="users" text="Manage applications" />
          <FeatureItem icon="bar-chart" text="Track job performance" />
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
  toolsContainer: {
    position: 'absolute',
    width: 120,
    height: 120,
  },
  tool1: {
    position: 'absolute',
    top: 10,
    right: -10,
  },
  tool2: {
    position: 'absolute',
    bottom: 20,
    left: -15,
  },
  tool3: {
    position: 'absolute',
    top: 30,
    left: 10,
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
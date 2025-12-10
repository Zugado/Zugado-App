import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyStatusBar from '../../components/MyStatusbar';

// Mock data for Job Details section
const jobDetailsData = [
  { key: 'Timing Type', value: 'Fixed', icon: 'clock' },
  { key: 'Experience', value: 'Intermediate', icon: 'briefcase' },
  { key: 'Duration', value: '3-4 Weeks', icon: 'clock' },
  { key: 'Team Size', value: '1 Person', icon: 'users' },
];

// Component for a single metadata item
const MetaItem = ({ icon, text }) => (
  <View style={styles.metaItem}>
    <Feather name={icon} size={16} color="#4B5563" />
    <Text style={styles.metaText}>{text}</Text>
  </View>
);

// Component for a job detail row
const DetailRow = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <View style={styles.detailLabel}>
      <Feather name={icon} size={16} color="#6B7280" style={{ marginRight: 8 }} />
      <Text style={styles.detailLabelText}>{label}</Text>
    </View>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

// Component for a tag
const Tag = ({ text }) => (
  <View style={styles.tag}>
    <Text style={styles.tagText}>{text}</Text>
  </View>
);

export default function JobDetailedScreen({navigation}) {

  return (
    <SafeAreaView style={styles.container}>
          <MyStatusBar/>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Details</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="bell" size={24} color="#111827" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Featured Image */}
        <View style={styles.imageContainer}>
          <Image source={require('../../assets/jobImage.png')} style={styles.image} />
          <TouchableOpacity style={styles.bookmarkButton}>
            <Feather name="bookmark" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Job Title and Status */}
          <View style={styles.titleRow}>
            <Text style={styles.jobTitle}>Website Design Needed</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Urgent</Text>
            </View>
          </View>

          {/* Metadata Row */}
          <View style={styles.metaRow}>
            <MetaItem icon="clock" text="2 days left" />
            <MetaItem icon="map-pin" text="Remote" />
            <MetaItem icon="star" text="4.8" />
          </View>

          {/* Tags Row */}
          <View style={styles.tagsRow}>
            <Tag text="Design" />
            <Tag text="UI/UX" />
            <Tag text="Remote" />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.sectionText}>
              Need a professional UI designer to create a modern website interface for a tech startup.
              The project involves designing 5-7 pages including landing page, about us, services, and contact pages.
              Looking for a clean, minimalist design that appeals to a tech audience.
            </Text>
          </View>

          {/* Requirements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requirements</Text>
            <View style={styles.list}>
              <Text style={styles.listItem}>• At least 3 years of UI/UX design experience</Text>
              <Text style={styles.listItem}>• Proficient with Figma or Adobe XD</Text>
              <Text style={styles.listItem}>• Portfolio of previous website designs</Text>
              <Text style={styles.listItem}>• Good communication skills</Text>
            </View>
          </View>

          {/* Job Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job Details</Text>
            {jobDetailsData.map((item) => (
              <DetailRow key={item.key} icon={item.icon} label={item.key} value={item.value} />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Budget */}
        <View>
          <Text style={styles.budgetLabel}>Budget</Text>
          <Text style={styles.budgetValue}>
            <FontAwesome name="dollar" size={16} color="#16A34A" /> 10,000
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconAction}>
            <Feather name="message-square" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton}>
            <Text style={styles.applyText}>Apply</Text>
            <Text style={styles.applyArrow}>⌄</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  iconButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },
  notificationDot: { position: 'absolute', top: 4, right: 4, width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444' },

  scrollContent: { paddingBottom: 100 },
  imageContainer: { position: 'relative', height: 200 },
  image: { width: '100%', height: '100%' },
  bookmarkButton: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 999 },

  content: { padding: 16 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  jobTitle: { fontSize: 22, fontWeight: '700', flex: 1, paddingRight: 8 },
  statusBadge: { backgroundColor: '#EF4444', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600' },

  metaRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 12, marginBottom: 6 },
  metaText: { marginLeft: 4, fontSize: 12, color: '#4B5563', fontWeight: '500' },

  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  tag: { backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, marginRight: 6, marginBottom: 6 },
  tagText: { fontSize: 12, color: '#4B5563', fontWeight: '600' },

  section: { marginTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4, color: '#111827' },
  sectionText: { fontSize: 14, lineHeight: 20, color: '#4B5563' },
  list: { marginLeft: 12 },
  listItem: { fontSize: 14, lineHeight: 20, color: '#4B5563', marginBottom: 2 },

  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  detailLabel: { flexDirection: 'row', alignItems: 'center' },
  detailLabelText: { fontSize: 14, fontWeight: '500', color: '#111827' },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#111827' },

  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB', backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: -2 }, shadowRadius: 4 },
  budgetLabel: { fontSize: 12, fontWeight: '500', color: '#6B7280' },
  budgetValue: { fontSize: 22, fontWeight: '800', color: '#16A34A' },

  actions: { flexDirection: 'row', alignItems: 'center' },
  iconAction: { backgroundColor: '#111827', padding: 12, borderRadius: 999, marginRight: 8 },
  applyButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111827', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 999 },
  applyText: { color: '#fff', fontSize: 16, fontWeight: '700', marginRight: 6 },
  applyArrow: { color: '#fff', fontSize: 18, lineHeight: 18 },
});

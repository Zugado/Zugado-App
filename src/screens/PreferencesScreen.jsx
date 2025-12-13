import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import MyStatusBar from '../components/MyStatusbar';
import { CommonAppBar } from '../components/CommonComponents';
import { Colors } from '../styles/commonStyles';

const PreferencesScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState({
    pushNotifications: true,
    emailNotifications: false,
    jobAlerts: true,
    messageAlerts: true,
  });
  
  const [language, setLanguage] = useState('English');
  const [appearance, setAppearance] = useState('Light');
  const [currency, setCurrency] = useState('USD');
  const [onlineStatus, setOnlineStatus] = useState(true);

  const languages = ['English', 'Spanish', 'French', 'German', 'Hindi'];
  const appearances = ['Light', 'Dark', 'System'];
  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY'];

  const PreferenceSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  const PreferenceItem = ({ icon, title, subtitle, rightComponent, onPress }) => (
    <TouchableOpacity style={styles.preferenceItem} onPress={onPress}>
      <View style={styles.preferenceLeft}>
        <View style={styles.iconContainer}>
          <Feather name={icon} size={20} color={Colors.grayColor} />
        </View>
        <View style={styles.preferenceContent}>
          <Text style={styles.preferenceTitle}>{title}</Text>
          {subtitle && <Text style={styles.preferenceSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  const ToggleItem = ({ icon, title, subtitle, value, onToggle }) => (
    <PreferenceItem
      icon={icon}
      title={title}
      subtitle={subtitle}
      rightComponent={
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: Colors.extraLightGrayColor, true: Colors.primary }}
          thumbColor={value ? Colors.whiteColor : Colors.grayColor}
        />
      }
    />
  );

  const SelectItem = ({ icon, title, subtitle, value, onPress }) => (
    <PreferenceItem
      icon={icon}
      title={title}
      subtitle={subtitle}
      rightComponent={
        <View style={styles.selectValue}>
          <Text style={styles.selectValueText}>{value}</Text>
          <Feather name="chevron-right" size={16} color={Colors.grayColor} />
        </View>
      }
      onPress={onPress}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <MyStatusBar />
      <CommonAppBar title="Preferences" navigation={navigation} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <PreferenceSection title="Notifications">
          <ToggleItem
            icon="bell"
            title="Push Notifications"
            subtitle="Receive notifications on your device"
            value={notifications.pushNotifications}
            onToggle={(value) => setNotifications(prev => ({ ...prev, pushNotifications: value }))}
          />
          <View style={styles.divider} />
          <ToggleItem
            icon="mail"
            title="Email Notifications"
            subtitle="Receive updates via email"
            value={notifications.emailNotifications}
            onToggle={(value) => setNotifications(prev => ({ ...prev, emailNotifications: value }))}
          />
          <View style={styles.divider} />
          <ToggleItem
            icon="briefcase"
            title="Job Alerts"
            subtitle="Get notified about new job opportunities"
            value={notifications.jobAlerts}
            onToggle={(value) => setNotifications(prev => ({ ...prev, jobAlerts: value }))}
          />
          <View style={styles.divider} />
          <ToggleItem
            icon="message-circle"
            title="Message Alerts"
            subtitle="Notifications for new messages"
            value={notifications.messageAlerts}
            onToggle={(value) => setNotifications(prev => ({ ...prev, messageAlerts: value }))}
          />
        </PreferenceSection>

        <PreferenceSection title="General">
          <SelectItem
            icon="globe"
            title="Language"
            subtitle="Choose your preferred language"
            value={language}
            onPress={() => console.log('Language selection')}
          />
          <View style={styles.divider} />
          <SelectItem
            icon="monitor"
            title="Appearance"
            subtitle="Light, Dark, or System theme"
            value={appearance}
            onPress={() => console.log('Appearance selection')}
          />
          <View style={styles.divider} />
          <SelectItem
            icon="dollar-sign"
            title="Currency"
            subtitle="Default currency for payments"
            value={currency}
            onPress={() => console.log('Currency selection')}
          />
        </PreferenceSection>

        <PreferenceSection title="Privacy">
          <ToggleItem
            icon="eye"
            title="Online Status"
            subtitle="Show when you're active"
            value={onlineStatus}
            onToggle={setOnlineStatus}
          />
          <View style={styles.divider} />
          <PreferenceItem
            icon="shield"
            title="Privacy Settings"
            subtitle="Manage your privacy preferences"
            rightComponent={<Feather name="chevron-right" size={16} color={Colors.grayColor} />}
            onPress={() => console.log('Privacy settings')}
          />
          <View style={styles.divider} />
          <PreferenceItem
            icon="lock"
            title="Security"
            subtitle="Password and security settings"
            rightComponent={<Feather name="chevron-right" size={16} color={Colors.grayColor} />}
            onPress={() => console.log('Security settings')}
          />
        </PreferenceSection>

        <PreferenceSection title="Data & Storage">
          <PreferenceItem
            icon="download"
            title="Auto-download Media"
            subtitle="Automatically download images and files"
            rightComponent={<Feather name="chevron-right" size={16} color={Colors.grayColor} />}
            onPress={() => console.log('Auto-download settings')}
          />
          <View style={styles.divider} />
          <PreferenceItem
            icon="trash-2"
            title="Clear Cache"
            subtitle="Free up storage space"
            rightComponent={<Feather name="chevron-right" size={16} color={Colors.grayColor} />}
            onPress={() => console.log('Clear cache')}
          />
        </PreferenceSection>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bodyBackColor,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.grayColor,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.extraLightGrayColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  preferenceContent: {
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.blackColor,
    marginBottom: 2,
  },
  preferenceSubtitle: {
    fontSize: 13,
    color: Colors.grayColor,
    lineHeight: 18,
  },
  selectValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectValueText: {
    fontSize: 14,
    color: Colors.grayColor,
    marginRight: 8,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.extraLightGrayColor,
    marginHorizontal: 16,
  },
});

export default PreferencesScreen;
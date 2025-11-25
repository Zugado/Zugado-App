import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';

export default function CreateJob({ navigation, route }) {
  const {jobData} = route.params;
  console.log("Job Data from Screen 1:", jobData);
  // State for Location Type (On-site, Hybrid, Remote)
  const [jobLocationType, setJobLocationType] = useState('On-site');
  // State for Amount Disclosure
  const [discloseAmount, setDiscloseAmount] = useState('Yes');
  // State for Negotiable Switch
  const [isNegotiable, setIsNegotiable] = useState(true);

  // --- Components for Radio Buttons used in the UI ---

  // 1. RadioButton for square radio buttons (On-site, Hybrid, Remote)
  const SquareRadioButton = ({ label, selected, onPress }) => (
    <TouchableOpacity style={styles.squareOption} onPress={onPress}>
      <View style={[styles.squareRadio, selected && styles.squareRadioSelected]}>
        {/* No inner circle/square needed, as the background color changes for selection */}
      </View>
      <Text style={[styles.squareOptionText, selected && styles.squareOptionTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  // 2. RadioButton for round radio buttons (Yes/No disclosure)
  const RoundRadioButton = ({ label, selected, onPress }) => (
    <TouchableOpacity style={styles.roundOption} onPress={onPress}>
      <View style={styles.roundRadio}>
        {selected && <View style={styles.roundRadioSelected} />}
      </View>
      <Text style={styles.roundOptionText}>{label}</Text>
    </TouchableOpacity>
  );

  // --- Main Render Function ---

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -200} // Adjust as needed
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* --- Header --- */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => {navigation.goBack()}} style={styles.backButton}>
              <Feather name="arrow-left" size={20} color="#000" />
            </TouchableOpacity>
            <View style={styles.progressContainer}>
              {/* Progress bar is now 2/3rds complete */}
              <View style={[styles.progressBar, { width: '66.66%' }]} />
            </View>
            <Text style={styles.progressText}>2/3</Text>
          </View>

          {/* --- Title --- */}
          <Text style={styles.title}>Define Location & Payment Information</Text>

          {/* --- Form --- */}
          <View style={styles.form}>
            {/* Job Location Type */}
            <Text style={styles.label}>Job Location</Text>
            <View style={styles.locationOptionsContainer}>
              <SquareRadioButton
                label="On-site"
                selected={jobLocationType === 'On-site'}
                onPress={() => setJobLocationType('On-site')}
              />
              <SquareRadioButton
                label="Hybrid"
                selected={jobLocationType === 'Hybrid'}
                onPress={() => setJobLocationType('Hybrid')}
              />
              <SquareRadioButton
                label="Remote"
                selected={jobLocationType === 'Remote'}
                onPress={() => setJobLocationType('Remote')}
              />
            </View>

            {/* Choose Address */}
            <TouchableOpacity style={styles.textInputWithIcon}>
              <TextInput
                style={styles.textInputFlex}
                placeholder="Choose Address"
                placeholderTextColor="#888"
                editable={false} // Typically opens a map/picker
              />
              <Feather name="map-pin" size={20} color="#000" />
            </TouchableOpacity>

            {/* Timings */}
            <Text style={styles.label}>Timing Type</Text>
            <TouchableOpacity style={styles.textInputWithIcon}>
              <TextInput
                style={styles.textInputFlex}
                placeholder="Select Timing"
                placeholderTextColor="#888"
                editable={false} // Typically opens a dropdown/modal
              />
              <Feather name="chevron-down" size={20} color="#000" />
            </TouchableOpacity>

            {/* Date & Time */}
            <Text style={styles.label}>Date & Time</Text>
            <TouchableOpacity style={styles.textInputWithIcon}>
              <TextInput
                style={styles.textInputFlex}
                placeholder="Choose Date & Time"
                placeholderTextColor="#888"
                editable={false} // Typically opens a date picker
              />
              <Feather name="calendar" size={20} color="#000" />
            </TouchableOpacity>

            {/* Would you like to disclose the amount? */}
            <Text style={[styles.label, { marginTop: 15 }]}>Would you like to disclose the amount ?</Text>
            <View style={styles.disclosureOptionsContainer}>
              <RoundRadioButton
                label="Yes"
                selected={discloseAmount === 'Yes'}
                onPress={() => setDiscloseAmount('Yes')}
              />
              <RoundRadioButton
                label="No"
                selected={discloseAmount === 'No'}
                onPress={() => setDiscloseAmount('No')}
              />
            </View>

            {/* Amount / Amount Range Section */}
            {discloseAmount === 'Yes' ? (
              <>
                {/* Amount and Negotiable Switch */}
                <Text style={styles.label}>Amount</Text>
                <View style={styles.amountInputContainer}>
                  <TextInput
                    style={[styles.textInputFlex, styles.amountInput]}
                    placeholder="Enter Amount"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                  />
                  <View style={styles.negotiableSwitchContainer}>
                    <Text style={styles.negotiableText}>Negotiable</Text>
                    <Switch
                      trackColor={{ false: '#767577', true: '#5CB85C' }} // Green for ON
                      thumbColor={isNegotiable ? '#fff' : '#f4f3f4'}
                      onValueChange={setIsNegotiable}
                      value={isNegotiable}
                      style={styles.negotiableSwitch}
                    />
                  </View>
                </View>

                {/* Amount Range */}
                <Text style={styles.label}>Amount Range</Text>
                <View style={styles.amountRangeContainer}>
                  <TextInput
                    style={styles.rangeInput}
                    placeholder="Min Amount"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={styles.rangeInput}
                    placeholder="Max Amount"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                  />
                </View>
              </>
            ) : (
              // If discloseAmount is 'No', you might show a different UI or nothing.
              <View style={{ height: 20 }} />
            )}

          </View>
        </ScrollView>

        {/* --- Next Button --- */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('CreateJobScreen3',
            {
              jobData: {
                ...jobData,
                jobLocationType,
                discloseAmount,
                isNegotiable,
              }
            }
          )}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // --- General/Reused Styles ---
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Reduced from 120, check spacing
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 20,
  },
  progressContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginHorizontal: 15,
  },
  progressBar: {
    // Width set inline in component for 2/3
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#888',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
    fontWeight: '600', // Added for better visual match
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0', // Optional separator line
  },
  nextButton: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // --- New Styles for Page 2 UI ---

  // Text Input with Icon (Address, Timings, Date & Time)
  textInputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: Platform.OS === 'ios' ? 12 : 5, // Adjusted for better alignment
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  textInputFlex: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    padding: 0, // Reset default padding
  },

  // Location Radio Buttons (Square/Box Style)
  locationOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30, // Increased spacing after the location radios
  },
  squareOption: {
    flex: 1,
    marginHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center text and radio
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  squareRadio: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 5,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  squareRadioSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  squareOptionText: {
    fontSize: 15,
    color: '#000',
  },

  // Amount Disclosure Radio Buttons (Round Style - copied from original file)
  disclosureOptionsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  roundOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 30,
  },
  roundRadio: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10, // Round
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundRadioSelected: {
    width: 10,
    height: 10,
    backgroundColor: '#000',
    borderRadius: 5, // Inner round
  },
  roundOptionText: {
    fontSize: 16,
    color: '#000',
  },

  // Amount Input and Negotiable Switch
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 20,
  },
  amountInput: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  negotiableSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 15,
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
    height: '100%',
    backgroundColor: 'rgba(92, 184, 92, 0.1)', // Light green background like in the image
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  negotiableText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5CB85C',
    marginRight: 5,
  },
  negotiableSwitch: {
    // Styles for the switch itself
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },

  // Amount Range
  amountRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  rangeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
    marginHorizontal: 5,
  },
});
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import DateTimePickerField from '../../components/DateTimePickerField';
import FloatingLabelInput from '../../components/inputFields/FloatingLabelInput';
import MyStatusBar from '../../components/MyStatusbar';
import { Colors } from '../../styles/commonStyles';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { FaddedIcon } from '../../components/CommonComponents';

export default function CreateJob({ navigation, route }) {
  const { jobData } = route.params || {};
  const { showSnackbar } = useSnackbar();
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    if (route.params?.selectedLocation) {
      setAddress(route.params.selectedLocation.address || '');
      setCoordinates(route.params.selectedLocation.coordinates || null);
    }
  }, [route.params?.selectedLocation]);
  
  // const [coordinate, setCoordinate] = useState(null);
  const [jobLocationType, setJobLocationType] = useState('onsite');

  const [discloseAmount, setDiscloseAmount] = useState(false);

  const [timingType, setTimingType] = useState('fixed');

  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dailyHours, setDailyHours] = useState('');

  const [deadline, setDeadline] = useState('');

  const [estimatedHours, setEstimatedHours] = useState('');

  const clearTimingFields = (newType) => {
    if (newType !== 'fixed') {
      setDate('');
      setStartTime('');
      setEndTime('');
    }
    if (newType !== 'multiday') {
      setStartDate('');
      setEndDate('');
      setDailyHours('');
    }
    if (newType !== 'deadline') {
      setDeadline('');
    }
    if (newType !== 'flexible') {
      setEstimatedHours('');
    }
  };

  const handleTimingTypeChange = (newType) => {
    clearTimingFields(newType);
    setTimingType(newType);
  };

  const [amountMin, setAmountMin] = useState('');
  const [amountMax, setAmountMax] = useState('');

  const CheckboxButton = ({ label, selected, onPress }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.option}
      onPress={onPress}
    >
      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
        {selected && <Feather name="check" size={12} color="#fff" />}
      </View>
      <Text style={styles.optionText}>{label}</Text>
    </TouchableOpacity>
  );

  const RoundRadioButton = ({ label, selected, onPress }) => (
    <TouchableOpacity style={styles.roundOption} onPress={onPress}>
      <View style={styles.roundRadio}>
        {selected && <View style={styles.roundRadioSelected} />}
      </View>
      <Text style={styles.roundOptionText}>{label}</Text>
    </TouchableOpacity>
  );

  const getTimingDetails = () => {
    switch (timingType) {
      case 'fixed':
        return { date, startTime, endTime };
      case 'multiday':
        return { startDate, endDate, dailyHours };
      case 'deadline':
        return { deadline };
      case 'flexible':
        return { estimatedHours };
      default:
        return {};
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20}
      enabled={true}
    >
      <SafeAreaView style={styles.safeAreaBlack}>
        <MyStatusBar />
        <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={20} color="#000" />
            </TouchableOpacity>

            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: '66.66%' }]} />
            </View>

            <Text style={styles.progressText}>2/3</Text>
          </View>

          <Text style={styles.title}>
            Define Location & Payment Information
          </Text>

          <View style={styles.form}>
            {/* Job Location */}
            <View style={styles.selectorContainer}>
              <Text style={styles.selectorLabel}>Job Location</Text>
              <Text style={styles.selectorHelper}>Where will the work be performed?</Text>
              <View style={styles.locationGrid}>
                {[
                  { value: 'onsite', label: 'On-site', icon: 'map-pin', desc: 'At specific location' },
                  { value: 'remote', label: 'Remote', icon: 'home', desc: 'Work from anywhere' },
                  { value: 'hybrid', label: 'Hybrid', icon: 'globe', desc: 'Mix of both' }
                ].map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.locationCard,
                      jobLocationType === option.value && styles.selectedLocationCard,
                    ]}
                    onPress={() => setJobLocationType(option.value)}
                  >
                    <View style={styles.locationContent}>
                      <Feather
                        name={option.icon}
                        size={20}
                        color={jobLocationType === option.value ? '#000' : '#666'}
                      />
                      <View style={styles.locationText}>
                        <Text style={[
                          styles.locationLabel,
                          jobLocationType === option.value && styles.selectedLocationLabel,
                        ]}>
                          {option.label}
                        </Text>
                        <Text style={styles.locationDesc}>{option.desc}</Text>
                      </View>
                    </View>
                    {jobLocationType === option.value && (
                      <View style={styles.locationCheckmark}>
                        <Feather name="check" size={12} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Address Selection */}
            <View style={styles.addressContainer}>
              <Text style={styles.selectorLabel}>Job Address</Text>
              <Text style={styles.selectorHelper}>Select location on map first, then edit address if needed</Text>
              
              {!coordinates ? (
                <TouchableOpacity
                  onPress={() => navigation.navigate('LocationPickerScreen', { 
                    returnScreen: 'CreateJobScreen2',
                    jobData 
                  })}
                  style={styles.mapButton}
                >
                  <Feather name="map-pin" size={20} color="#000" />
                  <Text style={styles.mapButtonText}>Select on Map</Text>
                  <Feather name="chevron-right" size={16} color="#666" />
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('LocationPickerScreen', { 
                      returnScreen: 'CreateJobScreen2',
                      jobData 
                    })}
                    style={styles.mapButtonSelected}
                  >
                    <Feather name="map-pin" size={20} color="#000" />
                    <Text style={styles.mapButtonSelectedText}>Change Location</Text>
                    <Feather name="edit-2" size={16} color="#666" />
                  </TouchableOpacity>
                  
                  <FloatingLabelInput
                    label="Address"
                    required={true}
                    value={address}
                    onChangeText={setAddress}
                    multiline
                    numberOfLines={2}
                    placeholder="Enter or edit address manually"
                  />
                  {/* Location Point */}
                  {/* <View style={styles.coordinatesInfo}>
                    <Feather name="map-pin" size={14} color="#666" />
                    <Text style={styles.coordinatesText}>
                      Location: {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
                    </Text>
                  </View> */}
                </>
              )}
            </View>

            {/* Timing Type */}
            <Text style={styles.label}>Timing Type</Text>

            <View style={{ marginBottom: 20 }}>
              <RoundRadioButton
                label="Fixed"
                selected={timingType === 'fixed'}
                onPress={() => handleTimingTypeChange('fixed')}
              />
              <RoundRadioButton
                label="Multi-day"
                selected={timingType === 'multiday'}
                onPress={() => handleTimingTypeChange('multiday')}
              />
              <RoundRadioButton
                label="Deadline"
                selected={timingType === 'deadline'}
                onPress={() => handleTimingTypeChange('deadline')}
              />
              <RoundRadioButton
                label="Flexible"
                selected={timingType === 'flexible'}
                onPress={() => handleTimingTypeChange('flexible')}
              />
            </View>

            {/* Input forms based on timing type */}
            {timingType === 'fixed' && (
              <>
                <DateTimePickerField
                  label="Date"
                  value={date}
                  mode="date"
                  onChange={setDate}
                />

                <DateTimePickerField
                  label="Start Time"
                  mode="time"
                  value={startTime}
                  onChange={setStartTime}
                />

                <DateTimePickerField
                  label="End Time"
                  mode="time"
                  value={endTime}
                  onChange={setEndTime}
                />
              </>
            )}

            {timingType === 'multiday' && (
              <>
                <DateTimePickerField
                  label="Start Date"
                  mode="date"
                  value={startDate}
                  onChange={setStartDate}
                />

                <DateTimePickerField
                  label="End Date"
                  mode="date"
                  value={endDate}
                  onChange={setEndDate}
                />

                <FloatingLabelInput
                  label="Daily Hours"
                  value={dailyHours}
                  onChangeText={setDailyHours}
                  keyboardType="numeric"
                  placeholder="Enter daily working hours (e.g., 8)"
                />
              </>
            )}

            {timingType === 'deadline' && (
              <DateTimePickerField
                label="Deadline"
                mode="datetime"
                value={deadline}
                onChange={setDeadline}
              />
            )}

            {timingType === 'flexible' && (
              <>
                <FloatingLabelInput
                  label="Estimated Hours"
                  value={estimatedHours}
                  onChangeText={setEstimatedHours}
                  keyboardType="numeric"
                  placeholder="Enter estimated total hours (e.g., 40)"
                />
              </>
            )}

            {/* Amount Disclosure */}
            <Text style={[styles.label, { marginTop: 15 }]}>
              Would you like to disclose the amount?
            </Text>

            <View style={styles.disclosureOptionsContainer}>
              <RoundRadioButton
                label="Yes"
                selected={discloseAmount === true}
                onPress={() => setDiscloseAmount(true)}
              />
              <RoundRadioButton
                label="No"
                selected={discloseAmount === false}
                onPress={() => {
                  setDiscloseAmount(false);
                  setAmountMin('');
                  setAmountMax('');
                }}
              />
            </View>

            {discloseAmount && (
              <>
                <Text style={styles.label}>Amount Range (INR)</Text>
                <View style={styles.amountRangeContainer}>
                  <View style={styles.rangeInputWrapper}>
                    <FloatingLabelInput
                      label="Min Amount ₹"
                      value={amountMin}
                      onChangeText={setAmountMin}
                      keyboardType="numeric"
                      placeholder="0"
                    />
                  </View>
                  <View style={styles.rangeInputWrapper}>
                    <FloatingLabelInput
                      label="Max Amount ₹"
                      value={amountMax}
                      onChangeText={setAmountMax}
                      keyboardType="numeric"
                      placeholder="0"
                    />
                  </View>
                </View>
              </>
            )}
          
          </View>
            <FaddedIcon/>
        </ScrollView>

        {/* NEXT BUTTON */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => {
              // Validation
              const timingDetails = getTimingDetails();
              if (timingType === 'fixed' && (!timingDetails.date || !timingDetails.startTime || !timingDetails.endTime)) {
                showSnackbar('Fixed timing requires date, start time, and end time', 'error');
                return;
              }
              if (timingType === 'multiday' && (!timingDetails.startDate || !timingDetails.endDate || !timingDetails.dailyHours)) {
                showSnackbar('Multi-day timing requires start date, end date, and daily hours', 'error');
                return;
              }
              if (timingType === 'deadline' && !timingDetails.deadline) {
                showSnackbar('Deadline timing requires a deadline', 'error');
                return;
              }
              if (timingType === 'flexible' && !timingDetails.estimatedHours) {
                showSnackbar('Flexible timing requires estimated hours', 'error');
                return;
              }
              if (discloseAmount && amountMin && amountMax && Number(amountMin) > Number(amountMax)) {
                showSnackbar('Minimum amount cannot be greater than maximum amount', 'error');
                return;
              }
              
              navigation.navigate('CreateJobScreen3', {
                jobData: {
                  ...jobData,
                  locationType: jobLocationType,
                  location: coordinates ? {
                    type: 'Point',
                    coordinates: [coordinates.longitude, coordinates.latitude],
                    address: address.trim() || ''
                  } : null,
                  timingType,
                  timingDetails,
                  amount: {
                    min: Number(amountMin) || 0,
                    max: Number(amountMax) || 0,
                    disclose: discloseAmount,
                  },
                },
              })
            }
            }>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

/* ========== STYLES HERE ========== */
const styles = StyleSheet.create({
  safeAreaBlack: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: { flex: 1, backgroundColor: '#fff' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 200 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  backButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  progressContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginHorizontal: 15,
  },
  progressBar: { height: '100%', backgroundColor: '#000', borderRadius: 4 },
  progressText: { fontSize: 14, color: '#888' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
    textAlign: 'center',
  },
  form: { width: '100%' },
  label: { fontSize: 14, color: '#000', marginBottom: 8, fontWeight: '600' },
  
  // Professional Selector Styles
  selectorContainer: {
    marginBottom: 24,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  selectorHelper: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  
  // Location Grid Styles
  locationGrid: {
    gap: 12,
  },
  locationCard: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  selectedLocationCard: {
    backgroundColor: '#fff',
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  locationText: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 2,
  },
  selectedLocationLabel: {
    color: '#000',
    fontWeight: '600',
  },
  locationDesc: {
    fontSize: 12,
    color: '#999',
  },
  locationCheckmark: {
    backgroundColor: '#000',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Address Selection Styles
  addressContainer: {
    marginBottom: 24,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  mapButtonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  mapButtonSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mapButtonSelectedText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  coordinatesInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  coordinatesText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },


  squareOption: {
    flex: 1,
    marginHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,

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
  squareRadioSelected: { backgroundColor: '#000', borderColor: '#000' },
  squareOptionText: { fontSize: 12, color: '#000' },
  squareOptionTextSelected: { fontWeight: 'bold' },

  // Checkbox styles
  option: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#171717ff',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#000',
  },
  optionText: { fontSize: 12, color: '#000' },

  // Round Radios
  disclosureOptionsContainer: { flexDirection: 'row', marginBottom: 20 },
  roundOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    marginRight: 30,
  },
  roundRadio: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundRadioSelected: {
    width: 10,
    height: 10,
    backgroundColor: '#000',
    borderRadius: 5,
  },
  roundOptionText: { fontSize: 12, color: '#000' },

  // Amount input
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 20,
  },
  amountInput: { paddingVertical: 12, paddingHorizontal: 15 },
  negotiableSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
    height: '100%',
    backgroundColor: 'rgba(92, 184, 92, 0.1)',
  },
  negotiableText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5CB85C',
    marginRight: 5,
  },
  negotiableSwitch: { transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] },


  amountRangeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  rangeInputWrapper: {
    flex: 1,
  },

  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  nextButton: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: 'center',
  },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

import AsyncStorage from '@react-native-async-storage/async-storage';
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
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import DateTimePickerField from '../../components/DateTimePickerField';
import FloatingLabelInput from '../../components/inputFields/FloatingLabelInput';
import MyStatusBar from '../../components/MyStatusbar';
import { Colors } from '../../styles/commonStyles';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { FaddedIcon } from '../../components/CommonComponents';
import { scrollToInput } from '../../utils/commonMethods';

export default function CreateJob({ navigation, route }) {
  const { jobData } = route.params || {};
  const { showSnackbar } = useSnackbar();
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const scrollViewRef = React.useRef(null);
  const [jobLocationType, setJobLocationType] = useState('onsite');
  //timing for person
  const [timingType, setTimingType] = useState('fixed');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dailyHours, setDailyHours] = useState('');
  const [deadline, setDeadline] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  //Timings for things
  const [thingTimingType, setThingTimingType] = useState('needed-by-date');
  const [thingDate, setThingDate] = useState('');
  const [thingDeadline, setThingDeadline] = useState('');
  const [thingStartTime, setThingStartTime] = useState('');
  const [thingEndTime, setThingEndTime] = useState('');
  const [thingStartDate, setThingStartDate] = useState('');
  const [thingEndDate, setThingEndDate] = useState('');
  const [thingDailyHours, setThingDailyHours] = useState('');
  const [thingEstimatedHours, setThingEstimatedHours] = useState('');
//
  {
    /* Amount Disclosure Common*/
  }
  
  
  const [discloseAmount, setDiscloseAmount] = useState(false);
  const [amount, setAmount] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [unit, setUnit] = useState('');
  const [isUnitClicked, setUnitClicked] = useState(false);
  const [isTimingClicked, setTimingClicked] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Debug: Log incoming job data and current form state
  useEffect(() => {
    console.log('=== SCREEN 2 - COMPONENT MOUNTED ===');
    console.log('Incoming Job Data:', JSON.stringify(jobData, null, 2));
    console.log('Current Form State:', {
      address,
      coordinates,
      jobLocationType,
      timingType,
      discloseAmount,
      amount,
      isNegotiable,
      minAmount,
      maxAmount,
      unit,
    });
    console.log('=== END SCREEN 2 MOUNT DEBUG ===\n');
  }, []);

  // Save draft data for Screen 2 fields
  useEffect(() => {
    const saveDraftScreen2 = async () => {
      try {
        const existingDraft = await AsyncStorage.getItem('jobDraft');
        if (existingDraft) {
          const draftData = JSON.parse(existingDraft);

          // Update draft with Screen 2 data
          const updatedDraft = {
            ...draftData,
            // Location data
            address,
            coordinates,
            jobLocationType,
            // Timing data
            timingType:
              jobData?.jobFor === 'person' ? timingType : thingTimingType,
            date,
            startTime,
            endTime,
            startDate,
            endDate,
            dailyHours,
            deadline,
            estimatedHours,
            thingDate,
            thingDeadline,
            thingStartTime,
            thingEndTime,
            thingStartDate,
            thingEndDate,
            thingDailyHours,
            thingEstimatedHours,
            // Amount data
            discloseAmount,
            amount,
            isNegotiable,
            minAmount,
            maxAmount,
            unit,
          };

          await AsyncStorage.setItem('jobDraft', JSON.stringify(updatedDraft));
          console.log('Screen 2 draft updated successfully');
        }
      } catch (error) {
        console.log('Error updating Screen 2 draft:', error);
      }
    };

    saveDraftScreen2();
  }, [
    address,
    coordinates,
    jobLocationType,
    timingType,
    thingTimingType,
    date,
    startTime,
    endTime,
    startDate,
    endDate,
    dailyHours,
    deadline,
    estimatedHours,
    thingDate,
    thingDeadline,
    thingStartTime,
    thingEndTime,
    thingStartDate,
    thingEndDate,
    thingDailyHours,
    thingEstimatedHours,
    discloseAmount,
    amount,
    isNegotiable,
    minAmount,
    maxAmount,
    unit,
  ]);

  const clearTimingFieldsOfPerson = newType => {
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

  const handleTimingTypeChangeForPerson = newType => {
    clearTimingFieldsOfPerson(newType);
    setTimingType(newType);
  };
  const clearTimingFieldsOfThing = newType => {
    if (newType !== 'needed-by-date') {
      setThingDate('');
      setThingStartTime('');
      setThingEndTime('');
    }
    if (newType !== 'start-end-date') {
      setThingStartDate('');
      setThingEndDate('');
      setThingDailyHours('');
    }
    if (newType !== 'deadline') {
      setThingDeadline('');
    }
    if (newType !== 'flexible') {
      setThingEstimatedHours('');
    }
  };

  const handleTimingTypeChangeForThing = newType => {
    clearTimingFieldsOfThing(newType);
    setThingTimingType(newType);
  };

  useEffect(() => {
    if (route.params?.selectedLocation) {
      setAddress(route.params.selectedLocation.address || '');
      setCoordinates(route.params.selectedLocation.coordinates || null);
    }
  }, [route.params?.selectedLocation]);

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

  const RoundRadioButton = ({ label, selected, onPress, description }) => (
    <TouchableOpacity style={styles.roundOption} onPress={onPress}>
      <View style={styles.roundRadio}>
        {selected && <View style={styles.roundRadioSelected} />}
      </View>
      <View style={styles.roundOptionContent}>
        <Text style={styles.roundOptionText}>{label}</Text>
        {description && (
          <Text style={styles.roundOptionDesc}>{description}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const getTimingDetailsForPerson = () => {
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

  const getTimingDetailsForThing = () => {
    switch (thingTimingType) {
      case 'needed-by-date':
        return { thingDate, thingStartTime, thingEndTime };
      case 'start-end-date':
        return { thingStartDate, thingEndDate, thingDailyHours };
      case 'deadline':
        return { thingDeadline };
      case 'flexible':
        return { thingEstimatedHours };
      default:
        return {};
    }
  };
  const handleNext = () => {
    validateForm(jobData.jobFor);
  };

  const validateForm = jobFor => {
    console.log('=== SCREEN 2 - FORM VALIDATION ===');
    console.log('Job For:', jobFor);
    console.log('Validation Input Data:', {
      jobLocationType,
      coordinates,
      timingType: jobFor === 'person' ? timingType : thingTimingType,
      discloseAmount,
      amount,
      isNegotiable,
      minAmount,
      maxAmount,
      unit,
    });

    if (jobFor === 'person') {
      // Person validation
      if (jobLocationType !== 'remote' && !coordinates) {
        showSnackbar('Please select a location', 'error');
        return;
      }

      const timingDetails = getTimingDetailsForPerson();
      console.log(
        'Person Timing Details:',
        JSON.stringify(timingDetails, null, 2),
      );

      if (
        timingType === 'fixed' &&
        (!timingDetails?.date ||
          !timingDetails?.startTime ||
          !timingDetails?.endTime)
      ) {
        showSnackbar(
          'Fixed timing requires date, start time, and end time',
          'error',
        );
        return;
      }
      if (
        timingType === 'multiday' &&
        (!timingDetails?.startDate ||
          !timingDetails?.endDate ||
          !timingDetails?.dailyHours)
      ) {
        showSnackbar(
          'Multi-day timing requires start date, end date, and daily hours',
          'error',
        );
        return;
      }
      if (timingType === 'deadline' && !timingDetails?.deadline) {
        showSnackbar('Deadline timing requires a deadline', 'error');
        return;
      }
      if (timingType === 'flexible' && !timingDetails?.estimatedHours) {
        showSnackbar('Flexible timing requires estimated hours', 'error');
        return;
      }
      if (discloseAmount && !isNegotiable && !amount?.trim()) {
        showSnackbar('Please enter an amount', 'error');
        return;
      }
      if (
        discloseAmount &&
        isNegotiable &&
        (!minAmount?.trim() || !maxAmount?.trim())
      ) {
        showSnackbar('Please enter both minimum and maximum amounts', 'error');
        return;
      }

      const personJobData = {
        ...jobData,
        locationType: jobLocationType,
        location: coordinates
          ? {
              type: 'Point',
              coordinates: [coordinates?.longitude, coordinates?.latitude],
              address: address?.trim() || '',
            }
          : null,
        timingType,
        timingDetails,
        amount: {
          value: isNegotiable ? 0 : Number(amount) || 0,
          unit: null,
          disclose: discloseAmount,
          negotiable: isNegotiable,
          range: isNegotiable
            ? { min: Number(minAmount) || 0, max: Number(maxAmount) || 0 }
            : null,
        },
      };

      console.log(
        'Person Job Data for Screen 3:',
        JSON.stringify(personJobData, null, 2),
      );
      console.log('=== END SCREEN 2 PERSON VALIDATION ===\n');

      // Navigate with person data
      navigation.navigate('CreateJobScreen3', {
        jobData: personJobData,
      });
    } else {
      // Thing validation
      if (!coordinates) {
        showSnackbar('Please select a location', 'error');
        return;
      }

      const timingDetails = getTimingDetailsForThing();
      console.log(
        'Thing Timing Details:',
        JSON.stringify(timingDetails, null, 2),
      );

      if (
        thingTimingType === 'needed-by-date' &&
        (!timingDetails?.thingDate ||
          !timingDetails?.thingStartTime ||
          !timingDetails?.thingEndTime)
      ) {
        showSnackbar(
          'Needed by date requires date, start time, and end time',
          'error',
        );
        return;
      }
      if (
        thingTimingType === 'start-end-date' &&
        (!timingDetails?.thingStartDate ||
          !timingDetails?.thingEndDate ||
          !timingDetails?.thingDailyHours)
      ) {
        showSnackbar(
          'Start-end date requires start date, end date, and daily hours',
          'error',
        );
        return;
      }
      if (thingTimingType === 'deadline' && !timingDetails?.thingDeadline) {
        showSnackbar('Deadline timing requires a deadline', 'error');
        return;
      }
      if (
        thingTimingType === 'flexible' &&
        !timingDetails?.thingEstimatedHours
      ) {
        showSnackbar('Flexible timing requires estimated hours', 'error');
        return;
      }
      if (discloseAmount && !isNegotiable && !amount?.trim()) {
        showSnackbar('Please enter an amount', 'error');
        return;
      }
      if (discloseAmount && !unit && !isNegotiable) {
        showSnackbar('Please select a unit', 'error');
        return;
      }
      if (
        discloseAmount &&
        isNegotiable &&
        (!minAmount?.trim() || !maxAmount?.trim())
      ) {
        showSnackbar('Please enter both minimum and maximum amounts', 'error');
        return;
      }

      const thingJobData = {
        ...jobData,
        location: {
          type: 'Point',
          coordinates: [coordinates?.longitude, coordinates?.latitude],
          address: address?.trim() || '',
        },
        timingType: thingTimingType,
        timingDetails,
        amount: {
          value: isNegotiable ? 0 : Number(amount) || 0,
          unit: isNegotiable ? null : unit,
          disclose: discloseAmount,
          negotiable: isNegotiable,
          range: isNegotiable
            ? { min: Number(minAmount) || 0, max: Number(maxAmount) || 0 }
            : null,
        },
      };

      console.log(
        'Thing Job Data for Screen 3:',
        JSON.stringify(thingJobData, null, 2),
      );
      console.log('=== END SCREEN 2 THING VALIDATION ===\n');

      // Navigate with thing data
      navigation.push('CreateJobScreen3', {
        jobData: thingJobData,
      });
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
            ref={scrollViewRef}
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

            {/* --- Title with Urgent Toggle --- */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                Define Location & Payment Information
              </Text>
            </View>

            {/* {thingForm?.()} */}
            {/* {personForm?.()} */}
            {jobData?.jobFor === 'person' ? (
            <>{personForm?.()}</>
            ) : (
              <>{thingForm?.()}</>
             )} 
            <FaddedIcon />
          </ScrollView>

          {/* NEXT BUTTON */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );

  function personForm() {
    return (
      <>
        <View style={styles.form}>
          {/* Job Location */}
          <View style={styles.selectorContainer}>
            <Text style={styles.selectorLabel}>Job Location</Text>
            <Text style={styles.selectorHelper}>
              Where will the work be performed ?
            </Text>
            <View style={styles.locationRow}>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  gap: 5,
                }}
              >
                {[
                  {
                    value: 'onsite',
                    label: 'On-site',
                    desc: 'At specific location',
                  },
                  {
                    value: 'remote',
                    label: 'Remote',
                    desc: 'Work from anywhere',
                  },
                  { value: 'hybrid', label: 'Hybrid', desc: 'Mix of both' },
                ].map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.locationOptionRow,
                      {
                        alignItems:
                          jobLocationType === option.value
                            ? 'flex-start'
                            : 'center',
                      },
                    ]}
                    onPress={() => setJobLocationType(option.value)}
                  >
                    <View
                      style={[
                        { marginTop: jobLocationType === option.value ? 4 : 0 },
                        styles.locationCheckbox,
                        jobLocationType === option.value &&
                          styles.locationCheckboxSelected,
                      ]}
                    >
                      {jobLocationType === option.value && (
                        <Feather name="check" size={14} color="#fff" />
                      )}
                    </View>
                    <View>
                      <Text style={[styles.locationLabel,{color:jobLocationType === option.value ? Colors.primary : Colors.darkGrayColor}]}>{option.label}</Text>
                      {jobLocationType === option.value && (
                        <Text style={styles.locationInfoText}>
                          {option.desc}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
       
          </View>

          {/* Address Selection */}
          <View style={styles.addressContainer}>
            <Text style={styles.selectorLabel}>Work Location Address</Text>
            <Text style={styles.selectorHelper}>
              Choose location from saved addresses or add new one
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate('SavedAddressesScreen', {
                  returnScreen: 'CreateJobScreen2',
                  jobData,
                })
              }
              style={styles.mapButton}
            >
              <Feather name="map-pin" size={20} color="#000" />
              <Text style={styles.mapButtonText}>
                {coordinates ? 'Change Address' : 'Choose Address'}
              </Text>
              <Feather name="chevron-right" size={16} color="#666" />
            </TouchableOpacity>

            {coordinates && (
              <View style={styles.selectedAddressContainer}>
                <Text style={styles.selectedAddressText}>{address}</Text>
              </View>
            )}
          </View>

          {/* Timing Type */}
          <View style={[styles.selectorContainer,{ marginBottom: 0,}]}>
            <Text style={styles.selectorLabel}>Timing Type</Text>
            <Text style={styles.selectorHelper}>
              Choose how you want to schedule this task
            </Text>
            <TouchableOpacity
              style={[
                styles.mapButton,
                {
                  backgroundColor: isTimingClicked ? '#fff' : '#f8f9fa',
                  borderColor: isTimingClicked ? '#000000ff' : '#e9ecef',
                },
              ]}
              onPress={() => setTimingClicked(prev => !prev)}
            >
              <Feather
                name={
                  timingType === 'fixed'
                    ? 'calendar'
                    : timingType === 'multiday'
                    ? 'calendar'
                    : timingType === 'deadline'
                    ? 'clock'
                    : 'zap'
                }
                size={20}
                color="#000"
              />
              <Text
                style={[
                  styles.mapButtonText,
                  { color: isTimingClicked ? '#000000ff' : '#666666' },
                ]}
              >
                {[
                  { value: 'fixed', label: 'Fixed' },
                  { value: 'multiday', label: 'Multi-day' },
                  { value: 'deadline', label: 'Deadline' },
                  { value: 'flexible', label: 'Flexible' },
                ].find(opt => opt.value === timingType)?.label ||
                  'Select Timing'}
              </Text>

              <Feather
                name={isTimingClicked ? 'chevron-down' : 'chevron-right'}
                size={16}
                color={isTimingClicked ? '#000000ff' : '#666666'}
              />
            </TouchableOpacity>
            {isTimingClicked && (
              <View style={styles.suggestionsContainer}>
                {[
                  {
                    value: 'fixed',
                    label: 'Fixed',
                    desc: 'Specific date & time',
                    icon: 'calendar',
                  },
                  {
                    value: 'multiday',
                    label: 'Multi-day',
                    desc: 'Multiple days',
                    icon: 'calendar',
                  },
                  {
                    value: 'deadline',
                    label: 'Deadline',
                    desc: 'Complete by date',
                    icon: 'clock',
                  },
                  {
                    value: 'flexible',
                    label: 'Flexible',
                    desc: 'Anytime',
                    icon: 'zap',
                  },
                ].map((item, index) => (
                  <View key={item.value}>
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={() => {
                        handleTimingTypeChangeForPerson(item.value);
                        setTimingClicked(false);
                      }}
                    >
                      <View style={styles.suggestionContent}>
                        <Feather name={item.icon} size={16} color="#666" />
                        <View style={styles.suggestionTextContainer}>
                          <Text style={styles.suggestionText}>
                            {item.label}
                          </Text>
                          <Text style={styles.suggestionDesc}>{item.desc}</Text>
                        </View>
                      </View>

                      <Feather name="chevron-right" size={14} color="#ccc" />
                    </TouchableOpacity>

                    {index < 3 && <View style={styles.separator} />}
                  </View>
                ))}
              </View>
            )}
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

              <View style={styles.timePickerRow}>
                <View style={styles.timePickerWrapper}>
                  <Text style={styles.timePickerLabel}>Start Time</Text>
                  <DateTimePickerField
                    label=""
                    mode="time"
                    value={startTime}
                    onChange={setStartTime}
                    style={styles.timePickerField}
                  />
                </View>
                <View style={styles.timePickerWrapper}>
                  <Text style={styles.timePickerLabel}>End Time</Text>
                  <DateTimePickerField
                    label=""
                    mode="time"
                    value={endTime}
                    onChange={setEndTime}
                    style={styles.timePickerField}
                  />
                </View>
              </View>
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
                onFocus={ref => scrollToInput(ref, scrollViewRef)}
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
          <View style={styles.selectorContainer}>
            <View style={[styles.disclosureLabelRow,{ marginBottom: 10,}]}>
              <Text style={styles.selectorLabel}>
                Would you like to disclose the amount?
              </Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', gap: 20 }}>
              {[{"Yes": true}, {"No": false}].map((option) => {
                const [label, value] = Object.entries(option)[0];
                return (
                  <TouchableOpacity
                    key={label}
                    style={{ display: 'flex', flexDirection: 'row' }}
                    onPress={() => {
                      setDiscloseAmount(value);
                      if (!value) {
                        setAmount('');
                        setIsNegotiable(false);
                        setMinAmount('');
                        setMaxAmount('');
                      }
                    }}
                  >
                    <View
                      style={[
                        styles.locationCheckbox,
                        discloseAmount === value && styles.locationCheckboxSelected,
                      ]}
                    >
                      {discloseAmount === value && (
                        <Feather name="check" size={14} color="#fff" />
                      )}
                    </View>
                    <View>
                      <Text style={[styles.locationLabel,{ color: discloseAmount === value ? Colors.blackColor : Colors.darkGrayColor}]}>{label}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {discloseAmount && (
            <View style={styles.selectorContainer}>
              <View style={styles.amountNegotiableRow}>
                <View style={styles.amountInputContainer}>
                  <FloatingLabelInput
                    label="Amount (INR) ₹"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    placeholder="Enter Amount"
                    onFocus={ref => scrollToInput(ref, scrollViewRef)}
                  />
                </View>
                <View style={styles.negotiableContainer}>
                  <View style={styles.negotiableCol}>
                    <Text style={styles.negotiableLabel}>Negotiable</Text>
                    <TouchableOpacity
                      style={[
                        styles.negotiableToggleSmall,
                        { backgroundColor: isNegotiable ? '#000' : '#666' },
                      ]}
                      onPress={() => {
                        setIsNegotiable(!isNegotiable);
                        if (isNegotiable) {
                          setMinAmount('');
                          setMaxAmount('');
                        } else {
                          setAmount('');
                        }
                      }}
                      activeOpacity={0.8}
                    >
                      {isNegotiable ? (
                        <>
                          <Text style={styles.negotiableTextSmall}>Yes</Text>
                          <Feather
                            name="check"
                            style={styles.negotiableIconSmall}
                          />
                        </>
                      ) : (
                        <>
                          <Feather
                            name="x"
                            style={styles.negotiableIconSmall}
                          />
                          <Text style={styles.negotiableTextSmall}>No</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </>
    );
  }

  function thingForm() {
    return (
      <>
        {/* Address Selection */}
        <View style={styles.addressContainer}>
          <Text style={styles.selectorLabel}>Address</Text>
          <Text style={styles.selectorHelper}>
            Select location on map first, then edit address if needed
          </Text>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SavedAddressesScreen', {
                returnScreen: 'CreateJobScreen2',
                jobData,
              });
            }}
            style={styles.mapButton}
          >
            <Feather name="map-pin" size={20} color="#000" />
            <Text style={styles.mapButtonText}>
              {coordinates ? 'Change Location' : 'Select on Map'}
            </Text>
            <Feather name="chevron-right" size={16} color="#666" />
          </TouchableOpacity>

          {coordinates && (
            <View style={styles.selectedAddressContainer}>
              <Text style={styles.selectedAddressText}>{address}</Text>
            </View>
          )}
        </View>
         {/* Timing Type */}
         <View style={[styles.selectorContainer,{ marginBottom: 0,}]}>
            <Text style={styles.selectorLabel}>Timing Type</Text>
            <Text style={styles.selectorHelper}>
              Choose how you want to schedule this task
            </Text>
            <TouchableOpacity
              style={[
                styles.mapButton,
                {
                  backgroundColor: isTimingClicked ? '#fff' : '#f8f9fa',
                  borderColor: isTimingClicked ? '#000000ff' : '#e9ecef',
                },
              ]}
              onPress={() => setTimingClicked(prev => !prev)}
            >
              <Feather
                name={
                  thingTimingType === 'needed-by-date'
                    ? 'calendar'
                    : thingTimingType === 'start-end-date'
                    ? 'calendar'
                    : thingTimingType === 'deadline'
                    ? 'clock'
                    : 'zap'
                }
                size={20}
                color="#000"
              />
              <Text
                style={[
                  styles.mapButtonText,
                  { color: isTimingClicked ? '#000000ff' : '#666666' },
                ]}
              >
                {[
                  { value: 'needed-by-date', label: 'Needed By date' },
                  { value: 'start-end-date', label: 'Start-End-Date' },
                  { value: 'deadline', label: 'Deadline' },
                  { value: 'flexible', label: 'Flexible' },
                ].find(opt => opt.value === thingTimingType)?.label ||
                  'Select Timing'}
              </Text>

              <Feather
                name={isTimingClicked ? 'chevron-down' : 'chevron-right'}
                size={16}
                color={isTimingClicked ? '#000000ff' : '#666666'}
              />
            </TouchableOpacity>
            {isTimingClicked && (
              <View style={styles.suggestionsContainer}>
                {[
                  {
                    value: 'needed-by-date',
                    label: 'Needed By date',
                    desc: 'Specific date & time',
                    icon: 'calendar',
                  },
                  {
                    value: 'start-end-date',
                    label: 'Start-End-Date',
                    desc: 'Multiple days',
                    icon: 'calendar',
                  },
                  {
                    value: 'deadline',
                    label: 'Deadline',
                    desc: 'Complete by date',
                    icon: 'clock',
                  },
                  {
                    value: 'flexible',
                    label: 'Flexible',
                    desc: 'Anytime',
                    icon: 'zap',
                  },
                ].map((item, index) => (
                  <View key={item.value}>
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={() => {
                        handleTimingTypeChangeForThing(item.value);
                        setTimingClicked(false);
                      }}
                    >
                      <View style={styles.suggestionContent}>
                        <Feather name={item.icon} size={16} color="#666" />
                        <View style={styles.suggestionTextContainer}>
                          <Text style={styles.suggestionText}>
                            {item.label}
                          </Text>
                          <Text style={styles.suggestionDesc}>{item.desc}</Text>
                        </View>
                      </View>

                      <Feather name="chevron-right" size={14} color="#ccc" />
                    </TouchableOpacity>

                    {index < 3 && <View style={styles.separator} />}
                  </View>
                ))}
              </View>
            )}
          </View>
       
        {/* Input forms based on timing type */}
        {thingTimingType === 'needed-by-date' && (
          <>
            <DateTimePickerField
              label="Date"
              value={thingDate}
              mode="date"
              onChange={setThingDate}
            />

            <DateTimePickerField
              label="Start Time"
              mode="time"
              value={thingStartTime}
              onChange={setThingStartTime}
            />

            <DateTimePickerField
              label="End Time"
              mode="time"
              value={thingEndTime}
              onChange={setThingEndTime}
            />
          </>
        )}

        {thingTimingType === 'start-end-date' && (
          <>
            <DateTimePickerField
              label="Start Date"
              mode="date"
              value={thingStartDate}
              onChange={setThingStartDate}
            />

            <DateTimePickerField
              label="End Date"
              mode="date"
              value={thingEndDate}
              onChange={setEndDate}
            />

            <FloatingLabelInput
              label="Daily Hours"
              value={thingDailyHours}
              onChangeText={setThingDailyHours}
              keyboardType="numeric"
              placeholder="Enter daily working hours (e.g., 8)"
              onFocus={ref => scrollToInput(ref, scrollViewRef)}
            />
          </>
        )}

        {thingTimingType === 'deadline' && (
          <DateTimePickerField
            label="Deadline"
            mode="datetime"
            value={thingDeadline}
            onChange={setThingDeadline}
          />
        )}

        {thingTimingType === 'flexible' && (
          <>
            <FloatingLabelInput
              label="Estimated Hours"
              value={thingEstimatedHours}
              onChangeText={setThingEstimatedHours}
              keyboardType="numeric"
              placeholder="Enter estimated total hours (e.g., 40)"
            />
          </>
        )}
          {/* Amount Disclosure */}
          <View style={styles.selectorContainer}>
            <View style={[styles.disclosureLabelRow,{ marginBottom: 10,}]}>
              <Text style={styles.selectorLabel}>
                Would you like to disclose the amount?
              </Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', gap: 20 }}>
              {[{"Yes": true}, {"No": false}].map((option) => {
                const [label, value] = Object.entries(option)[0];
                return (
                  <TouchableOpacity
                    key={label}
                    style={{ display: 'flex', flexDirection: 'row' }}
                    onPress={() => {
                      setDiscloseAmount(value);
                      if (!value) {
                        setAmount('');
                        setIsNegotiable(false);
                        setMinAmount('');
                        setMaxAmount('');
                      }
                    }}
                  >
                    <View
                      style={[
                        styles.locationCheckbox,
                        discloseAmount === value && styles.locationCheckboxSelected,
                      ]}
                    >
                      {discloseAmount === value && (
                        <Feather name="check" size={14} color="#fff" />
                      )}
                    </View>
                    <View>
                      <Text style={[styles.locationLabel,{ color: discloseAmount === value ? Colors.blackColor : Colors.darkGrayColor}]}>{label}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          {discloseAmount && (
            <View style={styles.selectorContainer}>
              <View style={styles.amountNegotiableRow}>
                <View style={[styles.amountInputContainer,{flex:2}]}>
                  <FloatingLabelInput
                    label="Amount (INR) ₹"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    placeholder="Enter Amount"
                    onFocus={ref => scrollToInput(ref, scrollViewRef)}
                  />
                </View>
                <View style={styles.unitDropdownWrapper}>
              <TouchableOpacity
                style={[
                  styles.unitButton,
                  {
                    backgroundColor: isUnitClicked ? '#fff' : '#f8f9fa',
                    borderColor: isUnitClicked ? '#000' : '#e9ecef',
                  },
                ]}
                onPress={() => setUnitClicked(prev => !prev)}
              >
                <Text
                  numberOfLines={1}
                  style={[
                    styles.unitButtonText,
                    { color: isUnitClicked ? '#000' : '#666' },
                  ]}
                >
                  {unit || 'Unit'}
                </Text>
                <Feather
                  name={isUnitClicked ? 'chevron-down' : 'chevron-right'}
                  size={14}
                  color={isUnitClicked ? '#000' : '#666'}
                />
              </TouchableOpacity>

              {isUnitClicked && (
                <View style={styles.unitSuggestionsContainer}>
                  {[
                    { value: 'per/hr', label: 'per/hr' },
                    { value: 'per/day', label: 'per/day' },
                    { value: 'per/week', label: 'per/week' },
                    { value: 'per/month', label: 'per/month' },
                  ].map((item, index) => (
                    <View key={item.value}>
                      <TouchableOpacity
                        style={styles.unitSuggestionItem}
                        onPress={() => {
                          setUnit(item.value);
                          setUnitClicked(false);
                        }}
                      >
                        <Text style={styles.unitSuggestionText}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                      {index < 3 && <View style={styles.unitSeparator} />}
                    </View>
                  ))}
                </View>
              )}
               </View>
                <View style={styles.negotiableContainer}>
                  <View style={styles.negotiableCol}>
                    <Text style={styles.negotiableLabel}>Negotiable</Text>
                    <TouchableOpacity
                      style={[
                        styles.negotiableToggleSmall,
                        { backgroundColor: isNegotiable ? '#000' : '#666' },
                      ]}
                      onPress={() => {
                        setIsNegotiable(!isNegotiable);
                        if (isNegotiable) {
                          setMinAmount('');
                          setMaxAmount('');
                        } else {
                          setAmount('');
                        }
                      }}
                      activeOpacity={0.8}
                    >
                      {isNegotiable ? (
                        <>
                          <Text style={styles.negotiableTextSmall}>Yes</Text>
                          <Feather
                            name="check"
                            style={styles.negotiableIconSmall}
                          />
                        </>
                      ) : (
                        <>
                          <Feather
                            name="x"
                            style={styles.negotiableIconSmall}
                          />
                          <Text style={styles.negotiableTextSmall}>No</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              
              </View>
              
            </View>
          )}

       
      
      </>
    );
  }
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
    marginBottom: 20,
  },
  selectorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  selectorHelper: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
    lineHeight: 18,
  },
  // Location Styles
  locationRow: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  locationOptionRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
  locationCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.darkGrayColor,
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationCheckboxSelected: {
    backgroundColor: '#000',
    borderColor:Colors.primary,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  // locationInfo: {
  //   marginTop: 16,
  //   padding: 12,
  //   backgroundColor: '#f0f8ff',
  //   borderRadius: 8,
  //   // borderLeftWidth: 3,
  //   // borderLeftColor: '#000',
  //   opacity: 0.9,
  // },
  locationInfoText: {
    fontSize: 9,
    color: '#666',
    textAlign: 'center',
    // marginTop: 0,
    fontStyle: 'italic',
  },
  // Selected Address Styles
  selectedAddressContainer: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedAddressText: {
    fontSize: 12,
    color: '#000',
    lineHeight: 20,
  },
  // Suggestions Container
  suggestionsContainer: {
    position: 'absolute',
    top: 112,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderColor: '#e5e7eb',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 1000,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  suggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  suggestionDesc: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#f3f4f6',
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

  // Amount Container Styles
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
 
  unitDropdownWrapper: {
    flex: 1,
    position: 'relative',
  },
  unitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 44,
  },
  unitButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  unitSuggestionsContainer: {
    position: 'absolute',
    top: '75%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderColor: '#e5e7eb',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 1000,
  },
  unitSuggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  unitSuggestionText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  unitSeparator: {
    height: 1,
    backgroundColor: '#f3f4f6',
  },
  negotiableWrapper: {
    flex: 0.7,
    // backgroundColor:"#000",
    alignItems: 'center',
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
    // marginBottom: 24,
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

  // Radio Button Styles
  // radioRow: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-around',
  // },
  // Checkbox Container
  checkboxContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  roundOption: {
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 6,
    padding: 8,
  },
  roundRadio: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundRadioSelected: {
    width: 10,
    height: 10,
    backgroundColor: '#000',
    borderRadius: 5,
  },
  roundOptionContent: {
    alignItems: 'center',
  },
  roundOptionText: {
    fontSize: 13,
    color: '#000',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 2,
  },
  roundOptionDesc: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },

  // Toggle Row Styles
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  toggleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
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
  timePickerRow: {
    flexDirection: 'row',
    gap: 12,
    // marginBottom: 20,
  },
  timePickerWrapper: {
    flex: 1,
  },
  timePickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  timePickerButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  timePickerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  // Yes/No Toggle Styles
  yesNoToggleContainer: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 8,
  },
  yesNoToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  yesNoText: {
    fontSize: 16,
    color: '#ccc',
    fontWeight: '500',
  },
  yesNoTextActive: {
    color: '#000',
    fontWeight: '600',
  },
  // Amount and Negotiable Row
  amountNegotiableRow: {
    flexDirection: 'row',
     gap: 16,
  },
  amountInputContainer: {
    flex: 1,
  },
  negotiableToggleContainer: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  // Amount Disclosure Styles
  disclosureLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  disclosureToggle: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  disclosureIcon: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
    color: '#000',
    fontSize: 16,
  },
  disclosureText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  // Negotiable Styles
  negotiableContainer: {
    paddingHorizontal: 4,
    // backgroundColor:"#899e8cff"
  },
  negotiableCol: {
    flexDirection: 'Col',
    alignItems: 'center',
    gap: 5,
  },
  negotiableLabel: {
    fontSize: 10,
    fontWeight:"700",
    color: '#666',
   },
  negotiableToggleSmall: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  negotiableIconSmall: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 3,
    color: '#000',
    fontSize: 10,
  },
  negotiableTextSmall: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
  },
  timePickerField: {
    marginBottom: 0,
  },
});

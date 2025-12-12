import React, { useState, useEffect } from 'react';
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
import DateTimePickerField from '../../components/DateTimePickerField';
import { Colors } from '../../styles/commonStyles';

export default function CreateJob({ navigation, route }) {
  const { jobData } = route.params || {};
  const [address, setAddress] = useState({});

  useEffect(() => {
    if (route.params?.selectedAddress) {
      console.log('Setting address object:', route.params.selectedAddress);
      setAddress(route.params.selectedAddress);
    }
  }, [route.params?.selectedAddress]);
  
  // const [coordinate, setCoordinate] = useState(null);
  const [jobLocationType, setJobLocationType] = useState('On-site');

  const [discloseAmount, setDiscloseAmount] = useState(true);
  const [isNegotiable, setIsNegotiable] = useState(true);

  const [timingType, setTimingType] = useState('fixed');

  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dailyHours, setDailyHours] = useState('');

  const [deadline, setDeadline] = useState('');

  const [estimatedHours, setEstimatedHours] = useState('');

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
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
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
            <Text style={styles.label}>Job Location</Text>

            <View style={styles.locationOptionsContainer}>
              <CheckboxButton
                label="On-site"
                selected={jobLocationType === 'On-site'}
                onPress={() => setJobLocationType('On-site')}
              />
              <CheckboxButton
                label="Hybrid"
                selected={jobLocationType === 'Hybrid'}
                onPress={() => setJobLocationType('Hybrid')}
              />
              <CheckboxButton
                label="Remote"
                selected={jobLocationType === 'Remote'}
                onPress={() => setJobLocationType('Remote')}
              />
            </View>

            {/* Address picker placeholder */}
            <Text style={styles.label}>Address</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SelectAddressScreen')}
              style={styles.textInputWithIcon}
            >
              {!address.address ? (
                <>
                  <TextInput
                    style={styles.textInputFlex}
                    placeholder="Choose Address"
                    placeholderTextColor="#888"
                    editable={false}
                  />
                  <Feather name="map-pin" size={20} color="#000" />
                </>
              ) : (
                <View>
                  <Text style={[styles.textInputFlex, {fontSize: 10, fontWeight: '600' }]}>
                    {address?.name}
                  </Text>
                  <Text
                    style={[
                      styles.textInputFlex,
                      { fontSize: 10, color: Colors.primary },
                    ]}
                  >
                    {address?.mobile}
                  </Text>
                  <Text
                    style={[
                      styles.textInputFlex,
                      { fontSize: 10, color: Colors.grayColor },
                    ]}
                  >
                    {address?.landmark}
                  </Text>
                  <Text
                    style={[
                      styles.textInputFlex,
                      { fontSize: 10, color: Colors.grayColor },
                    ]}
                  >
                    {address?.address}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Timing Type */}
            <Text style={styles.label}>Timing Type</Text>

            <View style={{ marginBottom: 20 }}>
              <RoundRadioButton
                label="Fixed"
                selected={timingType === 'fixed'}
                onPress={() => setTimingType('fixed')}
              />
              <RoundRadioButton
                label="Multi-day"
                selected={timingType === 'multiday'}
                onPress={() => setTimingType('multiday')}
              />
              <RoundRadioButton
                label="Deadline"
                selected={timingType === 'deadline'}
                onPress={() => setTimingType('deadline')}
              />
              <RoundRadioButton
                label="Flexible"
                selected={timingType === 'flexible'}
                onPress={() => setTimingType('flexible')}
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

                <TextInput
                  style={styles.textInputWithIcon}
                  placeholder="Daily Hours"
                  keyboardType="numeric"
                  value={dailyHours}
                  onChangeText={setDailyHours}
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
              <TextInput
                style={styles.textInputWithIcon}
                placeholder="Estimated Hours"
                keyboardType="numeric"
                value={estimatedHours}
                onChangeText={setEstimatedHours}
              />
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
                onPress={() => setDiscloseAmount(false)}
              />
            </View>

            <>
              {/* Amount */}
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
                    trackColor={{ false: '#767577', true: '#5CB85C' }}
                    thumbColor={isNegotiable ? '#fff' : '#f4f3f4'}
                    onValueChange={setIsNegotiable}
                    value={isNegotiable}
                    style={styles.negotiableSwitch}
                  />
                </View>
              </View>

              <Text style={styles.label}>Amount Range</Text>
              <View style={styles.amountRangeContainer}>
                <TextInput
                  style={styles.rangeInput}
                  placeholder="Min Amount"
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                  value={amountMin}
                  onChangeText={setAmountMin}
                />
                <TextInput
                  style={styles.rangeInput}
                  placeholder="Max Amount"
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                  value={amountMax}
                  onChangeText={setAmountMax}
                />
              </View>
            </>
          </View>
        </ScrollView>

        {/* NEXT BUTTON */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() =>
              navigation.navigate('CreateJobScreen3', {
                jobData: {
                  ...jobData,
                  locationType: jobLocationType,
                  // isNegotiable,
                  timingType,
                  timingDetails: getTimingDetails(),
                  amount: {
                    min: Number(amountMin),
                    max: Number(amountMax),
                    disclose: discloseAmount,
                  },
                },
              })
            }
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

/* ========== STYLES HERE ========== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },
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
  textInputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  textInputFlex: { flex: 1, fontSize: 12, color: '#000', padding: 0 },

  locationOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
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
    fontSize: 12,
    color: '#000',
    marginHorizontal: 5,
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

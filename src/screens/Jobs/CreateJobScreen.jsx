import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import MyStatusBar from '../../components/MyStatusbar';
import FloatingLabelInput from '../../components/inputFields/FloatingLabelInput';
import FloatingLabelSkillsInput from '../../components/inputFields/FloatingLabelSkillsInput';
import { getAllTags } from '../../store/thunks/jobThunk';
import { selectTags, selectTagsLoading } from '../../store/selector';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { scrollToInput } from '../../utils/commonMethods';
import { FaddedIcon } from '../../components/CommonComponents';
import SelectorToggleButton from '../../components/SelectorToggleButton';
import { CustomAlert } from '../../components/CustomAlert';

const RoundRadioButton = ({ label, selected, onPress, description }) => (
  <TouchableOpacity style={styles.roundOption} onPress={onPress}>
    <View style={styles.roundRadio}>
      {selected && <View style={styles.roundRadioSelected} />}
    </View>
    <View style={styles.roundOptionContent}>
      <Text style={styles.roundOptionText}>{label}</Text>
      {description && <Text style={styles.roundOptionDesc}>{description}</Text>}
    </View>
  </TouchableOpacity>
);
const CheckboxButton = ({ label, selected, onPress }) => (
  <TouchableOpacity activeOpacity={0.8} style={styles.option} onPress={onPress}>
    <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
      {selected && <Feather name="check" size={12} color="#fff" />}
    </View>
    <Text style={styles.optionText}>{label}</Text>
  </TouchableOpacity>
);
export default function CreateJob({ navigation }) {
  const dispatch = useDispatch();
  const availableTags = useSelector(selectTags);
  const tagsLoading = useSelector(selectTagsLoading);
  const { showSnackbar } = useSnackbar();
  const [showDraftAlert, setShowDraftAlert] = useState(true);
  const scrollViewRef = useRef(null);

  // Task For
  const [jobFor, setJobFor] = useState('person');

  //job for person
  const [personTitle, setPersonTitle] = useState('');
  const [personDescription, setPersonDescription] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skill, setSkill] = useState('');
  const [requiresExperience, setRequiresExperience] = useState('no');
  const jobForOptions = [
    { label: 'Person', value: 'person' },
    { label: 'Thing', value: 'thing' },
  ];
  const typeOptions = [
    { label: 'Standard', value: 'standard' },
    { label: 'Urgent', value: 'quick' },
  ];
  // Task Type
  const [jobType, setJobType] = useState('standard');

  //  job for things
  const [thingTitle, setThingTitle] = useState('');
  const [thingDescription, setThingDescription] = useState('');
  const [purpose, setPurpose] = useState('');
   const [thingCategoryList, setthingCategoryList] = useState([]);
  const [selectedThingCategory, setSelectedThingCategory] = useState('');
  // Load tags on component mount
  useEffect(() => {
    dispatch(getAllTags());
  }, [dispatch]);

  console.log('availble tage = ', JSON.stringify(availableTags, null, 2));

  const handleNewForm = () => {
    setShowDraftAlert(false);
  };

  const handleResumeDraft = () => {
    setShowDraftAlert(false);
    showSnackbar('No drafts available yet', 'info');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <SafeAreaView style={styles.safeAreaBlack} edges={['top']}>
        <MyStatusBar />
        <View style={styles.container}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* --- Header --- */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <Feather name="arrow-left" size={20} color="#000" />
              </TouchableOpacity>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar} />
              </View>
              <Text style={styles.progressText}>1/3</Text>
            </View>

            {/* --- Title --- */}
            <Text style={styles.title}>
              Create and Customize Your Task Posting
            </Text>
            {/* Task For */}
            <View style={styles.selectorContainer}>
              <Text style={styles.selectorLabel}>
                Task For <Text style={styles.required}>*</Text>
              </Text>
              <Text style={styles.selectorHelper}>
                What type of work are you posting?
              </Text>
              <View style={styles.selectorGrid}>
                {jobForOptions.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.selectorCard,
                      jobFor === option.value && styles.selectedCard,
                    ]}
                    onPress={() => setJobFor(option.value)}
                  >
                    <View style={styles.selectorContent}>
                      <Feather
                        name={option.value === 'person' ? 'user' : 'package'}
                        size={24}
                        color={jobFor === option.value ? '#000' : '#666'}
                      />
                      <Text
                        style={[
                          styles.selectorText,
                          jobFor === option.value && styles.selectedText,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </View>
                    {jobFor === option.value && (
                      <View style={styles.checkmark}>
                        <Feather name="check" size={14} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            {jobFor == 'person' ? <>{personForm?.()}</> : <>{thingsForm?.()}</>}
            <FaddedIcon />
          </ScrollView>

          {/* --- Next Button --- */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => {
                // Validation
                if (
                  !jobFor ||
                  !personTitle.trim() ||
                  !personDescription.trim() ||
                  !jobType
                ) {
                  showSnackbar('Please fill all required fields', 'error');
                  return;
                }
                if (jobFor === 'thing' && !purpose) {
                  showSnackbar('Please select a purpose for the item', 'error');
                  return;
                }
                if (requiresExperience === 'yes' && !experienceLevel) {
                  showSnackbar('Please select an experience level', 'error');
                  return;
                }
                if (selectedSkills.length === 0) {
                  showSnackbar(
                    'Please add at least one skill or category',
                    'error',
                  );
                  return;
                }
                if (personTitle.length > 100) {
                  showSnackbar('Title must be 100 characters or less', 'error');
                  return;
                }
                if (personDescription.length > 1000) {
                  showSnackbar(
                    'Description must be 1000 characters or less',
                    'error',
                  );
                  return;
                }
                if (skill.length > 500) {
                  showSnackbar(
                    'Requirements must be 500 characters or less',
                    'error',
                  );
                  return;
                }

                navigation.navigate('CreateJobScreen2', {
                  jobData: {
                    jobFor,
                    purpose: jobFor === 'thing' ? purpose : null,
                    title: personTitle.trim(),
                    description: personDescription.trim(),
                    category: selectedSkills, // Single array of skills/categories
                    requirements: skill.trim(),
                    experienceLevel:
                      requiresExperience === 'yes' ? experienceLevel : null,
                    jobType,
                  },
                });
              }}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>

          {showDraftAlert && (
            <CustomAlert
              message="Would you like to start a new form or resume from your draft?"
              onYes={handleResumeDraft}
              onClose={handleNewForm}
              yesText="Resume Draft"
              noText="New Form"
              iconName="file-text"
              iconColor="#0000007c"
            />
          )}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
  function personForm() {
    return (
      <>
        {/* --- Form --- */}
        <View style={styles.form}>
          {/* Purpose (for thing job type) */}
          {/* Title */}
          <FloatingLabelInput
            label={'Task Title'}
            value={personTitle}
            onChangeText={setPersonTitle}
            placeholder="Enter a clear, descriptive title"
            required={true}
            onFocus={ref => scrollToInput(ref, scrollViewRef)}
          />

          {/* Description */}
          <FloatingLabelInput
            label="Description"
            value={personDescription}
            onChangeText={setPersonDescription}
            multiline
            numberOfLines={4}
            placeholder={
              'Describe the job requirements, deliverables, and expectations'
            }
            required={true}
            onFocus={ref => scrollToInput(ref, scrollViewRef)}
          />

          {/* Task Skills/Category */}
          <FloatingLabelSkillsInput
            label="Task Skills & Categories"
            selectedSkills={selectedSkills}
            onSkillsChange={setSelectedSkills}
            availableTags={availableTags}
            placeholder="E.g Software,Design..."
            maxSkills={8}
            required={true}
            onFocus={ref => scrollToInput(ref, scrollViewRef)}
          />

          {/* Requirements */}
          <FloatingLabelInput
            label="Requirements (Optional)"
            value={skill}
            onChangeText={setSkill}
            multiline
            numberOfLines={3}
            placeholder="List specific skills, experience, or qualifications needed"
            onFocus={ref => scrollToInput(ref, scrollViewRef)}
          />

          {/* Task Type */}
          <View style={styles.selectorContainer}>
            <Text style={styles.selectorLabel}>
              Task Type <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.selectorHelper}>Choose the urgency level</Text>
            <SelectorToggleButton
              options={['Standard', 'Urgent']}
              selectedValue={jobType === 'standard' ? 'Standard' : 'Urgent'}
              onValueChange={value =>
                setJobType(value === 'Standard' ? 'standard' : 'quick')
              }
            />
          </View>
          {/* Experience Level */}
          <View style={styles.selectorContainer}>
            <Text style={styles.selectorLabel}>
              Requires Specific Experience Level?
            </Text>
            <Text style={styles.selectorHelper}>
              Do you need candidates with specific experience?
            </Text>
            <SelectorToggleButton
              options={['No', 'Yes']}
              selectedValue={requiresExperience === 'no' ? 'No' : 'Yes'}
              onValueChange={value =>
                setRequiresExperience(value === 'No' ? 'no' : 'yes')
              }
            />
          </View>

          {requiresExperience === 'yes' && (
            <View style={styles.selectorContainer}>
              <Text style={styles.selectorLabel}>
                Experience Level <Text style={styles.required}>*</Text>
              </Text>
              <Text style={styles.selectorHelper}>
                Select the required experience level
              </Text>
              <View style={styles.experienceRow}>
                {[
                  {
                    value: 'entry',
                    label: 'Entry Level',
                    desc: '0-2 years experience',
                  },
                  {
                    value: 'intermediate',
                    label: 'Intermediate',
                    desc: '2-5 years experience',
                  },
                  {
                    value: 'expert',
                    label: 'Expert',
                    desc: '5+ years experience',
                  },
                ].map(option => (
                  <RoundRadioButton
                    key={option.value}
                    label={option.label}
                    description={option.desc}
                    selected={experienceLevel === option.value}
                    onPress={() => setExperienceLevel(option.value)}
                  />
                ))}
              </View>
            </View>
          )}
        </View>
      </>
    );
  }
  function thingsForm() {
    return (
      <>
        <View style={styles.form}>
          <View style={styles.selectorContainer}>
            <Text style={styles.selectorLabel}>
              Purpose <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.selectorHelper}>
              What do you want to do with this item?
            </Text>
            <View style={styles.experienceRow}>
              {[
                { value: 'buy', label: 'Buy' },
                { value: 'sell', label: 'Sell' },
                { value: 'rent_in', label: 'Rent In' },
                { value: 'rent_out', label: 'Rent Out' },
                { value: 'other', label: 'Other' },
              ].map(option => (
                <RoundRadioButton
                  key={option.value}
                  label={option.label}
                  selected={purpose === option.value}
                  onPress={() => setPurpose(option.value)}
                />
              ))}
            </View>
          </View>

          {/* Title */}
          <FloatingLabelInput
            label={'Title'}
            value={thingTitle}
            onChangeText={setThingTitle}
            placeholder="Enter a clear, descriptive title"
            required={true}
            onFocus={ref => scrollToInput(ref, scrollViewRef)}
          />

          {/* Description */}
          <FloatingLabelInput
            label="Description"
            value={thingDescription}
            onChangeText={setThingDescription}
            multiline
            numberOfLines={4}
            placeholder={
              'Info add: item description, item attributes (Material, Color e.g)'
            }
            required={true}
            onFocus={ref => scrollToInput(ref, scrollViewRef)}
          />

          {/* Task Skills/Category */}
          <FloatingLabelSkillsInput
            label="Task Skills & Categories"
            selectedSkills={selectedSkills}
            onSkillsChange={setSelectedSkills}
            availableTags={availableTags}
            placeholder="E.g Software,Design..."
            maxSkills={8}
            required={true}
            onFocus={ref => scrollToInput(ref, scrollViewRef)}
          />

    
        </View>
      </>
    );
  }
}

// ------------------- STYLES -------------------
const styles = StyleSheet.create({
  safeAreaBlack: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: { flex: 1, backgroundColor: '#fff' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 120 },
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
  progressBar: {
    width: '33.33%',
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 4,
  },
  progressText: { fontSize: 14, color: '#888' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
    textAlign: 'center',
  },
  form: { width: '100%' },
  required: { color: '#FF0000', fontSize: 14 },

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
  selectorGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  selectorCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
    minHeight: 80,
  },
  selectedCard: {
    backgroundColor: '#fff',
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectorContent: {
    alignItems: 'center',
    gap: 8,
  },
  selectorText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
  selectedText: {
    color: '#000',
    fontWeight: '600',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#000',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Experience Level Styles
  experienceRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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

  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingVertical: 20,
  },
  nextButton: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: 'center',
  },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

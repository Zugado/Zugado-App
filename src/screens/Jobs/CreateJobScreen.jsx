import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Switch,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
import { Colors } from '../../styles/commonStyles';
const purposeOptions = [
  { id: 1, value: 'buy', label: 'Buy', icon: 'shopping-cart' },
  { id: 2, value: 'sell', label: 'Sell', icon: 'dollar-sign' },
  { id: 3, value: 'rent_in', label: 'Rent In', icon: 'home' },
  { id: 4, value: 'rent_out', label: 'Rent Out', icon: 'key' },
  { id: 5, value: 'other', label: 'Other', icon: 'more-horizontal' },
];

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
  const [showDraftAlert, setShowDraftAlert] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const scrollViewRef = useRef(null);

  // common
  const [jobFor, setJobFor] = useState('person');

  //job for person use state start
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
  //job for person use state End

  // Task Type Common
  const [jobType, setJobType] = useState('standard');

  //  job for things use states start
  const [thingTitle, setThingTitle] = useState('');
  const [thingDescription, setThingDescription] = useState('');
  const [purpose, setPurpose] = useState('');
  const [otherPurpose, setOtherPurpose] = useState('');
  const [thingCategoryList, setthingCategoryList] = useState([]);
  const [selectedThingCategory, setSelectedThingCategory] = useState('');
  const [isPurposeClicked, setPurposeClicked] = useState(false);
  //  job for things use states END

  const [isLoadingDraft, setIsLoadingDraft] = useState(false);

  // Load tags and check for draft on component mount
  useEffect(() => {
    dispatch(getAllTags());
    checkForDraft();
  }, [dispatch]);

  // Listen for screen focus to auto-load draft when opened from tab bar
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('=== SCREEN FOCUSED - AUTO LOADING DRAFT ===');
      autoLoadDraftOnFocus();
    });

    return unsubscribe;
  }, [navigation]);

  // Save draft whenever form data changes (but not when loading draft)
  useEffect(() => {
    if (isLoadingDraft) return; // Skip saving while loading draft
    
    const draftData = {
      jobFor,
      personTitle,
      personDescription,
      experienceLevel,
      selectedSkills,
      skill,
      requiresExperience,
      jobType,
      thingTitle,
      thingDescription,
      purpose,
      otherPurpose,
      selectedThingCategory,
    };
    saveDraft(draftData);
    
    // Debug: Log current form state
    console.log('=== SCREEN 1 - FORM STATE DEBUG ===');
    console.log('Current Draft Data:', JSON.stringify(draftData, null, 2));
    console.log('Has Meaningful Data:', hasMeaningfulData(draftData));
    console.log('=== END SCREEN 1 DEBUG ===\n');
  }, [
    jobFor,
    personTitle,
    personDescription,
    experienceLevel,
    selectedSkills,
    skill,
    requiresExperience,
    jobType,
    thingTitle,
    thingDescription,
    purpose,
    otherPurpose,
    selectedThingCategory,
    isLoadingDraft
  ]);

  const hasMeaningfulData = (data) => {
    return data?.personTitle || 
           data?.thingTitle || 
           data?.personDescription || 
           data?.thingDescription || 
           data?.selectedSkills?.length > 0;
  };

  const autoLoadDraftOnFocus = async () => {
    try {
      const draft = await AsyncStorage.getItem('jobDraft');
      if (draft) {
        const draftData = JSON.parse(draft);
        const hasData = hasMeaningfulData(draftData);
        
        console.log('Auto-loading draft on screen focus');
        console.log('Has meaningful data:', hasData);
        
        if (hasData) {
          // Auto-load draft without showing alert
          await loadDraftSilently(draftData);
          showSnackbar('Draft restored automatically', 'success');
        }
      }
    } catch (error) {
      console.log('Error auto-loading draft:', error);
    }
  };

  const loadDraftSilently = async (draftData) => {
    try {
      console.log('=== SILENTLY LOADING DRAFT ===');
      console.log('Draft Data to Load:', JSON.stringify(draftData, null, 2));
      
      setIsLoadingDraft(true); // Prevent save effect during loading
      
      // Use setTimeout to ensure state updates are processed
      setTimeout(() => {
        // Set all state values
        setJobFor(draftData?.jobFor || 'person');
        setPersonTitle(draftData?.personTitle || '');
        setPersonDescription(draftData?.personDescription || '');
        setExperienceLevel(draftData?.experienceLevel || '');
        setSelectedSkills(draftData?.selectedSkills || []);
        setSkill(draftData?.skill || '');
        setRequiresExperience(draftData?.requiresExperience || 'no');
        setJobType(draftData?.jobType || 'standard');
        setThingTitle(draftData?.thingTitle || '');
        setThingDescription(draftData?.thingDescription || '');
        setPurpose(draftData?.purpose || '');
        setOtherPurpose(draftData?.otherPurpose || '');
        setSelectedThingCategory(draftData?.selectedThingCategory || '');
        
        console.log('Draft silently loaded into state');
        
        // Re-enable saving after state updates
        setTimeout(() => setIsLoadingDraft(false), 200);
      }, 50);
      
      console.log('=== END SILENT DRAFT LOADING ===\n');
    } catch (error) {
      console.log('Error loading draft silently:', error);
      setIsLoadingDraft(false);
    }
  };
  const checkForDraft = async () => {
    try {
      const draft = await AsyncStorage.getItem('jobDraft');
      console.log('=== CHECKING FOR DRAFT ===');
      console.log('Raw Draft:', draft);
      
      if (draft) {
        const draftData = JSON.parse(draft);
        console.log('Parsed Draft Data:', JSON.stringify(draftData, null, 2));
        
        const hasData = hasMeaningfulData(draftData);
        console.log('Has Meaningful Data:', hasData);
        
        if (hasData) {
          setHasDraft(true);
          setShowDraftAlert(true);
          console.log('Draft alert will be shown');
        } else {
          console.log('No meaningful data in draft');
        }
      } else {
        console.log('No draft found');
      }
      console.log('=== END DRAFT CHECK ===\n');
    } catch (error) {
      console.log('Error checking draft:', error);
    }
  };

  const saveDraft = async data => {
    try {
      const hasData = hasMeaningfulData(data);
      
      if (hasData) {
        await AsyncStorage.setItem('jobDraft', JSON.stringify(data));
        console.log('Draft saved successfully');
      } else {
        // Clear draft if no meaningful data
        await AsyncStorage.removeItem('jobDraft');
        console.log('Draft cleared - no meaningful data');
      }
    } catch (error) {
      console.log('Error saving draft:', error);
    }
  };

  const loadDraft = async () => {
    try {
      const draft = await AsyncStorage.getItem('jobDraft');
      console.log('=== LOADING DRAFT ===');
      console.log('Raw Draft to Load:', draft);
      
      if (draft) {
        const draftData = JSON.parse(draft);
        console.log('Parsed Draft Data to Load:', JSON.stringify(draftData, null, 2));
        
        setIsLoadingDraft(true); // Prevent save effect during loading
        
        // Use setTimeout to ensure state updates are processed
        setTimeout(() => {
          // Set all state values
          setJobFor(draftData?.jobFor || 'person');
          setPersonTitle(draftData?.personTitle || '');
          setPersonDescription(draftData?.personDescription || '');
          setExperienceLevel(draftData?.experienceLevel || '');
          setSelectedSkills(draftData?.selectedSkills || []);
          setSkill(draftData?.skill || '');
          setRequiresExperience(draftData?.requiresExperience || 'no');
          setJobType(draftData?.jobType || 'standard');
          setThingTitle(draftData?.thingTitle || '');
          setThingDescription(draftData?.thingDescription || '');
          setPurpose(draftData?.purpose || '');
          setOtherPurpose(draftData?.otherPurpose || '');
          setSelectedThingCategory(draftData?.selectedThingCategory || '');
          
          console.log('Draft data loaded into state');
          console.log('Loaded Values:', {
            jobFor: draftData?.jobFor,
            personTitle: draftData?.personTitle,
            thingTitle: draftData?.thingTitle,
            selectedSkills: draftData?.selectedSkills
          });
          
          // Re-enable saving after state updates
          setTimeout(() => setIsLoadingDraft(false), 200);
        }, 50);
      }
      console.log('=== END DRAFT LOADING ===\n');
    } catch (error) {
      console.log('Error loading draft:', error);
      setIsLoadingDraft(false);
    }
  };

  const clearDraft = async () => {
    try {
      await AsyncStorage.removeItem('jobDraft');
    } catch (error) {
      console.log('Error clearing draft:', error);
    }
  };

  const handleNewForm = () => {
    setShowDraftAlert(false);
    clearDraft();
    // Reset all form fields
    setJobFor('person');
    setPersonTitle('');
    setPersonDescription('');
    setExperienceLevel('');
    setSelectedSkills([]);
    setSkill('');
    setRequiresExperience('no');
    setJobType('standard');
    setThingTitle('');
    setThingDescription('');
    setPurpose('');
    setOtherPurpose('');
    setSelectedThingCategory('');
  };

  const handleResumeDraft = async () => {
    setShowDraftAlert(false);
    await loadDraft();
    showSnackbar('Draft loaded successfully', 'success');
  };

  // Clear fields when switching between person/thing
  const handleJobForChange = value => {
    setJobFor(value);
    if (value === 'person') {
      // Clear thing-specific fields
      setThingTitle('');
      setThingDescription('');
      setPurpose('');
      setOtherPurpose('');
      setSelectedThingCategory('');
    } else {
      // Clear person-specific fields
      setPersonTitle('');
      setPersonDescription('');
      setExperienceLevel('');
      setSkill('');
      setRequiresExperience('no');
    }
  };

  // Clear experience level when switching requiresExperience
  const handleRequiresExperienceChange = value => {
    setRequiresExperience(value);
    if (value === 'no') {
      setExperienceLevel('');
    }
  };

  const handleNext = () => {
    validateForm(jobFor);
  };

  const validateForm = jobFor => {
    console.log('=== SCREEN 1 - FORM VALIDATION ===');
    console.log('Job For:', jobFor);
    
    const currentFormData = {
      jobFor,
      personTitle: personTitle?.trim(),
      personDescription: personDescription?.trim(),
      experienceLevel,
      selectedSkills,
      skill: skill?.trim(),
      requiresExperience,
      jobType,
      thingTitle: thingTitle?.trim(),
      thingDescription: thingDescription?.trim(),
      purpose,
      otherPurpose: otherPurpose?.trim(),
    };
    
    console.log('Current Form Data:', JSON.stringify(currentFormData, null, 2));
    
    // DO NOT clear draft here - keep it until job is successfully posted

    if (jobFor === 'person') {
      // Person validation
      if (
        !jobFor ||
        !personTitle?.trim() ||
        !personDescription?.trim() ||
        !jobType
      ) {
        showSnackbar('Please fill all required fields', 'error');
        return;
      }
      if (requiresExperience === 'yes' && !experienceLevel) {
        showSnackbar('Please select an experience level', 'error');
        return;
      }
      if (selectedSkills?.length === 0) {
        showSnackbar('Please add at least one skill or category', 'error');
        return;
      }
      if (personTitle?.length > 100) {
        showSnackbar('Title must be 100 characters or less', 'error');
        return;
      }
      if (personDescription?.length > 1000) {
        showSnackbar('Description must be 1000 characters or less', 'error');
        return;
      }
      if (skill?.length > 500) {
        showSnackbar('Requirements must be 500 characters or less', 'error');
        return;
      }

      const personJobData = {
        jobFor,
        title: personTitle?.trim(),
        description: personDescription?.trim(),
        category: selectedSkills,
        requirements: skill?.trim(),
        experienceLevel:
          requiresExperience === 'yes' ? experienceLevel : null,
        jobType,
      };
      
      console.log('Person Job Data for Screen 2:', JSON.stringify(personJobData, null, 2));
      console.log('=== END SCREEN 1 VALIDATION ===\n');

      // Navigate with person data
      navigation.push('CreateJobScreen2', {
        jobData: personJobData,
      });
    } else {
      // Thing validation
      if (
        !jobFor ||
        !thingTitle?.trim() ||
        !thingDescription?.trim() ||
        !jobType
      ) {
        showSnackbar('Please fill all required fields', 'error');
        return;
      }
      if (!purpose) {
        showSnackbar('Please select a purpose for the item', 'error');
        return;
      }
      if (purpose === 'other' && !otherPurpose?.trim()) {
        showSnackbar('Please specify the purpose', 'error');
        return;
      }
      if (selectedSkills?.length === 0) {
        showSnackbar('Please add at least one skill or category', 'error');
        return;
      }
      if (thingTitle?.length > 100) {
        showSnackbar('Title must be 100 characters or less', 'error');
        return;
      }
      if (thingDescription?.length > 1000) {
        showSnackbar('Description must be 1000 characters or less', 'error');
        return;
      }

      const thingJobData = {
        jobFor,
        purpose: purpose === 'other' ? otherPurpose : purpose,
        title: thingTitle?.trim(),
        description: thingDescription?.trim(),
        category: selectedSkills,
        jobType,
      };
      
      console.log('Thing Job Data for Screen 2:', JSON.stringify(thingJobData, null, 2));
      console.log('=== END SCREEN 1 VALIDATION ===\n');

      // Navigate with thing data
      navigation.push('CreateJobScreen2', {
        jobData: thingJobData,
      });
    }
  };

  // Clear other purpose when purpose changes
  const handlePurposeChange = value => {
    setPurpose(value);
    if (value !== 'other') {
      setOtherPurpose('');
    }
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
                <View style={[styles.progressBar, { width: '33.33%' }]} />
              </View>
              <Text style={styles.progressText}>1/3</Text>
            </View>

            {/* --- Title --- */}
            <Text style={styles.title}>
              Create and Customize Your Task Posting
            </Text>
            
            {/* Task For */}
            <View style={styles.selectorContainer}>
              <View style={styles.selectorHeaderRow}>
                <View>
                  <Text style={styles.selectorLabel}>
                    Task For <Text style={styles.required}>*</Text>
                  </Text>
                  <Text style={styles.selectorHelper}>
                    What type of work are you posting?
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.urgentToggle,
                    { backgroundColor: jobType === 'quick' ? '#000' : '#666' },
                  ]}
                  onPress={() => setJobType(jobType === 'quick' ? 'standard' : 'quick')}
                  activeOpacity={0.8}
                >
                  {jobType === 'quick' ? (
                    <>
                      <Text style={styles.urgentText}>Urgent</Text>
                      <Feather name="zap" style={styles.urgentIcon} />
                    </>
                  ) : (
                    <>
                      <Feather name="zap" style={styles.urgentIcon} />
                      <Text style={styles.urgentText}>Urgent</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.selectorGrid}>
                {jobForOptions.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.selectorCard,
                      jobFor === option.value && styles.selectedCard,
                    ]}
                    onPress={() => handleJobForChange(option.value)}
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
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>

          {showDraftAlert && hasDraft && (
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

          {/* Task Type - Remove this section since we have the toggle */}
          {/* Experience Level */}
          <View style={styles.selectorContainer}>
            <View style={styles.selectorHeaderRow}>
              <View>
                <Text style={styles.selectorLabel}>
                  Requires Specific Experience Level?
                </Text>
                <Text style={styles.selectorHelper}>
                  Do you need candidates with specific experience?
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.experienceToggle,
                  { backgroundColor: requiresExperience === 'yes' ? '#000' : '#666' },
                ]}
                onPress={() => handleRequiresExperienceChange(requiresExperience === 'yes' ? 'no' : 'yes')}
                activeOpacity={0.8}
              >
                {requiresExperience === 'yes' ? (
                  <>
                    <Text style={styles.experienceText}>Yes</Text>
                    <Feather name="check" style={styles.experienceIcon} />
                  </>
                ) : (
                  <>
                    <Feather name="x" style={styles.experienceIcon} />
                    <Text style={styles.experienceText}>No</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {requiresExperience === 'yes' && (
            <View style={styles.selectorContainer}>
              {/* <Text style={styles.selectorLabel}>
                Experience Level <Text style={styles.required}>*</Text>
              </Text>
              <Text style={styles.selectorHelper}>
                Select the required experience level
              </Text> */}
              <View style={styles.experienceRowContainer}>
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
                  <TouchableOpacity
                    key={option.value}
                    style={styles.experienceOption}
                    onPress={() => setExperienceLevel(option.value)}
                  >
                    <View style={[
                      styles.experienceCheckbox,
                      experienceLevel === option.value && styles.experienceCheckboxSelected
                    ]}>
                      {experienceLevel === option.value && (
                        <Feather name="check" size={14} color="#fff" />
                      )}
                    </View>
                    <Text style={styles.experienceLabel}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {experienceLevel && (
                <View style={styles.experienceInfo}>
                  <Text style={styles.experienceInfoText}>
                    {[
                      { value: 'entry', desc: '0-2 years experience' },
                      { value: 'intermediate', desc: '2-5 years experience' },
                      { value: 'expert', desc: '5+ years experience' },
                    ].find(opt => opt.value === experienceLevel)?.desc}
                  </Text>
                </View>
              )}
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
          <View style={{ marginBottom: 1 }}>
            <Text style={styles.selectorLabel}>
              Purpose <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.selectorHelper}>
              What do you want to do with this item?
            </Text>

            <TouchableOpacity
              style={[
                styles.mapButton,
                {
                  backgroundColor: isPurposeClicked ? '#fff' : '#f8f9fa',
                  borderColor: isPurposeClicked ? '#000000ff' : '#e9ecef',
                },
              ]}
              onPress={() => setPurposeClicked(prev => !prev)}
            >
              <Feather name="target" size={20} color="#000" />
              <Text
                style={[
                  styles.mapButtonText,
                  { color: isPurposeClicked ? '#000000ff' : '#666666' },
                ]}
              >
                {purpose || 'Select Purpose'}
              </Text>

              <Feather
                name={isPurposeClicked ? 'chevron-down' : 'chevron-right'}
                size={16}
                color={isPurposeClicked ? '#000000ff' : '#666666'}
              />
            </TouchableOpacity>
            {isPurposeClicked && (
              <View style={styles.suggestionsContainer}>
                {purposeOptions.map((item, index) => (
                  <View key={item.id}>
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={() => {
                        handlePurposeChange(item.value);
                        setPurposeClicked(false);
                      }}
                    >
                      <View style={styles.suggestionContent}>
                        <Feather name={item.icon} size={16} color="#666" />
                        <Text style={styles.suggestionText}>{item.label}</Text>
                      </View>

                      <Feather name="chevron-right" size={14} color="#ccc" />
                    </TouchableOpacity>

                    {index < purposeOptions.length - 1 && (
                      <View style={styles.separator} />
                    )}
                  </View>
                ))}
              </View>
            )}

            {purpose === 'other' && (
              <FloatingLabelInput
                label={'Purspose (If Others)'}
                value={otherPurpose}
                onChangeText={setOtherPurpose}
                placeholder="Enter purpose (if selected as Others)"
                required={true}
                onFocus={ref => scrollToInput(ref, scrollViewRef)}
              />
            )}
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
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  mapButtonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  progressContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginHorizontal: 15,
  },
  progressBar: {
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
  selectorHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  urgentToggle: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  urgentIcon: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
    color: '#000',
    fontSize: 16,
  },
  urgentText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  experienceToggle: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  experienceIcon: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
    color: '#000',
    fontSize: 16,
  },
  experienceText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
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
    marginBottom: 8,
  },
  selectorHelper: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
  },
  // Location Styles
  locationContainer: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  locationCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationCheckboxSelected: {
    backgroundColor: '#000',
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  locationInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#000',
  },
  locationInfoText: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
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
  experienceRowContainer: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  experienceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  experienceCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  experienceCheckboxSelected: {
    backgroundColor: '#000',
  },
  experienceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#484040ff',
  },
  experienceInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#000',
  },
  experienceInfoText: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  // Custom Toggle Styles
  customToggleContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  customToggle: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customToggleText: {
    fontSize: 14,
    fontWeight: '600',
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
  separator: {
    height: 1,
    backgroundColor: Colors.extraLightGrayColor,
  },
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
  suggestionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },

  // suggestionItem: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   paddingHorizontal: 12,
  //   paddingVertical: 12,
  // },
  // suggestionText: {
  //   marginLeft: 8,
  //   flex: 1,
  //   color: Colors.lightBlackColor,
  // },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  // Toggle Row Styles
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },

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
});

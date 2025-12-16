import React, { useState, useEffect ,useRef} from 'react';
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
export default function CreateJob({ navigation }) {
  const dispatch = useDispatch();
  const availableTags = useSelector(selectTags);
  const tagsLoading = useSelector(selectTagsLoading);
  const { showSnackbar } = useSnackbar();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skill, setSkill] = useState('');
  const [experienceLevel, setExperienceLevel] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  // Task For
  const [jobFor, setJobFor] = useState('person');
  
  // Task Type
  const [jobType, setJobType] = useState('standard');
  
  const jobForOptions = [
    { label: 'Person', value: 'person' },
    { label: 'Thing', value: 'thing' },
  ];
   const typeOptions = [
    { label: 'Standard', value: 'standard' },
    { label: 'Quick', value: 'quick' },
  ];
  // Load tags on component mount
  useEffect(() => {
    dispatch(getAllTags());
  }, [dispatch]);

 console.log("availble tage = ", JSON.stringify(availableTags, null, 2));

  const CheckboxButton = ({ label, selected, onPress }) => (
    <TouchableOpacity activeOpacity={0.8} style={styles.option} onPress={onPress}>
      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
        {selected && <Feather name="check" size={12} color="#fff" />}
      </View>
      <Text style={styles.optionText}>{label}</Text>
    </TouchableOpacity>
  );

  const scrollViewRef = useRef(null);

  const toggleExperienceLevel = (level) => {
    setExperienceLevel(prev => 
      prev.includes(level) 
        ? prev.filter(item => item !== level)
        : [...prev, level]
    );
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

          {/* --- Form --- */}
          <View style={styles.form}>
            {/* Task For */}
            <View style={styles.selectorContainer}>
              <Text style={styles.selectorLabel}>Task For <Text style={styles.required}>*</Text></Text>
              <Text style={styles.selectorHelper}>What type of work are you posting?</Text>
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
                      <Text style={[
                        styles.selectorText,
                        jobFor === option.value && styles.selectedText,
                      ]}>
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
            
            
            {/* <TouchableOpacity
              style={[styles.textInput,{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
              onPress={() => setShowJobTypeModal(true)}
            >
              <Text style={{ color: jobType === 'Select' ? '#888' : '#000' , fontSize: 12 }}>
                {jobType}
              </Text>
              <Feather name="chevron-down" size={20} color="#888" />
            </TouchableOpacity> */}
            {/* Task Title */}
            <FloatingLabelInput
              label="Task Title *"
              value={title}
              onChangeText={setTitle}
              placeholder="Enter a clear, descriptive title"
              onFocus={(ref) => scrollToInput(ref, scrollViewRef)}
            />
           
            {/* Task Description */}
            <FloatingLabelInput
              label="Task Description *"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              placeholder="Describe the job requirements, deliverables, and expectations"
              onFocus={(ref) => scrollToInput(ref, scrollViewRef)}
            />
           
            

            {/* Task Skills/Category */}
            <FloatingLabelSkillsInput
              label="Task Skills & Categories *"
              selectedSkills={selectedSkills}
              onSkillsChange={setSelectedSkills}
              availableTags={availableTags}
              placeholder="E.g Software,Design..."
              maxSkills={8}
              onFocus={(ref) => scrollToInput(ref, scrollViewRef)}
            />

         
              {/* Requirements */}
            <FloatingLabelInput
              label="Requirements (Optional)"
              value={skill}
              onChangeText={setSkill}
              multiline
              numberOfLines={3}
              placeholder="List specific skills, experience, or qualifications needed"
              onFocus={(ref) => scrollToInput(ref, scrollViewRef)}
            />

              {/* Task Type */}
            <View style={styles.selectorContainer}>
              <Text style={styles.selectorLabel}>Task Type <Text style={styles.required}>*</Text></Text>
              <Text style={styles.selectorHelper}>Choose the urgency level</Text>
              <View style={styles.selectorGrid}>
                {typeOptions.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.selectorCard,
                      jobType === option.value && styles.selectedCard,
                    ]}
                    onPress={() => setJobType(option.value)}
                  >
                    <View style={styles.selectorContent}>
                      <Feather
                        name={option.value === 'quick' ? 'zap' : 'clock'}
                        size={24}
                        color={jobType === option.value ? '#000' : '#666'}
                      />
                      <Text style={[
                        styles.selectorText,
                        jobType === option.value && styles.selectedText,
                      ]}>
                        {option.label}
                      </Text>
                    </View>
                    {jobType === option.value && (
                      <View style={styles.checkmark}>
                        <Feather name="check" size={14} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            {/* Experience Level */}
            <View style={styles.selectorContainer}>
              <Text style={styles.selectorLabel}>Experience Level</Text>
              <Text style={styles.selectorHelper}>Select the required experience level</Text>
              <View style={styles.experienceGrid}>
                {[
                  { value: 'entry', label: 'Entry Level', desc: '0-2 years', icon: 'user-plus' },
                  { value: 'intermediate', label: 'Intermediate', desc: '2-5 years', icon: 'user' },
                  { value: 'expert', label: 'Expert', desc: '5+ years', icon: 'award' }
                ].map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.experienceCard,
                      experienceLevel.includes(option.value) && styles.selectedExperienceCard,
                    ]}
                    onPress={() => toggleExperienceLevel(option.value)}
                  >
                    <View style={styles.experienceContent}>
                      <Feather
                        name={option.icon}
                        size={20}
                        color={experienceLevel.includes(option.value) ? '#000' : '#666'}
                      />
                      <View style={styles.experienceText}>
                        <Text style={[
                          styles.experienceLabel,
                          experienceLevel.includes(option.value) && styles.selectedExperienceLabel,
                        ]}>
                          {option.label}
                        </Text>
                        <Text style={styles.experienceDesc}>{option.desc}</Text>
                      </View>
                    </View>
                    {experienceLevel.includes(option.value) && (
                      <View style={styles.experienceCheckmark}>
                        <Feather name="check" size={12} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <FaddedIcon/>
          </View>
        </ScrollView>

        {/* --- Next Button --- */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => {
              // Validation
              if (!jobFor || !title.trim() || !description.trim() || !jobType) {
                showSnackbar('Please fill all required fields', 'error');
                return;
              }
              if (selectedSkills.length === 0) {
                showSnackbar('Please add at least one skill or category', 'error');
                return;
              }
              if (title.length > 100) {
                showSnackbar('Title must be 100 characters or less', 'error');
                return;
              }
              if (description.length > 1000) {
                showSnackbar('Description must be 1000 characters or less', 'error');
                return;
              }
              if (skill.length > 500) {
                showSnackbar('Requirements must be 500 characters or less', 'error');
                return;
              }
              
              navigation.navigate('CreateJobScreen2', {
                jobData: {
                  jobFor,
                  title: title.trim(),
                  description: description.trim(),
                  category: selectedSkills, // Single array of skills/categories
                  requirements: skill.trim(),
                  experienceLevel: experienceLevel.length > 0 ? experienceLevel[0] : 'entry',
                  jobType,
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
  backButton: { backgroundColor: '#fff', padding: 10, borderRadius: 20 ,shadowColor:"#000",shadowOffset:{width:2,height:3},shadowOpacity:0.3,shadowRadius:4,elevation:3, },
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
  title: { fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 30 ,textAlign:'center' },
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
  experienceGrid: {
    gap: 12,
  },
  experienceCard: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  selectedExperienceCard: {
    backgroundColor: '#fff',
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  experienceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  experienceText: {
    flex: 1,
  },
  experienceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 2,
  },
  selectedExperienceLabel: {
    color: '#000',
    fontWeight: '600',
  },
  experienceDesc: {
    fontSize: 12,
    color: '#999',
  },
  experienceCheckmark: {
    backgroundColor: '#000',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingTop: 20,
  },
  nextButton: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: 'center',
  },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },


});

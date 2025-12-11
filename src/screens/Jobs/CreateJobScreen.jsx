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
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import MyStatusBar from '../../components/MyStatusbar';
import { TypeSelectorButtons } from '../../components/CommonComponents';
export default function CreateJob({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skill, setSkill] = useState('');
  const [experienceLevel, setExperienceLevel] = useState([]);

  // Job For
  const [jobFor, setJobFor] = useState('');
  const [showJobForModal, setShowJobForModal] = useState(false);
  const jobForOptions = [
    { label: 'Person', value: 'Person' },
    { label: 'Thing', value: 'Thing' },
  ];
   const typeOptions = [
    { label: 'Standard', value: 'Standard' },
    { label: 'Quick', value: 'Quick' },
  ];

  // Job Type
  const [jobType, setJobType] = useState('');
  const [showJobTypeModal, setShowJobTypeModal] = useState(false);
  // --- NEW TAG STATE & LOGIC ---
  const [tags, setTags] = useState([
    { tag: 'web', subTag: 'frontend' },
    { tag: 'react', subTag: 'development' },
  ]);

  const [showTagModal, setShowTagModal] = useState(false);
  const [currentSelectedTag, setCurrentSelectedTag] = useState(null);
  const [showSubTagModal, setShowSubTagModal] = useState(false);

  // Define your available Tag/SubTag structure
  const availableTags = [
    {
      name: 'web',
      subTags: ['frontend', 'backend', 'fullstack'],
    },
    {
      name: 'react',
      subTags: ['development', 'native', 'testing'],
    },
    {
      name: 'design',
      subTags: ['ui/ux', 'graphic', 'motion'],
    },
    {
      name: 'marketing',
      subTags: ['seo', 'content', 'social media'],
    },
  ];

  const CheckboxButton = ({ label, selected, onPress }) => (
    <TouchableOpacity activeOpacity={0.8} style={styles.option} onPress={onPress}>
      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
        {selected && <Feather name="check" size={12} color="#fff" />}
      </View>
      <Text style={styles.optionText}>{label}</Text>
    </TouchableOpacity>
  );

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
    >
      <SafeAreaView style={styles.container}>
        <MyStatusBar />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
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
            Create and Customize Your Job Posting
          </Text>

          {/* --- Form --- */}
          <View style={styles.form}>
             {/* Job For */}
            <Text style={styles.label}>Job For</Text>
            <TypeSelectorButtons
              type={jobFor}
              setType={setJobFor}
              options={jobForOptions}
            />
            
            {/* Job Type */}
            <Text style={styles.label}>Job Type</Text>
             <TypeSelectorButtons
              type={jobType}
              setType={setJobType}
              options={typeOptions}
            />
            {/* <TouchableOpacity
              style={[styles.textInput,{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
              onPress={() => setShowJobTypeModal(true)}
            >
              <Text style={{ color: jobType === 'Select' ? '#888' : '#000' , fontSize: 12 }}>
                {jobType}
              </Text>
              <Feather name="chevron-down" size={20} color="#888" />
            </TouchableOpacity> */}
             {/* Job Title */}
            <Text style={styles.label}>Job Title</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter Title"
              placeholderTextColor="#888"
              value={title}
              onChangeText={setTitle}
            />
           
           

   {/* Job Description */}
            <Text style={styles.label}>Job Description</Text>
            <TextInput
              style={[styles.textInput, styles.descriptionInput]}
              placeholder="Enter Description"
              placeholderTextColor="#888"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />
           
            {/* Skill Required */}
            <Text style={styles.label}>Skill Required</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter Skill (e.g., React, Redux)"
              placeholderTextColor="#888"
              value={skill}
              onChangeText={setSkill}
            />

            {/* Job Category - UPDATED SECTION */}
            <Text style={styles.label}>Job Category</Text>
            <View style={styles.categoryBox}>
              <Text style={styles.categoryPlaceholder}>
                Selected Categories:
              </Text>
              <View style={styles.tagsContainer}>
                {tags.map((item, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>
                      {item.tag} / {item.subTag}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        setTags(prevTags =>
                          prevTags.filter((t, i) => i !== index),
                        )
                      }
                    >
                      <Feather
                        name="x"
                        size={14}
                        color="#555"
                        style={styles.tagClose}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.addTagButton}
                  onPress={() => setShowTagModal(true)}
                >
                  <Feather name="plus" size={16} color="#000" />
                  <Text style={styles.addTagText}>Add Tag</Text>
                </TouchableOpacity>
              </View>
            </View>

         


            {/* Experience Level */}
            <Text style={styles.label}>Experience Level</Text>
            <View style={styles.experienceBox}>
              <CheckboxButton
                label="Beginner"
                selected={experienceLevel.includes('Beginner')}
                onPress={() => toggleExperienceLevel('Beginner')}
              />
              <CheckboxButton
                label="Intermediate"
                selected={experienceLevel.includes('Intermediate')}
                onPress={() => toggleExperienceLevel('Intermediate')}
              />
              <CheckboxButton
                label="Advanced"
                selected={experienceLevel.includes('Advanced')}
                onPress={() => toggleExperienceLevel('Advanced')}
              />
            </View>
          </View>
        </ScrollView>

        {/* --- Next Button --- */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() =>
              navigation.navigate('CreateJobScreen2', {
                jobData: {
                  jobFor,
                  jobType,
                  title,
                  description,
                  tags,
                  requirements: skill,
                  experienceLevel,
                },
              })
            }
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>

        {/* --- Modal: Job For (Unchanged) --- */}
        {showJobForModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Select Job For</Text>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setJobFor('Person');
                  setShowJobForModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>Person</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setJobFor('Thing');
                  setShowJobForModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>Thing</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowJobForModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* --- Modal: Job Type (Unchanged) --- */}
        {showJobTypeModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Select Job Type</Text>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setJobType('Quick');
                  setShowJobTypeModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>Quick</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setJobType('Standard');
                  setShowJobTypeModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>Standard</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowJobTypeModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* --- NEW MODAL: Select Main Tag --- */}
        {showTagModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Select Main Tag</Text>
              <ScrollView style={styles.modalScrollView}>
                {availableTags.map(item => (
                  <TouchableOpacity
                    key={item.name}
                    style={styles.modalOption}
                    onPress={() => {
                      setCurrentSelectedTag(item);
                      setShowTagModal(false);
                      setShowSubTagModal(true);
                    }}
                  >
                    <Text style={styles.modalOptionText}>
                      {item.name.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowTagModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* --- NEW MODAL: Select SubTag --- */}
        {showSubTagModal && currentSelectedTag && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>
                Select Sub-Tag for: **{currentSelectedTag.name.toUpperCase()}**
              </Text>
              <ScrollView style={styles.modalScrollView}>
                {currentSelectedTag.subTags.map(subTag => (
                  <TouchableOpacity
                    key={subTag}
                    style={styles.modalOption}
                    onPress={() => {
                      setTags(prevTags => [
                        ...prevTags,
                        { tag: currentSelectedTag.name, subTag: subTag },
                      ]);
                      setCurrentSelectedTag(null);
                      setShowSubTagModal(false);
                    }}
                  >
                    <Text style={styles.modalOptionText}>{subTag}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => {
                  setCurrentSelectedTag(null);
                  setShowSubTagModal(false);
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

// ------------------- STYLES -------------------
const styles = StyleSheet.create({
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
  label: { fontSize: 14, color: '#000', marginBottom: 8, fontWeight: '500' },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 12,
    color: '#000',
    marginBottom: 10,
  },
  descriptionInput: { height: 120, textAlignVertical: 'top' },
  categoryBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    minHeight: 100,
  },
  categoryPlaceholder: { color: '#000', fontSize: 14, fontWeight: '500' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0ff', // Changed color to stand out
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  tagText: { fontSize: 12, color: '#000' },
  tagClose: { marginLeft: 5 },

  // NEW STYLES
  addTagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  addTagText: {
    fontSize: 12,
    color: '#000',
    marginLeft: 5,
  },

  experienceBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
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
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  nextButton: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: 'center',
  },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  // MODAL
  modalOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  modalScrollView: { maxHeight: 250, width: '100%' }, // Added for scrollable options
  modalOption: {
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOptionText: { fontSize: 16, textAlign: 'center', color: '#000' },
  modalCancelBtn: { marginTop: 15 },
  modalCancelText: { fontSize: 16, color: 'red' },
});

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
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import MyStatusBar from '../../components/MyStatusbar';
import { TypeSelectorButtons } from '../../components/CommonComponents';
import { useSnackbar } from '../../contexts/SnackbarContext';
export default function CreateJob({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skill, setSkill] = useState('');
  const [experienceLevel, setExperienceLevel] = useState([]);
  const { showSnackbar } = useSnackbar();

  // Job For
  const [jobFor, setJobFor] = useState('');
  const [showJobForModal, setShowJobForModal] = useState(false);
  
  // Job Type
  const [jobType, setJobType] = useState('');
  const [showJobTypeModal, setShowJobTypeModal] = useState(false);
  
  const jobForOptions = [
    { label: 'Person', value: 'person' },
    { label: 'Thing', value: 'thing' },
  ];
   const typeOptions = [
    { label: 'Standard', value: 'standard' },
    { label: 'Quick', value: 'quick' },
  ];
  // --- NEW TAG STATE & LOGIC ---
  const [tags, setTags] = useState([]);

  const [showTagModal, setShowTagModal] = useState(false);
  const [currentSelectedTag, setCurrentSelectedTag] = useState(null);
  const [showSubTagModal, setShowSubTagModal] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [showCustomTagModal, setShowCustomTagModal] = useState(false);
  const [customTag, setCustomTag] = useState('');
  const [customSubTag, setCustomSubTag] = useState('');
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Cleanup when component unmounts (going back to home)
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  // AI-powered tag suggestion using Gemini
  const getAITagSuggestions = async (description) => {
    try {
      const prompt = `Based on this job description, suggest minimun 2 relevant tags in the format "tag/subtag". Only return the tags separated by commas, no explanations:\n\n"${description}"`;
      
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': 'AIzaSyCs7PmOsTjptoDjOfivX6ZF6ZtBQcDsd-Y'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });
      
      const data = await response.json();
      console.log('AI response:', data);
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Parse AI response to extract tag/subtag pairs
      const tagPairs = aiResponse.split(',').map(pair => {
        const cleanPair = pair.trim().replace(/["']/g, '');
        const [tag, subTag] = cleanPair.split('/');
        return tag && subTag ? { tag: tag.toLowerCase().trim(), subTag: subTag.toLowerCase().trim() } : null;
      }).filter(Boolean);
      
      return tagPairs;
    } catch (error) {
      console.log('AI suggestion error:', error);
      // Fallback to simple keyword matching
      return getSimpleTagSuggestions(description);
    }
  };

  // Fallback simple tag suggestions
  const getSimpleTagSuggestions = (text) => {
    const suggestions = [];
    const lowerText = text.toLowerCase();
    
    // const keywordMap = {
    //   'web': ['website', 'html', 'css', 'javascript', 'web'],
    //   'react': ['react', 'jsx', 'component'],
    //   'mobile': ['mobile', 'app', 'ios', 'android', 'flutter'],
    //   'design': ['design', 'ui', 'ux', 'figma'],
    //   'backend': ['backend', 'api', 'server', 'database'],
    //   'marketing': ['marketing', 'seo', 'social', 'content']
    // };
    
    Object.entries(keywordMap).forEach(([tag, keywords]) => {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        suggestions.push({ tag, subTag: 'development' });
      }
    });
    
    return suggestions.slice(0, 3);
  };

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
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <SafeAreaView style={styles.safeAreaBlack} edges={['top']}>
        <MyStatusBar />
        <View style={styles.container}>
        <ScrollView
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
            Create and Customize Your Job Posting
          </Text>

          {/* --- Form --- */}
          <View style={styles.form}>
             {/* Job For */}
            <Text style={styles.label}>Job For<Text style={styles.required}>*</Text></Text>
            <TypeSelectorButtons
              type={jobFor}
              setType={setJobFor}
              options={jobForOptions}
            />
            
            {/* Job Type */}
            <Text style={styles.label}>Job Type<Text style={styles.required}>*</Text></Text>
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
            <Text style={styles.label}>Job Title<Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter Title"
              placeholderTextColor="#888"
              value={title}
              onChangeText={setTitle}
            />
           
           

   {/* Job Description */}
            <Text style={styles.label}>Job Description<Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.textInput, styles.descriptionInput]}
              placeholder="Enter Description"
              placeholderTextColor="#888"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                
                // Clear existing timeout
                if (typingTimeout) {
                  clearTimeout(typingTimeout);
                }
                
                // Clear suggestions if text is too short
                if (text.length < 10) {
                  setSuggestedTags([]);
                  setIsLoadingSuggestions(false);
                  return;
                }
                
                // Show loading state
                setIsLoadingSuggestions(true);
                
                // Set new timeout for 10 seconds
                const newTimeout = setTimeout(async () => {
                  try {
                    const suggestions = await getAITagSuggestions(text);
                    setSuggestedTags(suggestions);
                  } catch (error) {
                    console.log('Error getting suggestions:', error);
                  } finally {
                    setIsLoadingSuggestions(false);
                  }
                }, 10000);
                
                setTypingTimeout(newTimeout);
              }}
            />
           
            {/* Requirements */}
            <Text style={styles.label}>Requirements</Text>
            <TextInput
              style={[styles.textInput, styles.descriptionInput]}
              placeholder="Enter job requirements (e.g., 3+ years React experience, portfolio required)"
              placeholderTextColor="#888"
              multiline
              numberOfLines={3}
              value={skill}
              onChangeText={setSkill}
            />

            {/* Job Category - UPDATED SECTION */}
            <Text style={styles.label}>Job Category</Text>
            <View style={styles.categoryBox}>
              <View style={styles.tagsContainer}>
                {tags.map((item, index) => (
                  <View key={index} style={styles.selectedTag}>
                    <Text style={styles.selectedTagText}>
                      {item.tag}/{item.subTag}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        setTags(prevTags =>
                          prevTags.filter((t, i) => i !== index),
                        )
                      }
                    >
                      <Feather name="x" size={12} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              
              {/* Custom Tag Button */}
              <TouchableOpacity
                style={styles.addCustomTagButton}
                onPress={() => setShowCustomTagModal(true)}
              >
                <View style={styles.addTagIconContainer}>
                  <Feather name="plus" size={18} color="#fff" />
                </View>
                <Text style={styles.addCustomTagText}>Add Custom Tag</Text>
                <Feather name="chevron-right" size={16} color="#666" />
              </TouchableOpacity>
              
              {/* AI Suggested Tags */}
              {(isLoadingSuggestions || suggestedTags.length > 0) && (
                <View style={styles.aiSuggestionsContainer}>
                  <Text style={styles.aiSuggestionsTitle}>✨ AI Suggestions:</Text>
                  <View style={styles.aiSuggestionsRow}>
                    {isLoadingSuggestions ? (
                      // Skeleton loaders
                      Array.from({ length: 3 }).map((_, index) => (
                        <View key={index} style={styles.skeletonTag}>
                          <View style={styles.skeletonText} />
                        </View>
                      ))
                    ) : (
                      // Actual suggestions
                      suggestedTags.map((suggestion, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.aiSuggestionTag}
                          onPress={() => {
                            const newTag = { tag: suggestion.tag, subTag: suggestion.subTag };
                            const exists = tags.some(t => t.tag === newTag.tag && t.subTag === newTag.subTag);
                            if (!exists) {
                              setTags(prev => [...prev, newTag]);
                            }
                            setSuggestedTags(prev => prev.filter((_, i) => i !== index));
                          }}
                        >
                          <Text style={styles.aiSuggestionText}>
                            {suggestion.tag}/{suggestion.subTag}
                          </Text>
                          <Feather name="plus" size={10} color="#007AFF" />
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                </View>
              )}
            </View>

         


            {/* Experience Level */}
            <Text style={styles.label}>Experience Level</Text>
            <View style={styles.experienceBox}>
              <CheckboxButton
                label="Entry Level"
                selected={experienceLevel.includes('entry')}
                onPress={() => toggleExperienceLevel('entry')}
              />
              <CheckboxButton
                label="Intermediate"
                selected={experienceLevel.includes('intermediate')}
                onPress={() => toggleExperienceLevel('intermediate')}
              />
              <CheckboxButton
                label="Expert"
                selected={experienceLevel.includes('expert')}
                onPress={() => toggleExperienceLevel('expert')}
              />
            </View>
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
                  tags,
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



        {/* --- Enhanced Custom Tag Modal --- */}
        {showCustomTagModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.enhancedModalBox}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalIconContainer}>
                  <Feather name="tag" size={24} color="#000" />
                </View>
                <Text style={styles.enhancedModalTitle}>Add Custom Tag</Text>
                <Text style={styles.modalSubtitle}>Create your own professional tag</Text>
              </View>
              
              {/* Modal Content */}
              <View style={styles.modalContent}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Tag</Text>
                  <TextInput
                    style={styles.enhancedInput}
                    placeholder="e.g., python, design, marketing"
                    placeholderTextColor="#999"
                    value={customTag}
                    onChangeText={setCustomTag}
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Subtag</Text>
                  <TextInput
                    style={styles.enhancedInput}
                    placeholder="e.g., django, ui-ux, social-media"
                    placeholderTextColor="#999"
                    value={customSubTag}
                    onChangeText={setCustomSubTag}
                  />
                </View>
                
                <View style={styles.previewContainer}>
                  <Text style={styles.previewLabel}>Preview:</Text>
                  <View style={styles.previewTag}>
                    <Text style={styles.previewTagText}>
                      {customTag || 'tag'}/{customSubTag || 'subtag'}
                    </Text>
                  </View>
                </View>
              </View>
              
              {/* Modal Actions */}
              <View style={styles.enhancedModalActions}>
                <TouchableOpacity
                  style={styles.enhancedCancelButton}
                  onPress={() => {
                    setShowCustomTagModal(false);
                    setCustomTag('');
                    setCustomSubTag('');
                  }}
                >
                  <Text style={styles.enhancedCancelText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.enhancedAddButton,
                    (!customTag.trim() || !customSubTag.trim()) && styles.disabledButton
                  ]}
                  disabled={!customTag.trim() || !customSubTag.trim()}
                  onPress={() => {
                    if (customTag.trim() && customSubTag.trim()) {
                      const newTag = { tag: customTag.trim().toLowerCase(), subTag: customSubTag.trim().toLowerCase() };
                      const exists = tags.some(t => t.tag === newTag.tag && t.subTag === newTag.subTag);
                      if (!exists) {
                        setTags(prev => [...prev, newTag]);
                      }
                      setShowCustomTagModal(false);
                      setCustomTag('');
                      setCustomSubTag('');
                    }
                  }}
                >
                  <Feather name="plus" size={16} color="#fff" />
                  <Text style={styles.enhancedAddText}>Add Tag</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
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
  label: { fontSize: 14, color: '#000', marginBottom: 8, fontWeight: '500' },
  required: { color: '#FF0000', fontSize: 14 },
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
    paddingBottom: 34,
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
  
  // Updated category styles
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTagText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
    marginRight: 6,
  },
  // Enhanced custom tag button
  addCustomTagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 15,
  },
  addTagIconContainer: {
    backgroundColor: '#000',
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addCustomTagText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  aiSuggestionsContainer: {
    backgroundColor: '#f8f9ff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e3e8ff',
  },
  aiSuggestionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4f46e5',
    marginBottom: 8,
  },
  aiSuggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  aiSuggestionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  aiSuggestionText: {
    fontSize: 10,
    color: '#007AFF',
    fontWeight: '500',
  },
  
  // Skeleton loader styles
  skeletonTag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 6,
  },
  skeletonText: {
    width: 60,
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
  },
  
  // Enhanced modal styles
  enhancedModalBox: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  modalHeader: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalIconContainer: {
    backgroundColor: '#000',
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  enhancedModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  modalContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  enhancedInput: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000',
    backgroundColor: '#f8f9fa',
  },
  previewContainer: {
    marginTop: 8,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  previewTag: {
    backgroundColor: '#000',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  previewTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  enhancedModalActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  enhancedCancelButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e9ecef',
  },
  enhancedCancelText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  enhancedAddButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  enhancedAddText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
});

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  FlatList,
  BackHandler,
  Modal,
  useWindowDimensions,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import PaginationDots from '../../components/PaginationDots';
import { useFocusEffect } from '@react-navigation/native';

import illustration1 from '../../assets/onboarding1.png';
import illustration2 from '../../assets/onboarding2.png';
import illustration3 from '../../assets/onboarding3.png';
import MyStatusBar from '../../components/MyStatusbar';

const onboardingData = [
  {
    key: '1',
    illustration: illustration1,
    title: 'Find Work. Find Help. All in One Place.',
    subtitle:
      'Browse thousands of tasks or hire skilled professional instantly using our smart matching system',
  },
  {
    key: '2',
    illustration: illustration2,
    title: 'Fair Bidding. Transparent Earnings.',
    subtitle:
      'Choose your model: bid credits or commission-based payments. No confusion just clarity',
  },
  {
    key: '3',
    illustration: illustration3,
    title: 'Stay Connected. Finish Tasks Faster.',
    titleStyle: { fontSize: 28 },
    subtitle:
      'Limited chat before acceptance, full chat after. Manage tasks easily and track updates.',
  },
];

// --- Sub-Component to Render Each Slide ---
const Slide = ({ item, width, styles }) => (
  <View style={{ width, ...styles.contentContainer }}>
    <Image source={item.illustration} style={styles.illustration} resizeMode="contain" />
    <Text style={[styles.title, item.titleStyle]}>{item.title}</Text>
    <Text style={styles.subtitle}>{item.subtitle}</Text>
  </View>
);

export default function OnboardingScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showExitModal, setShowExitModal] = useState(false);
  const flatListRef = useRef(null);

  const totalScreens = onboardingData.length;
  const isLastScreen = currentIndex === totalScreens - 1;

  const handleSkip = () => {
    navigation.navigate('Auth', { screen: 'Login' });
  };

   useFocusEffect(
  React.useCallback(() => {
    const backAction = () => {
      if (currentIndex === 0) {
        setShowExitModal(true);
        return true;
      } else {
        const prevIndex = currentIndex - 1;
        scrollToIndex(prevIndex);
        setCurrentIndex(prevIndex);
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [currentIndex]));
  
  const scrollToIndex = (index) => {
    try {
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0, // ⚡ Align the item to the start
      });
    } catch (error) {
      console.log('scrollToIndex error:', error);
    }
  };

  const handleNext = () => {
    if (isLastScreen) {
      handleSkip();
    } else {
      const nextIndex = currentIndex + 1;
      scrollToIndex(nextIndex);
      setCurrentIndex(nextIndex);
    }
  };
  
 

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <SafeAreaView style={styles.container}>
        <MyStatusBar/>
      {/* Skip Button */}
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>{isLastScreen ? '' : 'Skip'}</Text>
        </TouchableOpacity>
      </View>

      {/* FlatList for Swiping */}
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={({ item }) => <Slide item={item} width={width} styles={styles} />}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        scrollEventThrottle={16}
        contentContainerStyle={styles.flatListContent}
      />

      {/* Pagination Dots */}
      <View style={styles.dotsWrapper}>
        <PaginationDots currentIndex={currentIndex} total={totalScreens} />
      </View>

      {/* Action Button */}
      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.getStartedButton} onPress={handleNext}>

          <Text style={styles.getStartedButtonText}>
            {isLastScreen ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Custom Exit Modal */}
      <Modal
        visible={showExitModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowExitModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={styles.iconContainer}>
                <Feather name="log-out" size={24} color="#ff6b6b" />
              </View>
              <Text style={styles.modalTitle}>Exit App</Text>
              <Text style={styles.modalMessage}>Are you sure you want to exit the app?</Text>
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowExitModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.exitButton}
                onPress={() => {
                  setShowExitModal(false);
                  BackHandler.exitApp();
                }}
              >
                <Text style={styles.exitButtonText}>Exit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7F9' },
  skipContainer: { alignItems: 'flex-end', paddingHorizontal: 20, paddingTop: 10, zIndex: 10 },
  skipButton: { padding: 5 },
  skipText: { fontSize: 16, color: '#666', fontWeight: '500' },
  contentContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30, marginTop: -50 },
  flatListContent: { flexGrow: 1 },
  illustration: { width: '100%', height: 250, marginBottom: 40, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 5 },
  title: { fontSize: 24, fontWeight: '700', color: '#333', textAlign: 'center', marginBottom: 15, lineHeight: 32 },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 40, lineHeight: 24 },
  dotsWrapper: { alignItems: 'center', marginBottom: 20 },
  buttonWrapper: { paddingHorizontal: 30, paddingBottom: 30 },
  getStartedButton: { backgroundColor: '#000', paddingVertical: 14, borderRadius: 30, alignItems: 'center', width: '100%', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 8 },
  getStartedButtonText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 320,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  modalHeader: {
    alignItems: 'center',
    padding: 30,
    paddingBottom: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 18,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  exitButton: {
    flex: 1,
    paddingVertical: 18,
    alignItems: 'center',
  },
  exitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff6b6b',
  },
});

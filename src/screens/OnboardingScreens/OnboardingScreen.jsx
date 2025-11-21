import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  FlatList, // 👈 New: Import FlatList
  useWindowDimensions, // 👈 New: To get the screen width for paging
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PaginationDots from '../../components/PaginationDots';

// ⚠️ IMPORTANT: You must ensure these image imports point to the correct paths in your project.
import illustration1 from '../../assets/onboarding1.png';
import illustration2 from '../../assets/onboarding2.png';
import illustration3 from '../../assets/onboarding3.png';

// --- Consolidated Content Data ---
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
    titleStyle: {fontSize: 28},
    subtitle:
      'Limited chat before acceptance, full chat after. manage tasks easily and track updates.',
  },
];

// --- Sub-Component to Render Each Slide ---
const Slide = ({ item, width, styles }) => (
  <View style={{ width, ...styles.contentContainer }}>
    {/* Illustration */}
    <Image 
      source={item.illustration} 
      style={styles.illustration} 
      resizeMode="contain" 
    />
    
    {/* Title */}
    <Text style={[styles.title, item.titleStyle]}>
        {item.title}
    </Text>
    
    {/* Subtitle */}
    <Text style={styles.subtitle}>
        {item.subtitle}
    </Text>
    
    {/* The PaginationDots and Button will be rendered outside the FlatList */}
  </View>
);


export default function OnboardingScreen({ navigation }) {
  const { width } = useWindowDimensions(); // Get the screen width
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const totalScreens = onboardingData.length;
  const isLastScreen = currentIndex === totalScreens - 1;

  const currentItem = onboardingData[currentIndex];

  const handleSkip = () => {
    navigation.navigate('Auth', { screen: 'Login' });
  };

  const handleNext = () => {
    if (isLastScreen) {
      handleSkip();
    } else {
      const nextIndex = currentIndex + 1;
      // Scroll FlatList to the next item
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }
  };

  // Called when the user finishes swiping a page
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  // Configuration for determining when a slide is fully visible
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50, // 50% of the item must be visible
  }).current;


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F7F9" />

      {/* Skip Button */}
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>{isLastScreen ? '' : 'Skip'}</Text>
        </TouchableOpacity>
      </View>

      {/* --- FlatList for Swiping --- */}
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={({ item }) => <Slide item={item} width={width} styles={styles} />}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled // 👈 Enables snap-to-page scrolling
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        scrollEventThrottle={16}
        style={styles.flatList}
        // contentContainerStyle is used to allow the FlatList to take up most of the space
        contentContainerStyle={styles.flatListContent}
      />
      {/* --- End FlatList --- */}
      
      {/* Pagination Dots (Rendered outside the FlatList for a fixed position) */}
      <View style={styles.dotsWrapper}>
          <PaginationDots currentIndex={currentIndex} total={totalScreens} />
      </View>

      {/* Action Button */}
      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={handleNext}>
          <Text style={styles.getStartedButtonText}>
            {isLastScreen ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F9',
  },
  skipContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 10, // Ensure skip button is above the content
  },
  skipButton: {
    padding: 5,
  },
  skipText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  // The contentContainer is now the style for *each individual slide*
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: -50, // Adjust for central alignment
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    flexGrow: 1, // Ensure content takes up available space
  },
  illustration: {
    width: '100%',
    height: 250, 
    marginBottom: 40,
    // Keep shadow styles
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '700', 
    color: '#333333',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  dotsWrapper: {
      alignItems: 'center',
      marginBottom: 20, // Space between dots and button
  },
  buttonWrapper: {
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  getStartedButton: {
    backgroundColor: '#000000',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  getStartedButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
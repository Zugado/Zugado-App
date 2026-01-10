
import React, { useRef, useState } from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  StyleSheet,
} from 'react-native';

import { Colors } from '../styles/commonStyles';
const { width } = Dimensions.get('window');

export default function SwipableTabs({ titles = [], components = [] }) {
  const scrollRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    if (activeTab !== index) {
      setActiveTab(index);
    }
  };

  const handleTabPress = (index) => {
    setActiveTab(index);
    scrollRef.current.scrollTo({ x: index * width, animated: true });
  };

  return (
    <View style={style.tabWrapper}>
      <View style={style.tabHeader}>
        {titles.map((title, index) => (
          <TouchableOpacity
           activeOpacity={0.9}
            key={index}
            style={[
              style.tabButton,
              activeTab === index && style.tabButtonActive,
            ]}
            onPress={() => handleTabPress(index)}
          >
            <Text
              style={[
                style.tabButtonText,
                activeTab === index && style.tabButtonTextActive,
              ]}
            >
              {title}
            </Text>
            {activeTab === index && (
              <View style={style.tabActiveIndicator} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {components.map((Component, index) => (
          <View key={index} style={style.tabContent}>
            {Component}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const style = StyleSheet.create({
  tabWrapper: {
    flex: 1,
  },
  tabHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor:Colors.extraLightGrayColor,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    position: 'relative',
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor:Colors.primary,
  },
  tabButtonText: {
    fontSize: 14,
    color: Colors.grayColor,
  },
  tabButtonTextActive: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  tabActiveIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  tabContent: {
    width,
  },
});
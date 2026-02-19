import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { CommonAppBar, FaddedIcon } from '../components/CommonComponents';
import { Colors } from '../styles/commonStyles';
import JobCard from '../components/JobCard';
import { TextInput } from 'react-native-gesture-handler';

const BidPlacementScreen = ({ navigation, route }) => {
  const { job } = route.params || {};
  const [isLoading, setIsLoading] = useState(false);
  const [isNegotiable, setIsNegotiable] = useState('yes');
  const scrollViewRef = useRef(null);

  const scrollToInput = (inputRef, scrollRef) => {
    if (inputRef?.current && scrollRef?.current) {
      inputRef.current.measureLayout(
        scrollRef.current,
        (x, y) => {
          scrollRef.current.scrollTo({ y: y - 100, animated: true });
        },
        () => {},
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={Colors.bodyBackColor}
        />
        <CommonAppBar navigation={navigation} title="Place Your Bid" />
        <ScrollView ref={scrollViewRef} keyboardShouldPersistTaps="handled">
          <JobCard job={job} showButttons={false} />
          <View style={{ paddingVertical: 12, paddingHorizontal: 14 }}>
            <Text
              style={{
                fontWeight: '500',
                fontSize: 16,
                color: Colors.blackColor,
              }}
            >
              Your Expected Amount
            </Text>
            <View
              style={{
                backgroundColor: Colors.extraLightGrayColor,
                borderRadius: 8,
                display: 'flex',
                overflow: 'hidden',
                flexDirection: 'row',
                borderWidth: 1,
                borderColor: Colors.grayColor,
                alignItems: 'center',
                marginVertical: 10,
              }}
            >
              <View
                style={{
                  padding: 10,
                  borderRightColor: Colors.grayColor,
                  borderRightWidth: 1,
                  backgroundColor: Colors.extraLightGrayColor,
                }}
              >
                <Text>₹</Text>
              </View>
              <TextInput
                placeholder="Enter Amount Here"
                style={{
                  flex: 1,
                  fontSize: 12,
                  paddingHorizontal: 10,
                  backgroundColor: Colors.whiteColor,
                }}
              />
            </View>
            <View style={styles.negotiableContainer}>
              <View>
                <Text style={styles.negotiableLabel}>
                  Is This Price Negotiable ?
                </Text>
                <Text style={styles.negotiableHelper}>
                  Can the price be discussed?
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.negotiableToggle,
                  {
                    backgroundColor: isNegotiable === 'yes' ? '#000' : '#666',
                  },
                ]}
                onPress={() =>
                  setIsNegotiable(isNegotiable === 'yes' ? 'no' : 'yes')
                }
                activeOpacity={0.8}
              >
                {isNegotiable === 'yes' ? (
                  <>
                    <Text style={styles.negotiableText}>Yes</Text>
                    <Feather name="check" style={styles.negotiableIcon} />
                  </>
                ) : (
                  <>
                    <Feather name="x" style={styles.negotiableIcon} />
                    <Text style={styles.negotiableText}>No</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontWeight: '500',
                fontSize: 16,
                color: Colors.blackColor,
              }}
            >
              Why Should The client Choose You?
            </Text>
            <TextInput
              placeholder="Briefly Describe your Experience or Approach here... "
              style={{
                flex: 1,
                fontSize: 12,
                paddingVertical: 10,
                paddingHorizontal: 10,
                borderWidth: 1,
                borderColor: Colors.grayColor,
                backgroundColor: Colors.whiteColor,
                minHeight: 100,
                borderRadius: 8,
                marginVertical: 10,
                textAlignVertical: 'top',
              }}
              onFocus={ref => scrollToInput(ref, scrollViewRef)}
            />
          </View>

          <FaddedIcon />
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit Bid</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    marginVertical: 8,
    maxHeight: 30,
    paddingHorizontal: 10,
  },
  filterScrollContent: {
    paddingHorizontal: 10,
    alignItems: 'center',
    flexGrow: 1,
  },
  filterButton: {
    marginHorizontal: 2,
    borderWidth: 1,
    height: 30,
    borderColor: '#ccc',
    backgroundColor: Colors.whiteColor,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedFilterButton: {
    borderColor: Colors.primary,
    backgroundColor: Colors.extraLightGrayColor,
  },
  filterText: {
    fontSize: 10,
    color: '#555',
    textAlign: 'center',
  },
  selectedFilterText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.extraLightGrayColor,
    textAlign: 'center',
    marginTop: 0,
  },
  negotiableContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  negotiableLabel: {
    fontWeight: '500',
    fontSize: 16,
    color: Colors.blackColor,
  },
  negotiableHelper: {
    fontSize: 12,
    color: Colors.grayColor,
    marginTop: 2,
  },
  negotiableToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  negotiableText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  negotiableIcon: {
    color: '#000000',
    borderRadius: 15,
    backgroundColor: '#ffffff',
    padding: 2,
    fontSize: 14,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  submitButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default BidPlacementScreen;

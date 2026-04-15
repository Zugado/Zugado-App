import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { CommonAppBar, FaddedIcon } from '../components/CommonComponents';
import { Colors } from '../styles/commonStyles';
import JobCard from '../components/JobCard';
import MyStatusBar from '../components/MyStatusbar';
import { TextInput } from 'react-native-gesture-handler';
import { useSnackbar } from '../contexts/SnackbarContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BidUpdateScreen = ({ navigation, route }) => {
  const { job } = route.params || {};
  const { showSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

  const bid = job?.bids?.[0];
  const jobInfo = job?.job;

  const [bidAmount, setBidAmount] = useState(bid?.amount?.toString() || '');
  const [message, setMessage] = useState(bid?.message || '');
  const [isNegotiable, setIsNegotiable] = useState(bid?.isNegotiable || false);
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

  const handleUpdateBid = async () => {
    if (!bidAmount || bidAmount.trim() === '') {
      showSnackbar('Please enter bid amount', 'error');
      return;
    }
    const payload = {
      bidId: bid?._id,
      jobId: jobInfo?._id,
      amount: Number(bidAmount),
      message: message.trim(),
      isNegotiable,
    };
    console.log('Update bid payload:', payload);
    navigation.goBack();
    // TODO: dispatch update bid API with payload
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <MyStatusBar backgroundColor={Colors.bodyBackColor} barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <CommonAppBar navigation={navigation} title="Update Your Bid" />
        <ScrollView ref={scrollViewRef} keyboardShouldPersistTaps="handled">
          {jobInfo && <JobCard job={jobInfo} showButttons={false} />}
          <View style={styles.formContainer}>
            <Text style={styles.label}>Your Expected Amount</Text>
            <View style={styles.amountInputContainer}>
              <View style={styles.currencySymbol}>
                <Text>₹</Text>
              </View>
              <TextInput
                placeholder="Enter Amount Here"
                style={styles.amountInput}
                keyboardType="numeric"
                value={bidAmount}
                onChangeText={setBidAmount}
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
                  isNegotiable ? styles.negotiableActive : styles.negotiableInactive,
                ]}
                onPress={() => setIsNegotiable(!isNegotiable)}
                activeOpacity={0.8}
              >
                {isNegotiable ? (
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
            <Text style={styles.label}>Why Should The client Choose You?</Text>
            <TextInput
              placeholder="Briefly Describe your Experience or Approach here... "
              style={styles.messageInput}
              multiline
              value={message}
              onChangeText={setMessage}
              onFocus={ref => scrollToInput(ref, scrollViewRef)}
            />
          </View>

          <FaddedIcon />
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleUpdateBid}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Update Bid</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bodyBackColor,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.bodyBackColor,
  },
  formContainer: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  label: {
    fontWeight: '500',
    fontSize: 16,
    color: Colors.blackColor,
  },
  amountInputContainer: {
    backgroundColor: Colors.extraLightGrayColor,
    borderRadius: 8,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.grayColor,
    alignItems: 'center',
    marginVertical: 10,
    overflow: 'hidden',
  },
  currencySymbol: {
    padding: 10,
    borderRightColor: Colors.grayColor,
    borderRightWidth: 1,
    backgroundColor: Colors.extraLightGrayColor,
  },
  amountInput: {
    flex: 1,
    fontSize: 12,
    paddingHorizontal: 10,
    backgroundColor: Colors.whiteColor,
  },
  messageInput: {
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
  negotiableActive: {
    backgroundColor: '#000',
  },
  negotiableInactive: {
    backgroundColor: '#666',
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
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default BidUpdateScreen;

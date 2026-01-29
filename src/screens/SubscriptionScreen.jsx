import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { CommonAppBar } from '../components/CommonComponents';
import { Colors } from '../styles/commonStyles';
import Feather from 'react-native-vector-icons/Feather';

const SubscriptionScreen = () => {
  const features = [
    '✓ 30 Bids / Month',
    '✓ Boosted Profile Visibility',
    '✓ Premium Badge',
  ];

  return (
    <View style={styles.container}>
      <CommonAppBar title="" borderBottomColor={Colors.bodyBackColor} />

      <Text style={styles.headerText}>You Don't have Bids Available</Text>

      <View style={styles.subscriptionCard}>
        <View style={styles.contentRow}>
          <View style={styles.iconContainer}>
          <Image source={require('../assets/proBadge.png')} style={styles.iconImage} />

          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>Subscribe and Get Bids</Text>
            {features.map((feature, index) => (
              <Text key={index} style={styles.featureText}>
                {feature}
              </Text>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.subscribeButton}>
          <Text style={styles.subscribeButtonText}>Subscribe & Get Bids</Text>
        </TouchableOpacity>

        <View style={styles.morePlansRow}>
          <Text style={styles.morePlansText}>See More Plans</Text>
          <Feather name="chevron-right" size={20} color={Colors.grayColor} />
        </View>
      </View>
      <View>
        <View style={styles.dividerContainer}>
          <View style={styles.dashedLine} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.dashedLine} />
        </View>
        <Text style={styles.headerText}>Do You Want to Subscribe</Text>
        <Text style={styles.subHeader}>
          Purchage a Bid Only for this task
        </Text>
        <View style={styles.subscriptionCard}>
          <Text style={styles.priceText}>₹ 50 </Text>
          <TouchableOpacity style={styles.subscribeButton}>
            <Text style={styles.subscribeButtonText}>
              Purchase & place Bid
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bodyBackColor,
  },
  headerText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: Colors.textColor,
    fontWeight: '700',
  },
  subscriptionCard: {
    padding: 20,
    backgroundColor: Colors.whiteColor,
    margin: 20,
    borderRadius: 14,
    borderColor: Colors.extraLightGrayColor,
    borderWidth: 1,
    shadowColor: Colors.grayColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    elevation: 4,
  },
  contentRow: {
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
  },
  iconContainer: {
    padding: 10,
    backgroundColor: Colors.primary,
    borderColor: '#eac11c',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    marginBottom: 10,
    height: 50,
    width: 50,
  },
  iconImage: {
    height: 38,
    width: 38,
  },
  textContainer: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    color: Colors.textColor,
    marginBottom: 5,
    marginTop: 8,
  },
  featureText: {
    fontSize: 12,
    color: Colors.textColor,
    marginVertical: 2,
  },
  subscribeButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  subscribeButtonText: {
    color: Colors.whiteColor,
    fontWeight: '700',
  },
  morePlansRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  subHeader: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.grayColor,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: Colors.grayColor,
    borderStyle: 'dashed',
  },
  orText: {
    textAlign: 'center',
    color: Colors.grayColor,
    fontSize: 12,
    marginHorizontal: 15,
  },
  morePlansText: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.grayColor,
  },
  priceText: {  
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textColor,  
    textAlign: 'center',
    marginBottom: 10,
  },
});

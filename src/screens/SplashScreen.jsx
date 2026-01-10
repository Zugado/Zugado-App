import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { loadUserFromStorage } from '../store/store';
import MyStatusBar from '../components/MyStatusbar';

const APP_NAME = "Zugado";
const POWERED_BY = "Powered by React Native";
const CHAR_DELAY = 30; // ms
const SECONDARY_DELAY = 500;

const SplashScreen = () => {
  const [showSecondary, setShowSecondary] = useState(false);

  // Create an array of Animated.Values for each character
  const charAnimations = useRef(
    APP_NAME.split('').map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    StatusBar.setBarStyle('dark-content', true);
    loadUserFromStorage();
    // Animate characters one by one
    const animations = charAnimations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 700,
        delay: index * CHAR_DELAY,
        useNativeDriver: true,
      })
    );

    // Sequence animations
    Animated.stagger(CHAR_DELAY, animations).start(() => {
      // After main text animation, show secondary text
      setTimeout(() => setShowSecondary(true), SECONDARY_DELAY);
    });
  }, []);

  return (
    <View style={styles.container}>
         <MyStatusBar/>
      <View style={styles.textContainer}>
        {APP_NAME.split('').map((char, index) => {
          const anim = charAnimations[index];
          const scale = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.5, 1],
          });
          const opacity = anim;

          return (
            <Animated.Text
              key={index}
              style={[
                styles.char,
                {
                  opacity,
                  transform: [{ scale }],
                },
              ]}
            >
              {char}
            </Animated.Text>
          );
        })}
      </View>

      {showSecondary && (
        <Animated.Text style={[styles.secondary, { opacity: showSecondary ? 1 : 0 }]}>
          {POWERED_BY}
        </Animated.Text>
      )}
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  char: {
    color: '#fff',
    fontSize: 64,
    fontWeight: '800',
    fontFamily: 'serif',
  },
  secondary: {
    position: 'absolute',
    bottom: 40,
    color: '#ccc',
    fontSize: 16,
    fontWeight: '300',
  },
});

export default SplashScreen;


// import React, { useEffect } from 'react';
// import { View, Image, StyleSheet, StatusBar } from 'react-native';
// import { loadUserFromStorage } from '../store/store';

// export default function SplashScreen() {
//   useEffect(() => {
//     StatusBar.setBarStyle('dark-content', true);
//     loadUserFromStorage();
//   }, []);
  
//   return (
//     <View style={styles.container}>
//       <Image 
//         source={require('../assets/logo1.png')}
//         style={styles.logo} 
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#000',
//   },
//   logo: {
//     width: 220,
//     height: 80,
//     resizeMode: 'contain',
//   },
// });
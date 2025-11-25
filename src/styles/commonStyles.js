
import { Dimensions, StyleSheet } from 'react-native';

export const Colors = {
  primary: '#30a134ff',
  lightPrimary:"#cafac1ff",
  darkBlue: '#101942',
  secondary: '#FF5722',
  secondaryLight: "#FF8C00",
  bodyBackColor: "#F2F2F2",
  blackColor: "#000000",
  whiteColor: "#FFFFFF",
  grayColor: "#828282",
  extraLightGrayColor: "#E0E0E0",
  lightBlackColor: "#333333",
  redColor: "#FF0606",
  lightGreenColor: "#cef9cef0",
  greenColor: "#4CAF50",
  yellowColor: "#F2C94C",
}
export const appFonts = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  bold: 'Poppins-Bold',
  light: 'Poppins-Light',
  semiBold: 'Poppins-SemiBold',
  extraBold: 'Poppins-ExtraBold',
  italic: 'Poppins-Italic',
};

export const fontSizes = {
  xxxs: 6,
  xxs: 8,
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 26,
  xxxl: 30,
};


// Predefined text styles
export const textStyles = StyleSheet.create({
  heading: {
    fontFamily: appFonts.bold,
    fontSize: fontSizes.xl,
  },
  subHeading: {
    fontFamily: appFonts.semiBold,
    fontSize: fontSizes.md,
  },
  body: {
    fontFamily: appFonts.regular,
    fontSize: fontSizes.md,
  },
  extraSmall: {
    fontFamily: appFonts.light,
    fontSize: fontSizes.xs,
  },
  small: {
    fontFamily: appFonts.light,
    fontSize: fontSizes.sm,
  },
   smallBold: {
    fontFamily: appFonts.bold,
    fontSize: fontSizes.sm,
  },
  italic: {
    fontFamily: appFonts.italic,
    fontSize: fontSizes.md,
  },
  buttonText: {
    fontFamily: appFonts.medium,
    fontSize: fontSizes.lg,
  },
  title: {
    fontFamily: appFonts.extraBold,
    fontSize: fontSizes.xxl,
  },
  largeTitle:{
    fontFamily: appFonts.bold,
    fontSize: fontSizes.xxxl,
  }
});


export const Sizes = {
  fixPadding: 10.0,
};

export const commonStyles = {
  shadow: {
    elevation: 2.0,
    shadowColor: Colors.grayColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
  },
  rowSpaceBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowAlignCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    backgroundColor: Colors.primary,
    // flex:1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    padding: Sizes.fixPadding * 1,
  },
  outlinedButton: {
    backgroundColor: Colors.whiteColor,
    borderColor: Colors.primary,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    padding: Sizes.fixPadding * 1,
  },
  outlinedButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "bold",
  },
  buttonText: {
    color: Colors.whiteColor,
    fontSize: 14,
    fontWeight: "bold",
  },
  boxInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 12,
    fontSize: 12,
    backgroundColor: "#f5f5f5",
    height: 45,
  },
};


export const Fonts = {
  whiteColor16Regular: {
    color: Colors.whiteColor,
    fontSize: 12.0,
    fontFamily: appFonts.regular,
    includeFontPadding: false,
  },

  whiteColor14Regular: {
    color: Colors.whiteColor,
    fontSize: 14.0,
    fontFamily: appFonts.regular,
    includeFontPadding: false,
  },

  whiteColor10Medium: {
    color: Colors.whiteColor,
    fontSize: 10.0,
    fontFamily: appFonts.medium,
    includeFontPadding: false,
  },

  whiteColor12Medium: {
    color: Colors.whiteColor,
    fontSize: 12.0,
    fontFamily: appFonts.medium,
    includeFontPadding: false,
  },

  whiteColor16Medium: {
    color: Colors.whiteColor,
    fontSize: 16.0,
    fontFamily: appFonts.medium,
    includeFontPadding: false,
  },

  whiteColor14Medium: {
    color: Colors.whiteColor,
    fontSize: 14.0,
    fontFamily: appFonts.medium,
    includeFontPadding: false,
  },

  whiteColor14SemiBold: {
    color: Colors.whiteColor,
    fontSize: 14.0,
    fontFamily: appFonts.semiBold,
    includeFontPadding: false,
  },

  whiteColor16SemiBold: {
    color: Colors.whiteColor,
    fontSize: 16.0,
    fontFamily: appFonts.semiBold,
    includeFontPadding: false,
  },

  whiteColor18SemiBold: {
    color: Colors.whiteColor,
    fontSize: 18.0,
    fontFamily: appFonts.semiBold,
    includeFontPadding: false,
  },

  whiteColor34SemiBold: {
    color: Colors.whiteColor,
    fontSize: 34.0,
    fontFamily: appFonts.semiBold,
    includeFontPadding: false,
  },

  blackColor12Regular: {
    color: Colors.blackColor,
    fontSize: 12.0,
    fontFamily: appFonts.regular,
    includeFontPadding: false,
  },

  blackColor10Medium: {
    color: Colors.blackColor,
    fontSize: 10.0,
    fontFamily: appFonts.medium,
    includeFontPadding: false,
  },

  blackColor16Medium: {
    color: Colors.blackColor,
    fontSize: 16.0,
    fontFamily: appFonts.medium,
    includeFontPadding: false,
  },

  blackColor12Medium: {
    color: Colors.blackColor,
    fontSize: 12.0,
    fontFamily: appFonts.medium,
    includeFontPadding: false,
  },

  blackColor14Medium: {
    color: Colors.blackColor,
    fontSize: 14.0,
    fontFamily: appFonts.medium,
    includeFontPadding: false,
  },

  blackColor12SemiBold: {
    color: Colors.blackColor,
    fontSize: 12.0,
    fontFamily: appFonts.semiBold,
    includeFontPadding: false,
  },

  blackColor12Bold: {
    color: Colors.blackColor,
    fontSize: 12.0,
    fontFamily: appFonts.bold,
    fontWeight: "700",
    includeFontPadding: false,
  },

  blackColor14SemiBold: {
    color: Colors.blackColor,
    fontSize: 14.0,
    fontFamily: appFonts.semiBold,
    fontWeight: "500",
    includeFontPadding: false,
  },

  blackColor14Bold: {
    color: Colors.blackColor,
    fontSize: 14.0,
    fontFamily: appFonts.bold,
    fontWeight: "700",
    includeFontPadding: false,
  },

  blackColor16SemiBold: {
    color: Colors.blackColor,
    fontSize: 16.0,
    fontFamily: appFonts.semiBold,
    includeFontPadding: false,
  },

  blackColor16Bold: {
    color: Colors.blackColor,
    fontSize: 16.0,
    fontFamily: appFonts.bold,
    fontWeight: "700",
    includeFontPadding: false,
  },

  blackColor22SemiBold: {
    color: Colors.blackColor,
    fontSize: 22.0,
    fontFamily: appFonts.semiBold,
    includeFontPadding: false,
  },

  grayColor10Regular: {
    color: Colors.grayColor,
    fontSize: 10.0,
    fontFamily: appFonts.regular,
    includeFontPadding: false,
  },

  grayColor12Regular: {
    color: Colors.grayColor,
    fontSize: 12.0,
    fontFamily: appFonts.regular,
    includeFontPadding: false,
  },

  grayColor12SemiBold: {
    color: Colors.grayColor,
    fontSize: 12.0,
    fontFamily: appFonts.semiBold,
    fontWeight: "800",
    includeFontPadding: false,
  },

  grayColor14Regular: {
    color: Colors.grayColor,
    fontSize: 14.0,
    fontFamily: appFonts.regular,
    includeFontPadding: false,
  },

  grayColor10Medium: {
    color: Colors.grayColor,
    fontSize: 10.0,
    fontFamily: appFonts.medium,
    includeFontPadding: false,
  },

  grayColor11Medium: {
    color: Colors.grayColor,
    fontSize: 11.0,
    fontFamily: appFonts.medium,
    includeFontPadding: false,
  },

  grayColor12Medium: {
    color: Colors.grayColor,
    fontSize: 12.0,
    fontFamily: appFonts.medium,
    includeFontPadding: false,
  },

  grayColor14Medium: {
    color: Colors.grayColor,
    fontSize: 14.0,
    fontFamily: appFonts.medium,
    includeFontPadding: false,
  },

  grayColor14SemiBold: {
    color: Colors.grayColor,
    fontSize: 14.0,
    fontFamily: appFonts.semiBold,
    includeFontPadding: false,
  },

  primary12Medium: {
    color: Colors.primary,
    fontSize: 12.0,
    fontFamily: appFonts.medium,
    includeFontPadding: false,
  },

  primary14Medium: {
    color: Colors.primary,
    fontSize: 14.0,
    fontFamily: appFonts.medium,
    includeFontPadding: false,
  },

  primary12SemiBold: {
    color: Colors.primary,
    fontSize: 12.0,
    fontFamily: appFonts.semiBold,
    includeFontPadding: false,
  },

  primary14SemiBold: {
    color: Colors.primary,
    fontSize: 14.0,
    fontFamily: appFonts.semiBold,
    includeFontPadding: false,
  },

  primary18SemiBold: {
    color: Colors.primary,
    fontSize: 18.0,
    fontFamily: appFonts.semiBold,
    includeFontPadding: false,
  },

  redColor14Medium: {
    color: Colors.redColor,
    fontSize: 14.0,
    fontFamily: appFonts.medium,
    includeFontPadding: false,
  },
};


export const screenWidth = Dimensions.get("window").width;

export const screenHeight = Dimensions.get("window").height;
import { Platform } from 'react-native';

export const scrollToInput = (inputRef, scrollViewRef) => {
  if (inputRef && scrollViewRef.current) {
    setTimeout(() => {
      inputRef.measureLayout(
        scrollViewRef.current,
        (x, y, width, height) => {
          const keyboardHeight = Platform.OS === 'ios' ? 300 : 250;
          const scrollY = y - keyboardHeight + height + 50;
          scrollViewRef.current.scrollTo({ y: Math.max(0, scrollY), animated: true });
        },
        () => {}
      );
    }, 200);
  }
};

export function trimText(text, maxChars) {
  if (typeof text !== "string") return "";

  if (text.length <= maxChars) return text;

  let trimmed = text.substring(0, maxChars);
  trimmed = trimmed.substring(0, trimmed.lastIndexOf(" "));

  return trimmed + "...";
}
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as RNLocalize from "react-native-localize";

import en from "./translations/en.json";
import hi from "./translations/hi.json";
import bn from "./translations/bn.json";

const fallback = { languageTag: "en" };
const { languageTag } =
  RNLocalize.getLocales()[0] || fallback;

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v3",
    lng: languageTag,
    fallbackLng: "en",
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      bn: { translation: bn },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';
import mapValues from 'lodash/mapValues';

import translations from './locales/translations.json';
import en_US from './locales/en-US.js';

const languageDetector = {
  type: 'languageDetector',
  async: false,
  detect: () => DeviceInfo.getDeviceLocale(),
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: {
      'nb-US': ['no'],
      default: ['en-US'],
    },

    // Use downloaded translations if available but use en-US from source to make development easier
    resources: {
      ...mapValues(translations, 'translation'),
      ...{ 'en-US': en_US },
    },

    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',
    fallbackNS: 'common',

    interpolation: {
      escapeValue: false, // not needed for react as it does escape per default to prevent xss!
    },

    react: {
      wait: true,
      nsMode: 'fallback',
    },
  });

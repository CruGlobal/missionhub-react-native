import i18n, {
  LanguageDetectorModule,
  ResourceLanguage,
  Resource,
} from 'i18next';
import { initReactI18next } from 'react-i18next';
import { findBestAvailableLanguage } from 'react-native-localize';

import oneSkyTranslations from './locales/translations.json';
import en_US from './locales/en-US.js';
import {
  mapOneSkyToResourceLanguages,
  aliasLanguages,
  createBaseLocaleAliases,
} from './helpers';

const aliases = {
  nb: 'no',
  nn: 'no',
  ...createBaseLocaleAliases(oneSkyTranslations),
};

const resourceLanguages = {
  // Use downloaded translations if available but use en-US from source to make development easier
  ...mapOneSkyToResourceLanguages(oneSkyTranslations),
  ...{ 'en-US': en_US as ResourceLanguage },
};

const aliasedResourceLanguages: Resource = aliasLanguages(
  aliases,
  resourceLanguages,
);

const languageDetector: LanguageDetectorModule = {
  type: 'languageDetector',
  detect: () =>
    (findBestAvailableLanguage(Object.keys(aliasedResourceLanguages)) || {})
      .languageTag,
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en-US',

    resources: aliasedResourceLanguages,

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

// https://github.com/AlexanderZaytsev/react-native-i18n
import I18n from 'react-native-i18n';

import en from './locales/en.json';
import fr from './locales/fr.json';

I18n.fallbacks = true;

// TODO: Add all translations correctly
I18n.translations = {
  en,
  fr,
};

export default I18n;
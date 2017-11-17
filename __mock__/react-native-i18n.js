const I18nMock = jest.mock('react-native-i18n', () => ({
  t: jest.fn(translation => translation),
  currentlLocale: jest.fn(() => 'en'),
}));

global.I18n = I18nMock;
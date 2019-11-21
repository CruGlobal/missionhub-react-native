// From https://github.com/react-native-community/react-native-localize#how-to-test-your-code

jest.mock('react-native-localize', () => ({
  // use a provided translation, or return undefined to test your fallback
  findBestAvailableLanguage: () => ({
    languageTag: 'en-TEST',
    isRTL: false,
  }),
  getLocales: () => [
    // you can choose / add the locales you want
    {
      countryCode: 'US',
      languageTag: 'en-TEST',
      languageCode: 'en',
      isRTL: false,
    },
    {
      countryCode: 'FR',
      languageTag: 'fr-FR',
      languageCode: 'fr',
      isRTL: false,
    },
  ],
  getNumberFormatSettings: () => ({
    decimalSeparator: '.',
    groupingSeparator: ',',
  }),
  getCalendar: () => 'gregorian', // or "japanese", "buddhist",
  getCountry: () => 'US', // the country code you want,
  getCurrencies: () => ['USD', 'EUR'], // can be empty array,
  getTemperatureUnit: () => 'fahrenheit', // or "celsius",
  getTimeZone: () => 'America/Los_Angeles', // the timezone you want,
  uses24HourClock: () => false,
  usesMetricSystem: () => false,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

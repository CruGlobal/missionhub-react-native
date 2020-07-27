jest.mock('react-native-appsflyer', () => ({
  __esModule: true as const,
  default: {
    initSdk: jest.fn(),
    setCustomerUserId: jest.fn(),
    setAdditionalData: jest.fn(),
    trackEvent: jest.fn(),
  },
}));

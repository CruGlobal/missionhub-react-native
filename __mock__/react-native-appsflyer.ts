jest.mock('react-native-appsflyer', () => ({
  __esModule: true,
  default: {
    initSdk: jest.fn(),
    setCustomerUserId: jest.fn(),
    setAdditionalData: jest.fn(),
  },
}));

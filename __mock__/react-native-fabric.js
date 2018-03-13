jest.mock('react-native-fabric', () => ({
  Crashlytics: {
    log: jest.fn(),
    recordCustomExceptionName: jest.fn(),
    setUserIdentifier: jest.fn(),
  },
}));

jest.mock('react-native-fabric', () => ({
  Crashlytics: {
    recordCustomExceptionName: jest.fn(),
    setUserIdentifier: jest.fn(),
  },
}));

jest.mock('react-native-fabric', () => ({
  Crashlytics: {
    log: jest.fn(),
    recordCustomExceptionName: jest.fn(),
    setUserIdentifier: jest.fn(),
    setUserName: jest.fn(),
    setUserEmail: jest.fn(),
  },
}));

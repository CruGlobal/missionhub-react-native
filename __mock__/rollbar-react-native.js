jest.mock('rollbar-react-native', () => ({
  Configuration: jest.fn(),
  Client: jest.fn(function() {
    return {
      log: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warning: jest.fn(),
      error: jest.fn(),
      critical: jest.fn(),
      setPerson: jest.fn(),
      clearPerson: jest.fn(),
    };
  }),
}));

jest.mock('@react-native-firebase/dynamic-links', () => ({
  __esModule: true as const,
  default: jest.fn(),
}));
jest.mock('@react-native-firebase/analytics', () => ({
  __esModule: true as const,
  default: jest.fn(() => ({
    logEvent: jest.fn(),
    logScreenView: jest.fn(),
    setUserProperties: jest.fn(),
  })),
}));

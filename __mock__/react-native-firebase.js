jest.mock('react-native-firebase', () => ({
  links: jest.fn(),
  onLink: jest.fn(),
  getInitialLink: jest.fn(() => Promise.resolve('firebaseDeepLinkUri')),
}));

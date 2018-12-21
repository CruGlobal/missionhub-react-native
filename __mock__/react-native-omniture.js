jest.mock('react-native-omniture', () => ({
  trackAction: jest.fn(),
  trackState: jest.fn(),
  syncIdentifier: jest.fn(),
  loadMarketingCloudId: jest.fn(),
}));

jest.mock('react-native-simple-toast', () => ({
  __esModule: true as const,
  default: {
    show: jest.fn(),
  },
}));

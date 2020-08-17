jest.mock('react-native-video', () => ({
  __esModule: true,
  // @ts-ignore
  ...jest.requireActual('react-native-video'),
  default: 'Video',
}));

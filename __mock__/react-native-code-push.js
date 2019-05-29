jest.mock('react-native-code-push', () => {
  const wrapperFn = () => app => app;
  wrapperFn.CheckFrequency = { ON_APP_START: 0 };
  return wrapperFn;
});

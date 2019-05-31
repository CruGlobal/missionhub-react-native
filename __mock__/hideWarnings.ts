const originalWarn = console.warn;

beforeAll(() => {
  // Needed since the test NavigationProvider creates a navigator for each test
  console.warn = (...args: any[]) => {
    if (
      /You should only render one navigator explicitly in your app, and other navigators should be rendered by including them in that navigator/.test(
        args[0],
      )
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
});

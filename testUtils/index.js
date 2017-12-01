export const createMockStore = () => {
  return {
    getState: jest.fn(() => ({
      profile: {},
      stages: {},
    })),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  };
};
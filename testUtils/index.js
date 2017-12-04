import 'react-native';
import renderer from 'react-test-renderer';

export const createMockStore = (state = {}) => {
  return {
    getState: jest.fn(() => (state)),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  };
};

export const createMockNavState = (params = {}) => {
  return {
    state: {
      params,
    },
  };
};

export const testSnapshot = (data) => {
  expect(renderer.create(data)).toMatchSnapshot();
};

import 'react-native';
import React from 'react';

import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import StageScreen from '../../src/containers/StageScreen';
import { createMockNavState, createMockStore } from '../../testUtils';

const mockStages = () => {
  return 'mock stages';
};

jest.mock('react-native-device-info');
jest.mock('../../src/actions/stages', () => {
  return {
    getStages: () => mockStages(),
  };
});

const mockState = {
  profile: {},
  stages: {},
};

const store = createMockStore(mockState);

describe('StageScreen', () => {
  let tree;

  beforeEach(() => {
    tree = renderer.create(
      <Provider store={store}>
        <StageScreen navigation={createMockNavState()} />
      </Provider>
    );
  });

  it('loads stages when component is mounted', () => {
    expect(store.dispatch).toHaveBeenCalledWith(mockStages());
  });

  it('renders correctly', () => {
    expect(tree.toJSON()).toMatchSnapshot();
  });
});

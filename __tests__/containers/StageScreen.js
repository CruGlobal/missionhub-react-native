import 'react-native';
import React from 'react';

import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import StageScreen from '../../src/containers/StageScreen';
import { createMockNavState, createMockStore, testSnapshot } from '../../testUtils';

const mockStages = () => {
  return 'mock stages';
};

jest.mock('react-native-device-info');
jest.mock('../../src/actions/stages', () => {
  return {
    getStages: () => mockStages(),
    getStagesIfNotExists: () => mockStages(),
  };
});

const mockState = {
  profile: {
    firstName: 'Roger',
  },
  stages: {},
};

const store = createMockStore(mockState);

it('StageScreen renders correctly with back button', () => {
  testSnapshot(
    <Provider store={store}>
      <StageScreen
        navigation={createMockNavState({
          enableButton: true,
        })}
      />
    </Provider>
  );
});




describe('StageScreen', () => {
  let tree;

  beforeEach(() => {
    tree = renderer.create(
      <Provider store={store}>
        <StageScreen navigation={createMockNavState({
          enableButton: false,
        })} />
      </Provider>
    );
  });

  it('loads stages when component is mounted', () => {
    expect(store.dispatch).toHaveBeenCalledWith(mockStages());
  });

  it('renders correctly without back button', () => {
    expect(tree.toJSON()).toMatchSnapshot();
  });
});

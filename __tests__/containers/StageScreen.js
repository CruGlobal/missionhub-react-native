import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';

import StageScreen from '../../src/containers/StageScreen';
import { createMockNavState, createMockStore, renderShallow, testSnapshot } from '../../testUtils';
import * as selectStage from '../../src/actions/selectStage';

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
const mockStage = {
  id: 1,
};
const mockComplete = jest.fn();

const store = createMockStore(mockState);
let component;

function buildShallowScreen(props) {
  return renderShallow(<StageScreen
    navigation={createMockNavState({
      name: 'Test',
      contactId: '123',
      currentStage: '2',
      section: 'section',
      subsection: 'subsection',
      onComplete: mockComplete,
      ...props,
    })}
  />, store).instance();
}

beforeEach(() => mockComplete.mockReset());

it('StageScreen renders correctly with back button', () => {
  testSnapshot(
    <Provider store={store}>
      <StageScreen
        navigation={createMockNavState({
          enableBackButton: true,
          section: 'section',
          subsection: 'subsection',
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
          enableBackButton: false,
          section: 'section',
          subsection: 'subsection',
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

describe('stage screen methods', () => {
  beforeEach(() => {
    component = buildShallowScreen({});
  });

  it('runs select stage', () => {
    selectStage.selectMyStage = jest.fn();

    component.handleSelectStage(mockStage, false);

    expect(selectStage.selectMyStage).toHaveBeenCalledTimes(1);
  });
});

describe('stage screen methods', () => {
  beforeEach(() => {
    component = buildShallowScreen({ noNav: true });
  });

  it('runs select stage with active', () => {
    component.handleSelectStage(mockStage, true);

    expect(mockComplete).toHaveBeenCalledTimes(1);
  });
});


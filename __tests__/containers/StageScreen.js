import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';

import StageScreen from '../../src/containers/StageScreen';
import { createMockNavState, createMockStore, testSnapshot } from '../../testUtils';
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


const store = createMockStore(mockState);

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

describe('person stage screen methods', () => {
  let component;
  const mockComplete = jest.fn();
  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    const screen = shallow(
      <StageScreen
        navigation={createMockNavState({
          onComplete: mockComplete,
          name: 'Test',
          contactId: '123',
          currentStage: '2',
          section: 'section',
          subsection: 'subsection',
        })}
      />,
      { context: { store } },
    );

    component = screen.dive().dive().dive().instance();
  });

  it('runs select stage', () => {

    selectStage.selectStage = jest.fn();

    component.handleSelectStage(mockStage, false);
    expect(selectStage.selectStage).toHaveBeenCalledTimes(1);
  });
});

describe('person stage screen methods', () => {
  let component;
  const mockComplete = jest.fn();
  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    const screen = shallow(
      <StageScreen
        navigation={createMockNavState({
          onComplete: mockComplete,
          name: 'Test',
          contactId: '123',
          currentStage: '2',
          contactAssignmentId: '333',
          noNav: true,
          section: 'section',
          subsection: 'subsection',
        })}
      />,
      { context: { store } },
    );

    component = screen.dive().dive().dive().instance();
  });

  it('runs select stage with active', () => {

    component.handleSelectStage(mockStage, true);
    expect(mockComplete).toHaveBeenCalledTimes(1);
  });
});


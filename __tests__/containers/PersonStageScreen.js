import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';

// Note: test renderer must be required after react-native.
import PersonStageScreen from '../../src/containers/PersonStageScreen';
import { testSnapshot, createMockNavState, createMockStore } from '../../testUtils';
import * as navigation from '../../src/actions/navigation';
import * as selectStage from '../../src/actions/selectStage';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as analytics from '../../src/actions/analytics';
import { navigatePush } from '../../src/actions/navigation';
import { PERSON_SELECT_STEP_SCREEN } from '../../src/containers/PersonSelectStepScreen';

const mockState = {
  personProfile: {
    personFirstName: 'Billy',
    personLastName: 'Test',
  },
  auth: {},
  notifications: {},
  stages: [],
};

const mockStage = {
  id: 1,
};

let store = createMockStore(mockState);

jest.mock('react-native-device-info');

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <PersonStageScreen
        navigation={createMockNavState({
          onComplete: jest.fn(),
          name: 'Test',
          contactId: '123',
          currentStage: '2',
          contactAssignmentId: '333',
          enableBackButton: true,
          section: 'section',
          subsection: 'subsection',
        })}
      />
    </Provider>
  );
});

describe('person stage screen methods', () => {
  let component;
  const mockComplete = jest.fn();
  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    const screen = shallow(
      <PersonStageScreen
        navigation={createMockNavState({
          onComplete: mockComplete,
          name: 'Test',
          contactId: '123',
          currentStage: '2',
          contactAssignmentId: '333',
          section: 'section',
          subsection: 'subsection',
        })}
      />,
      { context: { store } },
    );

    component = screen.dive().dive().dive().instance();
  });

  it('runs select stage', () => {

    selectStage.updateUserStage = jest.fn();

    component.handleSelectStage(mockStage, false);
    expect(selectStage.updateUserStage).toHaveBeenCalledTimes(1);
  });

  it('runs celebrate and finish', () => {

    navigation.navigatePush = jest.fn();

    component.celebrateAndFinish();
    expect(navigation.navigatePush).toHaveBeenCalledTimes(1);
  });
});

describe('person stage screen methods with add contact flow', () => {
  let component;
  const mockComplete = jest.fn();
  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    const screen = shallow(
      <PersonStageScreen
        navigation={createMockNavState({
          onCompleteCelebration: mockComplete,
          addingContactFlow: true,
          name: 'Test',
          contactId: '123',
          currentStage: '2',
          contactAssignmentId: '333',
          section: 'section',
          subsection: 'subsection',
        })}
      />,
      { context: { store } },
    );

    component = screen.dive().dive().dive().instance();
  });

  it('runs handle navigate', () => {
    component.celebrateAndFinish = jest.fn();

    component.handleNavigate();
    expect(component.celebrateAndFinish).toHaveBeenCalledTimes(1);
  });

  it('runs update stage', async() => {
    const trackStateResult = { type: 'tracked state' };
    const mockStore = configureStore([ thunk ])(mockState);
    const screen = shallow(
      <PersonStageScreen
        navigation={createMockNavState({
          onCompleteCelebration: mockComplete,
          addingContactFlow: true,
          name: 'Test',
          contactId: '123',
          currentStage: '2',
          contactAssignmentId: '333',
          section: 'section',
          subsection: 'subsection',
        })}
      />,
      { context: { store: mockStore } },
    );
    component = screen.dive().dive().dive().instance();
    selectStage.updateUserStage = () => () => Promise.resolve();
    analytics.trackState = () => (trackStateResult);
    navigation.navigatePush = jest.fn();

    await component.handleSelectStage(mockStage, false);

    expect(navigatePush).toHaveBeenCalledWith(PERSON_SELECT_STEP_SCREEN, expect.anything());
  });

  it('runs celebrate and finish with on complete', () => {
    navigation.navigatePush = jest.fn();

    component.celebrateAndFinish();
    expect(navigation.navigatePush).toHaveBeenCalledTimes(1);
  });

});

describe('person stage screen methods', () => {
  let component;
  const mockComplete = jest.fn();
  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    const screen = shallow(
      <PersonStageScreen
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


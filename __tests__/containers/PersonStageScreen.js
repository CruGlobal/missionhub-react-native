import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import PersonStageScreen from '../../src/containers/PersonStageScreen';
import {
  testSnapshot,
  createMockNavState,
  createMockStore,
  renderShallow,
} from '../../testUtils';
import * as navigation from '../../src/actions/navigation';
import * as selectStage from '../../src/actions/selectStage';
import * as analytics from '../../src/actions/analytics';
import { navigatePush } from '../../src/actions/navigation';
import { PERSON_SELECT_STEP_SCREEN } from '../../src/containers/PersonSelectStepScreen';
import { completeOnboarding } from '../../src/actions/onboardingProfile';

const mockState = {
  personProfile: {
    personFirstName: 'Billy',
    personLastName: 'Test',
  },
  auth: {
    person: {
      id: '123',
    },
  },
  notifications: {},
  stages: {},
};

const mockStage = {
  id: 1,
};

let store = createMockStore(mockState);
const mockNavState = {
  name: 'Test',
  contactId: '123',
  currentStage: '2',
  contactAssignmentId: '333',
  section: 'section',
  subsection: 'subsection',
};
const trackStateResult = { type: 'tracked state' };

jest.mock('react-native-device-info');
jest.mock('../../src/actions/onboardingProfile', () => ({
  completeOnboarding: jest
    .fn()
    .mockReturnValue({ type: 'onboarding complete' }),
}));

function buildScreen(mockNavStateParam, storeParam) {
  const screen = renderShallow(
    <PersonStageScreen navigation={createMockNavState(mockNavStateParam)} />,
    storeParam,
  );

  return screen.instance();
}

navigation.navigatePush = jest.fn();
navigation.navigateBack = jest.fn();

beforeEach(() => {
  navigation.navigatePush.mockReset();
  navigation.navigatePush.mockReturnValue({ type: 'navigated forward' });

  navigation.navigateBack.mockReset();
  analytics.trackState = jest.fn(() => trackStateResult);
});

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <PersonStageScreen
        navigation={createMockNavState({
          ...mockNavState,
          onComplete: jest.fn(),
          enableBackButton: true,
        })}
      />
    </Provider>,
  );
});

describe('person stage screen methods with onComplete prop', () => {
  let component;
  const mockComplete = jest.fn();

  beforeEach(() => {
    component = buildScreen(
      {
        ...mockNavState,
        onComplete: mockComplete,
      },
      store,
    );
  });

  it('runs select stage', async () => {
    selectStage.updateUserStage = jest.fn();
    navigation.navigatePush = jest.fn((_, params) => params.onSaveNewSteps());

    await component.handleSelectStage(mockStage, false);

    expect(navigation.navigateBack).toHaveBeenCalledWith(2);
    expect(selectStage.updateUserStage).toHaveBeenCalledTimes(1);
  });

  it('runs celebrate and finish', () => {
    component.celebrateAndFinish();

    expect(navigation.navigatePush).toHaveBeenCalledTimes(1);
  });
});

describe('person stage screen methods with onComplete prop but without add contact flow', () => {
  it('runs update stage', async () => {
    const mockStore = configureStore([thunk])(mockState);
    const component = buildScreen(
      {
        onCompleteCelebration: jest.fn(),
        addingContactFlow: false,
        ...mockNavState,
      },
      mockStore,
    );
    selectStage.updateUserStage = () => () => Promise.resolve();

    await component.handleSelectStage(mockStage, false);

    expect(navigatePush).toHaveBeenCalledWith(
      PERSON_SELECT_STEP_SCREEN,
      expect.anything(),
    );
    expect(completeOnboarding).toHaveBeenCalled();
  });
});

describe('person stage screen methods with add contact flow', () => {
  let component;
  const mockComplete = jest.fn();

  beforeEach(() => {
    component = buildScreen(
      {
        onCompleteCelebration: mockComplete,
        addingContactFlow: true,
        ...mockNavState,
      },
      store,
    );
  });

  it('runs handle navigate', () => {
    component.celebrateAndFinish = jest.fn();

    component.handleNavigate();

    expect(component.celebrateAndFinish).toHaveBeenCalledTimes(1);
  });

  it('runs update stage', async () => {
    const mockStore = configureStore([thunk])(mockState);
    component = buildScreen(
      {
        onCompleteCelebration: mockComplete,
        addingContactFlow: true,
        ...mockNavState,
      },
      mockStore,
    );
    selectStage.updateUserStage = () => () => Promise.resolve();

    await component.handleSelectStage(mockStage, false);

    expect(navigatePush).toHaveBeenCalledWith(
      PERSON_SELECT_STEP_SCREEN,
      expect.anything(),
    );
  });

  it('runs celebrate and finish with on complete', () => {
    component.celebrateAndFinish();

    expect(navigation.navigatePush).toHaveBeenCalledTimes(1);
  });
});

describe('person stage screen methods', () => {
  let component;
  const mockComplete = jest.fn();

  beforeEach(() => {
    component = buildScreen(
      {
        onComplete: mockComplete,
        noNav: true,
        ...mockNavState,
      },
      store,
    );
  });

  it('runs select stage with active', () => {
    component.handleSelectStage(mockStage, true);

    expect(mockComplete).toHaveBeenCalledTimes(1);
  });
});

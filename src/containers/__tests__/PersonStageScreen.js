import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import PersonStageScreen from '../PersonStageScreen';
import {
  testSnapshot,
  createMockNavState,
  createThunkStore,
  renderShallow,
} from '../../../testUtils';
import { showReminderOnLoad } from '../../actions/notifications';
import * as selectStage from '../../actions/selectStage';
import * as analytics from '../../actions/analytics';
import { navigatePush, navigateBack } from '../../actions/navigation';
import { PERSON_SELECT_STEP_SCREEN } from '../PersonSelectStepScreen';
import { completeOnboarding } from '../../actions/onboardingProfile';

jest.mock('react-native-device-info');
jest.mock('../../actions/notifications');
jest.mock('../../actions/navigation');
jest.mock('../../actions/onboardingProfile', () => ({
  completeOnboarding: jest
    .fn()
    .mockReturnValue({ type: 'onboarding complete' }),
}));

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

let store;

const mockNavState = {
  name: 'Test',
  contactId: '123',
  currentStage: '2',
  contactAssignmentId: '333',
  section: 'section',
  subsection: 'subsection',
};
const trackStateResult = { type: 'tracked state' };

function buildScreen(mockNavState, store) {
  const screen = renderShallow(
    <PersonStageScreen navigation={createMockNavState(mockNavState)} />,
    store,
  );

  return screen.instance();
}

const showReminderResult = { type: 'show notification prompt' };
const navigatePushResult = { type: 'navigated forward' };
const navigateBackResult = { type: 'navigated back' };

beforeEach(() => {
  showReminderOnLoad.mockReturnValue(showReminderResult);
  navigatePush.mockReturnValue(navigatePushResult);
  navigateBack.mockReturnValue(navigateBackResult);

  analytics.trackState = jest.fn(() => trackStateResult);

  store = createThunkStore(mockState);
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
    selectStage.updateUserStage = jest.fn(() => () => Promise.resolve());
    navigatePush.mockImplementation((screen, { next }) => () =>
      next()(jest.fn()),
    );

    await component.handleSelectStage(mockStage, false);

    expect(navigateBack).toHaveBeenCalledWith(3);
    expect(selectStage.updateUserStage).toHaveBeenCalledTimes(1);
  });

  it('runs celebrate and finish', () => {
    component.celebrateAndFinish();

    expect(navigatePush).toHaveBeenCalledTimes(1);
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

  it('runs handle navigate for addingContactFlow', async () => {
    component.celebrateAndFinish = jest.fn();

    await component.handleNavigate();

    expect(component.celebrateAndFinish).toHaveBeenCalledTimes(1);
  });

  it('runs handle navigate for onboarding', async () => {
    component = buildScreen(
      {
        onCompleteCelebration: mockComplete,
        ...mockNavState,
      },
      store,
    );

    component.celebrateAndFinishOnboarding = jest.fn();

    await component.handleNavigate();

    expect(showReminderOnLoad).toHaveBeenCalled();
    expect(component.celebrateAndFinishOnboarding).toHaveBeenCalledTimes(1);
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

    expect(navigatePush).toHaveBeenCalledTimes(1);
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

describe('person stage screen methods with next', () => {
  let component;
  const mockNext = jest.fn(() => ({ type: 'next' }));

  beforeEach(() => {
    component = buildScreen(
      {
        ...mockNavState,
        next: mockNext,
      },
      store,
    );
  });

  it('runs select stage with stage not previously selected', async () => {
    selectStage.updateUserStage = jest.fn(() => ({
      type: 'updated user stage',
    }));

    await component.handleSelectStage(mockStage, false);

    expect(selectStage.updateUserStage).toHaveBeenCalledWith(
      mockNavState.contactAssignmentId,
      mockStage.id,
    );
    expect(mockNext).toHaveBeenCalledWith({
      stage: mockStage,
      contactId: mockNavState.contactId,
      name: mockNavState.name,
      orgId: mockNavState.orgId,
      isAlreadySelected: false,
      contactAssignmentId: mockNavState.contactAssignmentId,
    });
  });

  it('runs select stage with stage previously selected', async () => {
    selectStage.updateUserStage = jest.fn(() => ({
      type: 'updated user stage',
    }));

    await component.handleSelectStage(mockStage, true);

    expect(selectStage.updateUserStage).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith({
      stage: mockStage,
      contactId: mockNavState.contactId,
      name: mockNavState.name,
      orgId: mockNavState.orgId,
      isAlreadySelected: true,
      contactAssignmentId: mockNavState.contactAssignmentId,
    });
  });
});

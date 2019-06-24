import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { fireEvent } from 'react-native-testing-library';

import { NOTIFICATION_PROMPT_TYPES } from '../../constants';
import PersonStageScreen from '../PersonStageScreen';
import {
  renderWithContext,
  testSnapshot,
  createMockNavState,
  createThunkStore,
  renderShallow,
} from '../../../testUtils';
import { showReminderOnLoad } from '../../actions/notifications';
import { updateUserStage } from '../../actions/selectStage';
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
jest.mock('../../actions/selectStage');

const mockStage = {
  id: '1',
  name: 'uninterested',
};

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
  stages: { stages: [mockStage] },
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
    updateUserStage.mockImplementation(() => () => Promise.resolve());
    navigatePush.mockImplementation((screen, { next }) => () =>
      next()(jest.fn()),
    );

    await component.handleSelectStage(mockStage, false);

    expect(navigateBack).toHaveBeenCalledWith(3);
    expect(updateUserStage).toHaveBeenCalledTimes(1);
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
    updateUserStage.mockImplementation(() => () => Promise.resolve());

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

    expect(showReminderOnLoad).toHaveBeenCalledWith(
      NOTIFICATION_PROMPT_TYPES.ONBOARDING,
      true,
    );
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
    updateUserStage.mockImplementation(() => () => Promise.resolve());

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
  const next = jest.fn();
  const nextResponse = { type: 'next' };
  const updatedStageResult = { type: 'updated user stage' };

  beforeEach(() => {
    next.mockReturnValue(nextResponse);
    updateUserStage.mockReturnValue(updatedStageResult);
  });

  it('runs select stage with stage not previously selected', async () => {
    const { getByTestId } = renderWithContext(
      <PersonStageScreen next={next} />,
      {
        initialState: mockState,
        navParams: mockNavState,
      },
    );

    await fireEvent.press(getByTestId('StageButton0'), mockStage, false);

    expect(updateUserStage).toHaveBeenCalledWith(
      mockNavState.contactAssignmentId,
      mockStage.id,
    );
    expect(next).toHaveBeenCalledWith({
      stage: mockStage,
      contactId: mockNavState.contactId,
      name: mockNavState.name,
      orgId: mockNavState.orgId,
      isAlreadySelected: false,
      contactAssignmentId: mockNavState.contactAssignmentId,
    });
  });

  it('runs select stage with stage previously selected', async () => {
    const { getByTestId } = renderWithContext(
      <PersonStageScreen next={next} />,
      {
        initialState: mockState,
        navParams: { ...mockNavState, firstItem: 0 },
      },
    );

    await fireEvent.press(getByTestId('StageButton0'), mockStage, true);

    expect(updateUserStage).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith({
      stage: mockStage,
      contactId: mockNavState.contactId,
      name: mockNavState.name,
      orgId: mockNavState.orgId,
      isAlreadySelected: true,
      contactAssignmentId: mockNavState.contactAssignmentId,
    });
  });
});

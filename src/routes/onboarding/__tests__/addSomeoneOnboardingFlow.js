import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  ACTIONS,
  CREATE_STEP,
  NOTIFICATION_PROMPT_TYPES,
} from '../../../constants';
import { renderShallow } from '../../../../testUtils';
import { buildTrackingObj } from '../../../utils/common';
import { ADD_SOMEONE_SCREEN } from '../../../containers/AddSomeoneScreen';
import { SETUP_PERSON_SCREEN } from '../../../containers/SetupScreen';
import { SELECT_STAGE_SCREEN } from '../../../containers/SelectStageScreen';
import { PERSON_SELECT_STEP_SCREEN } from '../../../containers/PersonSelectStepScreen';
import { SUGGESTED_STEP_DETAIL_SCREEN } from '../../../containers/SuggestedStepDetailScreen';
import { ADD_STEP_SCREEN } from '../../../containers/AddStepScreen';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen';
import { AddSomeoneOnboardingFlowScreens } from '../addSomeoneOnboardingFlow';
import { navigatePush, navigateToMainTabs } from '../../../actions/navigation';
import { skipOnboarding } from '../../../actions/onboarding';
import { showReminderOnLoad } from '../../../actions/notifications';
import { trackActionWithoutData } from '../../../actions/analytics';
import { createCustomStep } from '../../../actions/steps';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/onboardingProfile');
jest.mock('../../../actions/notifications');
jest.mock('../../../actions/analytics');
jest.mock('../../../actions/steps');
jest.mock('../../../utils/hooks/useLogoutOnBack', () => ({
  useLogoutOnBack: jest.fn(),
}));

const myId = '123';
const personId = '321';
const personFirstName = 'Someone';
const personLastName = 'Else';
const stageId = '3';
const stage = { id: stageId };
const step = { id: '111' };
const text = 'Step Text';

const store = configureStore([thunk])({
  auth: { person: { id: myId, user: { pathway_stage_id: stageId } } },
  personProfile: { firstName: personFirstName, lastName: personLastName },
  people: {
    allByOrg: {
      personal: {
        people: { [personId]: { id: personId, first_name: personFirstName } },
      },
    },
  },
  stages: { stges: [] },
});

beforeEach(() => {
  store.clearActions();
  navigatePush.mockReturnValue(() => Promise.resolve());
  navigateToMainTabs.mockReturnValue(() => Promise.resolve());
  skipOnboarding.mockReturnValue(() => Promise.resolve());
  showReminderOnLoad.mockReturnValue(() => Promise.resolve());
  trackActionWithoutData.mockReturnValue(() => Promise.resolve());
  createCustomStep.mockReturnValue(() => Promise.resolve());
});

let screen;
let next;

describe('AddSomeoneScreen next', () => {
  beforeEach(() => {
    const Component =
      AddSomeoneOnboardingFlowScreens[ADD_SOMEONE_SCREEN].screen;

    screen = renderShallow(<Component />, store);
    next = screen.instance().props.next;
  });

  it('renders without back button correctly', () => {
    expect(screen).toMatchSnapshot();
  });

  it('should fire required next actions without skip', async () => {
    await store.dispatch(next({ skip: false }));

    expect(navigatePush).toHaveBeenCalledWith(SETUP_PERSON_SCREEN);
  });

  it('should fire required next actions with skip', async () => {
    await store.dispatch(next({ skip: true }));

    expect(skipOnboarding).toHaveBeenCalledWith();
  });
});

describe('SetupPersonScreen next', () => {
  beforeEach(() => {
    const Component =
      AddSomeoneOnboardingFlowScreens[SETUP_PERSON_SCREEN].screen;

    screen = renderShallow(<Component />, store);
    next = screen.instance().props.next;
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });

  it('should fire required next actions without skip', async () => {
    await store.dispatch(next({ skip: false, personId }));

    expect(navigatePush).toHaveBeenCalledWith(SELECT_STAGE_SCREEN, {
      section: 'onboarding',
      subsection: 'add person',
      personId,
    });
  });

  it('should fire required next actions with skip', async () => {
    await store.dispatch(next({ skip: true }));

    expect(skipOnboarding).toHaveBeenCalledWith();
  });
});

describe('SelectStageScreen', () => {
  beforeEach(() => {
    const Component =
      AddSomeoneOnboardingFlowScreens[SELECT_STAGE_SCREEN].screen;

    screen = renderShallow(
      <Component
        navigation={{
          state: {
            params: { section: 'onboarding', subsection: 'add person' },
          },
        }}
      />,
      store,
    );
    next = screen.instance().props.next;
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });

  it('should fire required next actions', async () => {
    await store.dispatch(
      next({
        stage: stage,
        personId,
        firstName: personFirstName,
        isMe: false,
      }),
    );

    expect(navigatePush).toHaveBeenCalledWith(PERSON_SELECT_STEP_SCREEN, {
      contactStage: stage,
      contactName: personFirstName,
      contactId: personId,
    });
  });
});

describe('PersonSelectStepScreen next', () => {
  beforeEach(() => {
    const Component =
      AddSomeoneOnboardingFlowScreens[PERSON_SELECT_STEP_SCREEN].screen;

    screen = renderShallow(
      <Component
        navigation={{
          state: {
            params: {
              contactStage: stage,
              contactName: personFirstName,
              contactId: personId,
            },
          },
        }}
      />,
      store,
    );
    next = screen.instance().props.next;
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });

  it('should fire required next actions for suggested step', async () => {
    await store.dispatch(next({ receiverId: personId, step }));

    expect(navigatePush).toHaveBeenCalledWith(SUGGESTED_STEP_DETAIL_SCREEN, {
      step,
      receiverId: personId,
    });
  });

  it('should fire required next actions for create step', async () => {
    await store.dispatch(next({ receiverId: personId, step: undefined }));

    expect(navigatePush).toHaveBeenCalledWith(ADD_STEP_SCREEN, {
      type: CREATE_STEP,
      personId,
      trackingObj: buildTrackingObj(
        'onboarding : person : steps : create',
        'onboarding',
        'person',
        'steps',
      ),
    });
  });
});

describe('SuggestedStepDetailScreen next', () => {
  beforeEach(() => {
    const Component =
      AddSomeoneOnboardingFlowScreens[SUGGESTED_STEP_DETAIL_SCREEN].screen;

    screen = renderShallow(
      <Component
        navigation={{
          state: {
            params: {
              step,
              receiverId: myId,
            },
          },
        }}
      />,
      store,
    );
    next = screen.instance().props.next;
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });

  it('should fire required next actions for other person', async () => {
    await store.dispatch(next({ contactId: personId }));

    expect(showReminderOnLoad).toHaveBeenCalledWith(
      NOTIFICATION_PROMPT_TYPES.ONBOARDING,
      true,
    );
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.ONBOARDING_COMPLETE,
    );
    expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN);
  });
});

describe('AddStepScreen next', () => {
  beforeEach(() => {
    const Component = AddSomeoneOnboardingFlowScreens[ADD_STEP_SCREEN].screen;

    screen = renderShallow(
      <Component
        navigation={{
          state: {
            params: {
              type: CREATE_STEP,
              personId,
              trackingObj: buildTrackingObj(
                'onboarding : person : steps : create',
                'onboarding',
                'person',
                'steps',
              ),
            },
          },
        }}
      />,
      store,
    );
    next = screen.instance().props.next;
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });

  it('should fire required next actions for other person', async () => {
    await store.dispatch(next({ text, personId }));

    expect(createCustomStep).toHaveBeenCalledWith(text, personId);

    expect(showReminderOnLoad).toHaveBeenCalledWith(
      NOTIFICATION_PROMPT_TYPES.ONBOARDING,
      true,
    );
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.ONBOARDING_COMPLETE,
    );
    expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN);
  });
});

describe('CelebrationScreen next', () => {
  beforeEach(() => {
    const Component =
      AddSomeoneOnboardingFlowScreens[CELEBRATION_SCREEN].screen;

    screen = renderShallow(
      <Component navigation={{ state: { params: {} } }} />,
      store,
    );
    next = screen.instance().props.next;
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });

  it('should fire required next actions', async () => {
    await store.dispatch(next());

    expect(navigateToMainTabs).toHaveBeenCalledWith();
  });
});

import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { CREATE_STEP, ACTIONS } from '../../../constants';
import { renderShallow } from '../../../../testUtils';
import { ADD_SOMEONE_SCREEN } from '../../../containers/AddSomeoneScreen';
import { SETUP_PERSON_SCREEN } from '../../../containers/SetupScreen';
import { SELECT_STAGE_SCREEN } from '../../../containers/SelectStageScreen';
import { PERSON_SELECT_STEP_SCREEN } from '../../../containers/PersonSelectStepScreen';
import { SUGGESTED_STEP_DETAIL_SCREEN } from '../../../containers/SuggestedStepDetailScreen';
import { ADD_STEP_SCREEN } from '../../../containers/AddStepScreen';
import { NOTIFICATION_PRIMER_SCREEN } from '../../../containers/NotificationPrimerScreen';
import { NOTIFICATION_OFF_SCREEN } from '../../../containers/NotificationOffScreen';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen';
import { AddSomeoneOnboardingFlowScreens } from '../addSomeoneOnboardingFlow';
import { navigatePush, navigateToMainTabs } from '../../../actions/navigation';
import {
  skipAddPersonAndCompleteOnboarding,
  resetPersonAndCompleteOnboarding,
  setOnboardingPersonId,
} from '../../../actions/onboarding';
import {
  trackActionWithoutData,
  resetAppContext,
} from '../../../actions/analytics';
import { createCustomStep } from '../../../actions/steps';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/onboarding');
jest.mock('../../../actions/analytics');
jest.mock('../../../actions/steps');
jest.mock('../../../utils/hooks/useLogoutOnBack', () => ({
  useLogoutOnBack: jest.fn(),
}));

const myId = '123';
const personId = '321';
const personFirstName = 'Someone';
const stageId = '3';
const stage = { id: stageId };
const step = { id: '111' };
const text = 'Step Text';

const store = configureStore([thunk])({
  auth: { person: { id: myId, user: { pathway_stage_id: stageId } } },
  onboarding: { personId },
  people: {
    allByOrg: {
      personal: {
        people: { [personId]: { id: personId, first_name: personFirstName } },
      },
    },
  },
  organizations: { all: [] },
  stages: { stages: [] },
});

beforeEach(() => {
  store.clearActions();
  // @ts-ignore
  navigatePush.mockReturnValue(() => Promise.resolve());
  // @ts-ignore
  navigateToMainTabs.mockReturnValue(() => Promise.resolve());
  // @ts-ignore
  skipAddPersonAndCompleteOnboarding.mockReturnValue(() => Promise.resolve());
  // @ts-ignore
  resetPersonAndCompleteOnboarding.mockReturnValue(() => Promise.resolve());
  // @ts-ignore
  resetAppContext.mockReturnValue(() => Promise.resolve());
  // @ts-ignore
  trackActionWithoutData.mockReturnValue(() => Promise.resolve());
  // @ts-ignore
  createCustomStep.mockReturnValue(() => Promise.resolve());
  // @ts-ignore
  setOnboardingPersonId.mockReturnValue(() => Promise.resolve());
});

// @ts-ignore
let screen;
// @ts-ignore
let next;

describe('AddSomeoneScreen next', () => {
  beforeEach(() => {
    const Component = AddSomeoneOnboardingFlowScreens[ADD_SOMEONE_SCREEN];

    screen = renderShallow(<Component />, store);
    // @ts-ignore
    next = screen.instance().props.next;
  });

  it('renders without back button correctly', () => {
    // @ts-ignore
    expect(screen).toMatchSnapshot();
  });

  it('should fire required next actions without skip', async () => {
    // @ts-ignore
    await store.dispatch(next({ skip: false }));

    expect(navigatePush).toHaveBeenCalledWith(SETUP_PERSON_SCREEN);
  });

  it('should fire required next actions with skip', async () => {
    // @ts-ignore
    await store.dispatch(next({ skip: true }));

    expect(skipAddPersonAndCompleteOnboarding).toHaveBeenCalledWith();
  });
});

describe('SetupPersonScreen next', () => {
  beforeEach(() => {
    const Component = AddSomeoneOnboardingFlowScreens[SETUP_PERSON_SCREEN];

    screen = renderShallow(<Component />, store);
    // @ts-ignore
    next = screen.instance().props.next;
  });

  it('renders correctly', () => {
    // @ts-ignore
    expect(screen).toMatchSnapshot();
  });

  it('should fire required next actions without skip', async () => {
    // @ts-ignore
    await store.dispatch(next({ skip: false, personId }));

    expect(navigatePush).toHaveBeenCalledWith(SELECT_STAGE_SCREEN, {
      section: 'onboarding',
      subsection: 'add person',
      personId,
    });
  });

  it('should fire required next actions with skip', async () => {
    // @ts-ignore
    await store.dispatch(next({ skip: true }));

    expect(skipAddPersonAndCompleteOnboarding).toHaveBeenCalledWith();
  });
});

describe('SelectStageScreen', () => {
  beforeEach(() => {
    const Component = AddSomeoneOnboardingFlowScreens[SELECT_STAGE_SCREEN];

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
    // @ts-ignore
    next = screen.instance().props.next;
  });

  it('renders correctly', () => {
    // @ts-ignore
    expect(screen).toMatchSnapshot();
  });

  it('should fire required next actions', async () => {
    await store.dispatch(
      // @ts-ignore
      next({
        isMe: false,
      }),
    );

    expect(navigatePush).toHaveBeenCalledWith(PERSON_SELECT_STEP_SCREEN, {
      personId,
    });
  });
});

describe('PersonSelectStepScreen next', () => {
  beforeEach(() => {
    const Component =
      AddSomeoneOnboardingFlowScreens[PERSON_SELECT_STEP_SCREEN];

    screen = renderShallow(
      <Component
        navigation={{
          state: {
            params: {
              contactStage: stage,
              contactName: personFirstName,
              contactId: personId,
              orgId: '123',
            },
          },
        }}
      />,
      store,
    );
    // @ts-ignore
    next = screen.instance().props.next;
  });

  it('renders correctly', () => {
    // @ts-ignore
    expect(screen).toMatchSnapshot();
  });

  it('should fire required next actions for suggested step', async () => {
    // @ts-ignore
    await store.dispatch(next({ personId, step }));

    expect(navigatePush).toHaveBeenCalledWith(SUGGESTED_STEP_DETAIL_SCREEN, {
      step,
      personId,
    });
  });

  it('should fire required next actions for create step', async () => {
    // @ts-ignore
    await store.dispatch(next({ personId, step: undefined }));

    expect(navigatePush).toHaveBeenCalledWith(ADD_STEP_SCREEN, {
      type: CREATE_STEP,
      personId,
    });
  });
});

describe('SuggestedStepDetailScreen next', () => {
  beforeEach(() => {
    const Component =
      AddSomeoneOnboardingFlowScreens[SUGGESTED_STEP_DETAIL_SCREEN];

    screen = renderShallow(
      <Component
        navigation={{
          state: {
            params: {
              step,
              personId: myId,
              orgId: 'personal',
            },
          },
        }}
      />,
      store,
    );
    // @ts-ignore
    next = screen.instance().props.next;
  });

  it('renders correctly', () => {
    // @ts-ignore
    expect(screen).toMatchSnapshot();
  });

  it('should fire required next actions for other person', async () => {
    // @ts-ignore
    await store.dispatch(next({ contactId: personId }));

    expect(resetPersonAndCompleteOnboarding).toHaveBeenCalledWith();
  });
});

describe('AddStepScreen next', () => {
  beforeEach(() => {
    const Component = AddSomeoneOnboardingFlowScreens[ADD_STEP_SCREEN];

    screen = renderShallow(
      <Component
        navigation={{
          state: {
            params: {
              type: CREATE_STEP,
              personId,
              orgId: 'personal',
            },
          },
        }}
      />,
      store,
    );
    // @ts-ignore
    next = screen.instance().props.next;
  });

  it('renders correctly', () => {
    // @ts-ignore
    expect(screen).toMatchSnapshot();
  });

  it('should fire required next actions for other person', async () => {
    // @ts-ignore
    await store.dispatch(next({ text, personId }));

    expect(createCustomStep).toHaveBeenCalledWith(text, personId);

    expect(resetPersonAndCompleteOnboarding).toHaveBeenCalledWith();
  });
});

describe('NotificationPrimerScreen next', () => {
  it('should fire required next actions', () => {
    const Component =
      AddSomeoneOnboardingFlowScreens[NOTIFICATION_PRIMER_SCREEN];

    store.dispatch(
      renderShallow(<Component navigation={{ state: { params: {} } }} />, store)
        .instance()
        // @ts-ignore
        .props.next(),
    );

    expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, undefined);
  });
});

describe('NotificationOffScreen next', () => {
  it('should fire required next actions', () => {
    const Component = AddSomeoneOnboardingFlowScreens[NOTIFICATION_OFF_SCREEN];

    store.dispatch(
      renderShallow(<Component navigation={{ state: { params: {} } }} />, store)
        .instance()
        // @ts-ignore
        .props.next(),
    );

    expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, undefined);
  });
});

describe('CelebrationScreen next', () => {
  it('should fire required next actions', async () => {
    const Component = AddSomeoneOnboardingFlowScreens[CELEBRATION_SCREEN];

    await store.dispatch(
      renderShallow(<Component navigation={{ state: { params: {} } }} />, store)
        .instance()
        // @ts-ignore
        .props.next(),
    );

    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.ONBOARDING_COMPLETE,
    );
    expect(resetAppContext).toHaveBeenCalledWith();
    expect(navigateToMainTabs).toHaveBeenCalledWith();
  });
});

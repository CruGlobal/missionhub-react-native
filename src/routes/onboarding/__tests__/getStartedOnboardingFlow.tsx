/* eslint max-lines: 0 */
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { CREATE_STEP, ACTIONS } from '../../../constants';
import { renderShallow } from '../../../../testUtils';
import { GET_STARTED_SCREEN } from '../../../containers/GetStartedScreen';
import { STAGE_SUCCESS_SCREEN } from '../../../containers/StageSuccessScreen';
import { ADD_SOMEONE_SCREEN } from '../../../containers/AddSomeoneScreen';
import { SELECT_MY_STEP_SCREEN } from '../../../containers/SelectMyStepScreen';
import { PERSON_SELECT_STEP_SCREEN } from '../../../containers/PersonSelectStepScreen';
import { SUGGESTED_STEP_DETAIL_SCREEN } from '../../../containers/SuggestedStepDetailScreen';
import { ADD_STEP_SCREEN } from '../../../containers/AddStepScreen';
import { NOTIFICATION_PRIMER_SCREEN } from '../../../containers/NotificationPrimerScreen';
import { NOTIFICATION_OFF_SCREEN } from '../../../containers/NotificationOffScreen';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen';
import { SETUP_PERSON_SCREEN } from '../../../containers/SetupScreen';
import { SELECT_STAGE_SCREEN } from '../../../containers/SelectStageScreen';
import { GetStartedOnboardingFlowScreens } from '../getStartedOnboardingFlow';
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

describe('GetStartedScreen', () => {
  beforeEach(() => {
    // @ts-ignore
    const Component = GetStartedOnboardingFlowScreens[GET_STARTED_SCREEN];

    screen = renderShallow(
      <Component navigation={{ state: { params: {} } }} />,
      store,
    );
    // @ts-ignore
    next = screen.instance().props.next;
  });

  it('renders without back button correctly', () => {
    // @ts-ignore
    expect(screen).toMatchSnapshot();
  });

  it('should fire required next actions', async () => {
    // @ts-ignore
    await store.dispatch(next({ id: myId }));

    expect(navigatePush).toHaveBeenCalledWith(SELECT_STAGE_SCREEN, {
      section: 'onboarding',
      subsection: 'self',
      personId: myId,
    });
  });
});

describe('StageSuccessScreen', () => {
  beforeEach(() => {
    // @ts-ignore
    const Component = GetStartedOnboardingFlowScreens[STAGE_SUCCESS_SCREEN];

    screen = renderShallow(
      <Component
        navigation={{ state: { params: { selectedStage: stage } } }}
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
    // @ts-ignore
    await store.dispatch(next({ selectedStage: stage }));

    expect(navigatePush).toHaveBeenCalledWith(SELECT_MY_STEP_SCREEN, {
      selectedStage: stage,
    });
  });
});

describe('SelectMyStepScreen', () => {
  beforeEach(() => {
    // @ts-ignore
    const Component = GetStartedOnboardingFlowScreens[SELECT_MY_STEP_SCREEN];

    screen = renderShallow(
      <Component navigation={{ state: { params: { contactStage: stage } } }} />,
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
    await store.dispatch(next({ personId: myId, step }));

    expect(navigatePush).toHaveBeenCalledWith(SUGGESTED_STEP_DETAIL_SCREEN, {
      step,
      personId: myId,
    });
  });

  it('should fire required next actions for create step', async () => {
    // @ts-ignore
    await store.dispatch(next({ personId: myId, step: undefined }));

    expect(navigatePush).toHaveBeenCalledWith(ADD_STEP_SCREEN, {
      type: CREATE_STEP,
      personId: myId,
    });
  });
});

describe('AddSomeoneScreen next', () => {
  beforeEach(() => {
    const Component = GetStartedOnboardingFlowScreens[ADD_SOMEONE_SCREEN];

    screen = renderShallow(
      <Component navigation={{ state: { params: {} } }} />,
      store,
    );
    // @ts-ignore
    next = screen.instance().props.next;
  });

  it('renders with back button correctly', () => {
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
    const Component = GetStartedOnboardingFlowScreens[SETUP_PERSON_SCREEN];

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
  describe('person is me', () => {
    beforeEach(() => {
      const Component = GetStartedOnboardingFlowScreens[SELECT_STAGE_SCREEN];

      screen = renderShallow(
        <Component
          navigation={{
            state: {
              params: {
                section: 'onboarding',
                subsection: 'self',
                personId: myId,
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

    it('should fire required next actions', async () => {
      // @ts-ignore
      await store.dispatch(next({ stage, isMe: true }));

      expect(navigatePush).toHaveBeenCalledWith(STAGE_SUCCESS_SCREEN);
    });
  });

  describe('person is other', () => {
    beforeEach(() => {
      const Component = GetStartedOnboardingFlowScreens[SELECT_STAGE_SCREEN];

      screen = renderShallow(
        <Component
          navigation={{
            state: {
              params: {
                section: 'onboarding',
                subsection: 'add person',
                personId,
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

    it('should fire required next actions', async () => {
      await store.dispatch(
        // @ts-ignore
        next({
          stage: stage,
          personId,
          firstName: personFirstName,
          isMe: false,
        }),
      );

      expect(navigatePush).toHaveBeenCalledWith(PERSON_SELECT_STEP_SCREEN, {
        personId,
      });
    });
  });
});

describe('PersonSelectStepScreen next', () => {
  beforeEach(() => {
    const Component =
      GetStartedOnboardingFlowScreens[PERSON_SELECT_STEP_SCREEN];

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
      GetStartedOnboardingFlowScreens[SUGGESTED_STEP_DETAIL_SCREEN];

    screen = renderShallow(
      <Component
        navigation={{
          state: {
            params: {
              step,
              personId: myId,
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
    const Component = GetStartedOnboardingFlowScreens[ADD_STEP_SCREEN];

    screen = renderShallow(
      <Component
        navigation={{
          state: {
            params: {
              type: CREATE_STEP,
              personId,
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
      GetStartedOnboardingFlowScreens[NOTIFICATION_PRIMER_SCREEN];

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
    const Component = GetStartedOnboardingFlowScreens[NOTIFICATION_OFF_SCREEN];

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
    const Component = GetStartedOnboardingFlowScreens[CELEBRATION_SCREEN];

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

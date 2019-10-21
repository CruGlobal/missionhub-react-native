/* eslint max-lines: 0 */
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
import { GET_STARTED_SCREEN } from '../../../containers/GetStartedScreen';
import { STAGE_SUCCESS_SCREEN } from '../../../containers/StageSuccessScreen';
import { ADD_SOMEONE_SCREEN } from '../../../containers/AddSomeoneScreen';
import { SELECT_MY_STEP_SCREEN } from '../../../containers/SelectMyStepScreen';
import { SETUP_PERSON_SCREEN } from '../../../containers/SetupPersonScreen';
import { SELECT_STAGE_SCREEN } from '../../../containers/SelectStageScreen';
import { PERSON_SELECT_STEP_SCREEN } from '../../../containers/PersonSelectStepScreen';
import { SUGGESTED_STEP_DETAIL_SCREEN } from '../../../containers/SuggestedStepDetailScreen';
import { ADD_STEP_SCREEN } from '../../../containers/AddStepScreen';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen';
import { GetStartedOnboardingFlowScreens } from '../getStartedOnboardingFlow';
import { navigatePush, navigateToMainTabs } from '../../../actions/navigation';
import { skipOnboarding } from '../../../actions/onboardingProfile';
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
  profile: { id: myId },
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

describe('GetStartedScreen', () => {
  beforeEach(() => {
    const Component =
      GetStartedOnboardingFlowScreens[GET_STARTED_SCREEN].screen;

    screen = renderShallow(
      <Component navigation={{ state: { params: {} } }} />,
      store,
    );
    next = screen.instance().props.next;
  });

  it('renders without back button correctly', () => {
    expect(screen).toMatchSnapshot();
  });

  it('should fire required next actions', async () => {
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
    const Component =
      GetStartedOnboardingFlowScreens[STAGE_SUCCESS_SCREEN].screen;

    screen = renderShallow(
      <Component
        navigation={{ state: { params: { selectedStage: stage } } }}
      />,
      store,
    );
    next = screen.instance().props.next;
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });

  it('should fire required next actions', async () => {
    await store.dispatch(next({ selectedStage: stage }));

    expect(navigatePush).toHaveBeenCalledWith(SELECT_MY_STEP_SCREEN, {
      contactStage: stage,
    });
  });
});

describe('SelectMyStepScreen', () => {
  beforeEach(() => {
    const Component =
      GetStartedOnboardingFlowScreens[SELECT_MY_STEP_SCREEN].screen;

    screen = renderShallow(
      <Component navigation={{ state: { params: { contactStage: stage } } }} />,
      store,
    );
    next = screen.instance().props.next;
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });

  it('should fire required next actions for suggested step', async () => {
    await store.dispatch(next({ receiverId: myId, step }));

    expect(navigatePush).toHaveBeenCalledWith(SUGGESTED_STEP_DETAIL_SCREEN, {
      step,
      receiverId: myId,
    });
  });

  it('should fire required next actions for create step', async () => {
    await store.dispatch(next({ receiverId: myId, step: undefined }));

    expect(navigatePush).toHaveBeenCalledWith(ADD_STEP_SCREEN, {
      type: CREATE_STEP,
      personId: myId,
      trackingObj: buildTrackingObj(
        'onboarding : self : steps : create',
        'onboarding',
        'self',
        'steps',
      ),
    });
  });
});

describe('AddSomeoneScreen next', () => {
  beforeEach(() => {
    const Component =
      GetStartedOnboardingFlowScreens[ADD_SOMEONE_SCREEN].screen;

    screen = renderShallow(
      <Component navigation={{ state: { params: {} } }} />,
      store,
    );
    next = screen.instance().props.next;
  });

  it('renders with back button correctly', () => {
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
      GetStartedOnboardingFlowScreens[SETUP_PERSON_SCREEN].screen;

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
  describe('person is me', () => {
    beforeEach(() => {
      const Component =
        GetStartedOnboardingFlowScreens[SELECT_STAGE_SCREEN].screen;

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
      next = screen.instance().props.next;
    });

    it('renders correctly', () => {
      expect(screen).toMatchSnapshot();
    });

    it('should fire required next actions', async () => {
      await store.dispatch(next({ stage, isMe: true }));

      expect(navigatePush).toHaveBeenCalledWith(STAGE_SUCCESS_SCREEN, {
        selectedStage: stage,
      });
    });
  });

  describe('person is other', () => {
    beforeEach(() => {
      const Component =
        GetStartedOnboardingFlowScreens[SELECT_STAGE_SCREEN].screen;

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
});

describe('PersonSelectStepScreen next', () => {
  beforeEach(() => {
    const Component =
      GetStartedOnboardingFlowScreens[PERSON_SELECT_STEP_SCREEN].screen;

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
      GetStartedOnboardingFlowScreens[SUGGESTED_STEP_DETAIL_SCREEN].screen;

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
    const Component = GetStartedOnboardingFlowScreens[ADD_STEP_SCREEN].screen;

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
      GetStartedOnboardingFlowScreens[CELEBRATION_SCREEN].screen;

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

/* eslint max-lines: 0 */
import React from 'react';

import {
  ACTIONS,
  CREATE_STEP,
  NOTIFICATION_PROMPT_TYPES,
} from '../../../constants';
import { renderWithContext } from '../../../../testUtils';
import { GET_STARTED_SCREEN } from '../../../containers/GetStartedScreen';
import { STAGE_SUCCESS_SCREEN } from '../../../containers/StageSuccessScreen';
import { ADD_SOMEONE_SCREEN } from '../../../containers/AddSomeoneScreen';
import { SELECT_STEP_SCREEN } from '../../../containers/SelectStepScreen';
import { SUGGESTED_STEP_DETAIL_SCREEN } from '../../../containers/SuggestedStepDetailScreen';
import { ADD_STEP_SCREEN } from '../../../containers/AddStepScreen';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen';
import { SETUP_PERSON_SCREEN } from '../../../containers/SetupScreen';
import { SELECT_STAGE_SCREEN } from '../../../containers/SelectStageScreen';
import { GetStartedOnboardingFlowScreens } from '../getStartedOnboardingFlow';
import { navigatePush, navigateToMainTabs } from '../../../actions/navigation';
import {
  skipOnboarding,
  setOnboardingPersonId,
} from '../../../actions/onboarding';
import { showReminderOnLoad } from '../../../actions/notifications';
import { trackActionWithoutData } from '../../../actions/analytics';
import { createCustomStep } from '../../../actions/steps';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/onboarding');
jest.mock('../../../actions/notifications');
jest.mock('../../../actions/analytics');
jest.mock('../../../actions/steps');
jest.mock('../../../utils/hooks/useLogoutOnBack', () => ({
  useLogoutOnBack: jest.fn(),
}));
jest.mock('../../../containers/StepsList');

const myId = '123';
const personId = '321';
const personFirstName = 'Someone';
const stageId = '3';
const step = { id: '111' };
const text = 'Step Text';

const initialState = {
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
};

beforeEach(() => {
  // @ts-ignore
  navigatePush.mockReturnValue(() => Promise.resolve());
  // @ts-ignore
  navigateToMainTabs.mockReturnValue(() => Promise.resolve());
  // @ts-ignore
  skipOnboarding.mockReturnValue(() => Promise.resolve());
  // @ts-ignore
  showReminderOnLoad.mockReturnValue(() => Promise.resolve());
  // @ts-ignore
  trackActionWithoutData.mockReturnValue(() => Promise.resolve());
  // @ts-ignore
  createCustomStep.mockReturnValue(() => Promise.resolve());
  // @ts-ignore
  setOnboardingPersonId.mockReturnValue(() => Promise.resolve());
});

// @ts-ignore
const buildAndCallNext = async (screen, navParams, nextProps) => {
  // @ts-ignore
  const Component = GetStartedOnboardingFlowScreens[screen].screen;

  const { store, getByType } = renderWithContext(<Component />, {
    initialState,
    navParams,
  });

  // @ts-ignore
  await store.dispatch(getByType(Component).children[0].props.next(nextProps));
};

describe('GetStartedScreen', () => {
  it('should fire required next actions', async () => {
    // @ts-ignore
    await buildAndCallNext(GET_STARTED_SCREEN);

    expect(navigatePush).toHaveBeenCalledWith(SELECT_STAGE_SCREEN, {
      section: 'onboarding',
      subsection: 'self',
      personId: myId,
    });
  });
});

describe('StageSuccessScreen', () => {
  it('should fire required next actions', async () => {
    // @ts-ignore
    await buildAndCallNext(STAGE_SUCCESS_SCREEN);

    expect(navigatePush).toHaveBeenCalledWith(SELECT_STEP_SCREEN, {
      personId: myId,
    });
  });
});

describe('SelectStepScreen', () => {
  it('should fire required next actions for suggested step', async () => {
    await buildAndCallNext(
      SELECT_STEP_SCREEN,
      { personId: myId },
      { personId: myId, step },
    );

    expect(navigatePush).toHaveBeenCalledWith(SUGGESTED_STEP_DETAIL_SCREEN, {
      step,
      personId: myId,
    });
  });

  it('should fire required next actions for create step', async () => {
    await buildAndCallNext(
      SELECT_STEP_SCREEN,
      { personId: myId },
      { personId: myId, step: undefined },
    );

    expect(navigatePush).toHaveBeenCalledWith(ADD_STEP_SCREEN, {
      type: CREATE_STEP,
      personId: myId,
    });
  });
});

describe('AddSomeoneScreen next', () => {
  it('should fire required next actions without skip', async () => {
    await buildAndCallNext(ADD_SOMEONE_SCREEN, undefined, { skip: false });

    expect(navigatePush).toHaveBeenCalledWith(SETUP_PERSON_SCREEN);
  });

  it('should fire required next actions with skip', async () => {
    await buildAndCallNext(ADD_SOMEONE_SCREEN, undefined, { skip: true });

    expect(skipOnboarding).toHaveBeenCalledWith();
  });
});

describe('SetupPersonScreen next', () => {
  it('should fire required next actions without skip', async () => {
    await buildAndCallNext(SETUP_PERSON_SCREEN, undefined, {
      skip: false,
      personId,
    });

    expect(navigatePush).toHaveBeenCalledWith(SELECT_STAGE_SCREEN, {
      section: 'onboarding',
      subsection: 'add person',
      personId,
    });
  });

  it('should fire required next actions with skip', async () => {
    await buildAndCallNext(SETUP_PERSON_SCREEN, undefined, {
      skip: true,
    });

    expect(skipOnboarding).toHaveBeenCalledWith();
  });
});

describe('SelectStageScreen', () => {
  describe('person is me', () => {
    it('should fire required next actions', async () => {
      await buildAndCallNext(
        SELECT_STAGE_SCREEN,
        {
          section: 'onboarding',
          subsection: 'self',
          personId: myId,
        },
        { isMe: true },
      );

      expect(navigatePush).toHaveBeenCalledWith(STAGE_SUCCESS_SCREEN);
    });
  });

  describe('person is other', () => {
    it('should fire required next actions', async () => {
      await buildAndCallNext(
        SELECT_STAGE_SCREEN,
        {
          section: 'onboarding',
          subsection: 'add person',
          personId,
        },
        {
          isMe: false,
        },
      );

      expect(navigatePush).toHaveBeenCalledWith(SELECT_STEP_SCREEN, {
        personId,
      });
    });
  });
});

describe('SuggestedStepDetailScreen next', () => {
  it('should fire required next actions for me', async () => {
    await buildAndCallNext(
      SUGGESTED_STEP_DETAIL_SCREEN,
      {
        step,
        personId: myId,
      },
      {
        personId: myId,
      },
    );

    expect(navigatePush).toHaveBeenCalledWith(ADD_SOMEONE_SCREEN);
  });
  it('should fire required next actions for other person', async () => {
    await buildAndCallNext(
      SUGGESTED_STEP_DETAIL_SCREEN,
      {
        step,
        personId,
      },
      {
        personId,
      },
    );

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
  it('should fire required next actions for me', async () => {
    await buildAndCallNext(
      ADD_STEP_SCREEN,
      {
        personId: myId,
      },
      {
        personId: myId,
        text,
      },
    );

    expect(navigatePush).toHaveBeenCalledWith(ADD_SOMEONE_SCREEN);
  });
  it('should fire required next actions for other person', async () => {
    await buildAndCallNext(
      ADD_STEP_SCREEN,
      {
        personId,
      },
      {
        personId,
        text,
      },
    );

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
  it('should fire required next actions', async () => {
    // @ts-ignore
    await buildAndCallNext(CELEBRATION_SCREEN);

    expect(navigateToMainTabs).toHaveBeenCalledWith();
  });
});

/* eslint max-lines: 0 */
import React from 'react';

import { CREATE_STEP } from '../../../constants';
import { renderWithContext } from '../../../../testUtils';
import { WELCOME_SCREEN } from '../../../containers/WelcomeScreen';
import { SETUP_SCREEN } from '../../../containers/SetupScreen';
import { GET_STARTED_SCREEN } from '../../../containers/GetStartedScreen';
import { SELECT_STAGE_SCREEN } from '../../../containers/SelectStageScreen';
import { STAGE_SUCCESS_SCREEN } from '../../../containers/StageSuccessScreen';
import { SELECT_STEP_SCREEN } from '../../../containers/SelectStepScreen';
import { ADD_SOMEONE_SCREEN } from '../../../containers/AddSomeoneScreen';
import { SETUP_PERSON_SCREEN } from '../../../containers/SetupScreen';
import { SUGGESTED_STEP_DETAIL_SCREEN } from '../../../containers/SuggestedStepDetailScreen';
import { ADD_STEP_SCREEN } from '../../../containers/AddStepScreen';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen';
import { onboardingFlowGenerator } from '../onboardingFlowGenerator';
import { navigatePush, navigateToMainTabs } from '../../../actions/navigation';
import {
  skipAddPersonAndCompleteOnboarding,
  resetPersonAndCompleteOnboarding,
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
jest.mock('../../../utils/hooks/useAnalytics');
jest.mock('../../../containers/StepsList');

const myId = '123';
const personId = '321';
const personFirstName = 'Someone';
const stageId = '3';
const step = { id: '111' };
const text = 'Step Text';

const initialState = {
  auth: { person: { id: myId, user: { pathway_stage_id: stageId } } },
  people: {
    allByOrg: {
      personal: {
        people: { [personId]: { id: personId, first_name: personFirstName } },
      },
    },
  },
  organizations: { all: [] },
  stages: { stages: [] },
  onboarding: { personId },
  drawer: { isOpen: false },
};

const testFlow = onboardingFlowGenerator({});

beforeEach(() => {
  // @ts-ignore
  navigatePush.mockReturnValue(() => Promise.resolve());
  // @ts-ignore
  navigateToMainTabs.mockReturnValue(() => Promise.resolve());
  // @ts-ignore
  skipAddPersonAndCompleteOnboarding.mockReturnValue(() => Promise.resolve());
  // @ts-ignore
  resetPersonAndCompleteOnboarding.mockReturnValue(() => Promise.resolve());
  // @ts-ignore
  showReminderOnLoad.mockReturnValue(() => Promise.resolve());
  // @ts-ignore
  trackActionWithoutData.mockReturnValue(() => Promise.resolve());
  // @ts-ignore
  createCustomStep.mockReturnValue(() => Promise.resolve());
  // @ts-ignore
  setOnboardingPersonId.mockReturnValue(() => Promise.resolve());
});

const buildAndCallNext = async (
  // @ts-ignore
  screen,
  // @ts-ignore
  navParams,
  // @ts-ignore
  nextProps,
  flow = testFlow,
  // eslint-disable-next-line max-params
) => {
  // @ts-ignore
  const Component = flow[screen];

  const { store, getByType } = renderWithContext(<Component />, {
    initialState,
    navParams,
  });

  // @ts-ignore
  await store.dispatch(getByType(Component).children[0].props.next(nextProps));
};

describe('WelcomeScreen next', () => {
  it('should fire required next actions', async () => {
    // @ts-ignore
    await buildAndCallNext(WELCOME_SCREEN);

    expect(navigatePush).toHaveBeenCalledWith(SETUP_SCREEN, undefined);
  });
});

describe('SetupScreen next', () => {
  it('should fire required next actions', async () => {
    // @ts-ignore
    await buildAndCallNext(SETUP_SCREEN);

    expect(navigatePush).toHaveBeenCalledWith(GET_STARTED_SCREEN, undefined);
  });
});

describe('GetStartedScreen next', () => {
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

describe('SelectStageScreen next', () => {
  describe('person is me', () => {
    it('should fire required next actions', async () => {
      await buildAndCallNext(
        SELECT_STAGE_SCREEN,
        { personId: myId },
        { isMe: true },
      );

      expect(navigatePush).toHaveBeenCalledWith(STAGE_SUCCESS_SCREEN);
    });
  });

  describe('person is other', () => {
    it('should fire required next actions', async () => {
      await buildAndCallNext(
        SELECT_STAGE_SCREEN,
        { personId },
        { isMe: false },
      );

      expect(navigatePush).toHaveBeenCalledWith(SELECT_STEP_SCREEN, {
        personId,
      });
    });
  });
});

describe('StageSuccessScreen next', () => {
  it('should fire required next actions', async () => {
    // @ts-ignore
    await buildAndCallNext(STAGE_SUCCESS_SCREEN);

    expect(navigatePush).toHaveBeenCalledWith(SELECT_STEP_SCREEN, {
      personId: myId,
    });
  });
});

describe('SelectStepScreen next', () => {
  it('should fire required next actions for suggested step', async () => {
    await buildAndCallNext(
      SELECT_STEP_SCREEN,
      { personId },
      {
        personId: myId,
        step,
      },
    );

    expect(navigatePush).toHaveBeenCalledWith(SUGGESTED_STEP_DETAIL_SCREEN, {
      step,
      personId: myId,
    });
  });

  it('should fire required next actions for create step', async () => {
    await buildAndCallNext(
      SELECT_STEP_SCREEN,
      { personId },
      {
        personId: myId,
        undefined,
      },
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

    expect(skipAddPersonAndCompleteOnboarding).toHaveBeenCalledWith();
  });
});

describe('AddSomeoneScreen with extra props', () => {
  const testExtraPropsFlow = onboardingFlowGenerator({
    startScreen: ADD_SOMEONE_SCREEN,
    hideSkipBtn: true,
  });

  it('should fire required next actions without skip and extra props', async () => {
    await buildAndCallNext(
      ADD_SOMEONE_SCREEN,
      undefined,
      { skip: false },
      testExtraPropsFlow,
    );

    expect(navigatePush).toHaveBeenCalledWith(SETUP_PERSON_SCREEN);
  });

  it('should fire required next actions with skip', async () => {
    await buildAndCallNext(
      ADD_SOMEONE_SCREEN,
      undefined,
      { skip: true },
      testExtraPropsFlow,
    );

    expect(skipAddPersonAndCompleteOnboarding).toHaveBeenCalledWith();
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

    expect(skipAddPersonAndCompleteOnboarding).toHaveBeenCalledWith();
  });
});

describe('PersonSelectStepScreen next', () => {
  it('should fire required next actions for suggested step', async () => {
    await buildAndCallNext(
      SELECT_STEP_SCREEN,
      {
        personId,
      },
      { personId, step },
    );

    expect(navigatePush).toHaveBeenCalledWith(SUGGESTED_STEP_DETAIL_SCREEN, {
      step,
      personId,
    });
  });

  it('should fire required next actions for create step', async () => {
    await buildAndCallNext(
      SELECT_STEP_SCREEN,
      {
        personId,
      },
      { personId, step: undefined },
    );

    expect(navigatePush).toHaveBeenCalledWith(ADD_STEP_SCREEN, {
      type: CREATE_STEP,
      personId,
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
      { personId: myId },
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
      { personId },
    );

    expect(resetPersonAndCompleteOnboarding).toHaveBeenCalledWith();
  });
});

describe('AddStepScreen next', () => {
  it('should fire required next actions for me', async () => {
    await buildAndCallNext(
      ADD_STEP_SCREEN,
      {
        type: CREATE_STEP,
        personId: myId,
      },
      { text, personId: myId },
    );

    expect(createCustomStep).toHaveBeenCalledWith(text, myId);

    expect(navigatePush).toHaveBeenCalledWith(ADD_SOMEONE_SCREEN);
  });

  it('should fire required next actions for other person', async () => {
    await buildAndCallNext(
      ADD_STEP_SCREEN,
      {
        type: CREATE_STEP,
        personId,
      },
      { text, personId },
    );

    expect(createCustomStep).toHaveBeenCalledWith(text, personId);

    expect(resetPersonAndCompleteOnboarding).toHaveBeenCalledWith();
  });
});

describe('CelebrationScreen next', () => {
  it('should fire required next actions', async () => {
    // @ts-ignore
    await buildAndCallNext(CELEBRATION_SCREEN);

    expect(navigateToMainTabs).toHaveBeenCalledWith();
  });
});

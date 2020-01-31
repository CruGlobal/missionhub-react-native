/* eslint max-lines: 0 */
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { CREATE_STEP } from '../../../constants';
import { renderShallow } from '../../../../testUtils';
import { buildTrackingObj } from '../../../utils/common';
import { WELCOME_SCREEN } from '../../../containers/WelcomeScreen';
import { SETUP_SCREEN } from '../../../containers/SetupScreen';
import { GET_STARTED_SCREEN } from '../../../containers/GetStartedScreen';
import { SELECT_STAGE_SCREEN } from '../../../containers/SelectStageScreen';
import { STAGE_SUCCESS_SCREEN } from '../../../containers/StageSuccessScreen';
import { SELECT_MY_STEP_SCREEN } from '../../../containers/SelectMyStepScreen';
import { ADD_SOMEONE_SCREEN } from '../../../containers/AddSomeoneScreen';
import { SETUP_PERSON_SCREEN } from '../../../containers/SetupScreen';
import { PERSON_SELECT_STEP_SCREEN } from '../../../containers/PersonSelectStepScreen';
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

const myId = '123';
const personId = '321';
const personFirstName = 'Someone';
const stageId = '3';
const stage = { id: stageId };
const step = { id: '111' };
const text = 'Step Text';

const store = configureStore([thunk])({
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
});

const testFlow = onboardingFlowGenerator({});

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
  showReminderOnLoad.mockReturnValue(() => Promise.resolve());
  // @ts-ignore
  trackActionWithoutData.mockReturnValue(() => Promise.resolve());
  // @ts-ignore
  createCustomStep.mockReturnValue(() => Promise.resolve());
  // @ts-ignore
  setOnboardingPersonId.mockReturnValue(() => Promise.resolve());
});

describe('WelcomeScreen next', () => {
  it('should fire required next actions', async () => {
    // @ts-ignore
    const Component = testFlow[WELCOME_SCREEN];

    await store.dispatch(
      renderShallow(<Component />, store)
        .instance()
        // @ts-ignore
        .props.next(),
    );

    expect(navigatePush).toHaveBeenCalledWith(SETUP_SCREEN, undefined);
  });
});

describe('SetupScreen next', () => {
  it('should fire required next actions', async () => {
    // @ts-ignore
    const Component = testFlow[SETUP_SCREEN];

    await store.dispatch(
      renderShallow(<Component />, store)
        .instance()
        // @ts-ignore
        .props.next(),
    );

    expect(navigatePush).toHaveBeenCalledWith(GET_STARTED_SCREEN, undefined);
  });
});

describe('GetStartedScreen next', () => {
  it('should fire required next actions', async () => {
    // @ts-ignore
    const Component = testFlow[GET_STARTED_SCREEN];

    await store.dispatch(
      renderShallow(
        <Component
          navigation={{
            state: {
              params: {},
            },
          }}
        />,
        store,
      )
        .instance()
        // @ts-ignore
        .props.next({ id: myId }),
    );

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
      const Component = testFlow[SELECT_STAGE_SCREEN];

      await store.dispatch(
        renderShallow(
          <Component
            navigation={{
              state: {
                params: {
                  section: 'onboarding',
                  subsection: 'self',
                  enableBackButton: false,
                },
              },
            }}
          />,
          store,
        )
          .instance()
          // @ts-ignore
          .props.next({ stage, isMe: true }),
      );

      expect(navigatePush).toHaveBeenCalledWith(STAGE_SUCCESS_SCREEN);
    });
  });

  describe('person is other', () => {
    it('should fire required next actions', async () => {
      const Component = testFlow[SELECT_STAGE_SCREEN];

      await store.dispatch(
        renderShallow(
          <Component
            navigation={{
              state: {
                params: { section: 'onboarding', subsection: 'add person' },
              },
            }}
          />,
          store,
        )
          .instance()
          // @ts-ignore
          .props.next({
            isMe: false,
          }),
      );

      expect(navigatePush).toHaveBeenCalledWith(PERSON_SELECT_STEP_SCREEN, {
        personId,
      });
    });
  });
});

describe('StageSuccessScreen next', () => {
  it('should fire required next actions', async () => {
    // @ts-ignore
    const Component = testFlow[STAGE_SUCCESS_SCREEN];

    await store.dispatch(
      renderShallow(
        <Component
          navigation={{ state: { params: { selectedStage: stage } } }}
        />,
        store,
      )
        .instance()
        // @ts-ignore
        .props.next(),
    );

    expect(navigatePush).toHaveBeenCalledWith(SELECT_MY_STEP_SCREEN, undefined);
  });
});

describe('SelectMyStepScreen next', () => {
  // @ts-ignore
  let next;

  beforeEach(() => {
    // @ts-ignore
    const Component = testFlow[SELECT_MY_STEP_SCREEN];

    next = renderShallow(
      <Component
        navigation={{ state: { params: { selectedStage: stage } } }}
      />,
      store,
      // @ts-ignore
    ).instance().props.next;
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
  // @ts-ignore
  let next;

  beforeEach(() => {
    const Component = testFlow[ADD_SOMEONE_SCREEN];

    // @ts-ignore
    next = renderShallow(<Component />, store).instance().props.next;
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

describe('AddSomeoneScreen with extra props', () => {
  // @ts-ignore
  let next;
  // @ts-ignore
  let component;
  const testExtraPropsFlow = onboardingFlowGenerator({
    startScreen: ADD_SOMEONE_SCREEN,
    hideSkipBtn: true,
  });

  beforeEach(() => {
    const Component = testExtraPropsFlow[ADD_SOMEONE_SCREEN];

    component = renderShallow(<Component />, store);
    // @ts-ignore
    next = component.instance().props.next;
  });

  it('should have hideSkipBtn prop set to true', () => {
    // @ts-ignore
    expect(component.instance().props.hideSkipBtn).toEqual(true);
  });

  it('setup person screen should have hideSkipBtn prop set to true', () => {
    const Component = testExtraPropsFlow[SETUP_PERSON_SCREEN];
    const setupPersonComponent = renderShallow(<Component />, store);
    // @ts-ignore
    expect(setupPersonComponent.instance().props.hideSkipBtn).toEqual(true);
  });

  it('should fire required next actions without skip and extra props', async () => {
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
  // @ts-ignore
  let next;

  beforeEach(() => {
    const Component = testFlow[SETUP_PERSON_SCREEN];

    // @ts-ignore
    next = renderShallow(<Component />, store).instance().props.next;
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

describe('PersonSelectStepScreen next', () => {
  // @ts-ignore
  let next;

  beforeEach(() => {
    const Component = testFlow[PERSON_SELECT_STEP_SCREEN];

    next = renderShallow(
      <Component
        navigation={{
          state: {
            params: {
              personId,
            },
          },
        }}
      />,
      store,
      // @ts-ignore
    ).instance().props.next;
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
  it('should fire required next actions for me', async () => {
    const Component = testFlow[SUGGESTED_STEP_DETAIL_SCREEN];

    await store.dispatch(
      renderShallow(
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
      )
        .instance()
        // @ts-ignore
        .props.next({ personId: myId }),
    );

    expect(navigatePush).toHaveBeenCalledWith(ADD_SOMEONE_SCREEN);
  });

  it('should fire required next actions for other person', async () => {
    const Component = testFlow[SUGGESTED_STEP_DETAIL_SCREEN];

    await store.dispatch(
      renderShallow(
        <Component
          navigation={{
            state: {
              params: {
                step,
                personId,
              },
            },
          }}
        />,
        store,
      )
        .instance()
        // @ts-ignore
        .props.next({ personId }),
    );

    expect(resetPersonAndCompleteOnboarding).toHaveBeenCalledWith();
  });
});

describe('AddStepScreen next', () => {
  it('should fire required next actions for me', async () => {
    const Component = testFlow[ADD_STEP_SCREEN];

    await store.dispatch(
      renderShallow(
        <Component
          navigation={{
            state: {
              params: {
                type: CREATE_STEP,
                personId: myId,
                // @ts-ignore
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
      )
        .instance()
        // @ts-ignore
        .props.next({ text, personId: myId }),
    );

    expect(createCustomStep).toHaveBeenCalledWith(text, myId);

    expect(navigatePush).toHaveBeenCalledWith(ADD_SOMEONE_SCREEN);
  });

  it('should fire required next actions for other person', async () => {
    const Component = testFlow[ADD_STEP_SCREEN];

    await store.dispatch(
      renderShallow(
        <Component
          navigation={{
            state: {
              params: {
                type: CREATE_STEP,
                personId,
                // @ts-ignore
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
      )
        .instance()
        // @ts-ignore
        .props.next({ text, personId }),
    );

    expect(createCustomStep).toHaveBeenCalledWith(text, personId);

    expect(resetPersonAndCompleteOnboarding).toHaveBeenCalledWith();
  });
});

describe('CelebrationScreen next', () => {
  it('should fire required next actions', async () => {
    const Component = testFlow[CELEBRATION_SCREEN];

    await store.dispatch(
      renderShallow(<Component navigation={{ state: { params: {} } }} />, store)
        .instance()
        // @ts-ignore
        .props.next(),
    );

    expect(navigateToMainTabs).toHaveBeenCalledWith();
  });
});
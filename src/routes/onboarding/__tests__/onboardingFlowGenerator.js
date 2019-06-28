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
import { WELCOME_SCREEN } from '../../../containers/WelcomeScreen';
import { SETUP_SCREEN } from '../../../containers/SetupScreen';
import { GET_STARTED_SCREEN } from '../../../containers/GetStartedScreen';
import { STAGE_SCREEN } from '../../../containers/StageScreen';
import { STAGE_SUCCESS_SCREEN } from '../../../containers/StageSuccessScreen';
import { SELECT_MY_STEP_SCREEN } from '../../../containers/SelectMyStepScreen';
import { ADD_SOMEONE_SCREEN } from '../../../containers/AddSomeoneScreen';
import { SETUP_PERSON_SCREEN } from '../../../containers/SetupPersonScreen';
import { PERSON_STAGE_SCREEN } from '../../../containers/PersonStageScreen';
import { PERSON_SELECT_STEP_SCREEN } from '../../../containers/PersonSelectStepScreen';
import { SUGGESTED_STEP_DETAIL_SCREEN } from '../../../containers/SuggestedStepDetailScreen';
import { ADD_STEP_SCREEN } from '../../../containers/AddStepScreen';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen';
import { onboardingFlowGenerator } from '../onboardingFlowGenerator';
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

const myId = '123';
const myFirstName = 'Me';
const myLastName = 'Myself';
const personId = '321';
const personFirstName = 'Someone';
const personLastName = 'Else';
const stageId = '3';
const stage = { id: stageId };
const step = { id: '111' };
const text = 'Step Text';

const store = configureStore([thunk])({
  auth: { person: { id: myId, user: { pathway_stage_id: stageId } } },
  profile: { firstName: myFirstName, lastName: myLastName },
  personProfile: { firstName: personFirstName, lastName: personLastName },
});

const testFlow = onboardingFlowGenerator({});

beforeEach(() => {
  store.clearActions();
  navigatePush.mockReturnValue(() => Promise.resolve());
  navigateToMainTabs.mockReturnValue(() => Promise.resolve());
  skipOnboarding.mockReturnValue(() => Promise.resolve());
  showReminderOnLoad.mockReturnValue(() => Promise.resolve());
  trackActionWithoutData.mockReturnValue(() => Promise.resolve());
  createCustomStep.mockReturnValue(() => Promise.resolve());
});

describe('WelcomeScreen next', () => {
  it('should fire required next actions', async () => {
    const Component = testFlow[WELCOME_SCREEN].screen;

    await store.dispatch(
      renderShallow(<Component />, store)
        .instance()
        .props.next(),
    );

    expect(navigatePush).toHaveBeenCalledWith(SETUP_SCREEN, undefined);
  });
});

describe('SetupScreen next', () => {
  it('should fire required next actions', async () => {
    const Component = testFlow[SETUP_SCREEN].screen;

    await store.dispatch(
      renderShallow(<Component />, store)
        .instance()
        .props.next(),
    );

    expect(navigatePush).toHaveBeenCalledWith(GET_STARTED_SCREEN, undefined);
  });
});

describe('GetStartedScreen next', () => {
  it('should fire required next actions', async () => {
    const Component = testFlow[GET_STARTED_SCREEN].screen;

    await store.dispatch(
      renderShallow(<Component />, store)
        .instance()
        .props.next(),
    );

    expect(navigatePush).toHaveBeenCalledWith(STAGE_SCREEN, {
      section: 'onboarding',
      subsection: 'self',
      enableBackButton: false,
    });
  });
});

describe('StageScreen next', () => {
  it('should fire required next actions', async () => {
    const Component = testFlow[STAGE_SCREEN].screen;

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
        .props.next({ stage }),
    );

    expect(navigatePush).toHaveBeenCalledWith(STAGE_SUCCESS_SCREEN, {
      selectedStage: stage,
    });
  });
});

describe('StageSuccessScreen next', () => {
  it('should fire required next actions', async () => {
    const Component = testFlow[STAGE_SUCCESS_SCREEN].screen;

    await store.dispatch(
      renderShallow(
        <Component
          navigation={{ state: { params: { selectedStage: stage } } }}
        />,
        store,
      )
        .instance()
        .props.next({ selectedStage: stage }),
    );

    expect(navigatePush).toHaveBeenCalledWith(SELECT_MY_STEP_SCREEN, {
      contactStage: stage,
      enableBackButton: false,
    });
  });
});

describe('SelectMyStepScreen next', () => {
  let next;

  beforeEach(() => {
    const Component = testFlow[SELECT_MY_STEP_SCREEN].screen;

    next = renderShallow(
      <Component
        navigation={{ state: { params: { selectedStage: stage } } }}
      />,
      store,
    ).instance().props.next;
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
  let next;

  beforeEach(() => {
    const Component = testFlow[ADD_SOMEONE_SCREEN].screen;

    next = renderShallow(<Component />, store).instance().props.next;
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
  let next;

  beforeEach(() => {
    const Component = testFlow[SETUP_PERSON_SCREEN].screen;

    next = renderShallow(<Component />, store).instance().props.next;
  });

  it('should fire required next actions without skip', async () => {
    await store.dispatch(next({ skip: false }));

    expect(navigatePush).toHaveBeenCalledWith(PERSON_STAGE_SCREEN, {
      section: 'onboarding',
      subsection: 'add person',
    });
  });

  it('should fire required next actions with skip', async () => {
    await store.dispatch(next({ skip: true }));

    expect(skipOnboarding).toHaveBeenCalledWith();
  });
});

describe('PersonStageScreen next', () => {
  it('should fire required next actions', async () => {
    const Component = testFlow[PERSON_STAGE_SCREEN].screen;

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
        .props.next({
          stage: stage,
          contactId: personId,
          name: personFirstName,
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
  let next;

  beforeEach(() => {
    const Component = testFlow[PERSON_SELECT_STEP_SCREEN].screen;

    next = renderShallow(
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
    ).instance().props.next;
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
  it('should fire required next actions for me', async () => {
    const Component = testFlow[SUGGESTED_STEP_DETAIL_SCREEN].screen;

    await store.dispatch(
      renderShallow(
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
      )
        .instance()
        .props.next({ contactId: myId }),
    );

    expect(navigatePush).toHaveBeenCalledWith(ADD_SOMEONE_SCREEN);
  });

  it('should fire required next actions for other person', async () => {
    const Component = testFlow[SUGGESTED_STEP_DETAIL_SCREEN].screen;

    await store.dispatch(
      renderShallow(
        <Component
          navigation={{
            state: {
              params: {
                step,
                receiverId: personId,
              },
            },
          }}
        />,
        store,
      )
        .instance()
        .props.next({ contactId: personId }),
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
    const Component = testFlow[ADD_STEP_SCREEN].screen;

    await store.dispatch(
      renderShallow(
        <Component
          navigation={{
            state: {
              params: {
                type: CREATE_STEP,
                personId: myId,
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
        .props.next({ text, personId: myId }),
    );

    expect(createCustomStep).toHaveBeenCalledWith(text, myId);

    expect(navigatePush).toHaveBeenCalledWith(ADD_SOMEONE_SCREEN);
  });

  it('should fire required next actions for other person', async () => {
    const Component = testFlow[ADD_STEP_SCREEN].screen;

    await store.dispatch(
      renderShallow(
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
      )
        .instance()
        .props.next({ text, personId }),
    );

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
  it('should fire required next actions', async () => {
    const Component = testFlow[CELEBRATION_SCREEN].screen;

    await store.dispatch(
      renderShallow(<Component navigation={{ state: { params: {} } }} />, store)
        .instance()
        .props.next(),
    );

    expect(navigateToMainTabs).toHaveBeenCalledWith();
  });
});

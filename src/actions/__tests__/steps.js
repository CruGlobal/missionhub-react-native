/* eslint max-lines: 0 */

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18next from 'i18next';

import callApi, { REQUESTS } from '../api';
import {
  completeStep,
  getStepSuggestions,
  getMyStepsNextPage,
  getContactSteps,
  setStepFocus,
  addStep,
  createCustomStep,
  deleteStepWithTracking,
} from '../steps';
import { reloadGroupCelebrateFeed } from '../celebration';
import { refreshImpact } from '../impact';
import { trackStepAdded, trackAction } from '../analytics';
import * as navigation from '../navigation';
import * as common from '../../utils/common';
import { buildTrackingObj } from '../../utils/common';
import { buildCustomStep } from '../../utils/steps';
import {
  ACTIONS,
  COMPLETED_STEP_COUNT,
  NAVIGATE_FORWARD,
  STEP_NOTE,
  TOGGLE_STEP_FOCUS,
  CUSTOM_STEP_TYPE,
  ACCEPTED_STEP,
} from '../../constants';
import { COMPLETE_STEP_FLOW } from '../../routes/constants';

const mockStore = configureStore([thunk]);
let store;

const personId = '2123';
const receiverId = '983547';
const orgId = '123';
const mockDate = '2018-02-14 11:30:00 UTC';
common.formatApiDate = jest.fn().mockReturnValue(mockDate);

jest.mock('../api');
jest.mock('../impact');
jest.mock('../celebration');
jest.mock('../analytics');

beforeEach(() => {
  store = mockStore();
});

describe('get step suggestions', () => {
  const locale = 'de';
  const stepSuggestionsQuery = { filters: { locale: locale } };
  const apiResult = { type: 'done' };

  it('should filter by language', () => {
    i18next.language = locale;
    callApi.mockReturnValue(apiResult);

    store.dispatch(getStepSuggestions());

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_CHALLENGE_SUGGESTIONS,
      stepSuggestionsQuery,
    );
    expect(store.getActions()).toEqual([apiResult]);
  });
});

describe('get steps page', () => {
  const stepsPageQuery = {
    order: '-focused_at,-accepted_at',
    page: { limit: 25, offset: 25 },
    filters: { completed: false },
    include:
      'receiver.reverse_contact_assignments,receiver.organizational_permissions,challenge_suggestion',
  };
  const apiResult = { type: 'done' };

  it('should filter with page', () => {
    store = mockStore({
      steps: { pagination: { page: 1, hasNextPage: true } },
    });
    callApi.mockReturnValue(apiResult);

    store.dispatch(getMyStepsNextPage());

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_MY_CHALLENGES,
      stepsPageQuery,
    );
    expect(store.getActions()[0]).toEqual(apiResult);
  });

  it('should not filter, no more pages', async () => {
    store = mockStore({
      steps: { pagination: { page: 1, hasNextPage: false } },
    });
    callApi.mockReturnValue(apiResult);

    const result = await store.dispatch(getMyStepsNextPage());

    expect(result).toEqual(undefined);
  });
});

describe('getContactSteps', () => {
  it('should get filtered steps for a person', () => {
    const apiResult = { type: 'done' };

    callApi.mockReturnValue(apiResult);

    store.dispatch(getContactSteps(personId, orgId));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_CHALLENGES_BY_FILTER, {
      filters: {
        receiver_ids: personId,
        organization_ids: orgId,
      },
      page: { limit: 1000 },
      include: 'receiver,challenge_suggestion,reminder',
    });
    expect(store.getActions()).toEqual([apiResult]);
  });
});

describe('addStep', () => {
  const stepSuggestion = {
    id: '100',
    body: 'System generated step',
  };
  const customStepSuggestion = {
    id: 'f53836fd-c6e3-4c69-bcd3-362928c5c924',
    body: 'Hello world',
    challenge_type: CUSTOM_STEP_TYPE,
  };

  const stepAddedResult = { type: 'added steps tracked' };

  beforeEach(() => {
    callApi.mockReturnValue(() => Promise.resolve());
    trackStepAdded.mockReturnValue(stepAddedResult);
  });

  it('creates step without org', async () => {
    await store.dispatch(addStep(stepSuggestion, receiverId));

    expect(callApi).toMatchSnapshot();
    expect(store.getActions()).toEqual([stepAddedResult]);
  });

  it('creates step with org', async () => {
    await store.dispatch(addStep(stepSuggestion, receiverId, orgId));

    expect(callApi).toMatchSnapshot();
    expect(store.getActions()).toEqual([stepAddedResult]);
  });

  it('creates step with custom step suggestion', async () => {
    await store.dispatch(addStep(customStepSuggestion, receiverId));

    expect(callApi).toMatchSnapshot();
    expect(store.getActions()).toEqual([stepAddedResult]);
  });
});

describe('create custom step', () => {
  const stepText = 'Custom Step';
  const myId = '111';

  const stepAddedResult = { type: 'added steps tracked' };

  beforeEach(() => {
    store = mockStore({ auth: { person: { id: myId } } });

    callApi.mockReturnValue(() => Promise.resolve());
    trackStepAdded.mockReturnValue(stepAddedResult);
  });

  it('creates custom step for other person', async () => {
    await store.dispatch(createCustomStep(stepText, receiverId));

    expect(callApi).toMatchSnapshot();
    expect(store.getActions()).toEqual([stepAddedResult]);
  });

  it('creates custom step for me', async () => {
    await store.dispatch(createCustomStep(stepText, myId));

    expect(callApi).toMatchSnapshot();
    expect(store.getActions()).toEqual([stepAddedResult]);
  });

  it('creates custom step for other person in org', async () => {
    await store.dispatch(createCustomStep(stepText, receiverId, orgId));

    expect(callApi).toMatchSnapshot();
    expect(store.getActions()).toEqual([stepAddedResult]);
  });
});

describe('complete challenge', () => {
  const stepId = 34556;
  const stepOrgId = '555';
  const step = {
    id: stepId,
    organization: { id: stepOrgId },
    receiver: { id: receiverId },
  };

  const challengeCompleteQuery = { challenge_id: stepId };
  const stepsQuery = {
    order: '-focused_at,-accepted_at',
    filters: { completed: false },
    include:
      'receiver.reverse_contact_assignments,receiver.organizational_permissions,challenge_suggestion',
  };
  const data = {
    data: {
      type: ACCEPTED_STEP,
      attributes: {
        completed_at: mockDate,
      },
    },
  };

  const trackActionResult = { type: 'tracked action' };
  const impactResponse = { type: 'test impact' };
  const celebrateResponse = { type: 'test celebrate' };
  const screen = 'contact steps';

  beforeEach(() => {
    store = mockStore({
      auth: {
        person: {
          id: personId,
        },
      },
      organizations: {
        all: [
          {
            id: orgId,
            celebrationPagination: {
              page: 42,
              hasNextPage: false,
            },
          },
        ],
      },
      steps: { userStepCount: { [receiverId]: 2 } },
    });

    trackAction.mockReturnValue(trackActionResult);
    callApi.mockReturnValue(() => Promise.resolve({ type: 'test api' }));
    refreshImpact.mockReturnValue(impactResponse);
    reloadGroupCelebrateFeed.mockReturnValue(celebrateResponse);
    // Call `onSetComplete` within the navigate push
    navigation.navigatePush = jest.fn((a, b) => {
      b.onSetComplete();
      return { type: NAVIGATE_FORWARD, routeName: a, params: b };
    });
  });

  it('completes step', async () => {
    await store.dispatch(completeStep(step, screen));
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.CHALLENGE_COMPLETE,
      challengeCompleteQuery,
      data,
    );
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_MY_CHALLENGES,
      stepsQuery,
    );
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_CHALLENGES_BY_FILTER,
      expect.objectContaining({
        filters: expect.objectContaining({
          receiver_ids: receiverId,
          organization_ids: stepOrgId,
        }),
      }),
    );
    expect(trackAction).toHaveBeenCalledWith(
      `${ACTIONS.STEP_COMPLETED.name} on ${screen} Screen`,
      { [ACTIONS.STEP_COMPLETED.key]: null },
    );
    expect(reloadGroupCelebrateFeed).toHaveBeenCalledWith(stepOrgId);

    expect(store.getActions()).toEqual([
      {
        type: NAVIGATE_FORWARD,
        routeName: COMPLETE_STEP_FLOW,
        params: {
          type: STEP_NOTE,
          personId: receiverId,
          stepId,
          onSetComplete: expect.any(Function),
          orgId: stepOrgId,
          trackingObj: buildTrackingObj(
            'people : person : steps : complete comment',
            'people',
            'person',
            'steps',
          ),
        },
      },
      trackActionResult,
      { type: COMPLETED_STEP_COUNT, userId: receiverId },
      impactResponse,
      celebrateResponse,
    ]);
  });

  it('completes step for personal ministry', async () => {
    const noOrgStep = { ...step, organization: undefined };
    await store.dispatch(completeStep(noOrgStep, screen));
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_MY_CHALLENGES,
      stepsQuery,
    );
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_CHALLENGES_BY_FILTER,
      expect.objectContaining({
        filters: expect.objectContaining({
          receiver_ids: receiverId,
          organization_ids: 'personal',
        }),
      }),
    );
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.CHALLENGE_COMPLETE,
      challengeCompleteQuery,
      data,
    );
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.CHALLENGE_COMPLETE,
      challengeCompleteQuery,
      data,
    );
    expect(reloadGroupCelebrateFeed).not.toHaveBeenCalled();
    expect(store.getActions()).toEqual([
      {
        type: NAVIGATE_FORWARD,
        routeName: COMPLETE_STEP_FLOW,
        params: {
          type: STEP_NOTE,
          personId: receiverId,
          stepId,
          onSetComplete: expect.any(Function),
          orgId: null,
          trackingObj: buildTrackingObj(
            'people : person : steps : complete comment',
            'people',
            'person',
            'steps',
          ),
        },
      },
      trackActionResult,
      { type: COMPLETED_STEP_COUNT, userId: receiverId },
      impactResponse,
    ]);
  });
});

describe('Set Focus', () => {
  const stepId = 102;
  const unfocusedStep = {
    id: stepId,
    receiver: { id: receiverId },
    focus: false,
  };
  const focusedStep = {
    ...unfocusedStep,
    focus: true,
  };

  const query = { challenge_id: stepId };

  const focusData = {
    data: {
      type: ACCEPTED_STEP,
      attributes: {
        organization_id: null,
        focus: true,
      },
      relationships: {
        receiver: {
          data: {
            type: 'person',
            id: receiverId,
          },
        },
      },
    },
  };

  const unfocusData = {
    data: {
      type: ACCEPTED_STEP,
      attributes: {
        organization_id: null,
        focus: false,
      },
      relationships: {
        receiver: {
          data: {
            type: 'person',
            id: receiverId,
          },
        },
      },
    },
  };

  beforeEach(() => {
    store = mockStore({
      auth: {
        person: {
          id: personId,
        },
      },
      steps: { userStepCount: { [receiverId]: 2 } },
    });
  });

  it('Focus set to true', async () => {
    callApi.mockReturnValue(() => ({ response: { focus: true } }));

    await store.dispatch(setStepFocus(unfocusedStep, true));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.CHALLENGE_SET_FOCUS,
      query,
      focusData,
    );
    expect(store.getActions()).toEqual([
      { type: TOGGLE_STEP_FOCUS, step: unfocusedStep },
    ]);
  });

  it('Focus set to false', async () => {
    callApi.mockReturnValue(() => ({ response: { focus: false } }));

    await store.dispatch(setStepFocus(focusedStep, false));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.CHALLENGE_SET_FOCUS,
      query,
      unfocusData,
    );
    expect(store.getActions()).toEqual([
      { type: TOGGLE_STEP_FOCUS, step: focusedStep },
    ]);
  });
});

describe('deleteStepWithTracking', () => {
  const step = { id: '123124' };
  const screen = 'steps';
  const trackActionResult = { type: 'hello world' };

  it('should delete a step', async () => {
    callApi.mockReturnValue(() => Promise.resolve({ type: 'test' }));
    trackAction.mockReturnValue(trackActionResult);

    await store.dispatch(deleteStepWithTracking(step, screen));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.DELETE_CHALLENGE,
      { challenge_id: step.id },
      {},
    );
    expect(store.getActions()).toEqual([trackActionResult]);
    expect(trackAction).toHaveBeenCalledWith(
      `${ACTIONS.STEP_REMOVED.name} on ${screen} Screen`,
      { [ACTIONS.STEP_REMOVED.key]: null },
    );
  });
});

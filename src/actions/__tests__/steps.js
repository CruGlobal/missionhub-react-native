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
  addSteps,
  completeStepReminder,
  deleteStepWithTracking,
} from '../steps';
import { reloadGroupCelebrateFeed } from '../celebration';
import { refreshImpact } from '../impact';
import * as analytics from '../analytics';
import { mockFnWithParams } from '../../../testUtils';
import * as common from '../../utils/common';
import { buildTrackingObj } from '../../utils/common';
import {
  ACTIONS,
  COMPLETED_STEP_COUNT,
  NAVIGATE_FORWARD,
  STEP_NOTE,
  TOGGLE_STEP_FOCUS,
  CUSTOM_STEP_TYPE,
} from '../../constants';
import { COMPLETE_STEP_FLOW } from '../../routes/constants';
import { ADD_STEP_SCREEN } from '../../containers/AddStepScreen';

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
  jest.clearAllMocks();
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
      'receiver.reverse_contact_assignments,receiver.organizational_permissions',
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
        completed: false,
        receiver_ids: personId,
        organization_ids: orgId,
      },
      page: { limit: 1000 },
      include: 'receiver',
    });
    expect(store.getActions()).toEqual([apiResult]);
  });
});

describe('addSteps', () => {
  const step1 = {
    id: '100',
    body: 'System generated step',
  };
  const step2 = {
    id: 'f53836fd-c6e3-4c69-bcd3-362928c5c924',
    body: 'Hello world',
    challenge_type: CUSTOM_STEP_TYPE,
  };
  const step3 = {
    id: '25fc6712-67c2-4774-88dd-083f138a8011',
    body: 'another custom step',
    challenge_type: CUSTOM_STEP_TYPE,
  };
  const steps = [step1, step2, step3];

  const acceptedChallenges = [
    {
      type: 'accepted_challenge',
      attributes: {
        title: step1.body,
        challenge_suggestion_id: step1.id,
      },
    },
    {
      type: 'accepted_challenge',
      attributes: {
        title: step2.body,
        challenge_suggestion_id: null,
      },
    },
    {
      type: 'accepted_challenge',
      attributes: {
        title: step3.body,
        challenge_suggestion_id: null,
      },
    },
  ];

  const stepAddedResult = { type: 'added steps tracked' };

  const test = async (organization, expectedIncluded) => {
    const expectedApiParam = {
      included: expectedIncluded,
      include: 'received_challenges',
    };

    await store.dispatch(addSteps(steps, receiverId, organization));

    expect(store.getActions()).toEqual([stepAddedResult]);
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.ADD_CHALLENGES,
      { person_id: receiverId },
      expectedApiParam,
    );
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_MY_CHALLENGES,
      expect.anything(),
    );
  };

  beforeEach(() => {
    mockFnWithParams(analytics, 'trackStepsAdded', stepAddedResult, steps);
    callApi.mockReturnValue(() => Promise.resolve());
  });

  it('creates steps without org', () => {
    return test(null, acceptedChallenges);
  });

  it('creates steps with org', () => {
    const organization = { id: '200' };
    const expectedIncluded = acceptedChallenges.map(c => ({
      ...c,
      attributes: { ...c.attributes, organization_id: organization.id },
    }));

    return test(organization, expectedIncluded);
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
      'receiver.reverse_contact_assignments,receiver.organizational_permissions',
  };
  const data = {
    data: {
      type: 'accepted_challenge',
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

    analytics.trackAction.mockReturnValue(trackActionResult);
    callApi.mockReturnValue(() => Promise.resolve({ type: 'test api' }));
    refreshImpact.mockReturnValue(impactResponse);
    reloadGroupCelebrateFeed.mockReturnValue(celebrateResponse);
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
    expect(analytics.trackAction).toHaveBeenCalledWith(
      `${ACTIONS.STEP_COMPLETED.name} on ${screen} Screen`,
      { [ACTIONS.STEP_COMPLETED.key]: null },
    );
    expect(reloadGroupCelebrateFeed).toHaveBeenCalledWith(stepOrgId);

    expect(store.getActions()).toEqual([
      { type: COMPLETED_STEP_COUNT, userId: receiverId },
      impactResponse,
      {
        type: NAVIGATE_FORWARD,
        routeName: COMPLETE_STEP_FLOW,
        params: {
          type: STEP_NOTE,
          personId: receiverId,
          stepId,
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
      { type: COMPLETED_STEP_COUNT, userId: receiverId },
      impactResponse,
      {
        type: NAVIGATE_FORWARD,
        routeName: COMPLETE_STEP_FLOW,
        params: {
          type: STEP_NOTE,
          personId: receiverId,
          stepId,
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
    ]);
  });

  it('completes step reminder', async () => {
    await store.dispatch(completeStepReminder(step, screen));
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_MY_CHALLENGES,
      stepsQuery,
    );
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.CHALLENGE_COMPLETE,
      challengeCompleteQuery,
      data,
    );
    expect(store.getActions()).toEqual([
      { type: COMPLETED_STEP_COUNT, userId: receiverId },
      impactResponse,
      {
        type: NAVIGATE_FORWARD,
        routeName: COMPLETE_STEP_FLOW,
        params: {
          type: STEP_NOTE,
          personId: receiverId,
          stepId,
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
      type: 'accepted_challenge',
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
      type: 'accepted_challenge',
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
    mockFnWithParams(
      analytics,
      'trackAction',
      trackActionResult,
      `${ACTIONS.STEP_REMOVED.name} on ${screen} Screen`,
      { [ACTIONS.STEP_REMOVED.key]: null },
    );

    await store.dispatch(deleteStepWithTracking(step, screen));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.DELETE_CHALLENGE,
      { challenge_id: step.id },
      {},
    );
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_MY_CHALLENGES,
      expect.anything(),
    );
    expect(store.getActions()).toEqual([trackActionResult]);
  });
});

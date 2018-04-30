import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18next from 'i18next';

import callApi, { REQUESTS } from '../../src/actions/api';
import {
  completeStep, getStepSuggestions, getMyStepsNextPage, getStepsByFilter, setStepFocus,
  addSteps, completeStepReminder,
} from '../../src/actions/steps';
import { refreshImpact } from '../../src/actions/impact';
import * as analytics from '../../src/actions/analytics';
import { mockFnWithParams } from '../../testUtils';
import * as common from '../../src/utils/common';
import { buildTrackingObj } from '../../src/utils/common';
import {
  ACTIONS, COMPLETED_STEP_COUNT, NAVIGATE_FORWARD, STEP_NOTE, ADD_STEP_REMINDER, REMOVE_STEP_REMINDER,
  CUSTOM_STEP_TYPE,
} from '../../src/constants';
import { ADD_STEP_SCREEN } from '../../src/containers/AddStepScreen';


const mockStore = configureStore([ thunk ]);
let store;

const personId = 2123;
const receiverId = 983547;
const mockDate = '2018-02-14 11:30:00 UTC';
common.formatApiDate = jest.fn().mockReturnValue(mockDate);

jest.mock('../../src/actions/api');
jest.mock('../../src/actions/impact');

beforeEach(() => {
  callApi.mockClear();
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

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_CHALLENGE_SUGGESTIONS, stepSuggestionsQuery);
    expect(store.getActions()).toEqual([ apiResult ]);
  });
});

describe('get steps page', () => {
  const stepsPageQuery = {
    order: '-accepted_at',
    page: { limit: 25, offset: 25 },
    filters: { completed: false },
    include: 'receiver.reverse_contact_assignments',
  };
  const apiResult = { type: 'done' };

  it('should filter with page', () => {
    store = mockStore({
      steps: { pagination: { page: 1, hasNextPage: true } },
    });
    callApi.mockReturnValue(apiResult);

    store.dispatch(getMyStepsNextPage());

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_MY_CHALLENGES, stepsPageQuery);
    expect(store.getActions()[0]).toEqual(apiResult);
  });
});

describe('getStepsByFilter', () => {
  it('should get filtered steps for a person', () => {
    const stepsFilter = {
      completed: true,
      receiver_ids: '1',
      organization_ids: '2',
    };
    const include = 'receiver';
    const apiResult = { type: 'done' };

    callApi.mockReturnValue(apiResult);

    store.dispatch(getStepsByFilter(stepsFilter, include));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_CHALLENGES_BY_FILTER, { filters: stepsFilter, page: { limit: 1000 }, include: include });
    expect(store.getActions()).toEqual([ apiResult ]);
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
  const steps = [ step1, step2, step3 ];

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

  const test = async(organization, expectedIncluded) => {
    const expectedApiParam = {
      included: expectedIncluded,
      include: 'received_challenges',
    };

    await store.dispatch(addSteps(steps, receiverId, organization));

    expect(store.getActions()).toEqual([ stepAddedResult ]);
    expect(callApi).toHaveBeenCalledWith(REQUESTS.ADD_CHALLENGES, { person_id: receiverId }, expectedApiParam);
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_MY_CHALLENGES, expect.anything());
  };

  beforeEach(() => {
    mockFnWithParams(analytics, 'trackStepsAdded', stepAddedResult, steps);
    callApi.mockReturnValue(() => Promise.resolve());
  });

  it('creates steps without org', async() => {
    return test(null, acceptedChallenges);
  });

  it('creates steps with org', async() => {
    const organization = { id: '200' };
    const expectedIncluded = acceptedChallenges.map((c) => ({ ...c, attributes: { ...c.attributes, organization_id: organization.id } }));

    return test(organization, expectedIncluded);
  });
});

describe('complete challenge', () => {
  const stepId = 34556;
  const step = {
    id: stepId,
    receiver: { id: receiverId },
  };

  const challengeCompleteQuery = { challenge_id: stepId };
  const stepsQuery = {
    order: '-accepted_at',
    filters: { completed: false },
    include: 'receiver.reverse_contact_assignments',
  };
  const data = {
    data: {
      type: 'accepted_challenge',
      attributes: {
        completed_at: mockDate,
      },
    },
  };

  const trackStateResult = { type: 'tracked state' };
  const trackActionResult = { type: 'tracked action' };

  const impactResponse = { type: 'test impact' };

  const removeReminderResponse = { type: REMOVE_STEP_REMINDER, step };

  beforeEach(() => {
    store = mockStore({
      auth: {
        person: {
          id: personId,
        },
      },
      steps: { userStepCount: { [receiverId]: 2 } },
    });

    mockFnWithParams(analytics,
      'trackState',
      trackStateResult,
      buildTrackingObj('people : person : steps : complete comment', 'people', 'person', 'steps'));
    mockFnWithParams(analytics, 'trackAction', trackActionResult, ACTIONS.STEP_COMPLETED);

    callApi.mockReturnValue(() => Promise.resolve({ type: 'test api' }));
    refreshImpact.mockReturnValue(impactResponse);
  });

  it('completes step', async() => {
    await store.dispatch(completeStep(step));
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_MY_CHALLENGES, stepsQuery);
    expect(callApi).toHaveBeenCalledWith(REQUESTS.CHALLENGE_COMPLETE, challengeCompleteQuery, data);
    expect(store.getActions()).toEqual([
      { type: COMPLETED_STEP_COUNT, userId: receiverId },
      impactResponse,
      { type: NAVIGATE_FORWARD,
        routeName: ADD_STEP_SCREEN,
        params: { type: STEP_NOTE, onComplete: expect.anything() } },
      trackStateResult,
      trackActionResult,
    ]);
  });

  it('completes step reminder', async() => {
    await store.dispatch(completeStepReminder(step));
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_MY_CHALLENGES, stepsQuery);
    expect(callApi).toHaveBeenCalledWith(REQUESTS.CHALLENGE_COMPLETE, challengeCompleteQuery, data);
    expect(store.getActions()).toEqual([
      { type: COMPLETED_STEP_COUNT, userId: receiverId },
      impactResponse,
      { type: NAVIGATE_FORWARD,
        routeName: ADD_STEP_SCREEN,
        params: { type: STEP_NOTE, onComplete: expect.anything() } },
      trackStateResult,
      trackActionResult,
      removeReminderResponse,
    ]);
  });
});


describe('Set Focus', () => {
  const stepId = 102;
  const step = {
    id: stepId,
    receiver: { id: receiverId },
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

    callApi.mockReturnValue(() => Promise.resolve({ type: 'test' }));
  });

  it('Focus set to true', async() => {
    await store.dispatch(setStepFocus(step, true));
    expect(callApi).toHaveBeenCalledWith(REQUESTS.CHALLENGE_SET_FOCUS, query, focusData);
    expect(store.getActions()).toEqual([ { type: ADD_STEP_REMINDER, step: step } ]);
  });

  it('Focus set to false', async() => {
    await store.dispatch(setStepFocus(step, false));
    expect(callApi).toHaveBeenCalledWith(REQUESTS.CHALLENGE_SET_FOCUS, query, unfocusData);
    expect(store.getActions()).toEqual([ { type: REMOVE_STEP_REMINDER, step: step } ]);
  });
});

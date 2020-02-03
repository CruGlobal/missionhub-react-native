/* eslint max-lines: 0 */

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18next from 'i18next';

import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import {
  completeStep,
  getStepSuggestions,
  getMyStepsNextPage,
  getContactSteps,
  addStep,
  createCustomStep,
  deleteStepWithTracking,
} from '../steps';
import { refreshImpact } from '../impact';
import { trackStepAdded, trackAction } from '../analytics';
import * as navigation from '../navigation';
import * as common from '../../utils/common';
import {
  ACTIONS,
  COMPLETED_STEP_COUNT,
  NAVIGATE_FORWARD,
  STEP_NOTE,
  CUSTOM_STEP_TYPE,
  ACCEPTED_STEP,
} from '../../constants';
import { COMPLETE_STEP_FLOW } from '../../routes/constants';

const mockStore = configureStore([thunk]);
// @ts-ignore
let store;

const personId = '2123';
const receiverId = '983547';
const orgId = '123';
const mockDate = '2018-02-14 11:30:00 UTC';
// @ts-ignore
common.formatApiDate = jest.fn().mockReturnValue(mockDate);

jest.mock('../api');
jest.mock('../impact');
jest.mock('../celebration');
jest.mock('../analytics');

const getMyChallengesIncludes =
  'receiver,receiver.reverse_contact_assignments,receiver.organizational_permissions,challenge_suggestion,reminder';
const getChallengesByFilterIncludes = 'receiver,challenge_suggestion,reminder';

beforeEach(() => {
  store = mockStore();
});

describe('get step suggestions', () => {
  const locale = 'de';
  const stepSuggestionsQuery = { filters: { locale: locale } };
  const apiResult = { type: 'done' };

  it('should filter by language', () => {
    i18next.language = locale;
    // @ts-ignore
    callApi.mockReturnValue(apiResult);

    // @ts-ignore
    store.dispatch(getStepSuggestions());

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_CHALLENGE_SUGGESTIONS,
      stepSuggestionsQuery,
    );
    // @ts-ignore
    expect(store.getActions()).toEqual([apiResult]);
  });
});

describe('get steps page', () => {
  const stepsPageQuery = {
    order: '-accepted_at',
    page: { limit: 25, offset: 25 },
    filters: { completed: false },
    include: getMyChallengesIncludes,
  };
  const apiResult = { type: 'done' };

  it('should filter with page', () => {
    store = mockStore({
      steps: { pagination: { page: 1, hasNextPage: true } },
    });
    // @ts-ignore
    callApi.mockReturnValue(apiResult);

    // @ts-ignore
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
    // @ts-ignore
    callApi.mockReturnValue(apiResult);

    // @ts-ignore
    const result = await store.dispatch(getMyStepsNextPage());

    expect(result).toEqual(undefined);
  });
});

describe('getContactSteps', () => {
  it('should get filtered steps for a person', () => {
    const apiResult = { type: 'done' };

    // @ts-ignore
    callApi.mockReturnValue(apiResult);

    // @ts-ignore
    store.dispatch(getContactSteps(personId, orgId));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_CHALLENGES_BY_FILTER, {
      filters: {
        receiver_ids: personId,
        organization_ids: orgId,
      },
      page: { limit: 1000 },
      include: getChallengesByFilterIncludes,
    });
    // @ts-ignore
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

  const callApiResult = { type: 'call API' };
  const stepAddedResult = { type: 'added steps tracked' };

  beforeEach(() => {
    // @ts-ignore
    callApi.mockReturnValue(callApiResult);
    // @ts-ignore
    trackStepAdded.mockReturnValue(stepAddedResult);
  });

  it('creates step without org', async () => {
    // @ts-ignore
    await store.dispatch(addStep(stepSuggestion, receiverId));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.ADD_CHALLENGE,
      {},
      {
        data: {
          type: ACCEPTED_STEP,
          attributes: {
            title: stepSuggestion.body,
          },
          relationships: {
            receiver: {
              data: {
                type: 'person',
                id: receiverId,
              },
            },
            challenge_suggestion: {
              data: {
                type: 'challenge_suggestion',
                id: stepSuggestion.id,
              },
            },
          },
        },
      },
    );
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_MY_CHALLENGES, {
      order: '-accepted_at',
      filters: { completed: false },
      include: getMyChallengesIncludes,
    });
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_CHALLENGES_BY_FILTER, {
      filters: { receiver_ids: receiverId, organization_ids: 'personal' },
      include: getChallengesByFilterIncludes,
      page: { limit: 1000 },
    });
    // @ts-ignore
    expect(store.getActions()).toEqual([
      callApiResult,
      stepAddedResult,
      callApiResult,
      callApiResult,
    ]);
  });

  it('creates step with org', async () => {
    // @ts-ignore
    await store.dispatch(addStep(stepSuggestion, receiverId, orgId));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.ADD_CHALLENGE,
      {},
      {
        data: {
          type: ACCEPTED_STEP,
          attributes: {
            title: stepSuggestion.body,
          },
          relationships: {
            receiver: {
              data: {
                type: 'person',
                id: receiverId,
              },
            },
            challenge_suggestion: {
              data: {
                type: 'challenge_suggestion',
                id: stepSuggestion.id,
              },
            },
            organization: {
              data: {
                type: 'organization',
                id: orgId,
              },
            },
          },
        },
      },
    );
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_MY_CHALLENGES, {
      order: '-accepted_at',
      filters: { completed: false },
      include: getMyChallengesIncludes,
    });
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_CHALLENGES_BY_FILTER, {
      filters: { receiver_ids: receiverId, organization_ids: orgId },
      include: getChallengesByFilterIncludes,
      page: { limit: 1000 },
    });
    // @ts-ignore
    expect(store.getActions()).toEqual([
      callApiResult,
      stepAddedResult,
      callApiResult,
      callApiResult,
    ]);
  });

  it('creates step with custom step suggestion', async () => {
    // @ts-ignore
    await store.dispatch(addStep(customStepSuggestion, receiverId));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.ADD_CHALLENGE,
      {},
      {
        data: {
          type: ACCEPTED_STEP,
          attributes: {
            title: customStepSuggestion.body,
          },
          relationships: {
            receiver: {
              data: {
                type: 'person',
                id: receiverId,
              },
            },
            challenge_suggestion: {
              data: {
                type: 'challenge_suggestion',
                id: null,
              },
            },
          },
        },
      },
    );
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_MY_CHALLENGES, {
      order: '-accepted_at',
      filters: { completed: false },
      include: getMyChallengesIncludes,
    });
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_CHALLENGES_BY_FILTER, {
      filters: { receiver_ids: receiverId, organization_ids: 'personal' },
      include: getChallengesByFilterIncludes,
      page: { limit: 1000 },
    });
    // @ts-ignore
    expect(store.getActions()).toEqual([
      callApiResult,
      stepAddedResult,
      callApiResult,
      callApiResult,
    ]);
  });
});

describe('create custom step', () => {
  const stepText = 'Custom Step';
  const myId = '111';

  const callApiResult = { type: 'call API' };
  const stepAddedResult = { type: 'added steps tracked' };

  beforeEach(() => {
    store = mockStore({ auth: { person: { id: myId } } });

    // @ts-ignore
    callApi.mockReturnValue(callApiResult);
    // @ts-ignore
    trackStepAdded.mockReturnValue(stepAddedResult);
  });

  it('creates custom step for other person', async () => {
    // @ts-ignore
    await store.dispatch(createCustomStep(stepText, receiverId));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.ADD_CHALLENGE,
      {},
      {
        data: {
          type: ACCEPTED_STEP,
          attributes: {
            title: stepText,
          },
          relationships: {
            receiver: {
              data: {
                type: 'person',
                id: receiverId,
              },
            },
            challenge_suggestion: {
              data: {
                type: 'challenge_suggestion',
                id: null,
              },
            },
          },
        },
      },
    );
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_MY_CHALLENGES, {
      order: '-accepted_at',
      filters: { completed: false },
      include: getMyChallengesIncludes,
    });
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_CHALLENGES_BY_FILTER, {
      filters: { receiver_ids: receiverId, organization_ids: 'personal' },
      include: getChallengesByFilterIncludes,
      page: { limit: 1000 },
    });
    // @ts-ignore
    expect(store.getActions()).toEqual([
      callApiResult,
      stepAddedResult,
      callApiResult,
      callApiResult,
    ]);
  });

  it('creates custom step for me', async () => {
    // @ts-ignore
    await store.dispatch(createCustomStep(stepText, myId));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.ADD_CHALLENGE,
      {},
      {
        data: {
          type: ACCEPTED_STEP,
          attributes: {
            title: stepText,
          },
          relationships: {
            receiver: {
              data: {
                type: 'person',
                id: myId,
              },
            },
            challenge_suggestion: {
              data: {
                type: 'challenge_suggestion',
                id: null,
              },
            },
          },
        },
      },
    );
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_MY_CHALLENGES, {
      order: '-accepted_at',
      filters: { completed: false },
      include: getMyChallengesIncludes,
    });
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_CHALLENGES_BY_FILTER, {
      filters: { receiver_ids: myId, organization_ids: 'personal' },
      include: getChallengesByFilterIncludes,
      page: { limit: 1000 },
    });
    // @ts-ignore
    expect(store.getActions()).toEqual([
      callApiResult,
      stepAddedResult,
      callApiResult,
      callApiResult,
    ]);
  });

  it('creates custom step for other person in org', async () => {
    // @ts-ignore
    await store.dispatch(createCustomStep(stepText, receiverId, orgId));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.ADD_CHALLENGE,
      {},
      {
        data: {
          type: ACCEPTED_STEP,
          attributes: {
            title: stepText,
          },
          relationships: {
            receiver: {
              data: {
                type: 'person',
                id: receiverId,
              },
            },
            challenge_suggestion: {
              data: {
                type: 'challenge_suggestion',
                id: null,
              },
            },
            organization: {
              data: {
                type: 'organization',
                id: orgId,
              },
            },
          },
        },
      },
    );
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_MY_CHALLENGES, {
      order: '-accepted_at',
      filters: { completed: false },
      include: getMyChallengesIncludes,
    });
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_CHALLENGES_BY_FILTER, {
      filters: { receiver_ids: receiverId, organization_ids: orgId },
      include: getChallengesByFilterIncludes,
      page: { limit: 1000 },
    });
    // @ts-ignore
    expect(store.getActions()).toEqual([
      callApiResult,
      stepAddedResult,
      callApiResult,
      callApiResult,
    ]);
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
    order: '-accepted_at',
    filters: { completed: false },
    include: getMyChallengesIncludes,
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

    // @ts-ignore
    trackAction.mockReturnValue(trackActionResult);
    // @ts-ignore
    callApi.mockReturnValue(() => Promise.resolve({ type: 'test api' }));
    // @ts-ignore
    refreshImpact.mockReturnValue(impactResponse);
    // Call `onSetComplete` within the navigate push
    // @ts-ignore
    navigation.navigatePush = jest.fn((a, b) => {
      b.onSetComplete();
      return { type: NAVIGATE_FORWARD, routeName: a, params: b };
    });
  });

  it('completes step', async () => {
    // @ts-ignore
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

    // @ts-ignore
    expect(store.getActions()).toEqual([
      {
        type: NAVIGATE_FORWARD,
        routeName: COMPLETE_STEP_FLOW,
        params: {
          type: STEP_NOTE,
          personId: receiverId,
          id: stepId,
          onSetComplete: expect.any(Function),
          orgId: stepOrgId,
        },
      },
      trackActionResult,
      { type: COMPLETED_STEP_COUNT, userId: receiverId },
      impactResponse,
    ]);
  });

  it('completes step for personal ministry', async () => {
    const noOrgStep = { ...step, organization: undefined };
    // @ts-ignore
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
    // @ts-ignore
    expect(store.getActions()).toEqual([
      {
        type: NAVIGATE_FORWARD,
        routeName: COMPLETE_STEP_FLOW,
        params: {
          type: STEP_NOTE,
          personId: receiverId,
          id: stepId,
          onSetComplete: expect.any(Function),
          orgId: null,
        },
      },
      trackActionResult,
      { type: COMPLETED_STEP_COUNT, userId: receiverId },
      impactResponse,
    ]);
  });
});

describe('deleteStepWithTracking', () => {
  const step = { id: '123124' };
  const screen = 'steps';
  const trackActionResult = { type: 'hello world' };

  it('should delete a step', async () => {
    // @ts-ignore
    callApi.mockReturnValue(() => Promise.resolve({ type: 'test' }));
    // @ts-ignore
    trackAction.mockReturnValue(trackActionResult);

    // @ts-ignore
    await store.dispatch(deleteStepWithTracking(step, screen));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.DELETE_CHALLENGE,
      { challenge_id: step.id },
      {},
    );
    // @ts-ignore
    expect(store.getActions()).toEqual([trackActionResult]);
    expect(trackAction).toHaveBeenCalledWith(
      `${ACTIONS.STEP_REMOVED.name} on ${screen} Screen`,
      { [ACTIONS.STEP_REMOVED.key]: null },
    );
  });
});

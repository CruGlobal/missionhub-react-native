import * as api from '../../src/actions/api';
import { REQUESTS } from '../../src/actions/api';
import { completeStep, getStepSuggestions } from '../../src/actions/steps';
import * as analytics from '../../src/actions/analytics';
import { mockFnWithParams, mockFnWithParamsMultiple } from '../../testUtils';
import * as common from '../../src/utils/common';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { buildTrackingObj } from '../../src/utils/common';
import { COMPLETED_STEP_COUNT, NAVIGATE_FORWARD, STEP_NOTE } from '../../src/constants';
import { ADD_STEP_SCREEN } from '../../src/containers/AddStepScreen';
import i18next from 'i18next';

const mockStore = configureStore([ thunk ]);
let store;

const mockDate = '2018-02-14 11:30:00 UTC';
common.formatApiDate = jest.fn().mockReturnValue(mockDate);

describe('get step suggestions', () => {
  const locale = 'de';
  const stepSuggestionsQuery = { filters: { locale: locale } };
  const apiResult = { type: 'done' };

  it('should filter by language', () => {
    store = mockStore();
    i18next.language = locale;
    mockFnWithParams(api, 'default', apiResult, REQUESTS.GET_CHALLENGE_SUGGESTIONS, stepSuggestionsQuery);

    store.dispatch(getStepSuggestions());

    expect(store.getActions()).toEqual([ apiResult ]);
  });
});

describe('complete challenge', () => {
  const personId = 2123;
  const receiverId = 983547;

  const stepId = 34556;
  const step = {
    id: stepId,
    receiver: { id: receiverId },
  };

  const challengeCompleteQuery = { challenge_id: stepId };
  const stepsQuery = {
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

  beforeEach(() => {
    store = mockStore({
      auth: { personId: personId },
      steps: { userStepCount: { [receiverId]: 2 } },
    });

    mockFnWithParams(analytics,
      'trackState',
      trackStateResult,
      buildTrackingObj('people : person : steps : complete comment', 'people', 'person', 'steps'));

    mockFnWithParamsMultiple(api,
      'default',
      { expectedReturn: () => Promise.resolve(), expectedParams: [ REQUESTS.GET_MY_CHALLENGES, stepsQuery ] },
      { expectedReturn: () => Promise.resolve(), expectedParams: [ REQUESTS.CHALLENGE_COMPLETE, challengeCompleteQuery, data ] });
  });

  it('completes step', () => {
    return store.dispatch(completeStep(step)).then(() => {
      expect(store.getActions()).toEqual([
        { type: COMPLETED_STEP_COUNT, userId: receiverId },
        { type: NAVIGATE_FORWARD,
          routeName: ADD_STEP_SCREEN,
          params: { type: STEP_NOTE, onComplete: expect.anything() } },
        trackStateResult,
      ]);
    });
  });
});

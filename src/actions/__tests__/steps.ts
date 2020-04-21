import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import { completeStep, deleteStepWithTracking } from '../steps';
import { refreshImpact } from '../impact';
import { trackAction } from '../analytics';
import * as navigation from '../navigation';
import * as date from '../../utils/date';
import {
  ACTIONS,
  COMPLETED_STEP_COUNT,
  NAVIGATE_FORWARD,
  STEP_NOTE,
  ACCEPTED_STEP,
} from '../../constants';
import { COMPLETE_STEP_FLOW } from '../../routes/constants';
import { getCelebrateFeed } from '../celebration';
import { apolloClient } from '../../apolloClient';

apolloClient.query = jest.fn();
apolloClient.readQuery = jest.fn();
apolloClient.writeQuery = jest.fn();

const mockStore = configureStore([thunk]);
// @ts-ignore
let store;

const personId = '2123';
const receiverId = '983547';
const orgId = '123';
const mockDate = '2018-02-14 11:30:00 UTC';

(date.formatApiDate as jest.Mock) = jest.fn().mockReturnValue(mockDate);

jest.mock('../api');
jest.mock('../impact');
jest.mock('../celebration');
jest.mock('../analytics');

beforeEach(() => {
  store = mockStore();
});

describe('completeStep', () => {
  const stepId = 34556;
  const stepOrgId = '555';
  const step = {
    id: stepId,
    organization: { id: stepOrgId },
    receiver: { id: receiverId },
  };

  const challengeCompleteQuery = { challenge_id: stepId };
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
    expect(
      trackAction,
    ).toHaveBeenCalledWith(
      `${ACTIONS.STEP_COMPLETED.name} on ${screen} Screen`,
      { [ACTIONS.STEP_COMPLETED.key]: null },
    );
    expect(getCelebrateFeed).toHaveBeenCalledWith(stepOrgId);

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
      REQUESTS.CHALLENGE_COMPLETE,
      challengeCompleteQuery,
      data,
    );
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.CHALLENGE_COMPLETE,
      challengeCompleteQuery,
      data,
    );
    expect(getCelebrateFeed).not.toHaveBeenCalled();
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
  const step = { id: '123124', receiver: { id: '3' } };
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
      {
        [ACTIONS.STEP_REMOVED.key]: null,
      },
    );
  });
});

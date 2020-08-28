import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { handleAfterCompleteStep } from '../steps';
import { refreshImpact } from '../impact';
import { trackAction } from '../analytics';
import * as navigation from '../navigation';
import * as date from '../../utils/date';
import { ACTIONS, NAVIGATE_FORWARD, STEP_NOTE } from '../../constants';
import { COMPLETE_STEP_FLOW } from '../../routes/constants';
import { getCelebrateFeed } from '../celebration';
import { apolloClient } from '../../apolloClient';
import { PERSON_STEPS_QUERY } from '../../containers/PersonScreen/PersonSteps/queries';

apolloClient.query = jest.fn();
apolloClient.readQuery = jest.fn();
apolloClient.writeQuery = jest.fn();

const mockStore = configureStore([thunk]);
// @ts-ignore
let store;

const personId = '2123';
const receiverId = '983547';
const communityId = '123';
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
  const stepCommunityId = '555';
  const step = {
    id: stepId,
    community: { id: stepCommunityId },
    receiver: { id: receiverId },
  };

  const trackActionResult = { type: 'tracked action' };
  const impactResponse = { type: 'test impact' };
  const screen = 'contact steps';

  beforeEach(() => {
    store = mockStore({
      organizations: {
        all: [
          {
            id: communityId,
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
    await store.dispatch(handleAfterCompleteStep(step, screen));

    expect(
      trackAction,
    ).toHaveBeenCalledWith(
      `${ACTIONS.STEP_COMPLETED.name} on ${screen} Screen`,
      { [ACTIONS.STEP_COMPLETED.key]: null },
    );
    expect(getCelebrateFeed).toHaveBeenCalledWith(stepCommunityId);
    expect(apolloClient.query).toHaveBeenCalledWith({
      query: PERSON_STEPS_QUERY,
      variables: {
        personId: receiverId,
        completed: true,
      },
    });
    // @ts-ignore
    expect(store.getActions()).toEqual([
      impactResponse,
      {
        type: NAVIGATE_FORWARD,
        routeName: COMPLETE_STEP_FLOW,
        params: {
          type: STEP_NOTE,
          personId: receiverId,
          id: stepId,
          onSetComplete: expect.any(Function),
          orgId: stepCommunityId,
        },
      },
      trackActionResult,
    ]);
  });

  it('completes step for personal ministry', async () => {
    const noCommunityStep = { ...step, community: undefined };
    // @ts-ignore
    await store.dispatch(handleAfterCompleteStep(noCommunityStep, screen));

    expect(getCelebrateFeed).not.toHaveBeenCalled();
    expect(apolloClient.query).toHaveBeenCalledWith({
      query: PERSON_STEPS_QUERY,
      variables: {
        personId: receiverId,
        completed: true,
      },
    });
    // @ts-ignore
    expect(store.getActions()).toEqual([
      impactResponse,
      {
        type: NAVIGATE_FORWARD,
        routeName: COMPLETE_STEP_FLOW,
        params: {
          type: STEP_NOTE,
          personId: receiverId,
          id: stepId,
          onSetComplete: expect.any(Function),
          communityId: undefined,
        },
      },
      trackActionResult,
    ]);
  });
});

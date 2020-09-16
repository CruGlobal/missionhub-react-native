import configureStore, { MockStore } from 'redux-mock-store';
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
import { STEPS_QUERY } from '../../containers/StepsScreen/queries';

apolloClient.query = jest.fn();
apolloClient.readQuery = jest.fn();
apolloClient.writeQuery = jest.fn();

const mockStore = configureStore([thunk]);
let store: MockStore;

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
  const stepId = '34556';
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

    (trackAction as jest.Mock).mockReturnValue(trackActionResult);
    (refreshImpact as jest.Mock).mockReturnValue(impactResponse);
    // Call `onSetComplete` within the navigate push
    (navigation.navigatePush as jest.Mock) = jest.fn((a, b) => {
      b.onSetComplete();
      return { type: NAVIGATE_FORWARD, routeName: a, params: b };
    });
  });

  it('completes step', async () => {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    await store.dispatch<any>(handleAfterCompleteStep(step, screen));

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
    expect(apolloClient.readQuery).toHaveBeenCalledWith({ query: STEPS_QUERY });
    expect(apolloClient.readQuery).toHaveBeenCalledWith({
      query: PERSON_STEPS_QUERY,
      variables: { personId: receiverId, completed: false },
    });
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
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    await store.dispatch<any>(handleAfterCompleteStep(noCommunityStep, screen));

    expect(getCelebrateFeed).not.toHaveBeenCalled();
    expect(apolloClient.query).toHaveBeenCalledWith({
      query: PERSON_STEPS_QUERY,
      variables: {
        personId: receiverId,
        completed: true,
      },
    });
    expect(apolloClient.readQuery).toHaveBeenCalledWith({ query: STEPS_QUERY });
    expect(apolloClient.readQuery).toHaveBeenCalledWith({
      query: PERSON_STEPS_QUERY,
      variables: { personId: receiverId, completed: false },
    });
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

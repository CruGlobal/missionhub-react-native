import { REQUESTS } from '../../src/actions/api';
import steps, { getPagination } from '../../src/reducers/steps';
import { COMPLETED_STEP_COUNT, FILTERED_CHALLENGES } from '../../src/constants';

it('creates a new user step count', () => {
  const state = steps(undefined, {
    type: COMPLETED_STEP_COUNT,
    userId: 1,
  });
  expect(state.userStepCount[1]).toBe(1);
});

it('increments existing user step count', () => {
  const state = steps(
    {
      userStepCount: { [1]: 1 },
    },
    {
      type: COMPLETED_STEP_COUNT,
      userId: 1,
    }
  );
  expect(state.userStepCount[1]).toBe(2);
});

it('saves filtered challenges', () => {
  const suggestedForMe = [ 'these are the steps for me' ];
  const suggestedForOthers = [ 'these are the steps for others' ];

  const state = steps(
    {},
    {
      type: FILTERED_CHALLENGES,
      suggestedForMe,
      suggestedForOthers,
    }
  );

  expect(state.suggestedForMe).toEqual(suggestedForMe);
  expect(state.suggestedForOthers).toEqual(suggestedForOthers);
});

it('adds new items to existing mine array', () => {
  const state = steps(
    {
      mine: [
        { id: '1' }, { id: '1' }, { id: '1' }, { id: '1' }, { id: '1' }, { id: '1' }, { id: '1' }, { id: '1' }, { id: '1' }, { id: '1' }, { id: '1' }, { id: '1' }, { id: '1' }, { id: '1' }, { id: '1' }, { id: '1' }, { id: '1' }, { id: '1' }, { id: '1' }, { id: '1' }, { id: '1' }, { id: '1' }, { id: '1' }, { id: '1' }, { id: '1' },
      ],
      reminders: [],
    },
    {
      type: REQUESTS.GET_MY_CHALLENGES.SUCCESS,
      results: {
        response: [ { id: '26' } ],
      },
      query: { page: { offset: 25 } },
    }
  );

  expect(state.mine.length).toEqual(26);
  expect(state.pagination).toEqual({ page: 2, hasNextPage: false });
});

it('get pagination works', () => {
  const result = getPagination({ pagination: {} }, {
    query: { page: { offset: 25 } },
    meta: { total: 51 },
  }, new Array(25));

  expect(result).toEqual({ page: 2, hasNextPage: true });
});

it('get pagination works for total', () => {
  const result = getPagination({ pagination: {} }, {
    query: { page: { offset: 25 } },
    meta: { total: 50 },
  }, new Array(25));

  expect(result).toEqual({ page: 2, hasNextPage: false });
});

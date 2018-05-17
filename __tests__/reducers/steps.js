import { REQUESTS } from '../../src/actions/api';
import steps, { getPagination } from '../../src/reducers/steps';
import { COMPLETED_STEP_COUNT, FILTERED_CHALLENGES, TOGGLE_STEP_FOCUS } from '../../src/constants';

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

it('receives reminders', () => {
  const stepsResponse = [ { id: '1', focus: true }, { id: '2', focus: false } ];

  const state = steps(
    {
      mine: [],
      reminders: [],
    },
    {
      type: REQUESTS.GET_MY_CHALLENGES.SUCCESS,
      results: {
        response: stepsResponse,
      },
      query: { page: { offset: 0 } },
    },
  );

  expect(state.mine).toEqual(stepsResponse);
});

it('receives contact steps', () => {
  const state = steps(
    {
      contactSteps: {
        '123-456': [ { id: '3' } ],
        '987-': [],
      },
    },
    {
      type: REQUESTS.GET_CHALLENGES_BY_FILTER.SUCCESS,
      results: {
        response: [ { id: '1' }, { id: '2' } ],
      },
      query: { filters: { receiver_ids: '123', organization_ids: '456' } },
    },
  );

  expect(state.contactSteps).toEqual({
    '123-456': [ { id: '1' }, { id: '2' } ],
    '987-': [],
  });
});

describe('it should toggle step focus', () => {
  const existingSteps = [
    { id: '1', focus: false },
    { id: '2', focus: true },
    { id: '3', focus: false },
  ];

  it('should toggle from false to true', () => {
    const state = steps(
      {
        mine: existingSteps,
      },
      {
        type: TOGGLE_STEP_FOCUS,
        step: existingSteps[ 2 ],
      },
    );

    expect(state.mine).toEqual([
      { id: '1', focus: false },
      { id: '2', focus: true },
      { id: '3', focus: true },
    ]);
  });

  it('should toggle from true to false', () => {
    const state = steps(
      {
        mine: existingSteps,
      },
      {
        type: TOGGLE_STEP_FOCUS,
        step: existingSteps[ 1 ],
      },
    );

    expect(state.mine).toEqual([
      { id: '1', focus: false },
      { id: '2', focus: false },
      { id: '3', focus: false },
    ]);
  });
});

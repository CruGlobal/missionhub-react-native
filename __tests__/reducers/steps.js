import { REQUESTS } from '../../src/actions/api';
import steps from '../../src/reducers/steps';
import { getPagination } from '../../src/utils/common';
import { COMPLETED_STEP_COUNT, TOGGLE_STEP_FOCUS } from '../../src/constants';

it('loads step suggestions for me', () => {
  const stageId = 5;
  const oldSuggestions = [
    { id: 1, type: 'challenge_suggestion' },
    { id: 2, type: 'challenge_suggestion' },
    { id: 3, type: 'challenge_suggestion' },
  ];
  const newSuggestions = [
    { id: 4, type: 'challenge_suggestion' },
    { id: 5, type: 'challenge_suggestion' },
    { id: 6, type: 'challenge_suggestion' },
  ];
  newSuggestions.findAll = () => newSuggestions;

  const state = steps(
    {
      suggestedForMe: {
        [stageId]: oldSuggestions,
      },
      suggestedForOthers: {
        [stageId]: [],
      },
    },
    {
      type: REQUESTS.GET_CHALLENGE_SUGGESTIONS.SUCCESS,
      query: {
        filters: {
          self_step: true,
          pathway_stage_id: stageId,
        },
      },
      results: {
        response: newSuggestions,
      },
    },
  );

  expect(state.suggestedForMe[stageId]).toEqual(newSuggestions);
});

it('loads step suggestions for others', () => {
  const stageId = 5;
  const oldSuggestions = [
    { id: 1, type: 'challenge_suggestion' },
    { id: 2, type: 'challenge_suggestion' },
    { id: 3, type: 'challenge_suggestion' },
  ];
  const newSuggestions = [
    { id: 4, type: 'challenge_suggestion' },
    { id: 5, type: 'challenge_suggestion' },
    { id: 6, type: 'challenge_suggestion' },
  ];
  newSuggestions.findAll = () => newSuggestions;

  const state = steps(
    {
      suggestedForMe: {
        [stageId]: [],
      },
      suggestedForOthers: {
        [stageId]: oldSuggestions,
      },
    },
    {
      type: REQUESTS.GET_CHALLENGE_SUGGESTIONS.SUCCESS,
      query: {
        filters: {
          self_step: false,
          pathway_stage_id: stageId,
        },
      },
      results: {
        response: newSuggestions,
      },
    },
  );

  expect(state.suggestedForOthers[stageId]).toEqual(newSuggestions);
});

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
    },
  );
  expect(state.userStepCount[1]).toBe(2);
});

it('adds new items to existing mine array', () => {
  const state = steps(
    {
      mine: [
        { id: '1' },
        { id: '1' },
        { id: '1' },
        { id: '1' },
        { id: '1' },
        { id: '1' },
        { id: '1' },
        { id: '1' },
        { id: '1' },
        { id: '1' },
        { id: '1' },
        { id: '1' },
        { id: '1' },
        { id: '1' },
        { id: '1' },
        { id: '1' },
        { id: '1' },
        { id: '1' },
        { id: '1' },
        { id: '1' },
        { id: '1' },
        { id: '1' },
        { id: '1' },
        { id: '1' },
        { id: '1' },
      ],
      reminders: [],
    },
    {
      type: REQUESTS.GET_MY_CHALLENGES.SUCCESS,
      results: {
        response: [{ id: '26' }],
      },
      query: { page: { offset: 25 } },
    },
  );

  expect(state.mine.length).toEqual(26);
  expect(state.pagination).toEqual({ page: 2, hasNextPage: false });
});

it('get pagination works', () => {
  const result = getPagination(
    {
      query: { page: { offset: 25 } },
      meta: { total: 51 },
    },
    25,
  );

  expect(result).toEqual({ page: 2, hasNextPage: true });
});

it('get pagination works for total', () => {
  const result = getPagination(
    {
      query: { page: { offset: 25 } },
      meta: { total: 50 },
    },
    25,
  );

  expect(result).toEqual({ page: 2, hasNextPage: false });
});

it('receives reminders', () => {
  const stepsResponse = [{ id: '1', focus: true }, { id: '2', focus: false }];

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
        '123-456': [{ id: '3' }],
        '987-': [],
      },
    },
    {
      type: REQUESTS.GET_CHALLENGES_BY_FILTER.SUCCESS,
      results: {
        response: [{ id: '1' }, { id: '2' }],
      },
      query: { filters: { receiver_ids: '123', organization_ids: '456' } },
    },
  );

  expect(state.contactSteps).toEqual({
    '123-456': [{ id: '1' }, { id: '2' }],
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
        step: existingSteps[2],
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
        step: existingSteps[1],
      },
    );

    expect(state.mine).toEqual([
      { id: '1', focus: false },
      { id: '2', focus: false },
      { id: '3', focus: false },
    ]);
  });
});

import { REQUESTS } from '../../api/routes';
import steps from '../steps';
import {
  COMPLETED_STEP_COUNT,
  TOGGLE_STEP_FOCUS,
  RESET_STEP_COUNT,
  STEP_SUGGESTION,
} from '../../constants';

it('loads step suggestions for me', () => {
  const stageId = '5';
  const oldSuggestions = [
    { id: '1', type: STEP_SUGGESTION },
    { id: '2', type: STEP_SUGGESTION },
    { id: '3', type: STEP_SUGGESTION },
  ];
  const newSuggestions = [
    { id: '4', type: STEP_SUGGESTION },
    { id: '5', type: STEP_SUGGESTION },
    { id: '6', type: STEP_SUGGESTION },
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
  const stageId = '5';
  const oldSuggestions = [
    { id: '1', type: STEP_SUGGESTION },
    { id: '2', type: STEP_SUGGESTION },
    { id: '3', type: STEP_SUGGESTION },
  ];
  const newSuggestions = [
    { id: '4', type: STEP_SUGGESTION },
    { id: '5', type: STEP_SUGGESTION },
    { id: '6', type: STEP_SUGGESTION },
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

it('resets a user step count', () => {
  const state = steps(undefined, {
    type: RESET_STEP_COUNT,
    userId: 1,
  });
  expect(state.userStepCount[1]).toBe(0);
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
      mine: Array(25).fill({ id: '1' }),
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

it('receives contact steps and sorts completed', () => {
  const state = steps(
    {
      contactSteps: {
        '123-456': { steps: [{ id: '6' }], completedSteps: [] },
        '987-personal': { steps: [], completedSteps: [] },
      },
    },
    {
      type: REQUESTS.GET_CHALLENGES_BY_FILTER.SUCCESS,
      results: {
        response: [
          { id: '6' },
          { id: '5', completed_at: '2018-12-09T15:12:24Z' },
          { id: '2', completed_at: '2018-12-12T15:12:24Z' },
          { id: '1', completed_at: '2018-12-13T15:12:24Z' },
          { id: '4', completed_at: '2018-12-10T15:12:24Z' },
          { id: '3', completed_at: '2018-12-11T15:12:24Z' },
        ],
      },
      query: { filters: { receiver_ids: '123', organization_ids: '456' } },
    },
  );

  expect(state.contactSteps).toEqual({
    '123-456': {
      steps: [{ id: '6' }],
      completedSteps: [
        { id: '1', completed_at: '2018-12-13T15:12:24Z' },
        { id: '2', completed_at: '2018-12-12T15:12:24Z' },
        { id: '3', completed_at: '2018-12-11T15:12:24Z' },
        { id: '4', completed_at: '2018-12-10T15:12:24Z' },
        { id: '5', completed_at: '2018-12-09T15:12:24Z' },
      ],
    },
    '987-personal': { steps: [], completedSteps: [] },
  });
});
describe('REQUESTS.ADD_CHALLENGE.SUCCESS', () => {
  it('adds personal org steps locally', () => {
    const newStep = {
      id: '7',
      organization: null,
      receiver: { id: '987' },
    };

    const state = steps(
      {
        mine: [{ id: '6' }],
        contactSteps: {
          '123-456': { steps: [{ id: '6' }], completedSteps: [] },
          '987-personal': { steps: [{ id: '6' }], completedSteps: [] },
        },
      },
      {
        type: REQUESTS.ADD_CHALLENGE.SUCCESS,
        results: { response: newStep },
      },
    );

    expect(state).toEqual({
      mine: [newStep, { id: '6' }],
      contactSteps: {
        '123-456': { steps: [{ id: '6' }], completedSteps: [] },
        '987-personal': { steps: [newStep, { id: '6' }], completedSteps: [] },
      },
    });
  });
  it('adds org steps locally', () => {
    const newStep = {
      id: '7',
      organization: { id: '456' },
      receiver: { id: '123' },
    };

    const state = steps(
      {
        mine: [{ id: '6' }],
        contactSteps: {
          '123-456': { steps: [{ id: '6' }], completedSteps: [] },
          '987-personal': { steps: [{ id: '6' }], completedSteps: [] },
        },
      },
      {
        type: REQUESTS.ADD_CHALLENGE.SUCCESS,
        results: { response: newStep },
      },
    );

    expect(state).toEqual({
      mine: [newStep, { id: '6' }],
      contactSteps: {
        '123-456': { steps: [newStep, { id: '6' }], completedSteps: [] },
        '987-personal': { steps: [{ id: '6' }], completedSteps: [] },
      },
    });
  });
});

it('deletes steps locally on REQUESTS.DELETE_CHALLENGE.SUCCESS', () => {
  const state = steps(
    {
      mine: [{ id: '6' }, { id: '3' }],
      contactSteps: {
        '123-456': { steps: [{ id: '6' }, { id: '3' }], completedSteps: [] },
        '987-personal': {
          steps: [{ id: '3' }, { id: '6' }],
          completedSteps: [],
        },
      },
    },
    {
      type: REQUESTS.DELETE_CHALLENGE.SUCCESS,
      query: { challenge_id: '3' },
    },
  );

  expect(state).toEqual({
    mine: [{ id: '6' }],
    contactSteps: {
      '123-456': { steps: [{ id: '6' }], completedSteps: [] },
      '987-personal': { steps: [{ id: '6' }], completedSteps: [] },
    },
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

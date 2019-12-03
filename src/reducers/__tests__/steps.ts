/* eslint max-lines: 0 */

import { REQUESTS } from '../../api/routes';
import { Person } from '../people';
import steps, { Step, initialState } from '../steps';
import {
  COMPLETED_STEP_COUNT,
  RESET_STEP_COUNT,
  STEP_SUGGESTION,
} from '../../constants';

it('loads step suggestions for me', () => {
  const stageId = '5';
  const oldSuggestions = [
    { id: '1', type: STEP_SUGGESTION },
    { id: '2', type: STEP_SUGGESTION },
    { id: '3', type: STEP_SUGGESTION },
  ] as Step[];
  const newSuggestions = [
    { id: '4', type: STEP_SUGGESTION },
    { id: '5', type: STEP_SUGGESTION },
    { id: '6', type: STEP_SUGGESTION },
  ] as Step[];

  const state = steps(
    {
      ...initialState,
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
  ] as Step[];
  const newSuggestions = [
    { id: '4', type: STEP_SUGGESTION },
    { id: '5', type: STEP_SUGGESTION },
    { id: '6', type: STEP_SUGGESTION },
  ] as Step[];

  const state = steps(
    {
      ...initialState,
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
      ...initialState,
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
      ...initialState,
      mine: Array(25).fill({ id: '1' }),
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
      ...initialState,
      mine: [],
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
      ...initialState,
      contactSteps: {
        '123-456': { steps: [{ id: '6' }] as Step[], completedSteps: [] },
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
    const existingStep = { id: '6' } as Step;
    const newStep = ({
      id: '7',
      organization: null,
      receiver: { id: '987' } as Person,
    } as unknown) as Step;

    const state = steps(
      {
        ...initialState,
        mine: [existingStep],
        contactSteps: {
          '123-456': { steps: [existingStep], completedSteps: [] },
          '987-personal': { steps: [existingStep], completedSteps: [] },
        },
      },
      {
        type: REQUESTS.ADD_CHALLENGE.SUCCESS,
        results: { response: newStep },
      },
    );

    expect(state.mine).toEqual([newStep, existingStep]);
    expect(state.contactSteps).toEqual({
      '123-456': { steps: [existingStep], completedSteps: [] },
      '987-personal': { steps: [newStep, existingStep], completedSteps: [] },
    });
  });
  it('adds org steps locally', () => {
    const existingStep = { id: '6' } as Step;
    const newStep = ({
      id: '7',
      organization: { id: '456' },
      receiver: { id: '123' },
    } as unknown) as Step;

    const state = steps(
      {
        ...initialState,
        mine: [existingStep],
        contactSteps: {
          '123-456': { steps: [existingStep], completedSteps: [] },
          '987-personal': { steps: [existingStep], completedSteps: [] },
        },
      },
      {
        type: REQUESTS.ADD_CHALLENGE.SUCCESS,
        results: { response: newStep },
      },
    );

    expect(state.mine).toEqual([newStep, { id: '6' }]);
    expect(state.contactSteps).toEqual({
      '123-456': { steps: [newStep, { id: '6' }], completedSteps: [] },
      '987-personal': { steps: [{ id: '6' }], completedSteps: [] },
    });
  });
});

it('deletes steps locally on REQUESTS.DELETE_CHALLENGE.SUCCESS', () => {
  const step1 = { id: '1' } as Step;
  const step2 = { id: '2' } as Step;

  const state = steps(
    {
      ...initialState,
      mine: [step1, step2],
      contactSteps: {
        '123-456': { steps: [step1, step2], completedSteps: [] },
        '987-personal': {
          steps: [step1, step2],
          completedSteps: [],
        },
      },
    },
    {
      type: REQUESTS.DELETE_CHALLENGE.SUCCESS,
      query: { challenge_id: '1' },
    },
  );

  expect(state.mine).toEqual([{ id: '2' }]);
  expect(state.contactSteps).toEqual({
    '123-456': { steps: [{ id: '2' }], completedSteps: [] },
    '987-personal': { steps: [{ id: '2' }], completedSteps: [] },
  });
});

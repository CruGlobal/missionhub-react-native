import configureStore from 'redux-mock-store';

import { REQUESTS } from '../../src/actions/api';
import steps from '../../src/middleware/steps';
import { FILTERED_CHALLENGES } from '../../src/constants';

const mockStore = configureStore([steps]);
let store;

const stage1 = 1;
const stage2 = 2;

const stage1Self1 = {
  id: 1,
  self_step: true,
  pathway_stage: { id: stage1 },
};
const stage1Self2 = {
  id: 2,
  self_step: true,
  pathway_stage: { id: stage1 },
};

const stage1Person = {
  self_step: false,
  pathway_stage: { id: stage1 },
};

const stage2Self = {
  self_step: true,
  pathway_stage: { id: stage2 },
};

const stage2Person = {
  self_step: false,
  pathway_stage: { id: stage2 },
};

const challengeSuggestions = [
  stage1Self1,
  stage1Self2,
  stage1Person,
  stage2Self,
  stage2Person,
];
const challengeSuggestionsSuccess = {
  type: REQUESTS.GET_CHALLENGE_SUGGESTIONS.SUCCESS,
  results: {
    findAll: type => {
      return type === 'challenge_suggestion' ? challengeSuggestions : undefined;
    },
  },
};

beforeEach(() => {
  store = mockStore();
});

it('should filter challenges', () => {
  store.dispatch(challengeSuggestionsSuccess);

  expect(store.getActions()).toEqual([
    {
      type: FILTERED_CHALLENGES,
      suggestedForMe: {
        [stage1]: [stage1Self1, stage1Self2],
        [stage2]: [stage2Self],
      },
      suggestedForOthers: {
        [stage1]: [stage1Person],
        [stage2]: [stage2Person],
      },
    },
  ]);
});

it('does nothing for other actions', () => {
  const action = { type: 'hello, world' };

  store.dispatch(action);

  expect(store.getActions()).toEqual([action]);
});

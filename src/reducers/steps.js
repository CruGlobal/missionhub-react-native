import { REHYDRATE } from 'redux-persist/constants';

import { REQUESTS } from '../actions/api';
import {
  LOGOUT, REMOVE_STEP_REMINDER, ADD_STEP_REMINDER, COMPLETED_STEP_COUNT,
  FILTERED_CHALLENGES,
} from '../constants';
import { findAllNonPlaceHolders } from '../utils/common';
import { DEFAULT_PAGE_LIMIT } from '../constants';

const initialState = {
  mine: [],
  suggestedForMe: {},
  suggestedForOthers: {},
  reminders: [],
  userStepCount: {},
  pagination: {
    hasNextPage: true,
    page: 1,
  },
};

function getPagination(state, action, steps) {
  const totalSteps = steps.length;
  const offset = action.query.page && action.query.page.offset ? action.query.page.offset : 0;
  const pageNum = Math.floor(offset / DEFAULT_PAGE_LIMIT) + 1;
  const total = action.meta ? action.meta.total || 0 : 0;
  const hasNextPage = total > (offset + totalSteps);
  LOG('page', pageNum, hasNextPage);

  return {
    ...state.pagination,
    page: pageNum,
    hasNextPage,
  };
}

function stepsReducer(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE:
      var incoming = action.payload.steps;
      if (incoming) {
        return {
          ...state,
          ...incoming,
        };
      }
      return state;
    case FILTERED_CHALLENGES:
      return {
        ...state,
        suggestedForMe: action.suggestedForMe,
        suggestedForOthers: action.suggestedForOthers,
      };
    case REQUESTS.GET_MY_CHALLENGES.SUCCESS:
      let mySteps = findAllNonPlaceHolders(action.results, 'accepted_challenge');
      mySteps = mySteps.map((s)=> {
        if (state.reminders.find((r)=> r.id === s.id)) return { ...s, reminder: true };
        return s;
      });
      // If we're doing paging, concat the old steps with the new ones
      if (action.query.page && action.query.page.offset > 0) {
        mySteps = state.mine.concat(mySteps);
      }
      return {
        ...state,
        mine: mySteps,
        pagination: getPagination(state, action, mySteps),
      };
    case ADD_STEP_REMINDER:
      const newMine = state.mine.map((s)=> {
        if (s.id === action.step.id) return { ...s, reminder: true };
        return s;
      });
      return {
        ...state,
        mine: newMine,
        reminders: [ ...state.reminders, action.step ],
      };
    case REMOVE_STEP_REMINDER:
      const newRemove = state.mine.map((s)=> {
        if (s.id === action.step.id) return { ...s, reminder: undefined };
        return s;
      });
      return {
        ...state,
        mine: newRemove,
        reminders: state.reminders.filter((s) => s.id !== action.step.id),
      };
    case COMPLETED_STEP_COUNT:
      const currentCount = state.userStepCount[action.userId] || 0;
      return {
        ...state,
        userStepCount: { ...state.userStepCount, [action.userId]: currentCount + 1 },
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default stepsReducer;

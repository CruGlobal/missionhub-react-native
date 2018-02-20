import { REHYDRATE } from 'redux-persist/constants';

import { REQUESTS } from '../actions/api';
import {
  LOGOUT, REMOVE_STEP_REMINDER, ADD_STEP_REMINDER, COMPLETED_STEP_COUNT,
  FILTERED_CHALLENGES,
} from '../constants';
import { findAllNonPlaceHolders } from '../utils/common';

const initialState = {
  mine: [],
  suggestedForMe: {},
  suggestedForOthers: {},
  reminders: [],
  userStepCount: {},
};

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
      return {
        ...state,
        mine: mySteps,
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

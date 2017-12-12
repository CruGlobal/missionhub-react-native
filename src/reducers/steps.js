import { REHYDRATE } from 'redux-persist/constants';

import { REQUESTS } from '../actions/api';
import { LOGOUT, REMOVE_STEP_REMINDER, ADD_STEP_REMINDER } from '../constants';

const initialState = {
  mine: [],
  suggestedForMe: [],
  suggestedForOthers: [],
  reminders: [],
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
    case REQUESTS.GET_CHALLENGE_SUGGESTIONS.SUCCESS:
      // TODO: Filter this correctly
      const suggestions = action.results.findAll('challenge_suggestion') || [];
      return {
        ...state,
        // suggestedForMe: action.results.findAll('pathway_stage'),
        suggestedForMe: suggestions.filter((s) => s.self_step),
        suggestedForOthers: suggestions.filter((s) => !s.self_step),
      };
    case REQUESTS.GET_MY_CHALLENGES.SUCCESS:
      let mySteps = action.results.findAll('accepted_challenge') || [];
      mySteps = mySteps.map((s)=> {
        if (state.reminders.find((r)=> r.id === s.id)) return {...s, reminder: true};
        return s;
      });
      return {
        ...state,
        mine: mySteps.filter((s) => !s._placeHolder),
      };
    case ADD_STEP_REMINDER:
      const newMine = state.mine.map((s)=> {
        if (s.id === action.step.id) return {...s, reminder: true};
        return s;
      });
      return {
        ...state,
        mine: newMine,
        reminders: [...state.reminders, action.step],
      };
    case REMOVE_STEP_REMINDER:
      const newRemove = state.mine.map((s)=> {
        if (s.id === action.step.id) return {...s, reminder: undefined};
        return s;
      });
      return {
        ...state,
        mine: newRemove,
        reminders: state.reminders.filter((s) => s.id !== action.step.id),
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default stepsReducer;

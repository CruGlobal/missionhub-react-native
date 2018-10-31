import {
  SCREEN_FLOW_NEXT,
  SCREEN_FLOW_BACK,
  SCREEN_FLOW_CLEAR_ALL,
  SCREEN_FLOW_START,
} from '../constants';
import { screensWithoutMostRecent } from '../selectors/screenFlow';

const initialState = {
  flowName: null,
  screens: [],
};

export default function screenFlowReducer(state = initialState, action) {
  switch (action.type) {
    case SCREEN_FLOW_START: {
      const { screen, flowName } = action;
      return {
        flowName,
        screens: [screen],
      };
    }
    case SCREEN_FLOW_NEXT: {
      const { screen } = action;
      return {
        ...state,
        screens: [...state.screens, screen],
      };
    }
    case SCREEN_FLOW_BACK: {
      return {
        ...state,
        screens: screensWithoutMostRecent(state, action.times),
      };
    }
    case SCREEN_FLOW_CLEAR_ALL: {
      return initialState;
    }
    default:
      return state;
  }
}

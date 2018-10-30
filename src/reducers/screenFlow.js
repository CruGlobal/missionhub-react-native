import {
  SCREEN_FLOW_NEXT,
  SCREEN_FLOW_PREVIOUS,
  SCREEN_FLOW_CLEAR_ALL,
} from '../constants';

const initialState = {
  screens: [],
};

export default function screenFlowReducer(state = initialState, action) {
  switch (action.type) {
    case SCREEN_FLOW_NEXT: {
      const { flow, screen } = action;
      return {
        screens: [...state.screens, { flow, screen }],
      };
    }
    case SCREEN_FLOW_PREVIOUS: {
      return action.times > 0
        ? {
            screens: state.screens.slice(0, -1 * action.times),
          }
        : state;
    }
    case SCREEN_FLOW_CLEAR_ALL: {
      return initialState;
    }
    default:
      return state;
  }
}

import {
  SCREEN_FLOW_START,
  SCREEN_FLOW_NEXT,
  SCREEN_FLOW_PREVIOUS,
  SCREEN_FLOW_FINISH,
} from '../constants';

const initialState = {
  current: {
    flow: null,
    screen: null,
  },
  history: [],
};

export default function screenFlowReducer(state = initialState, action) {
  switch (action.type) {
    case SCREEN_FLOW_START:
      return {
        current: { ...action.flowState },
        history: [],
      };
    case SCREEN_FLOW_NEXT:
      return {
        current: action.flowState,
        history: [...state.history, state.current],
      };
    case SCREEN_FLOW_PREVIOUS:
      return {
        current: state.history.slice(-1)[0], // Last element in history
        history: state.history.slice(0, -1), // All but last element in history
      };
    case SCREEN_FLOW_FINISH:
      return {
        current: null, // TODO: implement
        history: null, // TODO: implement
      };
    default:
      return state;
  }
}

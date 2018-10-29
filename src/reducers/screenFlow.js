import {
  SCREEN_FLOW_START,
  SCREEN_FLOW_NEXT,
  SCREEN_FLOW_PREVIOUS,
  SCREEN_FLOW_FINISH,
} from '../constants';
import {
  currentFlow,
  previousFlows,
  previousScreensOfCurrentFlow,
} from '../selectors/screenFlow';

const initialState = {
  activeFlows: [],
};

export default function screenFlowReducer(state = initialState, action) {
  switch (action.type) {
    case SCREEN_FLOW_START: {
      const { flow, screen } = action;
      return {
        activeFlows: [...state.activeFlows, { flow, screens: [screen] }],
      };
    }
    case SCREEN_FLOW_NEXT: {
      const { screen } = action;
      return {
        activeFlows: [
          ...previousFlows(state),
          {
            ...currentFlow(state),
            screens: [...previousScreensOfCurrentFlow(state), screen],
          },
        ],
      };
    }
    case SCREEN_FLOW_PREVIOUS: {
      return {
        activeFlows: [
          ...previousFlows(state),
          {
            ...currentFlow(state),
            screens: previousScreensOfCurrentFlow(state),
          },
        ],
      };
    }
    case SCREEN_FLOW_FINISH: {
      return {
        activeFlows: previousFlows(state),
      };
    }
    default:
      return state;
  }
}

import { REHYDRATE } from 'redux-persist/constants';

import { MARKETING_CLOUD_ID_CHANGED } from '../constants';

const initialAnalyticsState = {
  mcId: '',
};

function analyticsReducer(state = initialAnalyticsState, action) {
  switch (action.type) {
    case REHYDRATE:
      const incoming = action.payload.analytics;

      if (incoming) {
        return {
          ...state,
          ...incoming,
        };
      }
      return state;
    case MARKETING_CLOUD_ID_CHANGED:
      return {
        ...state,
        mcId: action.mcId,
      };
    default:
      return state;
  }
}

export default analyticsReducer;

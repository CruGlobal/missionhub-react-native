import { REHYDRATE } from 'redux-persist/constants';

import { LOGOUT, UPDATE_JOURNEY_ITEMS } from '../constants';

const initialState = {
  'personal': {},
};

function journeyReducer(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE:
      var incoming = action.payload.journey;
      if (incoming) {
        return {
          ...state,
          ...incoming,
        };
      }
      return state;
    case UPDATE_JOURNEY_ITEMS:
      const orgId = action.orgId || 'personal';
      const org = state[orgId] || {};

      return {
        ...state,
        [orgId]: {
          ...org,
          [action.personId]: action.journeyItems,
        },
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default journeyReducer;

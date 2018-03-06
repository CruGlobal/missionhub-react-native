import { REHYDRATE } from 'redux-persist/constants';

import { LOGOUT, UPDATE_JOURNEY_ITEMS } from '../constants';

const initialState = {
  all: { //todo remove 'all'
    'personal': {},
  },
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
      const personId = action.personId;
      const orgId = action.orgId || 'personal';
      const journeyItems = action.journeyItems;

      const newState = { all: { ...state.all } };
      const org = newState.all[orgId];

      if (org) {
        org[personId] = journeyItems;
      } else {
        newState.all[orgId] = { [personId]: journeyItems };
      }
      return newState;
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default journeyReducer;

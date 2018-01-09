import { REHYDRATE } from 'redux-persist/constants';

import { REQUESTS } from '../actions/api';
import { LOGOUT } from '../constants';

const initialState = {
  myOrgId: '',
  all: [],
};

function organizationsReducer(state = initialState, action) {
  const results = action.results;
  switch (action.type) {
    case REHYDRATE:
      var incoming = action.payload.organizations;
      if (incoming) {
        return {
          ...state,
          ...incoming,
        };
      }
      return state;
    case REQUESTS.GET_MY_ORGANIZATIONS.SUCCESS:
      const orgs = (results.findAll('organization') || []).map((o) => ({ text: o.name, ...o }));
      return {
        ...state,
        all: orgs,
        myId: orgs[0] ? orgs[0].id : '',
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default organizationsReducer;
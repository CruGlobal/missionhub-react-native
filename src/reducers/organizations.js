import lodash from 'lodash';
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
      const myOrgs = (results.findAll('organization') || []).map((o) => ({ text: o.name, ...o }));
      return {
        ...state,
        all: myOrgs,
        myOrgId: myOrgs[0] ? myOrgs[0].id : '',
      };
    case REQUESTS.GET_ORGANIZATIONS.SUCCESS:
      const orgs = (results.findAll('organization') || []).map((o) => ({ text: o.name, ...o }));
      const allOrgs = lodash.uniqBy([].concat(state.all, orgs), 'id');

      return {
        ...state,
        all: allOrgs,
      };
    case REQUESTS.GET_ME.SUCCESS:
      const user = (results.findAll('person') || [])[0] || {};
      const myPrimaryOrgId = user.user ? user.user.primary_organization_id : null;
      return {
        ...state,
        myOrgId: myPrimaryOrgId || state.myId,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default organizationsReducer;
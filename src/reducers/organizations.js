import lodash from 'lodash';

import { REQUESTS } from '../actions/api';
import { LOGOUT, GET_ORGANIZATION_CONTACTS } from '../constants';

const initialState = {
  all: [],
};

function organizationsReducer(state = initialState, action) {
  const results = action.results;
  switch (action.type) {
    case REQUESTS.GET_MY_ORGANIZATIONS.SUCCESS:
      const myOrgs = (results.findAll('organization') || []).map(o => ({
        text: o.name,
        ...o,
      }));
      return {
        ...state,
        all: myOrgs,
      };
    case REQUESTS.GET_ORGANIZATIONS.SUCCESS:
      const orgs = (results.findAll('organization') || []).map(o => ({
        text: o.name,
        ...o,
      }));
      const allOrgs = lodash.uniqBy([].concat(state.all, orgs), 'id');

      return {
        ...state,
        all: allOrgs,
      };
    case GET_ORGANIZATION_CONTACTS:
      const { orgId, contacts } = action;
      return {
        ...state,
        all: orgId
          ? state.all.map(o => (o.id === orgId ? { ...o, contacts } : o))
          : state.all,
      };
    case REQUESTS.GET_ORGANIZATION_INTERACTIONS_REPORT.SUCCESS:
      console.log(results);
      return state;
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default organizationsReducer;

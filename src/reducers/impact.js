import { REQUESTS } from '../actions/api';
import { LOGOUT } from '../constants';

const initialState = {
  mine: {},
  global: {},
};

function impactReducer(state = initialState, action) {
  switch (action.type) {
    case REQUESTS.GET_MY_IMPACT.SUCCESS:
      const mine = action.results.findAll('impact_report')[0] || {};
      return {
        ...state,
        mine,
      };
    case REQUESTS.GET_GLOBAL_IMPACT.SUCCESS:
      const globalImpact = action.results.findAll('impact_report')[0] || {};
      return {
        ...state,
        global: globalImpact,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default impactReducer;

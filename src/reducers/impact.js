import { REQUESTS } from '../actions/api';
import { LOGOUT, UPDATE_PEOPLE_INTERACTION_REPORT } from '../constants';

const initialState = {
  people: {},
  interactions: {},
  global: {},
};

function impactReducer(state = initialState, action) {
  switch (action.type) {
    case REQUESTS.GET_IMPACT_BY_ID.SUCCESS:
      const impact = action.results.response;
      return {
        ...state,
        people: {
          ...state.people,
          [impact.person_id]: impact,
        },
      };
    case REQUESTS.GET_GLOBAL_IMPACT.SUCCESS:
      const globalImpact = action.results.response;
      return {
        ...state,
        global: globalImpact,
      };
    case UPDATE_PEOPLE_INTERACTION_REPORT:
      const key = `${action.personId}-${action.organizationId}`;

      return {
        ...state,
        interactions: {
          ...state.interactions,
          [key]: {
            ...state.interactions[key],
            [action.period]: action.report,
          },
        },
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default impactReducer;

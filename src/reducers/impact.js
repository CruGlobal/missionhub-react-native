import { REQUESTS } from '../actions/api';
import { LOGOUT, UPDATE_PEOPLE_INTERACTION_REPORT } from '../constants';

const initialState = {
  summary: {},
  interactions: {},
};

export default function impactReducer(state = initialState, action) {
  switch (action.type) {
    case REQUESTS.GET_IMPACT_SUMMARY.SUCCESS:
      const impact = action.results.response;
      return {
        ...state,
        summary: {
          ...state.summary,
          [storageKey(impact.person_id, impact.organization_id)]: impact,
        },
      };
    case UPDATE_PEOPLE_INTERACTION_REPORT:
      const key = storageKey(action.personId, action.organizationId);

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

const storageKey = (personId, orgId) => `${personId || ''}-${orgId || ''}`;

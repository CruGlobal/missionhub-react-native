import { REQUESTS } from '../actions/api';
import { LOGOUT, GET_ORGANIZATION_SURVEYS } from '../constants';

const initialState = {
  all: [],
  allByOrg: {},
};

export default function surveysReducer(state = initialState, action) {
  const results = action.results;
  switch (action.type) {
    case REQUESTS.GET_SURVEYS.SUCCESS:
      const surveys = (results.findAll('survey') || []).map(s => ({
        text: s.title,
        ...s,
      }));
      return {
        ...state,
        all: surveys,
      };
    case GET_ORGANIZATION_SURVEYS:
      return loadOrgSurveys(state, action);
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

function loadOrgSurveys(state, action) {
  const { orgId, surveys } = action;
  const org = state.allbyOrg[orgId] || {};

  let surveysById = org.allById || {};
  surveys.forEach(s => {
    const e = surveysById[s.id];
    surveysById[s.id] = e ? { ...e, ...s } : s;
  });

  return {
    ...state,
    allByOrg: {
      ...state.allByOrg,
      [orgId]: {
        ...org,
        allById: surveysById,
      },
    },
  };
}

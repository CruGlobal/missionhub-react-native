import { REQUESTS } from '../actions/api';
import { LOGOUT } from '../constants';

import { getPagination } from './steps';

const initialState = {
  all: [],
  surveys: {}, // All surveys split up by orgId
  surveysPagination: {
    hasNextPage: true,
    page: 1,
  },
};

function groupsReducer(state = initialState, action) {
  const results = action.results;
  switch (action.type) {
    case REQUESTS.GET_MY_GROUPS.SUCCESS:
      const groups = (results.findAll('group') || []).map(g => ({
        text: g.name,
        ...g,
      }));
      return {
        ...state,
        all: groups,
      };
    case REQUESTS.GET_GROUP_SURVEYS.SUCCESS:
      const surveys = results.response;
      const surveyOrgId = action.query.organization_id;
      // If we're doing paging, concat the old steps with the new ones
      const allSurveys =
        action.query.page &&
        action.query.page.offset > 0 &&
        state.surveys[surveyOrgId]
          ? [...state.surveys[surveyOrgId], ...surveys]
          : surveys;

      return {
        ...state,
        surveys: {
          ...state.surveys,
          [surveyOrgId]: allSurveys,
        },
        surveysPagination: getPagination(action, allSurveys.length),
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default groupsReducer;

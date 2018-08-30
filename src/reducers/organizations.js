import {
  LOGOUT,
  GET_ORGANIZATIONS_CONTACTS_REPORT,
  GET_ORGANIZATION_SURVEYS,
  GET_ORGANIZATION_MEMBERS,
  SET_CELEBRATION_FEED,
  LOAD_ORGANIZATIONS,
} from '../constants';
import { getPagination } from '../utils/common';

const initialState = {
  all: [],
  surveysPagination: {
    hasNextPage: true,
    page: 1,
  },
  membersPagination: {
    hasNextPage: true,
    page: 1,
  },
};

function organizationsReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_ORGANIZATIONS:
      return {
        ...state,
        all: action.orgs,
      };
    case GET_ORGANIZATIONS_CONTACTS_REPORT:
      const { reports } = action;
      return {
        ...state,
        all: state.all.map(o => {
          const contactReport = (reports || []).find(r => r.id === o.id);
          return contactReport ? { ...o, contactReport } : o;
        }),
      };
    case GET_ORGANIZATION_SURVEYS:
      const { orgId: surveyOrgId, query: surveyQuery, surveys } = action;
      const curSurveyOrg = state.all.find(o => o.id === surveyOrgId);
      if (!curSurveyOrg) {
        return state; // Return if the organization does not exist
      }
      const existingSurveys = curSurveyOrg.surveys || [];
      const allSurveys =
        surveyQuery.page && surveyQuery.page.offset > 0
          ? [...existingSurveys, ...surveys]
          : surveys;

      return {
        ...state,
        all: surveyOrgId
          ? state.all.map(
              o => (o.id === surveyOrgId ? { ...o, surveys: allSurveys } : o),
            )
          : state.all,
        surveysPagination: getPagination(action, allSurveys.length),
      };
    case SET_CELEBRATION_FEED:
      return setCelebrationId(action, state);
    case GET_ORGANIZATION_MEMBERS:
      const { orgId: memberOrgId, query: memberQuery, members } = action;
      const currentMemberOrg = state.all.find(o => o.id === memberOrgId);
      if (!currentMemberOrg) {
        return state; // Return if the organization does not exist
      }
      const existingMembers = currentMemberOrg.members || [];
      const allMembers =
        memberQuery.page && memberQuery.page.offset > 0
          ? [...existingMembers, ...members]
          : members;
      return {
        ...state,
        all: memberOrgId
          ? state.all.map(
              o => (o.id === memberOrgId ? { ...o, members: allMembers } : o),
            )
          : state.all,
        membersPagination: getPagination(action, allMembers.length),
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

function setCelebrationId(action, state) {
  const { orgId, feedId } = action;
  return {
    ...state,
    all: orgId
      ? state.all.map(
          o => (o.id === orgId ? { ...o, celebrationId: feedId } : o),
        )
      : state.all,
  };
}

export default organizationsReducer;

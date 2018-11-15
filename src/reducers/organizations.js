import {
  LOGOUT,
  GET_ORGANIZATIONS_CONTACTS_REPORT,
  GET_ORGANIZATION_SURVEYS,
  GET_ORGANIZATION_MEMBERS,
  RESET_CELEBRATION_PAGINATION,
  RESET_CHALLENGE_PAGINATION,
  LOAD_ORGANIZATIONS,
  DEFAULT_PAGE_LIMIT,
  UPDATE_PERSON_ATTRIBUTES,
  REMOVE_ORGANIZATION_MEMBER,
} from '../constants';
import { REQUESTS } from '../actions/api';
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
    case REQUESTS.GET_GROUP_CELEBRATE_FEED.SUCCESS:
    case REQUESTS.GET_GROUP_CHALLENGE_FEED.SUCCESS:
      const isChallenge =
        action.type === REQUESTS.GET_GROUP_CHALLENGE_FEED.SUCCESS;
      const cQuery = action.query;
      const newItems = action.results.response;
      const cOrgId = isChallenge
        ? cQuery.filters.organization_ids
        : cQuery.orgId;
      const curOrg = state.all.find(o => o.id === cOrgId);
      if (!curOrg) {
        return state; // Return if the organization does not exist
      }

      const cPagination = isChallenge
        ? 'challengePagination'
        : 'celebratePagination';
      const cItems = isChallenge ? 'challengeItems' : 'celebrateItems';

      if (
        curOrg[cPagination] &&
        curOrg[cPagination].page > action.query.page.offset / DEFAULT_PAGE_LIMIT
      ) {
        /*
         This response is from a duplicate request.  Since the pagination object is updated in the response, it is
         possible for multiple requests to be fired with the same offset parameter, which results in duplicate
         challenge items.
         */
        return state;
      }

      const existingItems = curOrg[cItems] || [];
      const allItems =
        cQuery.page && cQuery.page.offset > 0
          ? [...existingItems, ...newItems]
          : newItems;

      return {
        ...state,
        all: cOrgId
          ? state.all.map(
              o =>
                o.id === cOrgId
                  ? {
                      ...o,
                      [cItems]: allItems,
                      [cPagination]: getPagination(action, allItems.length),
                    }
                  : o,
            )
          : state.all,
      };

    case RESET_CELEBRATION_PAGINATION:
    case RESET_CHALLENGE_PAGINATION:
      const resetCPagination =
        action.type === RESET_CHALLENGE_PAGINATION
          ? 'challengePagination'
          : 'celebratePagination';
      return {
        ...state,
        all: state.all.map(
          o =>
            o.id === action.orgId
              ? {
                  ...o,
                  [resetCPagination]: { page: 0, hasNextPage: true },
                }
              : o,
        ),
      };
    case REQUESTS.LIKE_CELEBRATE_ITEM.SUCCESS:
      return toggleCelebrationLike(action, state, true);
    case REQUESTS.UNLIKE_CELEBRATE_ITEM.SUCCESS:
      return toggleCelebrationLike(action, state, false);
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
    case UPDATE_PERSON_ATTRIBUTES:
      return updateAllPersonInstances(action, state);
    case REMOVE_ORGANIZATION_MEMBER:
      const { personId, orgId } = action;

      return {
        ...state,
        all: state.all.map(
          o =>
            o.id === orgId
              ? { ...o, members: o.members.filter(m => m.id !== personId) }
              : o,
        ),
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

function toggleCelebrationLike(action, state, liked) {
  const query = action.query;
  const org = state.all.find(o => o.id === query.orgId);
  if (!org) {
    return state; // Return if the organization does not exist
  }
  const newOrg = {
    ...org,
    celebrateItems: org.celebrateItems.map(
      c =>
        c.id === query.eventId
          ? { ...c, liked, likes_count: c.likes_count + (liked ? 1 : -1) }
          : c,
    ),
  };

  return {
    ...state,
    all: state.all.map(o => (o.id === query.orgId ? newOrg : o)),
  };
}

function updateAllPersonInstances(action, state) {
  const { updatedPersonAttributes: updatedPerson } = action;
  return {
    ...state,
    all: state.all.map(
      org =>
        org.members
          ? {
              ...org,
              members: org.members.map(
                m =>
                  m.id === updatedPerson.id ? { ...m, ...updatedPerson } : m,
              ),
            }
          : org,
    ),
  };
}

export default organizationsReducer;

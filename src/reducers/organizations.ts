/* eslint complexity: 0, max-lines: 0, max-lines-per-function: 0 */
import i18next from 'i18next';

import {
  LOGOUT,
  GET_ORGANIZATIONS_CONTACTS_REPORT,
  GET_ORGANIZATION_SURVEYS,
  GET_ORGANIZATION_MEMBERS,
  RESET_CHALLENGE_PAGINATION,
  LOAD_ORGANIZATIONS,
  DEFAULT_PAGE_LIMIT,
  UPDATE_PERSON_ATTRIBUTES,
  LOAD_PERSON_DETAILS,
  REMOVE_ORGANIZATION_MEMBER,
  UPDATE_CHALLENGE,
  GLOBAL_COMMUNITY_ID,
} from '../constants';
import { REQUESTS } from '../api/routes';
import { getPagination } from '../utils/common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Organization = any; // TODO: use GraphQL type

export interface PaginationObject {
  hasNextPage: boolean;
  page: number;
}

export interface OrganizationsState {
  all: Organization[];
  surveysPagination: PaginationObject;
  membersPagination: PaginationObject;
}

const globalCommunity = {
  id: GLOBAL_COMMUNITY_ID,
  name: i18next.t('groupsList:globalCommunity'),
  community: true,
  user_created: true,
};

const initialState: OrganizationsState = {
  all: [globalCommunity],
  surveysPagination: {
    hasNextPage: true,
    page: 1,
  },
  membersPagination: {
    hasNextPage: true,
    page: 1,
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function organizationsReducer(state = initialState, action: any) {
  switch (action.type) {
    case LOAD_ORGANIZATIONS:
      return {
        ...state,
        all: [
          globalCommunity,
          ...action.orgs.map((actionOrg: Organization) => ({
            ...(state.all.find(stateOrg => stateOrg.id === actionOrg.id) || {}),
            ...actionOrg,
          })),
        ],
      };
    case REQUESTS.GET_ORGANIZATION.SUCCESS:
      return {
        ...state,
        all: state.all.find(o => o.id === action.query.orgId)
          ? state.all.map(o =>
              o.id === action.query.orgId
                ? { ...o, ...action.results.response }
                : o,
            )
          : [...state.all, action.results.response],
      };
    case GET_ORGANIZATIONS_CONTACTS_REPORT:
      const { reports } = action;
      return {
        ...state,
        all: state.all.map(o => {
          const contactReport = (reports || []).find(
            (r: { id: string }) => r.id === o.id,
          );
          return contactReport ? { ...o, contactReport } : o;
        }),
      };
    case REQUESTS.GET_USERS_REPORT.SUCCESS:
      return {
        ...state,
        all: state.all.map(o =>
          o.id === GLOBAL_COMMUNITY_ID
            ? {
                ...o,
                contactReport: {
                  ...o.contactReport,
                  memberCount: action.results.response.users_count,
                },
              }
            : o,
        ),
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
          ? state.all.map(o =>
              o.id === surveyOrgId ? { ...o, surveys: allSurveys } : o,
            )
          : state.all,
        surveysPagination: getPagination(action, allSurveys.length),
      };
    case REQUESTS.GET_GROUP_CHALLENGE_FEED.SUCCESS:
      const isChallenge =
        action.type === REQUESTS.GET_GROUP_CHALLENGE_FEED.SUCCESS;
      const cQuery = action.query;
      const newItems = action.results.response;
      const cOrgId = isChallenge
        ? cQuery.filters.organization_ids === 'null'
          ? GLOBAL_COMMUNITY_ID
          : cQuery.filters.organization_ids
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
          ? state.all.map(o =>
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
    case RESET_CHALLENGE_PAGINATION:
      const resetCPagination =
        action.type === RESET_CHALLENGE_PAGINATION
          ? 'challengePagination'
          : 'celebratePagination';
      return {
        ...state,
        all: state.all.map(o =>
          o.id === action.orgId
            ? {
                ...o,
                [resetCPagination]: { page: 0, hasNextPage: true },
              }
            : o,
        ),
      };
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
          ? state.all.map(o =>
              o.id === memberOrgId ? { ...o, members: allMembers } : o,
            )
          : state.all,
        membersPagination: getPagination(action, allMembers.length),
      };
    case REQUESTS.UPDATE_ORGANIZATION.SUCCESS:
    case REQUESTS.UPDATE_ORGANIZATION_IMAGE.SUCCESS:
    case REQUESTS.ORGANIZATION_NEW_CODE.SUCCESS:
    case REQUESTS.ORGANIZATION_NEW_LINK.SUCCESS:
      const {
        results: { response: updatedOrgResponse },
      } = action;

      return {
        ...state,
        all: state.all.map(o =>
          o.id === updatedOrgResponse.id
            ? {
                ...o,
                // Update certain fields from the response
                name: updatedOrgResponse.name,
                community_photo_url: updatedOrgResponse.community_photo_url,
                community_code: updatedOrgResponse.community_code,
                community_url: updatedOrgResponse.community_url,
              }
            : o,
        ),
      };
    case UPDATE_PERSON_ATTRIBUTES:
      return updateAllPersonInstances(action.updatedPersonAttributes, state);
    case LOAD_PERSON_DETAILS:
      return updateAllPersonInstances(action.person, state);
    case REQUESTS.GET_ME.SUCCESS:
      return updateAllPersonInstances(action.results.response, state);
    case REQUESTS.GET_UNREAD_COMMENTS_NOTIFICATION.SUCCESS:
      const commentCounts = action.results.response.organizational_permissions.reduce(
        (
          acc: object,
          {
            organization: { id, unread_comments_count },
          }: { organization: Organization },
        ) => ({
          ...acc,
          [id]: unread_comments_count,
        }),
        {},
      );

      return {
        ...state,
        all: state.all.map(o => ({
          ...o,
          unread_comments_count: commentCounts[o.id] || o.unread_comments_count,
        })),
      };
    case REMOVE_ORGANIZATION_MEMBER:
      const { personId, orgId } = action;

      return {
        ...state,
        all: state.all.map(o =>
          o.id === orgId
            ? {
                ...o,
                members: o.members.filter(
                  (m: { id: string }) => m.id !== personId,
                ),
              }
            : o,
        ),
      };
    case UPDATE_CHALLENGE:
      return updateChallenge(action, state);

    case REQUESTS.MARK_ORG_COMMENTS_AS_READ.SUCCESS:
      if (!action.query.organization_id) {
        return state;
      }
      return {
        ...state,
        all: state.all.map(org =>
          org.id === action.query.organization_id
            ? {
                ...org,
                unread_comments_count: 0,
              }
            : org,
        ),
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function updateAllPersonInstances(updatedPerson: { id: string }, state: any) {
  return {
    ...state,
    all: state.all.map((org: Organization) =>
      org.members
        ? {
            ...org,
            members: org.members.map((m: { id: string }) =>
              m.id === updatedPerson.id ? { ...m, ...updatedPerson } : m,
            ),
          }
        : org,
    ),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function updateChallenge(action: any, state: any) {
  const { challenge = {} } = action;
  const orgId =
    (challenge.organization && challenge.organization.id) || undefined;

  return {
    ...state,
    all: orgId
      ? state.all.map((o: Organization) =>
          o.id === orgId
            ? {
                ...o,
                challengeItems: o.challengeItems.map((c: { id: string }) =>
                  c.id === challenge.id ? { ...c, ...challenge } : c,
                ),
              }
            : o,
        )
      : state.all,
  };
}

export default organizationsReducer;

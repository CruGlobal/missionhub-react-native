import { ImageURISource } from 'react-native';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import {
  GET_ORGANIZATIONS_CONTACTS_REPORT,
  GET_ORGANIZATION_MEMBERS,
  GET_ORGANIZATION_PEOPLE,
  DEFAULT_PAGE_LIMIT,
  LOAD_ORGANIZATIONS,
  REMOVE_ORGANIZATION_MEMBER,
  ACTIONS,
  ORG_PERMISSIONS,
  ERROR_PERSON_PART_OF_ORG,
  GLOBAL_COMMUNITY_ID,
  LOAD_PERSON_DETAILS,
} from '../constants';
import { timeFilter } from '../utils/filters';
import { removeHiddenOrgs } from '../selectors/selectorUtils';
import { organizationSelector } from '../selectors/organizations';
import { getScreenForOrg } from '../containers/Groups/GroupScreen';
import { GROUP_UNREAD_FEED_SCREEN } from '../containers/Groups/GroupUnreadFeed';
import { CELEBRATE_DETAIL_SCREEN } from '../containers/CelebrateDetailScreen';
import { REQUESTS } from '../api/routes';
import { AuthState } from '../reducers/auth';
import {
  Organization,
  OrganizationsState,
  PaginationObject,
} from '../reducers/organizations';
import { Person } from '../reducers/people';

import { getMe, getPersonDetails } from './person';
import callApi from './api';
import { trackActionWithoutData } from './analytics';
import { navigateReset, navigateNestedReset } from './navigation';

interface OrgContactReport {
  organization_id: string;
  contact_count: number;
  unassigned_count: number;
  uncontacted_count: number;
  member_count: number;
}
interface PersonInteractionReport {
  person_id: string;
  contact_count: number;
  unassigned_count: number;
  uncontacted_count: number;
  contacts_with_interaction_count: number;
}
interface ImageData {
  fileSize: number;
  fileName: string;
  fileType: string;
  width: number;
  height: number;
  isVertical: boolean;
  uri: string;
}

const getOrganizationsQuery = {
  limit: 100,
  include: '',
  filters: {
    descendants: false,
  },
  sort: 'name',
};

export function getMyCommunities() {
  return async (
    dispatch: ThunkDispatch<
      { auth: AuthState; organizations: OrganizationsState },
      {},
      AnyAction
    >,
  ) => {
    await dispatch(getMyOrganizations());
    dispatch(getUsersReport());
    return dispatch(getOrganizationsContactReports());
  };
}

export function getMyOrganizations() {
  return async (
    dispatch: ThunkDispatch<{}, null, AnyAction>,
    getState: () => { auth: AuthState },
  ) => {
    const orgs: Organization[] = await dispatch(
      callApi(REQUESTS.GET_ORGANIZATIONS, getOrganizationsQuery),
    ).response;
    const orgOrder = getState().auth.person.user.organization_order;

    if (orgOrder) {
      orgs.sort((a, b) => {
        const aIndex = orgOrder.indexOf(a.id);
        const bIndex = orgOrder.indexOf(b.id);

        if (aIndex === -1) {
          return bIndex === -1 ? 0 : 1;
        }

        if (bIndex === -1) {
          return aIndex === -1 ? 0 : -1;
        }

        return aIndex > bIndex ? 1 : -1;
      });
    }

    dispatch({
      type: LOAD_ORGANIZATIONS,
      orgs,
    });
  };
}

function getOrganization(orgId: string) {
  return (dispatch: ThunkDispatch<{}, null, AnyAction>) =>
    dispatch(callApi(REQUESTS.GET_ORGANIZATION, { orgId }));
}

export function refreshCommunity(orgId: string) {
  return async (
    dispatch: ThunkDispatch<{}, null, AnyAction>,
    getState: () => { organizations: OrganizationsState },
  ) => {
    if (orgId === GLOBAL_COMMUNITY_ID) {
      return getState().organizations.all.find(
        o => o.id === GLOBAL_COMMUNITY_ID,
      );
    }

    //Refresh Community Data
    const { response } = await dispatch(getOrganization(orgId));
    //Refresh user org permissions
    dispatch(getMe());

    return response;
  };
}

export function getOrganizationsContactReports() {
  return async (
    dispatch: ThunkDispatch<{}, null, AnyAction>,
    getState: () => { auth: AuthState; organizations: OrganizationsState },
  ) => {
    const {
      organizations,
      auth: { person },
    } = getState();

    const visibleOrgs: Organization[] = removeHiddenOrgs(
      organizations.all,
      person,
    );

    if (visibleOrgs.length === 0) {
      return;
    }

    const organization_ids = visibleOrgs
      .filter(org => org.community && org.id !== GLOBAL_COMMUNITY_ID)
      .map(org => org.id)
      .join(',');

    const reports: OrgContactReport[] = await dispatch(
      callApi(REQUESTS.GET_ORGANIZATION_INTERACTIONS_REPORT, {
        period: 'P1W',
        organization_ids,
      }),
    ).response;

    dispatch({
      type: GET_ORGANIZATIONS_CONTACTS_REPORT,
      reports: reports.map(r => ({
        id: `${r.organization_id}`,
        contactsCount: r.contact_count,
        unassignedCount: r.unassigned_count,
        uncontactedCount: r.uncontacted_count,
        memberCount: r.member_count,
      })),
    });
    return reports;
  };
}

export function getUsersReport() {
  return (dispatch: ThunkDispatch<{}, null, AnyAction>) =>
    dispatch(callApi(REQUESTS.GET_USERS_REPORT));
}

export function getOrganizationContacts(
  orgId: string,
  name: string,
  pagination: PaginationObject,
  filters: { [key: string]: any } = {},
) {
  const query: { [key: string]: any } = {
    filters: {
      organization_ids: orgId,
    },
    include:
      'reverse_contact_assignments,reverse_contact_assignments.organization,organizational_permissions',
  };
  if (name) {
    query.filters.name = name;
  }

  const answerFilters = getAnswersFromFilters(filters);
  if (answerFilters) {
    query.filters.answer_sheets = { answers: answerFilters };
  }
  if (filters.survey) {
    query.filters.answer_sheets = {
      ...(query.filters.answer_sheets || {}),
      survey_ids: filters.survey.id,
    };

    // If there is a survey AND we're filtering by time, apply the time filter to the answer_sheets
    if (filters.time) {
      const dates = timeFilter(filters.time.value);
      query.filters.answer_sheets = {
        ...(query.filters.answer_sheets || {}),
        created_at: [dates.first, dates.last],
      };
    }
  } else {
    // TODO: Enable this when the API supports sorting contacts by `updated_at`
    //   if (filters.time) {
    //     const dates = timeFilter(filters.time.value);
    //     query.filters.updated_at = [dates.first, dates.last];
    //   }
  }
  if (filters.gender) {
    query.filters.genders = filters.gender.id;
  }
  if (filters.archived) {
    query.filters.include_archived = true;
  }
  if (filters.unassigned) {
    query.filters.assigned_tos = 'unassigned';
  }
  if (filters.uncontacted) {
    query.filters.statuses = 'uncontacted';
  }
  if (filters.labels) {
    query.filters.label_ids = filters.labels.id;
  }
  if (filters.groups) {
    query.filters.group_ids = filters.groups.id;
  }
  if (!filters.includeUsers) {
    query.filters.permissions = 'no_permission';
  }

  const offset = DEFAULT_PAGE_LIMIT * pagination.page;

  query.page = {
    limit: DEFAULT_PAGE_LIMIT,
    offset,
  };

  return async (dispatch: ThunkDispatch<{}, null, AnyAction>) => {
    const result = await dispatch(callApi(REQUESTS.GET_PEOPLE_LIST, query));

    dispatch({
      type: GET_ORGANIZATION_PEOPLE,
      orgId,
      response: result.response,
    });
    return result;
  };
}

//each question/answer filter must be in the URL in the form:
//filters[answers][questionId][]=answerTexts
function getAnswersFromFilters(filters: { [key: string]: any }) {
  const arrFilters = Object.keys(filters).map(k => filters[k]);
  const answers = arrFilters.filter(f => f && f.isAnswer);
  if (answers.length === 0) {
    return null;
  }
  const answerFilters: { [key: string]: any } = {};
  answers.forEach(f => {
    answerFilters[f.id] = [f.text];
  });
  return answerFilters;
}

export function getOrganizationMembers(orgId: string, query = {}) {
  const newQuery = {
    ...query,
    filters: {
      permissions: 'owner,admin,user',
      organization_ids: orgId,
    },
    include: 'organizational_permissions,reverse_contact_assignments',
  };
  return async (dispatch: ThunkDispatch<{}, null, AnyAction>) => {
    const {
      response: members,
      meta,
    }: { response: Person[]; meta: any } = await dispatch(
      callApi(REQUESTS.GET_PEOPLE_LIST, newQuery),
    );

    const memberIds = members.map(m => m.id);
    const reportQuery = {
      people_ids: memberIds.join(','),
      period: 'P1Y',
      organization_ids: orgId,
    };
    const reports: PersonInteractionReport[] = await dispatch(
      callApi(REQUESTS.GET_PEOPLE_INTERACTIONS_REPORT, reportQuery),
    ).response;

    // Get an object with { [key = person_id]: [value = { counts }] }
    const reportsCountObj: { [key: string]: any } = reports.reduce(
      (p, n) => ({
        ...p,
        [`${n.person_id}`]: {
          contact_count: n.contact_count,
          uncontacted_count: n.uncontacted_count,
          contacts_with_interaction_count: n.contacts_with_interaction_count,
        },
      }),
      {},
    );
    // Merge the counts into the members array
    const membersWithCounts = members.map(m => ({
      ...m,
      ...(reportsCountObj[m.id] || {}),
    }));

    dispatch({
      type: GET_ORGANIZATION_MEMBERS,
      orgId,
      members: membersWithCounts,
      query: newQuery,
      meta,
    });
    dispatch({
      type: GET_ORGANIZATION_PEOPLE,
      orgId,
      response: membersWithCounts,
    });

    return membersWithCounts;
  };
}

export function getOrganizationMembersNextPage(orgId: string) {
  return (
    dispatch: ThunkDispatch<{}, null, AnyAction>,
    getState: () => { organizations: OrganizationsState },
  ) => {
    const { page, hasNextPage } = getState().organizations.membersPagination;
    if (!hasNextPage) {
      // Does not have more data
      return Promise.resolve();
    }
    const query = {
      page: {
        limit: DEFAULT_PAGE_LIMIT,
        offset: DEFAULT_PAGE_LIMIT * page,
      },
    };
    return dispatch(getOrganizationMembers(orgId, query));
  };
}

export function addNewPerson(data: { [key: string]: any }) {
  return async (
    dispatch: ThunkDispatch<{}, null, AnyAction>,
    getState: () => { auth: AuthState },
  ) => {
    const {
      person: { id: myId },
    } = getState().auth;
    if (!data || !data.firstName) {
      return Promise.reject(
        'Invalid Data from addNewPerson: no data or no firstName passed in',
      );
    }
    const included = [];
    if (data.assignToMe) {
      included.push({
        type: 'contact_assignment',
        attributes: {
          assigned_to_id: myId,
          organization_id: data.orgId || undefined,
        },
      });
    }
    if (data.orgId) {
      included.push({
        type: 'organizational_permission',
        attributes: {
          organization_id: data.orgId,
          permission_id: data.orgPermission && data.orgPermission.permission_id,
        },
      });
    }
    if (data.email) {
      included.push({
        type: 'email',
        attributes: { email: data.email },
      });
    }
    if (data.phone) {
      included.push({
        type: 'phone_number',
        attributes: {
          number: data.phone,
          location: 'mobile',
        },
      });
    }
    const bodyData = {
      data: {
        type: 'person',
        attributes: {
          first_name: data.firstName,
          last_name: data.lastName || undefined,
          gender: data.gender || undefined,
        },
      },
      included,
    };
    const query = {};
    const results = await dispatch(
      callApi(REQUESTS.ADD_NEW_PERSON, query, bodyData),
    );

    dispatch({
      type: LOAD_PERSON_DETAILS,
      orgId: data.orgId,
      person: results.response,
    });

    return results;
  };
}

export function updateOrganization(orgId: string, data: { name: string }) {
  return (dispatch: ThunkDispatch<{}, null, AnyAction>) => {
    if (!data) {
      return Promise.reject(
        'Invalid Data from updateOrganization: no data passed in',
      );
    }
    const bodyData = {
      data: {
        type: 'organization',
        attributes: {
          name: data.name,
        },
      },
    };
    const query = { orgId };
    return dispatch(callApi(REQUESTS.UPDATE_ORGANIZATION, query, bodyData));
  };
}

export function updateOrganizationImage(orgId: string, imageData: ImageData) {
  return (dispatch: ThunkDispatch<{}, null, AnyAction>) => {
    if (!imageData) {
      return Promise.reject(
        'Invalid Data from updateOrganizationImage: no image data passed in',
      );
    }

    const data = new FormData();

    data.append('data[attributes][community_photo][uri]', imageData.uri);
    data.append('data[attributes][community_photo][name]', imageData.fileName);
    data.append('data[attributes][community_photo][type]', imageData.fileType);

    return dispatch(
      callApi(REQUESTS.UPDATE_ORGANIZATION_IMAGE, { orgId }, data),
    );
  };
}

export function transferOrgOwnership(orgId: string, person_id: string) {
  return async (dispatch: ThunkDispatch<{}, null, AnyAction>) => {
    const { response } = await dispatch(
      callApi(
        REQUESTS.TRANSFER_ORG_OWNERSHIP,
        { orgId },
        {
          data: {
            type: 'organization_ownership_transfer',
            attributes: { person_id },
          },
        },
      ),
    );
    dispatch(trackActionWithoutData(ACTIONS.MANAGE_MAKE_OWNER));

    // After transfer, update auth person and other person with new org permissions
    dispatch(getMe());
    dispatch(getPersonDetails(person_id, orgId));

    return response;
  };
}

export function addNewOrganization(name: string, imageData: ImageData) {
  return async (
    dispatch: ThunkDispatch<{ auth: AuthState }, null, AnyAction>,
  ) => {
    if (!name) {
      return Promise.reject(
        'Invalid Data from addNewOrganization: no org name passed in',
      );
    }
    const bodyData = {
      data: {
        type: 'organization',
        attributes: {
          name,
          user_created: true,
        },
      },
    };
    const query = {};
    const results = await dispatch(
      callApi(REQUESTS.ADD_NEW_ORGANIZATION, query, bodyData),
    );
    dispatch(trackActionWithoutData(ACTIONS.CREATE_COMMUNITY));

    if (imageData) {
      // After the org is created, update the image with the image data passed in
      const newOrgId = results.response.id;
      await dispatch(updateOrganizationImage(newOrgId, imageData));
      dispatch(trackActionWithoutData(ACTIONS.ADD_COMMUNITY_PHOTO));
    }
    await dispatch(getMyOrganizations());
    // After the org is created, update auth person with new org permissions
    dispatch(getMe());

    return results;
  };
}

export function deleteOrganization(orgId: string) {
  return async (dispatch: ThunkDispatch<{}, null, AnyAction>) => {
    const query = { orgId };
    const results = await dispatch(
      callApi(REQUESTS.DELETE_ORGANIZATION, query),
    );
    dispatch(trackActionWithoutData(ACTIONS.COMMUNITY_DELETE));

    return results;
  };
}

export function lookupOrgCommunityCode(code: string) {
  return async (
    dispatch: ThunkDispatch<{}, null, AnyAction>,
    getState: () => { auth: AuthState },
  ) => {
    const query = { community_code: code };
    const { response: org = {} } = await dispatch(
      callApi(REQUESTS.LOOKUP_COMMUNITY_CODE, query),
    );
    dispatch(trackActionWithoutData(ACTIONS.SEARCH_COMMUNITY_WITH_CODE));

    if (!org.id) {
      return null;
    }

    if (getState().auth.token) {
      const orgWithOwner = await dispatch(getOwner(org));

      // No need to get member count anymore since it's an authenticated route
      // Leaving this code here in case we change that route to be unauthenticated
      // get the report information and append it to the org
      // const reportQuery = {
      //   organization_ids: org.id,
      //   period: 'P1W',
      // };
      // const { response: reports } = await dispatch(
      //   callApi(REQUESTS.GET_ORGANIZATION_INTERACTIONS_REPORT, reportQuery),
      // );

      // const report = reports[0] || {};
      // org.contactReport = {
      //   contactsCount: report.contact_count,
      //   unassignedCount: report.unassigned_count,
      //   uncontactedCount: report.uncontacted_count,
      //   memberCount: report.member_count,
      // };

      return orgWithOwner;
    }

    return org;
  };
}

export function lookupOrgCommunityUrl(urlCode: string) {
  return async (
    dispatch: ThunkDispatch<{}, null, AnyAction>,
    getState: () => { auth: AuthState },
  ) => {
    const query = { community_url: urlCode };
    const { response: org = {} } = await dispatch(
      callApi(REQUESTS.LOOKUP_COMMUNITY_URL, query),
    );
    // dispatch(trackActionWithoutData(ACTIONS.SEARCH_COMMUNITY_WITH_CODE)); // TODO: implement Url version

    if (!org.id) {
      return null;
    }

    if (getState().auth.token) {
      const orgWithOwner = await dispatch(getOwner(org));

      return orgWithOwner;
    }

    return org;
  };
}

function getOwner(org: Organization) {
  return async (dispatch: ThunkDispatch<{}, null, AnyAction>) => {
    // get the owner information and append it to the org
    const ownerQuery = {
      filters: {
        permissions: 'owner',
        organization_ids: org.id,
      },
    };
    const { response: ownerResponse } = await dispatch(
      callApi(REQUESTS.GET_PEOPLE_LIST, ownerQuery),
    );
    org.owner = ownerResponse[0];
    return { ...org, owner: ownerResponse[0] };
  };
}

export function joinCommunity(orgId: string, code?: string, url?: string) {
  return async (
    dispatch: ThunkDispatch<{}, null, AnyAction>,
    getState: () => { auth: AuthState },
  ) => {
    const myId = getState().auth.person.id;
    const attributes: { [key: string]: string } = {
      organization_id: orgId,
      permission_id: ORG_PERMISSIONS.USER,
    };
    if (code) {
      attributes.community_code = code;
    } else if (url) {
      attributes.community_url = url;
    } else {
      return Promise.reject(
        'Invalid Data from joinCommunity: must pass in a code or url',
      );
    }
    attributes.person_id = myId;
    const bodyData = {
      data: {
        type: 'organizational_permission',
        attributes,
      },
    };

    try {
      await dispatch(callApi(REQUESTS.JOIN_COMMUNITY, {}, bodyData));
    } catch (error) {
      // If the user is already part of the organization, just continue like normal
      if (
        !(
          error &&
          error.apiError &&
          error.apiError.errors &&
          error.apiError.errors[0] &&
          error.apiError.errors[0].detail === ERROR_PERSON_PART_OF_ORG
        )
      ) {
        throw error;
      }
    }

    dispatch(trackActionWithoutData(ACTIONS.JOIN_COMMUNITY_WITH_CODE));
  };
}

export function generateNewCode(orgId: string) {
  return async (dispatch: ThunkDispatch<{}, null, AnyAction>) => {
    const results = await dispatch(
      callApi(REQUESTS.ORGANIZATION_NEW_CODE, { orgId }),
    );
    dispatch(trackActionWithoutData(ACTIONS.NEW_CODE));

    return results;
  };
}

export function generateNewLink(orgId: string) {
  return async (dispatch: ThunkDispatch<{}, null, AnyAction>) => {
    const results = await dispatch(
      callApi(REQUESTS.ORGANIZATION_NEW_LINK, { orgId }),
    );
    dispatch(trackActionWithoutData(ACTIONS.NEW_INVITE_URL));

    return results;
  };
}

export function removeOrganizationMember(personId: string, orgId: string) {
  return {
    type: REMOVE_ORGANIZATION_MEMBER,
    personId,
    orgId,
  };
}

export function navigateToOrg(
  orgId: string = GLOBAL_COMMUNITY_ID,
  initialTab: string,
) {
  return (
    dispatch: ThunkDispatch<{}, null, AnyAction>,
    getState: () => { organizations: OrganizationsState },
  ) => {
    const { organizations } = getState();
    const { user_created } = organizationSelector({ organizations }, { orgId });

    return dispatch(
      navigateReset(getScreenForOrg(orgId, user_created), {
        orgId,
        initialTab,
      }),
    );
  };
}

export function navigateToCelebrateComments(
  orgId: string,
  celebrationItemId: string,
) {
  return async (
    dispatch: ThunkDispatch<{}, null, AnyAction>,
    getState: () => { organizations: OrganizationsState },
  ) => {
    const { organizations } = getState();
    const organization = organizationSelector({ organizations }, { orgId });

    const event = { id: celebrationItemId, organization };

    await dispatch(
      navigateNestedReset([
        {
          routeName: getScreenForOrg(orgId, organization.user_created),
          params: { orgId },
        },
        { routeName: GROUP_UNREAD_FEED_SCREEN, params: { organization } },
        { routeName: CELEBRATE_DETAIL_SCREEN, params: { event } },
      ]),
    );
  };
}

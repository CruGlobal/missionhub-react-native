import {
  GET_ORGANIZATIONS_CONTACTS_REPORT,
  GET_ORGANIZATION_MEMBERS,
  DEFAULT_PAGE_LIMIT,
  LOAD_ORGANIZATIONS,
  ORGANIZATION_CONTACTS_SEARCH,
  SURVEY_CONTACTS_SEARCH,
  RESET_ORGANIZATION_CONTACTS,
  RESET_SURVEY_CONTACTS,
} from '../constants';
import { timeFilter } from '../utils/filters';
import { organizationSelector } from '../selectors/organizations';

import callApi, { REQUESTS } from './api';

const getOrganizationsQuery = {
  limit: 100,
  include: '',
  filters: {
    descendants: false,
  },
};

export function getMyCommunities() {
  return async dispatch => {
    await dispatch(getMyOrganizations());
    return dispatch(getOrganizationsContactReports());
  };
}

export function getMyOrganizations() {
  return async (dispatch, getState) => {
    const { response: orgs } = await dispatch(
      callApi(REQUESTS.GET_ORGANIZATIONS, getOrganizationsQuery),
    );
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

export function getOrganizationsContactReports() {
  return async dispatch => {
    const { response } = await dispatch(
      callApi(REQUESTS.GET_ORGANIZATION_INTERACTIONS_REPORT, { period: 'P1W' }),
    );

    dispatch({
      type: GET_ORGANIZATIONS_CONTACTS_REPORT,
      reports: response.map(r => ({
        id: `${r.organization_id}`,
        contactsCount: r.contact_count,
        unassignedCount: r.unassigned_count,
        uncontactedCount: r.uncontacted_count,
      })),
    });
    return response;
  };
}

export function getOrganizationContacts(orgId, name, filters = {}) {
  const query = {
    filters: {
      permissions: 'no_permission',
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

  return async (dispatch, getState) => {
    const { organizations } = getState();
    const org = organizationSelector({ organizations }, { orgId });
    const pagination = org.contactPagination || { page: 0, hasNextPage: true };

    const offset = DEFAULT_PAGE_LIMIT * pagination.page;

    query.page = {
      limit: DEFAULT_PAGE_LIMIT,
      offset,
    };

    const { response, meta } = await dispatch(
      callApi(REQUESTS.GET_PEOPLE_LIST, query),
    );

    return dispatch({
      type: filters.survey
        ? SURVEY_CONTACTS_SEARCH
        : ORGANIZATION_CONTACTS_SEARCH,
      orgId,
      contacts: response,
      query,
      meta,
    });
  };
}

export function reloadOrganizationContacts(orgId, name, filters = {}) {
  return (dispatch, getState) => {
    const { organizations } = getState();
    const org = organizationSelector({ organizations }, { orgId });

    if (filters.survey && filters.survey.id) {
      const surveyId = filters.survey.id;
      if (
        org.surveys &&
        org.surveys[surveyId] &&
        org.surveys[surveyId].contactPagination
      ) {
        dispatch(resetContactPagination(orgId, surveyId));
      }
    }

    if (org && org.contactPagination) {
      dispatch(resetContactPagination(orgId));
    }
    return dispatch(getOrganizationContacts(orgId, name, filters));
  };
}

const resetContactPagination = (orgId, surveyId = undefined) => {
  return {
    type: surveyId ? RESET_SURVEY_CONTACTS : RESET_ORGANIZATION_CONTACTS,
    orgId,
    surveyId,
  };
};

//each question/answer filter must be in the URL in the form:
//filters[answers][questionId][]=answerTexts
function getAnswersFromFilters(filters) {
  const arrFilters = Object.keys(filters).map(k => filters[k]);
  const answers = arrFilters.filter(f => f.isAnswer);
  if (answers.length === 0) {
    return null;
  }
  let answerFilters = {};
  answers.forEach(f => {
    answerFilters[f.id] = [f.text];
  });
  return answerFilters;
}

//todo probably should start storing this stuff in Redux
export function getOrganizationMembers(orgId, query = {}) {
  const newQuery = {
    ...query,
    filters: {
      permissions: 'admin,user',
      organization_ids: orgId,
    },
    include: 'organizational_permissions',
  };
  return async dispatch => {
    const { response: members, meta } = await dispatch(
      callApi(REQUESTS.GET_PEOPLE_LIST, newQuery),
    );

    const memberIds = members.map(m => m.id);
    const reportQuery = {
      people_ids: memberIds.join(','),
      period: 'P1Y',
      organization_ids: orgId,
    };
    const { response: reportResponse } = await dispatch(
      callApi(REQUESTS.GET_PEOPLE_INTERACTIONS_REPORT, reportQuery),
    );

    // Get an object with { [key = person_id]: [value = { counts }] }
    const reportsCountObj = reportResponse.reduce(
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
    return membersWithCounts;
  };
}

export function getOrganizationMembersNextPage(orgId) {
  return (dispatch, getState) => {
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

export function addNewContact(data) {
  return (dispatch, getState) => {
    const {
      person: { id: myId },
    } = getState().auth;
    if (!data || !data.firstName) {
      return Promise.reject(
        `Invalid Data from addNewContact: no data or no firstName passed in`,
      );
    }
    let included = [];
    included.push({
      type: 'contact_assignment',
      attributes: {
        assigned_to_id: myId,
        organization_id: data.orgId || undefined,
      },
    });
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
    return dispatch(callApi(REQUESTS.ADD_NEW_PERSON, query, bodyData));
  };
}

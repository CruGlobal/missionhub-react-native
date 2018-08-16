import { PEOPLE_WITH_ORG_SECTIONS } from '../constants';

import callApi, { REQUESTS } from './api';

export function getMyPeople() {
  return async (dispatch, getState) => {
    const peopleQuery = {
      filters: {
        assigned_tos: 'me',
      },
      page: {
        limit: 1000,
      },
      include:
        'reverse_contact_assignments,reverse_contact_assignments.organization,organizational_permissions,phone_numbers,email_addresses',
    };

    const people = (await dispatch(
      callApi(REQUESTS.GET_PEOPLE_LIST, peopleQuery),
    )).response;
    const authPerson = getState().auth.person;
    const initOrgs = {
      personal: { id: 'personal', people: { [authPerson.id]: authPerson } },
    };

    const orgs = people.reduce((orgs, person) => {
      return (
        person.reverse_contact_assignments
          .filter(
            contactAssignment =>
              contactAssignment.assigned_to &&
              contactAssignment.assigned_to.id === authPerson.id,
          )
          .map(contactAssignment => contactAssignment.organization)
          // Verify contact assignment is in personal org or person has an org permission in current org
          .filter(
            org =>
              !org ||
              person.organizational_permissions.find(
                orgPermission =>
                  orgPermission.organization &&
                  orgPermission.organization.id === org.id,
              ),
          )
          .reduce((orgs, org) => {
            const orgId = (org && org.id) || 'personal';
            const orgData = orgs[orgId] || org;
            return {
              ...orgs,
              [orgId]: {
                ...orgData,
                people: {
                  ...(orgData.people || {}),
                  [person.id]: person,
                },
              },
            };
          }, orgs)
      );
    }, initOrgs);

    return dispatch({ type: PEOPLE_WITH_ORG_SECTIONS, orgs });
  };
}

export function searchPeople(text = '', filters = {}) {
  return dispatch => {
    const query = {
      q: text,
      fields: {
        person: 'first_name,last_name',
        organization: 'name',
      },
      include:
        'organizational_permissions.organization,reverse_contact_assignments',
      filters: {},
    };
    if (filters.ministry) {
      query.organization_ids = filters.ministry.id;
    }
    if (filters.gender) {
      query.filters.gender = filters.gender.id;
    }
    if (filters.archived) {
      query.filters.archived = true;
    }
    if (filters.unassigned) {
      query.filters.unassigned = true;
    }
    if (filters.labels) {
      query.filters.label_ids = filters.labels.id;
    }
    if (filters.groups) {
      query.filters.group_ids = filters.groups.id;
    }
    if (filters.surveys) {
      query.filters.survey_ids = filters.surveys.id;
    }
    if (filters.permission_ids) {
      query.filters.permission_ids = filters.permission_ids;
    }

    return dispatch(callApi(REQUESTS.SEARCH, query));
  };
}

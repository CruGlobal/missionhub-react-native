import { PEOPLE_WITH_ORG_SECTIONS } from '../constants';
import { REQUESTS } from '../api/routes';
import { Person } from '../reducers/people';

import callApi from './api';

export function getMyPeople() {
  // @ts-ignore
  return async (dispatch, getState) => {
    const peopleQuery = {
      filters: {
        assigned_tos: 'me',
      },
      page: {
        limit: 1000,
      },
      include:
        'reverse_contact_assignments,reverse_contact_assignments.organization,organizational_permissions',
    };

    const loadedPeople: Person[] = (
      await dispatch(callApi(REQUESTS.GET_PEOPLE_LIST, peopleQuery))
    ).response;
    const authPerson = getState().auth.person;

    const people = [
      authPerson,
      ...loadedPeople.filter(person => {
        return person.reverse_contact_assignments.some(
          // @ts-ignore
          contactAssignment =>
            contactAssignment.assigned_to &&
            contactAssignment.assigned_to.id === authPerson.id,
        );
      }),
    ];

    return dispatch({ type: PEOPLE_WITH_ORG_SECTIONS, response: people });
  };
}

export function searchPeople(text = '', filters = {}) {
  // @ts-ignore
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
    // @ts-ignore
    if (filters.ministry) {
      // @ts-ignore
      query.organization_ids = filters.ministry.id;
    }
    // @ts-ignore
    if (filters.gender) {
      // @ts-ignore
      query.filters.gender = filters.gender.id;
    }
    // @ts-ignore
    if (filters.archived) {
      // @ts-ignore
      query.filters.archived = true;
    }
    // @ts-ignore
    if (filters.unassigned) {
      // @ts-ignore
      query.filters.unassigned = true;
    }
    // @ts-ignore
    if (filters.labels) {
      // @ts-ignore
      query.filters.label_ids = filters.labels.id;
    }
    // @ts-ignore
    if (filters.groups) {
      // @ts-ignore
      query.filters.group_ids = filters.groups.id;
    }
    // @ts-ignore
    if (filters.surveys) {
      // @ts-ignore
      query.filters.survey_ids = filters.surveys.id;
    }
    // @ts-ignore
    if (filters.permission_ids) {
      // @ts-ignore
      query.filters.permission_ids = filters.permission_ids;
    }

    return dispatch(callApi(REQUESTS.SEARCH, query));
  };
}

import callApi, { REQUESTS } from './api';
import { PEOPLE_WITH_ORG_SECTIONS } from '../constants';

export function getMe() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_ME));
  };
}

export function getPerson(id) {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_PERSON, { person_id: id }));
  };
}

export function getPeopleList() {
  return (dispatch) => {
    const query = {
      filters: {
        assigned_tos: 'me',
      },
    };
    return dispatch(callApi(REQUESTS.GET_PEOPLE_LIST, query));
  };
}

export function getMyPeople() {
  return async(dispatch, getState) => {
    const peopleQuery = {
      filters: {
        assigned_tos: 'me',
      },
      page: {
        limit: 1000,
      },
      include: 'reverse_contact_assignments,organizational_permissions,people',
    };

    const peopleResults = await dispatch(callApi(REQUESTS.GET_PEOPLE_LIST, peopleQuery));
    const people = peopleResults.findAll('person');

    let myOrgs = [ { people: [], id: 'personal' } ];
    const state = getState().auth;

    if (state.isJean) {
      const orgQuery = {
        filters: {
          assigned_tos: 'me',
        },
        include: '',
      };

      const ministryOrgs = await dispatch(callApi(REQUESTS.GET_MY_ORGANIZATIONS, orgQuery));
      myOrgs = myOrgs.concat(ministryOrgs.findAll('organization'));
    }

    people.forEach((person) => {
      if (!person._placeHolder) {

        if (person.organizational_permissions.length === 0) {
          myOrgs[0].people.push(person);

        } else {
          person.reverse_contact_assignments.forEach((contact_assignment) => {

            if (contact_assignment.assigned_to.id === state.personId) {
              const foundOrg = myOrgs.find((org) => contact_assignment.organization && org.id === contact_assignment.organization.id);

              if (foundOrg && person.organizational_permissions.some((org_p) => org_p.organization_id === foundOrg.id)) {
                foundOrg.people ? foundOrg.people.push(person) : foundOrg.people = [ person ];
              }
            }
          });
        }
      }
    });

    return dispatch({ type: PEOPLE_WITH_ORG_SECTIONS, myOrgs });
  };
}

export function searchPeople(text, filters = {}) {
  return (dispatch) => {
    if (!text) {
      return Promise.reject('NoText');
    }

    let query = {
      q: text,
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

    return dispatch(callApi(REQUESTS.SEARCH, query));
  };
}


export function getUserDetails(id, query = {}) {
  return (dispatch) => {
    const newQuery = {
      person_id: id,
      ...query,
    };
    return dispatch(callApi(REQUESTS.GET_PERSON, newQuery));
  };
}

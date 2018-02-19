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

export function getPersonDetails(id) {
  return async(dispatch) => {
    const query = {
      person_id: id,
      include: 'email_addresses,phone_numbers,organizational_permissions,reverse_contact_assignments,user',
    };
    return await dispatch(callApi(REQUESTS.GET_PERSON, query));
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

    const myOrgs = [ { people: [], id: 'personal' } ];
    const ministryOrgs = [];
    const state = getState().auth;

    if (state.isJean) {
      const orgQuery = {
        filters: {
          assigned_tos: 'me',
        },
        include: '',
      };
      // Always include Me as the first item in the personal ministry
      myOrgs[0].people.push(state.user);

      const orgsResult = await dispatch(callApi(REQUESTS.GET_MY_ORGANIZATIONS, orgQuery));
      ministryOrgs.push(...orgsResult.findAll('organization'));
    }

    people.forEach((person) => {
      if (!person._placeHolder && `${person.id}` !== `${state.personId}`) {

        if (person.organizational_permissions.length === 0) {
          myOrgs[0].people.push(person);

        } else {
          person.reverse_contact_assignments.forEach((contact_assignment) => {

            if (contact_assignment.assigned_to.id === state.personId) {
              const foundOrg = ministryOrgs.find((org) => contact_assignment.organization && org.id === contact_assignment.organization.id);

              if (foundOrg && person.organizational_permissions.some((org_p) => org_p.organization_id === foundOrg.id)) {
                foundOrg.people ? foundOrg.people.push(person) : foundOrg.people = [ person ];
              }
            }
          });
        }
      }
    });

    const nonBlankMinistryOrgs = ministryOrgs.filter((org) => org.people);
    myOrgs.push(...nonBlankMinistryOrgs);

    return dispatch({ type: PEOPLE_WITH_ORG_SECTIONS, myOrgs });
  };
}

export function searchPeople(text, filters = {}) {
  return (dispatch) => {
    if (!text) {
      return Promise.reject('NoText');
    }

    // https://api-stage.missionhub.com/apis/v4/search?q=Ultr&fields[person]=first_name,picture&include=organizational_permissions.organization&fields[organization]=name

    let query = {
      q: text,
      fields: {
        person: 'first_name,last_name',
        organization: 'name',
      },
      include: 'organizational_permissions.organization',
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

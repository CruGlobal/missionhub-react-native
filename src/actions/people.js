import callApi, { REQUESTS } from './api';
import { PEOPLE_WITH_ORG_SECTIONS } from '../constants';
import { findAllNonPlaceHolders } from '../utils/common';

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
  return (dispatch, getState) => {
    const peopleQuery = {
      filters: {
        assigned_tos: 'me',
      },
      include: 'reverse_contact_assignments,organizational_permissions',
    };

    return dispatch(callApi(REQUESTS.GET_PEOPLE_LIST, peopleQuery)).then((pResults) => {
      const myPeople = findAllNonPlaceHolders(pResults, 'person'); //todo do this by looking at something other than placeholder

      const personalPeople = myPeople.filter((person) => person.organizational_permissions.length === 0);
      const personalOrg = { people: personalPeople };

      if (getState().auth.isJean) {
        return dispatch(getMinistryPeople(myPeople, personalOrg));
      } else {
        return [ personalOrg ];
      }
    });
  };
}

function getMinistryPeople(myPeople, personalOrg) {
  const orgQuery = {
    filters: {
      assigned_tos: 'me',
    },
    include: '',
  };
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_MY_ORGANIZATIONS, orgQuery)).then((oResults) => {
      const ministryOrgs = oResults.findAll('organization');
      const ministryPeople = myPeople.filter((person) => person.organizational_permissions.length > 0);

      ministryOrgs.forEach((org) => org.people = []);

      ministryPeople.forEach((person) => {
        person.reverse_contact_assignments.forEach((ca) => {
          const org = ministryOrgs.find((o) => {
            const foundOrg = ca.organization;

            if (foundOrg) {
              const foundOrgPerm = person.organizational_permissions.find((op) => op.organization_id === foundOrg.id);

              return o.id === foundOrg.id && foundOrgPerm;
            }
            return false;
          });
          if (org) {
            org.people.push(person);
          }
        });
      });

      return dispatch({ type: PEOPLE_WITH_ORG_SECTIONS, myOrgs: [ personalOrg, ...ministryOrgs ] });
    });
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
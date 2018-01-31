import lodash from 'lodash';

import callApi, { REQUESTS } from './api';
import { PEOPLE_WITH_ORG_SECTIONS } from '../constants';
import { getOrganizations } from './organizations';
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

export function getPeopleWithOrgSections() {
  return (dispatch, getState) => {
    const query = {
      filters: {
        assigned_tos: 'me',
      },
      includes: 'organizational_permissions',
    };
    return dispatch(callApi(REQUESTS.GET_PEOPLE_LIST, query)).then((results) => {

      if (!getState().auth.isJean) {
        return results;
      }

      const people = findAllNonPlaceHolders(results, 'person');
      
      // Get the orgIds that from the request to compare with the ones we have already
      const orgIds = results.findAll('organization')
        .map((o) => o.id);

      const existingOrgIds = getState().organizations.all.map((o) => o.id);

      // Check if we already have all the org ids in the existing orgs array
      const allExist = lodash.every(orgIds, (o) => existingOrgIds.indexOf(o) >= 0);
      
      if (allExist || orgIds.length === 0) {
        // LOG('all orgs already exist or there are no people, no need to query');
        dispatch(peopleSectionsWithOrg(people));
        return results;
      }

      const orgFilters = { ids: orgIds.join(',') };
      dispatch(getOrganizations(orgFilters)).then((orgResults) => {
        dispatch(peopleSectionsWithOrg(people));
        return orgResults;
      });

      return results;
    });
  };
}

function peopleSectionsWithOrg(people) {
  return (dispatch, getState) => {
    const me = getState().auth.user;
    
    // Use reduce to get an object like this
    /*
      {
        [orgId]: { people: [person1Obj, person2Obj] }
        [orgId2]: { people: [person3Obj, person4Obj] }
      }
    */
    const orgSections = people.reduce((p, n) => {
      const orgs = n.organizational_permissions;
      if (!orgs.length) {
        p.personal.people.push(n);
      }
      orgs.forEach((o) => {
        const orgId = o.organization_id;
        if (p[orgId]) { p[orgId].people.push(n); }
        else { p[orgId] = { people: [ n ] }; }
      });
      return p;
    }, {
      'personal': { organization: {}, people: [ me ] },
    });

    const myOrgs = getState().organizations.all;
    myOrgs.forEach((o) => {
      if (orgSections[o.id]) {
        orgSections[o.id].organization = o;
      } else {
        // Do this if we want to show empty organizations
        // orgSections[o.id] = { organization: o, people: [] };
      }
    });
    const sections = Object.keys(orgSections)
      .map((key) => orgSections[key])
      .sort((a, b) => {
        if (!a.organization.id) return -1;
        const aLength = a.people ? a.people.length : 0;
        const bLength = b.people ? b.people.length : 0;
        if (aLength > bLength) return -1;
        if (aLength < bLength) return 1;
        return 0;
      });
    dispatch({ type: PEOPLE_WITH_ORG_SECTIONS, sections });
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
      userId: id,
      ...query,
    };
    return dispatch(callApi(REQUESTS.GET_USER_DETAILS, newQuery));
  };
}

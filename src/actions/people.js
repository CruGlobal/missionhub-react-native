import callApi, { REQUESTS } from './api';


export function getPeopleList() {
  return (dispatch, getState) => {
    const orgId = getState().organizations.myOrgId;
    if (!orgId) {
      LOG('Could not get users organization id');
      return Promise.reject('NoOrganization');
    }
    const query = {
      organization_id: orgId,
      // filters: {}
    };
    return dispatch(callApi(REQUESTS.GET_PEOPLE_LIST, query));
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

    LOG('query', query);

    return dispatch(callApi(REQUESTS.SEARCH, query));
  };
}
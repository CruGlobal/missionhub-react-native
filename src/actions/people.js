import callApi, { REQUESTS } from './api';


export function getPeopleList() {
  return (dispatch) => {
    const query = {
      filters: {
        assigned_tos: 'me',
      },
      includes: 'reverse_contact_assignments',
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


export function getUserDetails(id) {
  return (dispatch) => {
    const query = {
      userId: id,
    };
    return dispatch(callApi(REQUESTS.GET_USER_DETAILS, query));
  };
}

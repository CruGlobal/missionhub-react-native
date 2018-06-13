import { DEFAULT_PAGE_LIMIT, GET_ORGANIZATION_SURVEYS } from '../constants';

import callApi, { REQUESTS } from './api';

export function getMySurveys() {
  return dispatch => {
    const query = {
      limit: 100,
      include: '',
    };
    return dispatch(callApi(REQUESTS.GET_SURVEYS, query));
  };
}

export function getOrgSurveys(orgId) {
  return async (dispatch, getState) => {
    const { page, hasNextPage } = getState().organizations.surveysPagination;
    if (!hasNextPage) {
      return Promise.reject('NoMoreData');
    }
    const newQuery = {
      page: {
        limit: DEFAULT_PAGE_LIMIT,
        offset: DEFAULT_PAGE_LIMIT * page,
      },
      organization_id: orgId,
    };

    const { response, meta } = await dispatch(
      callApi(REQUESTS.GET_GROUP_SURVEYS, newQuery),
    );
    dispatch({
      type: GET_ORGANIZATION_SURVEYS,
      orgId,
      surveys: response,
      query: newQuery,
      meta,
    });
  };
}

export function getOrgSurveysNextPage(orgId) {
  return (dispatch, getState) => {
    const { page, hasNextPage } = getState().organizations.surveysPagination;
    if (!hasNextPage) {
      return Promise.reject('NoMoreData');
    }
    const query = {
      page: {
        limit: DEFAULT_PAGE_LIMIT,
        offset: DEFAULT_PAGE_LIMIT * page,
      },
    };
    return dispatch(getOrgSurveys(orgId, query));
  };
}

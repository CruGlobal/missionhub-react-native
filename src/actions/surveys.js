import {
  DEFAULT_PAGE_LIMIT,
  GET_ORGANIZATION_SURVEYS,
  GET_SURVEY_DETAILS,
} from '../constants';

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

export function getOrgSurveys(orgId, query = {}) {
  const newQuery = {
    ...query,
    filters: {
      organization_ids: orgId,
    },
  };
  return async dispatch => {
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

export function getSurveyDetails(surveyId) {
  return async dispatch => {
    const query = {
      include: 'active_survey_elements.question',
      surveyId,
    };
    const { response } = await dispatch(callApi(REQUESTS.GET_SURVEY, query));

    return dispatch({
      type: GET_SURVEY_DETAILS,
      surveyId,
      orgId: `${response.organization.id}`,
      newSurvey: response,
      query,
    });
  };
}

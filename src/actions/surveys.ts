import { DEFAULT_PAGE_LIMIT, GET_ORGANIZATION_SURVEYS } from '../constants';
import { REQUESTS } from '../api/routes';

import callApi from './api';

export function getMySurveys() {
  // @ts-ignore
  return dispatch => {
    const query = {
      limit: 100,
      include: '',
    };
    return dispatch(callApi(REQUESTS.GET_SURVEYS, query));
  };
}

// @ts-ignore
export function getOrgSurveys(orgId, query = {}) {
  const newQuery = {
    ...query,
    filters: {
      organization_ids: orgId,
    },
  };
  // @ts-ignore
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

// @ts-ignore
export function getOrgSurveysNextPage(orgId) {
  // @ts-ignore
  return (dispatch, getState) => {
    const { page, hasNextPage } = getState().organizations.surveysPagination;
    if (!hasNextPage) {
      // Does not have more data
      return Promise.resolve();
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

// @ts-ignore
export function getSurveyQuestions(surveyId) {
  // @ts-ignore
  return async dispatch => {
    const { response } = await dispatch(
      callApi(REQUESTS.GET_SURVEY_QUESTIONS, { surveyId }),
    );
    return response;
  };
}

// @ts-ignore
export function getSurveyFilterStats(survey_id) {
  // @ts-ignore
  return async dispatch => {
    const query = {
      survey_id,
    };

    const { response } = await dispatch(
      callApi(REQUESTS.GET_SURVEY_FILTER_STATS, query),
    );
    return response;
  };
}

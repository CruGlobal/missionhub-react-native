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

export function searchSurveyContacts(text, filters = []) {
  return async dispatch => {
    if (!filters.survey) {
      return Promise.reject('No Survey Specified');
    }

    const query = {
      filters: createSurveyFilters(filters),
    };

    return await dispatch(callApi(REQUESTS.GET_ANSWER_SHEETS, query));
  };
}

function createSurveyFilters(filters) {
  let surveyFilters = {
    survey_ids: filters.survey.id,
    people: {
      organization_ids: filters.organization.id,
    },
  };
  if (filters.answers) {
    surveyFilters.answers = filters.answers;
  }
  if (filters.unassigned) {
    surveyFilters.people.assigned_tos = 'unassigned';
  }
  /*if (filters.gender) {
    query.filters.gender = filters.gender.id;
  }
  if (filters.archived) {
    query.filters.archived = true;
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
  if (filters.question) {
    query.filters.question_id = filters.question.id;
    query.filters.answer_value = filters.question.answer.text;
  }*/
  return surveyFilters;
}

export function getSurveyQuestions(surveyId) {
  return async dispatch => {
    return await dispatch(callApi(REQUESTS.GET_SURVEY_QUESTIONS, { surveyId }));
  };
}

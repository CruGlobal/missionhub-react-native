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
  if (filters.questions) {
    surveyFilters.answers = filters.questions.answers;
  }
  if (filters.gender) {
    surveyFilters.people.genders = filters.gender.id;
  }
  if (filters.uncontacted) {
    surveyFilters.people.statuses = 'uncontacted';
  }
  if (filters.unassigned) {
    surveyFilters.people.assigned_tos = 'unassigned';
  }
  if (filters.archived) {
    surveyFilters.people.include_archived = true;
  } else {
    surveyFilters.people.include_archived = false;
  }
  if (filters.labels) {
    surveyFilters.people.label_ids = filters.labels.id;
  }
  if (filters.groups) {
    surveyFilters.people.group_ids = filters.groups.id;
  }
  return surveyFilters;
}

export function getSurveyQuestions(surveyId) {
  return async dispatch => {
    return await dispatch(callApi(REQUESTS.GET_SURVEY_QUESTIONS, { surveyId }));
  };
}

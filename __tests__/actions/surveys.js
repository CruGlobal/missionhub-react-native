import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { mockFnWithParams } from '../../testUtils';
import * as api from '../../src/actions/api';
import { REQUESTS } from '../../src/actions/api';
import {
  getMySurveys,
  getOrgSurveys,
  getOrgSurveysNextPage,
  searchSurveyContacts,
  getSurveyQuestions,
} from '../../src/actions/surveys';
import { GET_ORGANIZATION_SURVEYS } from '../../src/constants';

let store;
const apiResponse = { type: 'successful' };

beforeEach(() => (store = configureStore([thunk])()));

describe('getMySurveys', () => {
  const query = {
    limit: 100,
    include: '',
  };

  it('should get my surveys', () => {
    mockFnWithParams(api, 'default', apiResponse, REQUESTS.GET_SURVEYS, query);

    store.dispatch(getMySurveys());

    expect(store.getActions()).toEqual([apiResponse]);
  });
});

describe('getOrgSurveys', () => {
  const orgId = '123';
  const query = {
    filters: {
      organization_ids: orgId,
    },
  };
  const surveys = [
    {
      name: 'person',
      id: '1',
    },
    {
      name: 'person',
      id: '2',
    },
  ];
  const surveysResponse = {
    type: 'successful',
    response: surveys,
    meta: { total: 50 },
  };
  const getSurveysAction = {
    type: GET_ORGANIZATION_SURVEYS,
    orgId,
    surveys,
    query,
    meta: { total: 50 },
  };

  it('should get surveys in organization', async () => {
    mockFnWithParams(
      api,
      'default',
      surveysResponse,
      REQUESTS.GET_GROUP_SURVEYS,
      query,
    );

    await store.dispatch(getOrgSurveys(orgId));
    expect(store.getActions()).toEqual([surveysResponse, getSurveysAction]);
  });
});

describe('getOrgSurveysNextPage', () => {
  const orgId = '123';
  const query = {
    page: {
      limit: 25,
      offset: 25,
    },
    filters: {
      organization_ids: orgId,
    },
  };
  const surveys = [
    {
      id: '1',
      title: 'person',
      contacts_count: 5,
      unassigned_contacts_count: 5,
      uncontacted_contacts_count: 5,
    },
    {
      id: '2',
      title: 'person',
      contacts_count: 5,
      unassigned_contacts_count: 5,
      uncontacted_contacts_count: 5,
    },
  ];
  const surveysResponse = {
    type: 'successful',
    response: surveys,
    meta: { total: 50 },
  };
  const getSurveysAction = {
    type: GET_ORGANIZATION_SURVEYS,
    orgId,
    surveys,
    query,
    meta: { total: 50 },
  };

  it('should get surveys next page in organization', async () => {
    store = configureStore([thunk])({
      organizations: { surveysPagination: { hasNextPage: true, page: 1 } },
    });

    mockFnWithParams(
      api,
      'default',
      surveysResponse,
      REQUESTS.GET_GROUP_SURVEYS,
      query,
    );

    await store.dispatch(getOrgSurveysNextPage(orgId));
    expect(store.getActions()).toEqual([surveysResponse, getSurveysAction]);
  });
});

describe('searchSurveyContacts', () => {
  const filters = {
    survey: { id: '12345' },
    organization: { id: '45678' },
    '123': { id: '123', text: '123Text', isAnswer: true },
    '456': { id: '456', text: '456Text', isAnswer: true },
    gender: { id: 'Female' },
    uncontacted: true,
    unassigned: true,
    archived: true,
    labels: { id: '333' },
    groups: { id: '444' },
  };
  const query = {
    filters: {
      survey_ids: filters.survey.id,
      people: {
        organization_ids: filters.organization.id,
        genders: filters.gender.id,
        statuses: 'uncontacted',
        assigned_tos: 'unassigned',
        include_archived: true,
        label_ids: filters.labels.id,
        group_ids: filters.groups.id,
      },
      answers: {
        '123': { '': filters['123'].text },
        '456': { '': filters['456'].text },
      },
    },
  };
  const searchResponse = { type: 'success' };

  it('calls API for filtered answer sheets', async () => {
    store = configureStore([thunk])();

    mockFnWithParams(
      api,
      'default',
      searchResponse,
      REQUESTS.GET_ANSWER_SHEETS,
      query,
    );

    await store.dispatch(searchSurveyContacts('text', filters));
    expect(store.getActions()).toEqual([searchResponse]);
  });
});

describe('getSurveyQuestions', () => {
  const surveyId = '12345';
  const questionsResponse = {
    type: 'success',
    response: [{ id: '123' }, { id: '456' }, { id: '789' }],
  };

  it('gets survey questions', async () => {
    store = configureStore([thunk])();

    mockFnWithParams(
      api,
      'default',
      questionsResponse,
      REQUESTS.GET_SURVEY_QUESTIONS,
      { surveyId },
    );

    await store.dispatch(getSurveyQuestions(surveyId));
    expect(store.getActions()).toEqual([questionsResponse]);
  });
});

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { GET_GROUP_SURVEYS } from '../../src/constants';
import { mockFnWithParams } from '../../testUtils';
import * as api from '../../src/actions/api';
import { REQUESTS } from '../../src/actions/api';
import {
  getMySurveys,
  getOrgSurveys,
  getOrgSurveysNextPage,
} from '../../src/actions/surveys';

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
    organization_id: orgId,
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

  it('should get surveys in organization', () => {
    mockFnWithParams(
      api,
      'default',
      surveysResponse,
      REQUESTS.GET_GROUP_SURVEYS,
      query,
    );

    store.dispatch(getOrgSurveys(orgId));
    expect(store.getActions()).toEqual([surveysResponse]);
  });
});

describe('getOrgSurveysNextPage', () => {
  const orgId = '123';
  const query = {
    page: {
      limit: 25,
      offset: 25,
    },
    organization_id: orgId,
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

  it('should get surveys next page in organization', () => {
    store = configureStore([thunk])({
      groups: { surveysPagination: { hasNextPage: true, page: 1 } },
    });

    mockFnWithParams(
      api,
      'default',
      surveysResponse,
      REQUESTS.GET_GROUP_SURVEYS,
      query,
    );

    store.dispatch(getOrgSurveysNextPage(orgId));
    expect(store.getActions()).toEqual([surveysResponse]);
  });
});

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import callApi, { REQUESTS } from '../api';
import { getMySurveys, getOrgSurveys, getOrgSurveysNextPage } from '../surveys';
import { GET_ORGANIZATION_SURVEYS } from '../../constants';

const apiResponse = { type: 'successful' };

jest.mock('../api');

let store;

beforeEach(() => {
  store = configureStore([thunk])();
  callApi.mockClear();
});

describe('getMySurveys', () => {
  const query = {
    limit: 100,
    include: '',
  };

  it('should get my surveys', () => {
    callApi.mockReturnValue(apiResponse);

    store.dispatch(getMySurveys());

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_SURVEYS, query);
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
    callApi.mockReturnValue(surveysResponse);

    await store.dispatch(getOrgSurveys(orgId));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_GROUP_SURVEYS, query);
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
    callApi.mockReturnValue(surveysResponse);

    await store.dispatch(getOrgSurveysNextPage(orgId));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_GROUP_SURVEYS, query);
    expect(store.getActions()).toEqual([surveysResponse, getSurveysAction]);
  });

  it('should not get next page', async () => {
    store = configureStore([thunk])({
      organizations: { surveysPagination: { hasNextPage: false, page: 1 } },
    });
    callApi.mockReturnValue(surveysResponse);

    const result = await store.dispatch(getOrgSurveysNextPage(orgId));

    expect(result).toEqual(undefined);
  });
});

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  getImpactSummary,
  getPeopleInteractionsReport,
  refreshImpact,
} from '../impact';
import callApi, { REQUESTS } from '../api';

jest.mock('../api');

const store = configureStore([thunk])();

const apiResponse = { type: 'test' };
callApi.mockReturnValue(apiResponse);

beforeEach(() => {
  callApi.mockClear();
  store.clearActions();
});

describe('refreshImpact', () => {
  it('should get my impact and global impact', async () => {
    await store.dispatch(refreshImpact());

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_IMPACT_SUMMARY, {
      person_id: 'me',
      organization_id: undefined,
    });
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_IMPACT_SUMMARY, {
      person_id: undefined,
      organization_id: undefined,
    });
    expect(store.getActions()).toEqual([apiResponse, apiResponse]);
  });

  it('should get my impact and global impact with org', async () => {
    const orgId = '123';
    await store.dispatch(refreshImpact(orgId));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_IMPACT_SUMMARY, {
      person_id: 'me',
      organization_id: undefined,
    });
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_IMPACT_SUMMARY, {
      person_id: undefined,
      organization_id: orgId,
    });
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_IMPACT_SUMMARY, {
      person_id: undefined,
      organization_id: undefined,
    });
    expect(store.getActions()).toEqual([apiResponse, apiResponse, apiResponse]);
  });
});

describe('getImpactSummary', () => {
  it('should make api request', async () => {
    await store.dispatch(getImpactSummary('2'));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_IMPACT_SUMMARY, {
      person_id: '2',
      organization_id: undefined,
    });
  });
  it('should make api request with org id', async () => {
    await store.dispatch(getImpactSummary('2', '4'));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_IMPACT_SUMMARY, {
      person_id: '2',
      organization_id: '4',
    });
  });
  it('should make api request without person org id to load global impact', async () => {
    await store.dispatch(getImpactSummary());

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_IMPACT_SUMMARY, {
      person_id: undefined,
      organization_id: undefined,
    });
  });
});

describe('getPeopleInteractionsReport', () => {
  beforeEach(() => {
    callApi.mockReturnValue({
      type: REQUESTS.GET_PEOPLE_INTERACTIONS_REPORT.SUCCESS,
      response: [
        {
          contact_count: 1,
          contacts_with_interaction_count: 0,
          id: '728-4195255-P1Y',
          interactions: [
            {
              interaction_type_id: 2,
              interaction_count: 1,
            },
            {
              interaction_type_id: 4,
              interaction_count: 2,
            },
            {
              interaction_type_id: 5,
              interaction_count: 1,
            },
          ],
          length: 0,
          organization_id: 728,
          person_id: 4195255,
          uncontacted_count: null,
          _type: 'person_report',
        },
      ],
    });
  });

  it('should make api request for person report', async () => {
    await store.dispatch(getPeopleInteractionsReport('2', '3', 'P1W'));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_PEOPLE_INTERACTIONS_REPORT,
      {
        people_ids: '2',
        organization_ids: '3',
        period: 'P1W',
      },
    );
    expect(store.getActions()).toMatchSnapshot();
  });

  it('should make api request for group report', async () => {
    await store.dispatch(getPeopleInteractionsReport(undefined, '3', 'P1W'));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_ORGANIZATION_INTERACTIONS_REPORT,
      {
        people_ids: undefined,
        organization_ids: '3',
        period: 'P1W',
      },
    );
    expect(store.getActions()).toMatchSnapshot();
  });
});

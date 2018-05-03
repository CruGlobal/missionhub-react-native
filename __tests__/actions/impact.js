import {
  getGlobalImpact,
  getMyImpact,
  getImpactById,
  getPeopleInteractionsReport,
  refreshImpact,
} from '../../src/actions/impact';
import callApi, { REQUESTS } from '../../src/actions/api';
jest.mock('../../src/actions/api');

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const store = configureStore([ thunk ])();

const apiResponse = { type: 'test' };
callApi.mockReturnValue(apiResponse);

beforeEach(() => {
  callApi.mockClear();
  store.clearActions();
});

describe('getGlobalImpact', () => {
  it('should make api request', async() => {
    await store.dispatch(getGlobalImpact());

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_GLOBAL_IMPACT);
  });
});

describe('getMyImpact', () => {
  it('should make api request', async() => {
    await store.dispatch(getMyImpact());

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_IMPACT_BY_ID, { person_id: 'me' });
  });
});

describe('refreshImpact', () => {
  it('should get my impact and global impact', async() => {
    await store.dispatch(refreshImpact());

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_IMPACT_BY_ID, { person_id: 'me' });
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_GLOBAL_IMPACT);
    expect(store.getActions()).toEqual([ apiResponse, apiResponse ]);
  });
});

describe('getImpactById', () => {
  it('should make api request', async() => {
    await store.dispatch(getImpactById('2'));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_IMPACT_BY_ID, { person_id: '2' });
  });
});

describe('getPeopleInteractionsReport', () => {
  it('should make api request', async() => {
    callApi.mockReturnValue({
      type: REQUESTS.GET_PEOPLE_INTERACTIONS_REPORT.SUCCESS,
      response: [ {
        contact_count: 1,
        contacts_with_interaction_count: 0,
        id: '728-4195255-P1Y',
        interactions: [
          {
            'interaction_type_id': 2,
            'interaction_count': 1,
          },
          {
            'interaction_type_id': 4,
            'interaction_count': 2,
          },
          {
            'interaction_type_id': 5,
            'interaction_count': 1,
          },
        ],
        length: 0,
        organization_id: 728,
        person_id: 4195255,
        uncontacted_count: null,
        _type: 'person_report',
      } ],
    });

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
});

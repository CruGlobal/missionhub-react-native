import { getGlobalImpact, getMyImpact, getImpactById, getUserImpact, refreshImpact } from '../../src/actions/impact';
import callApi, { REQUESTS } from '../../src/actions/api';
jest.mock('../../src/actions/api');

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const store = configureStore([ thunk ])();

const apiResponse = { type: 'test' };
callApi.mockReturnValue(() => Promise.resolve(apiResponse));

describe('getGlobalImpact', () => {
  it('should make api request', async() => {
    await store.dispatch(getGlobalImpact());

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_GLOBAL_IMPACT);
  });
});

describe('getMyImpact', () => {
  it('should make api request', async() => {
    await store.dispatch(getMyImpact());

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_MY_IMPACT, { person_id: 'me' });
  });
});

describe('refreshImpact', () => {
  it('should get my impact and global impact', async() => {
    callApi.mockReturnValue({ type: 'test' });

    await store.dispatch(refreshImpact());

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_MY_IMPACT, { person_id: 'me' });
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

describe('getUserImpact', () => {
  it('should make api request', async() => {
    await store.dispatch(getUserImpact('2', '3', 'P1W'));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_USER_IMPACT,
      {
        people_ids: '2',
        organization_ids: '3',
        period: 'P1W',
      }
    );
  });
});

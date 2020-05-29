import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { getImpactSummary, refreshImpact } from '../impact';
import callApi from '../api';
import { REQUESTS } from '../../api/routes';

jest.mock('../api');

const store = configureStore([thunk])();

const apiResponse = { type: 'test' };
// @ts-ignore
callApi.mockReturnValue(apiResponse);

beforeEach(() => {
  store.clearActions();
});

describe('refreshImpact', () => {
  it('should get my impact and global impact', async () => {
    // @ts-ignore
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
    // @ts-ignore
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
    // @ts-ignore
    await store.dispatch(getImpactSummary('2'));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_IMPACT_SUMMARY, {
      person_id: '2',
      organization_id: undefined,
    });
  });
  it('should make api request with org id', async () => {
    // @ts-ignore
    await store.dispatch(getImpactSummary('2', '4'));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_IMPACT_SUMMARY, {
      person_id: '2',
      organization_id: '4',
    });
  });
  it('should make api request without person org id to load global impact', async () => {
    // @ts-ignore
    await store.dispatch(getImpactSummary());

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_IMPACT_SUMMARY, {
      person_id: undefined,
      organization_id: undefined,
    });
  });
});

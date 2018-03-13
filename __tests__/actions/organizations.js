import { mockFnWithParams } from '../../testUtils';
import * as api from '../../src/actions/api';
import { REQUESTS } from '../../src/actions/api';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { getAssignedOrganizations, getMyOrganizations } from '../../src/actions/organizations';

let store;
const apiResponse = { type: 'successful' };

beforeEach(() => store = configureStore([ thunk ])());

describe('getMyOrganizations', () => {
  const query = {
    limit: 100,
  };

  it('should get my organizations', () => {
    mockFnWithParams(api, 'default', apiResponse, REQUESTS.GET_MY_ORGANIZATIONS, query);

    store.dispatch(getMyOrganizations());

    expect(store.getActions()).toEqual([ apiResponse ]);
  });
});

describe('getAssignedOrganizations', () => {
  const query = {
    limit: 100,
    filters: {
      assigned_tos: 'me',
    },
  };

  it('should get my assigned organizations', () => {
    mockFnWithParams(api, 'default', apiResponse, REQUESTS.GET_ORGANIZATIONS, query);

    store.dispatch(getAssignedOrganizations());

    expect(store.getActions()).toEqual([ apiResponse ]);
  });
});

import { getMe, getPeopleList, getPeopleWithOrgSections } from '../../src/actions/people';
import * as api from '../../src/actions/api';
import { REQUESTS } from '../../src/actions/api';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { JsonApiDataStore } from 'jsonapi-datastore';

let store;

const mockApi = (result, expectedRequestObj, expectedQuery) => {
  api.default = jest.fn().mockImplementation((requestObj, query) =>
    requestObj === expectedRequestObj && JSON.stringify(query) === JSON.stringify(expectedQuery) ? result : null
  );
};

beforeEach(() => store = configureStore([thunk])());

describe('get me', () => {
  const action = { type: 'got me' };

  beforeEach(() => mockApi(action, REQUESTS.GET_ME));

  it('should get me', () => {
    store.dispatch(getMe());

    expect(store.getActions()[0]).toBe(action);
  });
});

describe('get people list', () => {
  const expectedQuery = {
    filters: {
      assigned_tos: 'me',
    },
  };
  const action = { type: 'got people' };

  beforeEach(() => mockApi(action, REQUESTS.GET_PEOPLE_LIST, expectedQuery));

  it('should get people list', () => {
    store.dispatch(getPeopleList());

    expect(store.getActions()[0]).toBe(action);
  });
});

describe('get people with org sections', () => {
  const jsonApiStore = new JsonApiDataStore();

  const expectedQuery = {
    filters: {
      assigned_tos: 'me',
    },
    includes: 'organizational_permission,organization',
  };

  const mockApiReturnValue = (dispatch) => {
    return dispatch(() => Promise.resolve(jsonApiStore));
  };

  beforeEach(() => {
    jsonApiStore.sync(
      {
        data: [
          {
            type: 'person',
          },
        ],
      }
    );

    mockApi(mockApiReturnValue, REQUESTS.GET_PEOPLE_LIST, expectedQuery);
  });

  it('should get people with org sections', () => {
    store = configureStore([thunk])(
      { auth: { hasMinistries: false } }
    );

    return store.dispatch(getPeopleWithOrgSections()).then((result) => {
      expect(result).toBe(jsonApiStore);
    });
  });
});
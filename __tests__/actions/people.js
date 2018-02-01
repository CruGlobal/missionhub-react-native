import { getMe, getMyPeople, getPeopleList } from '../../src/actions/people';
import * as api from '../../src/actions/api';
import { REQUESTS } from '../../src/actions/api';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { mockFnWithParams } from '../../testUtils';

let store;

const mockApi = (result, ...expectedParams) => mockFnWithParams(api, 'default', result, ...expectedParams);

beforeEach(() => store = configureStore([ thunk ])());

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

describe('getMyPeople', () => {
  const person = { organizational_permissions: [] };
  const apiResult = { findAll: () => [ person ] };

  const expectedQuery = {
    filters: {
      assigned_tos: 'me',
    },
    include: 'reverse_contact_assignments,organizational_permissions',
  };

  const mockApiReturnValue = (dispatch) => {
    return dispatch(() => Promise.resolve(apiResult));
  };

  beforeEach(() => {
    mockApi(mockApiReturnValue, REQUESTS.GET_PEOPLE_LIST, expectedQuery);
  });

  describe('as Casey', () => {
    it('should return one org with people', () => {
      store = configureStore([ thunk ])(
        { auth: { isJean: false } }
      );

      return store.dispatch(getMyPeople()).then((result) => {
        console.log(result);
        expect(result).toEqual([ { people: [ person ] } ]);
      });
    });
  });

  describe('as Jean', () => {
    it('should return all orgs with assigned people', () => {

    });
  });

});
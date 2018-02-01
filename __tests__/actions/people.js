import { getMe, getMyPeople, getPeopleList } from '../../src/actions/people';
import * as api from '../../src/actions/api';
import { REQUESTS } from '../../src/actions/api';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { mockFnWithParams } from '../../testUtils';
import { PEOPLE_WITH_ORG_SECTIONS } from '../../src/constants';

const mockStore = configureStore([ thunk ]);
let store;

const mockApi = (result, ...expectedParams) => mockFnWithParams(api, 'default', result, ...expectedParams);
const mockApiReturnValue = (result) => {
  return (dispatch) => {
    return dispatch(() => Promise.resolve(result));
  };
};

describe('get me', () => {
  const action = { type: 'got me' };

  beforeEach(() => {
    store = mockStore();
    mockApi(action, REQUESTS.GET_ME);
  });

  it('should get me', () => {
    store.dispatch(getMe());

    expect(store.getActions()[0]).toBe(action);
  });
});

describe('get people list', () => {
  const expectedQuery = { filters: { assigned_tos: 'me' } };
  const action = { type: 'got people' };

  beforeEach(() => {
    store = mockStore();
    mockApi(action, REQUESTS.GET_PEOPLE_LIST, expectedQuery);
  });

  it('should get people list', () => {
    store.dispatch(getPeopleList());

    expect(store.getActions()[0]).toBe(action);
  });
});

describe('getMyPeople', () => {
  const peopleListQuery = {
    filters: { assigned_tos: 'me' },
    include: 'reverse_contact_assignments,organizational_permissions',
  };

  describe('as Casey', () => {
    const peopleList = [ { id: 123, organizational_permissions: [] } ];

    it('should return one org with people', () => {
      mockApi(mockApiReturnValue({ findAll: () => peopleList }), REQUESTS.GET_PEOPLE_LIST, peopleListQuery);
      store = mockStore({ auth: { isJean: false } });

      return store.dispatch(getMyPeople()).then((result) => {
        expect(result).toEqual([ { people: peopleList } ]);
      });
    });
  });

  describe('as Jean', () => {
    const organizationOneId = 101;
    const organizationList = [ { id: organizationOneId } ];
    const personOne = {
      id: 7777,
      organizational_permissions: [ { organization_id: organizationOneId } ],
      reverse_contact_assignments: [ { organization: { id: 103 } }, { organization: { id: organizationOneId } } ],
    };
    const personTwo = {
      id: 8888,
      organizational_permissions: [ { organization_id: 102 } ],
      reverse_contact_assignments: [ { organization: { id: organizationOneId } } ],
    };
    const personThree = {
      id: 9999,
      organizational_permissions: [],
    };

    const organizationQuery = {
      filters: { assigned_tos: 'me' },
      include: '',
    };

    it('should return all orgs with assigned people', () => {
      store = mockStore({ auth: { isJean: true } });
      api.default = jest.fn().mockImplementation((request, query) => {
        if (request === REQUESTS.GET_PEOPLE_LIST && JSON.stringify(query) === JSON.stringify(peopleListQuery)) {
          return mockApiReturnValue({ findAll: () => [ personOne, personTwo, personThree ] });

        } else if (request === REQUESTS.GET_MY_ORGANIZATIONS && JSON.stringify(query) === JSON.stringify(organizationQuery)) {
          return mockApiReturnValue({ findAll: () => organizationList });
        }
      });

      return store.dispatch(getMyPeople()).then(() => {
        expect(store.getActions()).toEqual([
          {
            type: PEOPLE_WITH_ORG_SECTIONS,
            myOrgs: [
              { people: [ personThree ] },
              { id: organizationOneId, people: [ personOne ] },
            ],
          },
        ]);
      });
    });
  });
});
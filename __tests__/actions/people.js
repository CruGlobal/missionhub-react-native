import { searchPeople, getMe, getMyPeople, getUserDetails, getPersonDetails } from '../../src/actions/people';
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


const myId = 23;
const mockUser = {
  id: myId,
  name: 'Test User',
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

describe('getPersonDetails', () => {
  it('should get a person\'s details', () => {
    mockApi({}, REQUESTS.GET_PERSON, {
      person_id: 1,
      include: 'email_addresses,phone_numbers,organizational_permissions,reverse_contact_assignments,user',
    });
    store.dispatch(getPersonDetails(1));
  });
});

describe('getMyPeople', () => {
  const peopleListQuery = {
    filters: { assigned_tos: 'me' },
    page: { limit: 1000 },
    include: 'reverse_contact_assignments,organizational_permissions,people',
  };

  describe('as Casey', () => {
    const peopleList = [ { id: 123, organizational_permissions: [], reverse_contact_assignments: [ { assigned_to: { id: myId } } ] } ];

    it('should return one org with people', () => {
      mockApi(mockApiReturnValue({ findAll: () => peopleList }), REQUESTS.GET_PEOPLE_LIST, peopleListQuery);
      store = mockStore({ auth: { isJean: false, personId: myId } });

      return store.dispatch(getMyPeople()).then(() => {
        expect(store.getActions()).toEqual([ {
          type: PEOPLE_WITH_ORG_SECTIONS,
          myOrgs: [ { people: peopleList, id: 'personal' } ],
        } ]);
      });
    });
  });

  describe('as Jean', () => {
    const organizationOneId = 101;
    const organizationTwoId = 111;
    const organizationList = [ { id: organizationOneId }, { id: organizationTwoId } ];
    const personOne = {
      id: 7777,
      organizational_permissions: [ { organization_id: organizationOneId } ],
      reverse_contact_assignments: [ { organization: { id: 103 }, assigned_to: { id: myId } }, { organization: { id: organizationOneId },assigned_to: { id: myId } } ],
    };
    const personTwo = {
      id: 8888,
      organizational_permissions: [ { organization_id: 102 } ],
      reverse_contact_assignments: [ { organization: { id: organizationOneId }, assigned_to: { id: myId } } ],
    };
    const personThree = {
      id: 9999,
      organizational_permissions: [],
      reverse_contact_assignments: [ { assigned_to: { id: myId } } ],
    };
    const personFour = {
      id: 10000,
      organizational_permissions: [ { organization_id: organizationTwoId } ],
      reverse_contact_assignments: [ { organization: { id: organizationTwoId }, assigned_to: { id: myId } }, { organization: { id: organizationTwoId }, assigned_to: { id: 24 } } ],
    };

    const organizationQuery = {
      filters: { assigned_tos: 'me' },
      include: '',
    };

    it('should return all orgs with assigned people', () => {
      store = mockStore({ auth: { isJean: true, personId: myId, user: mockUser } });
      api.default = jest.fn().mockImplementation((request, query) => {
        if (request === REQUESTS.GET_PEOPLE_LIST && JSON.stringify(query) === JSON.stringify(peopleListQuery)) {
          return mockApiReturnValue({ findAll: () => [ personOne, personTwo, personThree, personFour ] });

        } else if (request === REQUESTS.GET_MY_ORGANIZATIONS && JSON.stringify(query) === JSON.stringify(organizationQuery)) {
          return mockApiReturnValue({ findAll: () => organizationList });
        }
      });

      return store.dispatch(getMyPeople()).then(() => {
        expect(store.getActions()).toEqual([
          {
            type: PEOPLE_WITH_ORG_SECTIONS,
            myOrgs: [
              { people: [ mockUser, personThree ], id: 'personal' },
              { id: organizationOneId, people: [ personOne ] },
              { id: organizationTwoId, people: [ personFour ] },
            ],
          },
        ]);
      });
    });
  });
});

describe('get user', () => {
  const userId = 1;
  const expectedQuery = {
    person_id: userId,
  };
  const action = { type: 'got user' };

  beforeEach(() => {
    store = mockStore();
    mockApi(action, REQUESTS.GET_PERSON, expectedQuery);
  });

  it('should get me', () => {
    store.dispatch(getUserDetails(userId));

    expect(store.getActions()[0]).toBe(action);
  });
});

describe('search', () => {
  const text = 'test';
  const expectedQuery = {
    q: text,
    filters: { },
  };
  const action = { type: 'ran search' };

  beforeEach(() => {
    store = mockStore();
    mockApi(action, REQUESTS.SEARCH, expectedQuery);
  });

  it('should search', () => {
    store.dispatch(searchPeople(text));

    expect(store.getActions()[0]).toBe(action);
  });
});

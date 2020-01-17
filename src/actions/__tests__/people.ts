import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { searchPeople, getMyPeople } from '../people';
import callApi from '../api';
import { REQUESTS } from '../../api/routes';

jest.mock('../api');

const mockStore = configureStore([thunk]);
let store;

const myId = 23;
const mockUser = {
  id: myId,
  name: 'Test User',
};

describe('getMyPeople', () => {
  const peopleQuery = {
    filters: {
      assigned_tos: 'me',
    },
    page: {
      limit: 1000,
    },
    include:
      'reverse_contact_assignments,reverse_contact_assignments.organization,organizational_permissions',
  };

  describe('as Casey', () => {
    const peopleList = [
      {
        id: 123,
        organizational_permissions: [],
        reverse_contact_assignments: [{ assigned_to: { id: myId } }],
      },
    ];

    it('should return one org with people', async () => {
      callApi.mockReturnValue({
        type: REQUESTS.GET_PEOPLE_LIST.SUCCESS,
        response: peopleList,
      });
      store = mockStore({
        auth: {
          isJean: false,
          person: mockUser,
        },
      });

      await store.dispatch(getMyPeople());

      expect(callApi).toHaveBeenCalledWith(
        REQUESTS.GET_PEOPLE_LIST,
        peopleQuery,
      );
      expect(store.getActions()[1]).toMatchSnapshot();
    });
  });

  describe('as Jean', () => {
    const organizationOne = {
      id: 101,
      name: 'organizationOne',
    };
    const organizationTwo = {
      id: 111,
      name: 'organizationTwo',
    };
    const personOne = {
      id: 7777,
      organizational_permissions: [{ organization: organizationOne }],
      reverse_contact_assignments: [
        { organization: { id: 103 }, assigned_to: { id: myId } },
        { organization: organizationOne, assigned_to: { id: myId } },
      ],
    };
    const personTwo = {
      id: 8888,
      organizational_permissions: [{ organization: { id: 102 } }],
      reverse_contact_assignments: [
        { organization: organizationOne, assigned_to: { id: myId } },
      ],
    };
    const personThree = {
      id: 9999,
      organizational_permissions: [],
      reverse_contact_assignments: [{ assigned_to: { id: myId } }],
    };
    const personFour = {
      id: 10000,
      organizational_permissions: [
        { organization: organizationTwo },
        { organization: organizationOne },
      ],
      reverse_contact_assignments: [
        { organization: organizationTwo, assigned_to: { id: myId } },
        { organization: organizationOne, assigned_to: { id: 24 } },
      ],
    };
    const personFive = {
      id: myId,
      organizational_permissions: [{ organization: organizationTwo }],
      reverse_contact_assignments: [
        { organization: organizationTwo, assigned_to: { id: myId } },
      ],
    };

    it('should return all orgs with assigned people', async () => {
      store = mockStore({
        auth: {
          isJean: true,
          person: mockUser,
        },
      });
      callApi.mockReturnValue({
        type: REQUESTS.GET_PEOPLE_LIST.SUCCESS,
        response: [personOne, personTwo, personThree, personFour, personFive],
      });

      await store.dispatch(getMyPeople());
      expect(callApi).toHaveBeenCalledWith(
        REQUESTS.GET_PEOPLE_LIST,
        peopleQuery,
      );
      expect(store.getActions()[1]).toMatchSnapshot();
    });
  });
});

describe('search', () => {
  const text = 'test';
  const filters = {
    ministry: { id: '142124' },
    gender: { id: '42353' },
    archived: true,
    unassigned: true,
    labels: { id: '547' },
    groups: { id: '687753' },
    surveys: { id: '3387' },
    permission_ids: 2,
  };

  const expectedQuery = {
    q: text,
    organization_ids: filters.ministry.id,
    fields: {
      person: 'first_name,last_name',
      organization: 'name',
    },
    include:
      'organizational_permissions.organization,reverse_contact_assignments',
    filters: {
      gender: filters.gender.id,
      archived: true,
      unassigned: true,
      label_ids: filters.labels.id,
      group_ids: filters.groups.id,
      survey_ids: filters.surveys.id,
      permission_ids: filters.permission_ids,
    },
  };
  const action = { type: 'ran search' };

  beforeEach(() => {
    store = mockStore();
    callApi.mockReturnValue(action);
  });

  it('should search', () => {
    store.dispatch(searchPeople(text, filters));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.SEARCH, expectedQuery);
    expect(store.getActions()).toEqual([action]);
  });
});

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { searchPeople, getMyPeople } from '../../src/actions/people';
import callApi, { REQUESTS } from '../../src/actions/api';

jest.mock('../../src/actions/api');

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
  const inputFilters = {
    ministry: {
      id: '1',
    },
    gender: {
      id: '2',
    },
    archived: {
      id: '3',
    },
    unassigned: {
      id: '4',
    },
    labels: {
      id: '5',
    },
    groups: {
      id: '6',
    },
    surveys: {
      id: '7',
    },
    question: {
      id: '8',
      answer: {
        text: 'test',
      },
    },
  };

  const expectedQuery = {
    q: text,
    fields: {
      person: 'first_name,last_name',
      organization: 'name',
    },
    include: 'organizational_permissions.organization',
    filters: {},
  };
  const action = { type: 'ran search' };

  beforeEach(() => {
    store = mockStore();
    callApi.mockReturnValue(action);
  });

  const expectedFilterQuery = {
    ...expectedQuery,
    q: '',
    organization_ids: inputFilters.ministry.id,
    filters: {
      gender: inputFilters.gender.id,
      archived: true,
      unassigned: true,
      label_ids: inputFilters.labels.id,
      group_ids: inputFilters.groups.id,
      survey_ids: inputFilters.surveys.id,
      question_id: inputFilters.question.id,
      answer_value: inputFilters.question.answer.text,
    },
  };

  it('should search', () => {
    store.dispatch(searchPeople(text));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.SEARCH, expectedQuery);
    expect(store.getActions()[0]).toBe(action);
  });

  it('should search with filters', () => {
    store.dispatch(searchPeople('', inputFilters));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.SEARCH, expectedFilterQuery);
    expect(store.getActions()[0]).toBe(action);
  });
});

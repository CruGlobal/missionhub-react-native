import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockDate from 'mockdate';

import {
  GET_ORGANIZATIONS_CONTACTS_REPORT,
  GET_ORGANIZATION_MEMBERS,
  LOAD_ORGANIZATIONS,
  DEFAULT_PAGE_LIMIT,
  ORGANIZATION_CONTACTS_SEARCH,
  SURVEY_CONTACTS_SEARCH,
  RESET_ORGANIZATION_CONTACTS,
  RESET_SURVEY_CONTACTS,
} from '../../src/constants';
import callApi, { REQUESTS } from '../../src/actions/api';
import {
  getMyOrganizations,
  getOrganizationsContactReports,
  getOrganizationContacts,
  getOrganizationMembers,
  getOrganizationMembersNextPage,
  getMyCommunities,
  reloadOrganizationContacts,
} from '../../src/actions/organizations';
import { organizationSelector } from '../../src/selectors/organizations';

jest.mock('../../src/selectors/organizations');
jest.mock('../../src/actions/api');

const orgId = '123';

const mockStore = configureStore([thunk]);
let store;
const auth = { person: { user: {} } };

beforeEach(() => {
  store = mockStore({ auth });
  callApi.mockClear();
});

describe('getMyOrganizations', () => {
  const query = {
    limit: 100,
    include: '',
    filters: {
      descendants: false,
    },
  };
  const org1 = { id: '1' };
  const org2 = { id: '2' };
  const org3 = { id: '3' };
  const org4 = { id: '4' };
  const org5 = { id: '5' };
  const org6 = { id: '6' };
  const org7 = { id: '7' };
  const org8 = { id: '8' };
  const orgs = [org1, org2, org3, org4, org5, org6, org7, org8];

  callApi.mockReturnValue(() => Promise.resolve({ response: orgs }));

  it('should get my organizations', async () => {
    await store.dispatch(getMyOrganizations());

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_ORGANIZATIONS, query);
    expect(store.getActions()).toEqual([
      {
        type: LOAD_ORGANIZATIONS,
        orgs: [org1, org2, org3, org4, org5, org6, org7, org8],
      },
    ]);
  });

  it('should sort by user order when specified', async () => {
    store = mockStore({
      auth: {
        person: {
          user: { organization_order: [org5.id, org4.id, org6.id, org3.id] },
        },
      },
    });

    await store.dispatch(getMyOrganizations());

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_ORGANIZATIONS, query);
    expect(store.getActions()).toEqual([
      {
        type: LOAD_ORGANIZATIONS,
        orgs: [org5, org4, org6, org3, org1, org2, org7, org8],
      },
    ]);
  });
});

describe('getOrganizationsContactReports', () => {
  const contactReportsResponse = {
    type: 'successful',
    response: [
      {
        organization_id: '123',
        contact_count: 23,
        unassigned_count: 45,
        uncontacted_count: 67,
      },
      {
        organization_id: '456',
        contact_count: 89,
        unassigned_count: 10,
        uncontacted_count: 23,
      },
    ],
  };
  const contactReportsAction = {
    type: GET_ORGANIZATIONS_CONTACTS_REPORT,
    reports: [
      {
        id: contactReportsResponse.response[0].organization_id,
        contactsCount: contactReportsResponse.response[0].contact_count,
        unassignedCount: contactReportsResponse.response[0].unassigned_count,
        uncontactedCount: contactReportsResponse.response[0].uncontacted_count,
      },
      {
        id: contactReportsResponse.response[1].organization_id,
        contactsCount: contactReportsResponse.response[1].contact_count,
        unassignedCount: contactReportsResponse.response[1].unassigned_count,
        uncontactedCount: contactReportsResponse.response[1].uncontacted_count,
      },
    ],
  };

  it('should get contact reports and dispatch to API', async () => {
    callApi.mockReturnValue(contactReportsResponse);

    await store.dispatch(getOrganizationsContactReports());

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_ORGANIZATION_INTERACTIONS_REPORT,
      { period: 'P1W' },
    );
    expect(store.getActions()).toEqual([
      contactReportsResponse,
      contactReportsAction,
    ]);
  });
});

describe('getOrganizationContacts', () => {
  const createStore = state => {
    store = mockStore(state);
  };

  MockDate.set('2018-08-22 12:00:00', 300);
  const name = 'name';
  const surveyId = '555';
  const surveyQuestions1 = { id: '123', text: '123Text', isAnswer: true };
  const surveyQuestions2 = { id: '456', text: '456Text', isAnswer: true };
  const filters = {
    gender: { id: 'Male' },
    archived: true,
    unassigned: true,
    uncontacted: true,
    labels: { id: '333' },
    groups: { id: '444' },
    time: { id: 'time7', value: 7 },
  };
  const query = {
    filters: {
      permissions: 'no_permission',
      organization_ids: orgId,
      name: name,
      genders: filters.gender.id,
      include_archived: true,
      assigned_tos: 'unassigned',
      statuses: 'uncontacted',
      label_ids: filters.labels.id,
      group_ids: filters.groups.id,
    },
    page: {
      limit: DEFAULT_PAGE_LIMIT,
      offset: 0,
    },
    include:
      'reverse_contact_assignments,reverse_contact_assignments.organization,organizational_permissions',
  };
  const answerFilters = {
    survey: { id: surveyId },
    [surveyQuestions1.id]: surveyQuestions1,
    [surveyQuestions2.id]: surveyQuestions2,
  };

  const answerQuery = {
    survey_ids: surveyId,
    answers: {
      [surveyQuestions1.id]: [surveyQuestions1.text],
      [surveyQuestions2.id]: [surveyQuestions2.text],
    },
    created_at: ['2018-08-15T00:00:00Z', '2018-08-22T23:59:59Z'],
  };
  const org = { id: orgId };

  const apiResponse = { type: 'successful', response: [], meta: {} };

  const organizations = { all: [org] };

  beforeEach(() => {
    createStore({ organizations });
    callApi.mockReturnValue(apiResponse);
    organizationSelector.mockImplementation(() => org);
  });

  it('searches for org contacts by filters', async () => {
    callApi.mockReturnValue(apiResponse);
    const expectedReturn = {
      type: ORGANIZATION_CONTACTS_SEARCH,
      contacts: [],
      meta: {},
      orgId,
      query,
    };

    await store.dispatch(getOrganizationContacts(orgId, name, filters));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_PEOPLE_LIST, query);
    expect(store.getActions()).toEqual([apiResponse, expectedReturn]);
  });

  it('searches for survey contacts by filters', async () => {
    const surveyFilters = {
      ...filters,
      ...answerFilters,
    };
    const surveyQuery = {
      ...query,
      filters: {
        ...query.filters,
        answer_sheets: answerQuery,
      },
    };
    const expectedReturn = {
      type: SURVEY_CONTACTS_SEARCH,
      contacts: [],
      meta: {},
      orgId,
      query: surveyQuery,
    };

    await store.dispatch(getOrganizationContacts(orgId, name, surveyFilters));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_PEOPLE_LIST, surveyQuery);
    expect(store.getActions()).toEqual([apiResponse, expectedReturn]);
  });
});

describe('reloadOrganizationContacts', () => {
  const createStore = state => {
    store = mockStore(state);
  };

  const surveyId = '555';
  const name = 'name';
  const org = {
    id: orgId,
    contactPagination: { page: 1, hasNextPage: false },
    surveys: {
      [surveyId]: {
        contactPagination: { page: 1, hasNextPage: false },
      },
    },
  };
  const query = {
    filters: {
      permissions: 'no_permission',
      organization_ids: orgId,
      name: name,
    },
    page: {
      limit: DEFAULT_PAGE_LIMIT,
      offset: DEFAULT_PAGE_LIMIT,
    },
    include:
      'reverse_contact_assignments,reverse_contact_assignments.organization,organizational_permissions',
  };

  const answerQuery = {
    survey_ids: surveyId,
  };

  const apiResponse = { type: 'successful', response: [], meta: {} };

  const organizations = { all: [org] };

  beforeEach(() => {
    createStore({ organizations });
    callApi.mockReturnValue(apiResponse);
    organizationSelector.mockImplementation(() => org);
  });

  it('reloads org contacts', async () => {
    const resetAction = {
      type: RESET_ORGANIZATION_CONTACTS,
      orgId,
      surveyId: undefined,
    };
    const expectedReturn = {
      type: ORGANIZATION_CONTACTS_SEARCH,
      contacts: [],
      meta: {},
      orgId,
      query,
    };

    await store.dispatch(reloadOrganizationContacts(orgId, name));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_PEOPLE_LIST, query);
    expect(store.getActions()).toEqual([
      resetAction,
      apiResponse,
      expectedReturn,
    ]);
  });

  it('reloads survey contacts', async () => {
    createStore({ organizations });
    callApi.mockReturnValue(apiResponse);
    const resetAction = {
      type: RESET_SURVEY_CONTACTS,
      orgId,
      surveyId,
    };

    const filters = {
      survey: { id: surveyId },
    };
    const surveyQuery = {
      ...query,
      filters: {
        ...query.filters,
        answer_sheets: answerQuery,
      },
    };
    const expectedReturn = {
      type: SURVEY_CONTACTS_SEARCH,
      contacts: [],
      meta: {},
      orgId,
      query: surveyQuery,
    };

    await store.dispatch(reloadOrganizationContacts(orgId, name, filters));
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_PEOPLE_LIST, surveyQuery);
    expect(store.getActions()).toEqual([
      resetAction,
      apiResponse,
      expectedReturn,
    ]);
  });
});

describe('getOrganizationMembers', () => {
  const orgId = '123';
  const query = {
    filters: {
      permissions: 'admin,user',
      organization_ids: orgId,
    },
    include: 'organizational_permissions',
  };
  const members = [
    {
      name: 'person',
      id: '1',
    },
    {
      name: 'person',
      id: '2',
    },
  ];

  // Get reports endpoint
  const reportsQuery = {
    people_ids: members.map(m => m.id).join(','),
    period: 'P1Y',
    organization_ids: orgId,
  };
  const reports = [
    {
      person_id: '1',
      contact_count: 1,
      uncontacted_count: 1,
      contacts_with_interaction_count: 1,
    },
    {
      person_id: '2',
      contact_count: 1,
      uncontacted_count: 1,
      contacts_with_interaction_count: 1,
    },
  ];
  const finalMembers = members.map(m => ({
    ...m,
    contact_count: 1,
    uncontacted_count: 1,
    contacts_with_interaction_count: 1,
  }));

  // Final action to be run
  const getMembersAction = {
    type: GET_ORGANIZATION_MEMBERS,
    members: finalMembers,
    orgId,
    meta: { total: 50 },
    query: query,
  };

  const peopleListResponse = {
    type: 'successful',
    response: members,
    meta: { total: 50 },
  };

  const reportsListResponse = {
    type: 'successful',
    response: reports,
  };

  it('should get members in organization', async () => {
    // Mock out the api.default to return different results based on the 2 API calls being made
    callApi.mockImplementation((...actualParams) => {
      if (actualParams[0].name === REQUESTS.GET_PEOPLE_LIST.name) {
        return peopleListResponse;
      } else if (
        actualParams[0].name === REQUESTS.GET_PEOPLE_INTERACTIONS_REPORT.name
      ) {
        return reportsListResponse;
      }
      return undefined;
    });

    await store.dispatch(getOrganizationMembers(orgId));

    expect(store.getActions()).toEqual([
      peopleListResponse,
      reportsListResponse,
      getMembersAction,
    ]);
  });

  it('should get members next page in organization', async () => {
    store = configureStore([thunk])({
      organizations: { membersPagination: { hasNextPage: true, page: 1 } },
    });
    const page = { limit: 25, offset: 25 };

    await store.dispatch(getOrganizationMembersNextPage(orgId));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_PEOPLE_LIST, {
      ...query,
      page,
    });
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_PEOPLE_INTERACTIONS_REPORT,
      reportsQuery,
    );
    expect(store.getActions()).toEqual([
      peopleListResponse,
      reportsListResponse,
      { ...getMembersAction, query: { ...getMembersAction.query, page } },
    ]);
  });

  it('should get members next page in organization', async () => {
    store = configureStore([thunk])({
      organizations: { membersPagination: { hasNextPage: false, page: 1 } },
    });

    const result = await store.dispatch(getOrganizationMembersNextPage(orgId));
    expect(result).toEqual(undefined);
  });
});

describe('getMyCommunities', () => {
  it('should get my communities', async () => {
    const response = {
      type: 'successful',
      response: [{}],
    };
    callApi.mockReturnValue(response);
    await store.dispatch(getMyCommunities());
    const actions = store.getActions();

    // Api call, then LOAD_ORGANIZATIONS
    expect(actions[0]).toEqual(response);
    expect(actions[1].type).toEqual(LOAD_ORGANIZATIONS);
    // Another api call, then GET_ORGANIZATIONS_CONTACTS_REPORT
    expect(actions[2]).toEqual(response);
    expect(actions[3].type).toEqual(GET_ORGANIZATIONS_CONTACTS_REPORT);
  });
});

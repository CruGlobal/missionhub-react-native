import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  GET_ORGANIZATIONS_CONTACTS_REPORT,
  GET_ORGANIZATION_MEMBERS,
  LOAD_ORGANIZATIONS,
  DEFAULT_PAGE_LIMIT,
} from '../../src/constants';
import callApi, { REQUESTS } from '../../src/actions/api';
import {
  getMyOrganizations,
  getOrganizationsContactReports,
  getOrganizationContacts,
  getOrganizationMembers,
  getOrganizationMembersNextPage,
} from '../../src/actions/organizations';

jest.mock('../../src/selectors/organizations');
jest.mock('../../src/actions/api');

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
  const name = 'name';
  const orgId = '123';
  const filters = {
    gender: { id: 'Male' },
    archived: true,
    unassigned: true,
    uncontacted: true,
    labels: { id: '333' },
    groups: { id: '444' },
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
      offset: NaN,
    },
    include:
      'reverse_contact_assignments,reverse_contact_assignments.organization,organizational_permissions',
  };
  const apiResponse = { type: 'successful', response: {} };

  it('searches for contacts by filters', async () => {
    callApi.mockReturnValue(apiResponse);

    await store.dispatch(getOrganizationContacts(orgId, name, {}, filters));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_PEOPLE_LIST, query);
    expect(store.getActions()).toEqual([apiResponse]);
  });
});

describe('getOrganizationMembers', () => {
  const orgId = '123';
  const query = {
    filters: {
      permissions: 'admin,user',
      organization_ids: orgId,
    },
    include:
      'contact_assignments.person,organizational_permissions,phone_numbers,email_addresses',
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

    store.dispatch(getOrganizationMembersNextPage(orgId)).then(() => {
      expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_PEOPLE_LIST, query, {});
      expect(callApi).toHaveBeenCalledWith(
        REQUESTS.GET_PEOPLE_INTERACTIONS_REPORT,
        reportsQuery,
        {},
      );

      expect(store.getActions()).toEqual([getMembersAction]);
    });
  });

  it('should get members next page in organization', async () => {
    store = configureStore([thunk])({
      organizations: { membersPagination: { hasNextPage: false, page: 1 } },
    });

    try {
      await store.dispatch(getOrganizationMembersNextPage(orgId));
    } catch (e) {
      expect(e).toEqual('NoMoreData');
    }
  });
});

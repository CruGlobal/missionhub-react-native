import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  GET_ORGANIZATION_CONTACTS,
  GET_ORGANIZATIONS_CONTACTS_REPORT,
  GET_ORGANIZATION_MEMBERS,
} from '../../src/constants';
import { mockFnWithParams } from '../../testUtils';
import * as api from '../../src/actions/api';
import { REQUESTS } from '../../src/actions/api';
import {
  getAssignedOrganizations,
  getMyOrganizations,
  getOrganizationContacts,
  getOrganizationsContactReports,
  getOrganizationMembers,
  getOrganizationMembersNextPage,
} from '../../src/actions/organizations';

let store;
const apiResponse = { type: 'successful' };

beforeEach(() => (store = configureStore([thunk])()));

describe('getMyOrganizations', () => {
  const query = {
    limit: 100,
    include: '',
  };

  it('should get my organizations', () => {
    mockFnWithParams(
      api,
      'default',
      apiResponse,
      REQUESTS.GET_MY_ORGANIZATIONS,
      query,
    );

    store.dispatch(getMyOrganizations());

    expect(store.getActions()).toEqual([apiResponse]);
  });
});

describe('getAssignedOrganizations', () => {
  const query = {
    limit: 100,
    include: '',
    filters: {
      assigned_tos: 'me',
    },
  };

  it('should get my assigned organizations', () => {
    mockFnWithParams(
      api,
      'default',
      apiResponse,
      REQUESTS.GET_ORGANIZATIONS,
      query,
    );

    store.dispatch(getAssignedOrganizations());

    expect(store.getActions()).toEqual([apiResponse]);
  });
});

describe('getOrganizationContacts', () => {
  const orgId = '123';
  const query = {
    filters: {
      permissions: 'no_permission',
      organization_ids: orgId,
    },
    include:
      'reverse_contact_assignments,reverse_contact_assignments.organization,organizational_permissions',
  };
  const contacts = [
    {
      name: 'person',
      id: '1',
    },
    {
      name: 'person',
      id: '2',
    },
  ];
  const peopleListResponse = {
    type: 'successful',
    response: contacts,
  };
  const getContactsAction = {
    type: GET_ORGANIZATION_CONTACTS,
    contacts,
    orgId,
  };

  it('should get contacts in organization', async () => {
    mockFnWithParams(
      api,
      'default',
      peopleListResponse,
      REQUESTS.GET_PEOPLE_LIST,
      query,
    );

    await store.dispatch(getOrganizationContacts(orgId));
    expect(store.getActions()).toEqual([peopleListResponse, getContactsAction]);
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
    mockFnWithParams(
      api,
      'default',
      contactReportsResponse,
      REQUESTS.GET_ORGANIZATION_INTERACTIONS_REPORT,
      { period: 'P1W' },
    );

    await store.dispatch(getOrganizationsContactReports());
    expect(store.getActions()).toEqual([
      contactReportsResponse,
      contactReportsAction,
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
    api.default = jest.fn().mockImplementation((...actualParams) => {
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
      expect(api.default).toHaveBeenCalledWith(
        REQUESTS.GET_PEOPLE_LIST,
        query,
        {},
      );
      expect(api.default).toHaveBeenCalledWith(
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

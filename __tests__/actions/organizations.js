import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  GET_ORGANIZATION_CONTACTS,
  GET_ORGANIZATIONS_CONTACTS_REPORT,
} from '../../src/constants';
import { mockFnWithParams } from '../../testUtils';
import * as api from '../../src/actions/api';
import { REQUESTS } from '../../src/actions/api';
import {
  getAssignedOrganizations,
  getMyOrganizations,
  getOrganizationContacts,
  getOrganizationsContactReports,
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
    organization_id: orgId,
    filters: {
      permissions: 'no_permission',
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

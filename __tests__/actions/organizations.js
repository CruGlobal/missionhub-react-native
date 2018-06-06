import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  GET_ORGANIZATION_CONTACTS,
  GET_ORGANIZATION_MEMBERS,
} from '../../src/constants';
import { mockFnWithParams } from '../../testUtils';
import * as api from '../../src/actions/api';
import { REQUESTS } from '../../src/actions/api';
import {
  getAssignedOrganizations,
  getMyOrganizations,
  getOrganizationContacts,
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

describe('getOrganizationMembers', () => {
  const orgId = '123';
  const query = {
    organization_id: orgId,
    filters: {
      permissions: 'admin,user',
    },
    include: 'contact_assignments,organizational_permissions',
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
  const peopleListResponse = {
    type: 'successful',
    response: members,
    meta: { total: 50 },
  };
  const getMembersAction = {
    type: GET_ORGANIZATION_MEMBERS,
    members,
    orgId,
    meta: { total: 50 },
    query: query,
  };

  it('should get members in organization', async () => {
    mockFnWithParams(
      api,
      'default',
      peopleListResponse,
      REQUESTS.GET_PEOPLE_LIST,
      query,
    );

    await store.dispatch(getOrganizationMembers(orgId));
    expect(store.getActions()).toEqual([peopleListResponse, getMembersAction]);
  });
});

describe('getOrganizationMembersNextPage', () => {
  const orgId = '123';
  const query = {
    page: {
      limit: 25,
      offset: 25,
    },
    organization_id: orgId,
    filters: {
      permissions: 'admin,user',
    },
    include: 'contact_assignments,organizational_permissions',
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
  const peopleListResponse = {
    type: 'successful',
    response: members,
    meta: { total: 50 },
  };
  const getMembersAction = {
    type: GET_ORGANIZATION_MEMBERS,
    members,
    orgId,
    meta: { total: 50 },
    query: query,
  };

  it('should get members in organization', async () => {
    store = configureStore([thunk])({
      organizations: { membersPagination: { hasNextPage: true, page: 1 } },
    });

    mockFnWithParams(
      api,
      'default',
      peopleListResponse,
      REQUESTS.GET_PEOPLE_LIST,
      query,
    );

    await store.dispatch(getOrganizationMembersNextPage(orgId));
    expect(store.getActions()).toEqual([peopleListResponse, getMembersAction]);
  });
});

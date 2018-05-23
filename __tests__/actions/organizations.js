import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { mockFnWithParams } from '../../testUtils';
import * as api from '../../src/actions/api';
import { REQUESTS } from '../../src/actions/api';
import {
  getAssignedOrganizations,
  getMyOrganizations,
  getOrganizationContacts,
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
  const contactResponse = {
    type: 'successful',
    response: [
      {
        name: 'person',
        id: '1',
      },
      {
        name: 'person',
        id: '2',
      },
    ],
  };

  it('should get contacts in organization', () => {
    mockFnWithParams(
      api,
      'default',
      contactResponse,
      REQUESTS.GET_PEOPLE_LIST,
      query,
    );

    store.dispatch(getOrganizationContacts(orgId));

    expect(store.getActions()).toEqual([contactResponse]);
  });
});

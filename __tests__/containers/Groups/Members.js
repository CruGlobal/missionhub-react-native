import React from 'react';

import Members from '../../../src/containers/Groups/Members';
import {
  renderShallow,
  createMockStore,
  testSnapshotShallow,
} from '../../../testUtils';
import { navToPersonScreen } from '../../../src/actions/person';
import * as common from '../../../src/utils/common';
import {
  getOrganizationMembers,
  getOrganizationMembersNextPage,
} from '../../../src/actions/organizations';

jest.mock('../../../src/actions/organizations', () => ({
  getOrganizationMembers: jest.fn(() => ({ type: 'test' })),
  getOrganizationMembersNextPage: jest.fn(() => ({ type: 'test' })),
}));
jest.mock('../../../src/actions/person', () => ({
  navToPersonScreen: jest.fn(() => ({ type: 'test' })),
}));
common.refresh = jest.fn();

const members = [
  { id: '1', full_name: 'Test User 1', contact_assignments: [] },
  { id: '2', full_name: 'Test User 2', contact_assignments: [] },
  { id: '3', full_name: 'Test User 3', contact_assignments: [] },
];

let store = createMockStore({
  organizations: {
    all: [
      {
        id: '1',
        members,
      },
    ],
    membersPagination: { hasNextPage: true },
  },
});

const organization = { id: '1', name: 'Test Org' };

beforeEach(() => {
  navToPersonScreen.mockClear();
});

describe('Members', () => {
  const component = <Members organization={organization} />;

  it('should render correctly', () => {
    testSnapshotShallow(component, store);
  });

  it('should mount correctly', () => {
    const store = createMockStore({
      organizations: {
        all: [
          {
            id: '1',
            members: [],
          },
        ],
        membersPagination: { hasNextPage: true },
      },
    });
    const instance = renderShallow(component, store).instance();
    instance.componentDidMount();
    expect(getOrganizationMembers).toHaveBeenCalled();
  });

  it('should not render load more correctly', () => {
    const store = createMockStore({
      organizations: {
        all: [
          {
            id: '1',
            members,
          },
        ],
        membersPagination: { hasNextPage: false },
      },
    });
    const instance = renderShallow(component, store).instance();
    instance.componentDidMount();
    expect(getOrganizationMembers).toHaveBeenCalled();
  });

  it('should handleSelect correctly', () => {
    const instance = renderShallow(component, store).instance();
    instance.handleSelect({ id: '1' });
    expect(navToPersonScreen).toHaveBeenCalled();
  });

  it('should handleLoadMore correctly', () => {
    const instance = renderShallow(component, store).instance();
    instance.handleLoadMore();
    expect(getOrganizationMembersNextPage).toHaveBeenCalled();
  });

  it('should handleRefresh correctly', () => {
    const instance = renderShallow(component, store).instance();
    instance.handleRefresh();
    expect(common.refresh).toHaveBeenCalled();
  });
});

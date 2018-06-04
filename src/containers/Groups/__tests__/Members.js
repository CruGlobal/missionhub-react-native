import React from 'react';

import Members from '../Members';
import {
  renderShallow,
  createMockStore,
  testSnapshotShallow,
} from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
jest.mock('../../../actions/navigation', () => ({
  navigatePush: jest.fn(() => ({ type: 'test' })),
}));
import {
  getOrganizationMembers,
  getOrganizationMembersNextPage,
} from '../../../actions/organizations';
jest.mock('../../../actions/organizations', () => ({
  getOrganizationMembers: jest.fn(() => ({ type: 'test' })),
  getOrganizationMembersNextPage: jest.fn(() => ({ type: 'test' })),
}));

const store = createMockStore({
  groups: {
    members: [
      { id: '1', full_name: 'Test User 1', contact_assignments: [] },
      { id: '2', full_name: 'Test User 2', contact_assignments: [] },
      { id: '3', full_name: 'Test User 3', contact_assignments: [] },
    ],
    membersPagination: { hasNextPage: true },
  },
});

const organization = { id: '1', name: 'Test Org' };

describe('Members', () => {
  const component = <Members organization={organization} />;

  it('should render correctly', () => {
    testSnapshotShallow(component, store);
  });

  it('should mount correctly', () => {
    const instance = renderShallow(component, store).instance();
    instance.componentDidMount();
    expect(getOrganizationMembers).toHaveBeenCalled();
  });

  it('should handleSelect correctly', () => {
    const instance = renderShallow(component, store).instance();
    instance.handleSelect({ id: '1' });
    expect(navigatePush).toHaveBeenCalled();
  });

  it('should handleLoadMore correctly', () => {
    const instance = renderShallow(component, store).instance();
    instance.handleLoadMore();
    expect(getOrganizationMembersNextPage).toHaveBeenCalled();
  });
});

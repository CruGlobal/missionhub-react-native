import React from 'react';

import Members from '../Members';
import {
  renderShallow,
  createMockStore,
  testSnapshotShallow,
} from '../../../../testUtils';
import { navToPersonScreen } from '../../../actions/person';
import {
  getOrganizationMembers,
  getOrganizationMembersNextPage,
} from '../../../actions/organizations';
import * as common from '../../../utils/common';

jest.mock('../../../actions/person', () => ({
  navToPersonScreen: jest.fn(() => ({ type: 'test' })),
}));
jest.mock('../../../actions/organizations', () => ({
  getOrganizationMembers: jest.fn(() => ({ type: 'test' })),
  getOrganizationMembersNextPage: jest.fn(() => ({ type: 'test' })),
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
    const mockStore = createMockStore({
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
    const instance = renderShallow(component, mockStore).instance();
    instance.componentDidMount();
    expect(getOrganizationMembers).toHaveBeenCalled();
  });

  it('should not render load more correctly', () => {
    const mockStore = createMockStore({
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
    const instance = renderShallow(component, mockStore).instance();
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

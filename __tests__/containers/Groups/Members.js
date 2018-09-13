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
import * as navigation from '../../../src/actions/navigation';
import { ADD_CONTACT_SCREEN } from '../../../src/containers/AddContactScreen';

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

const store = createMockStore({
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

  it('calls list key extractor', () => {
    const instance = renderShallow(component, store).instance();
    const item = { id: '1' };
    const result = instance.keyExtractor(item);
    expect(result).toEqual(item.id);
  });

  it('calls render item', () => {
    const instance = renderShallow(component, store).instance();
    const renderedItem = instance.renderItem({ item: members[0] });
    expect(renderedItem).toMatchSnapshot();
  });

  it('calls invite', () => {
    const component = renderShallow(
      <Members organization={organization} />,
      store,
    );
    navigation.navigatePush = jest.fn(() => ({ type: 'push' }));
    component
      .childAt(1)
      .childAt(0)
      .props()
      .onPress();
    expect(navigation.navigatePush).toHaveBeenCalledWith(ADD_CONTACT_SCREEN, {
      organization,
      isInvite: true,
      onComplete: expect.any(Function),
    });
  });
});

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
import { ORG_PERMISSIONS } from '../../../src/constants';

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

const orgId = '1';

const store = createMockStore({
  organizations: {
    all: [
      {
        id: orgId,
        members,
      },
    ],
    membersPagination: { hasNextPage: true },
  },
  auth: {
    person: {
      organizational_permissions: [
        {
          organization_id: orgId,
          permission_id: ORG_PERMISSIONS.USER,
        },
      ],
    },
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

  it('should mount with send invite', () => {
    const store2 = createMockStore({
      organizations: {
        all: [
          {
            id: '1',
            members: [],
          },
        ],
        membersPagination: { hasNextPage: true },
      },
      auth: {
        person: {
          organizational_permissions: [
            {
              organization_id: orgId,
              permission_id: ORG_PERMISSIONS.ADMIN,
            },
          ],
        },
      },
    });
    testSnapshotShallow(component, store2);
  });

  it('should mount correctly', () => {
    const store2 = createMockStore({
      organizations: {
        all: [
          {
            id: '1',
            members: [],
          },
        ],
        membersPagination: { hasNextPage: true },
      },
      auth: {
        person: {
          organizational_permissions: [
            {
              organization_id: orgId,
              permission_id: ORG_PERMISSIONS.USER,
            },
          ],
        },
      },
    });
    const instance = renderShallow(component, store2).instance();
    instance.componentDidMount();
    expect(getOrganizationMembers).toHaveBeenCalled();
  });

  it('should not render load more correctly', () => {
    const store2 = createMockStore({
      organizations: {
        all: [
          {
            id: '1',
            members,
          },
        ],
        membersPagination: { hasNextPage: false },
      },
      auth: {
        person: {
          organizational_permissions: [
            {
              organization_id: orgId,
              permission_id: ORG_PERMISSIONS.USER,
            },
          ],
        },
      },
    });
    const instance = renderShallow(component, store2).instance();
    instance.componentDidMount();
    expect(getOrganizationMembers).toHaveBeenCalled();
  });

  it('should handleSelect correctly', () => {
    const member = members[0];
    const screen = renderShallow(component, store);
    const listItem = screen
      .childAt(0)
      .props()
      .renderItem({ item: member });

    listItem.props.onSelect(member);

    expect(navToPersonScreen).toHaveBeenCalledWith(member, organization);
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
    const store2 = createMockStore({
      organizations: {
        all: [
          {
            id: orgId,
            members,
          },
        ],
        membersPagination: { hasNextPage: true },
      },
      auth: {
        person: {
          organizational_permissions: [
            {
              organization_id: orgId,
              permission_id: ORG_PERMISSIONS.ADMIN,
            },
          ],
        },
      },
    });
    const component = renderShallow(
      <Members organization={organization} />,
      store2,
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

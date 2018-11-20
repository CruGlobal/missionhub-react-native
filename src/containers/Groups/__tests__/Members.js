import React from 'react';
import { Alert, Share } from 'react-native';

import Members from '../Members';
import {
  renderShallow,
  createMockStore,
  testSnapshotShallow,
} from '../../../../testUtils';
import { navToPersonScreen } from '../../../actions/person';
import * as common from '../../../utils/common';
import {
  getOrganizationMembers,
  getOrganizationMembersNextPage,
} from '../../../actions/organizations';
import { ORG_PERMISSIONS } from '../../../constants';
import i18n from '../../../i18n';
import { removeGroupInviteInfo } from '../../../actions/swipe';

jest.mock('../../../actions/organizations', () => ({
  getOrganizationMembers: jest.fn(() => ({ type: 'test' })),
  getOrganizationMembersNextPage: jest.fn(() => ({ type: 'test' })),
}));
jest.mock('../../../actions/person', () => ({
  navToPersonScreen: jest.fn(() => ({ type: 'test' })),
}));
jest.mock('../../../actions/swipe', () => ({
  removeGroupInviteInfo: jest.fn(() => ({ type: 'remove group invite info' })),
}));
common.refresh = jest.fn();
Alert.alert = jest.fn();

const members = [
  { id: '1', full_name: 'Test User 1', contact_assignments: [] },
  { id: '2', full_name: 'Test User 2', contact_assignments: [] },
  { id: '3', full_name: 'Test User 3', contact_assignments: [] },
];

const orgId = '1';
const myId = '111';

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
      id: myId,
      organizational_permissions: [
        {
          organization_id: orgId,
          permission_id: ORG_PERMISSIONS.USER,
        },
      ],
    },
  },
  swipe: { groupInviteInfo: true },
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
      swipe: { groupInviteInfo: true },
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
      swipe: { groupInviteInfo: true },
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
      swipe: { groupInviteInfo: true },
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

  it('calls invite', async () => {
    const url = '123';
    const store2 = createMockStore({
      organizations: {
        all: [{ ...organization, community_url: url, members }],
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
      swipe: { groupInviteInfo: true },
    });
    const component = renderShallow(
      <Members organization={organization} />,
      store2,
    );
    Share.share = jest.fn(() => ({ action: Share.sharedAction }));
    common.getCommunityUrl = jest.fn(() => url);
    await component
      .childAt(1)
      .childAt(0)
      .props()
      .onPress();

    expect(Share.share).toHaveBeenCalledWith({
      message: i18n.t('groupsMembers:sendInviteMessage', { url }),
    });
    expect(Alert.alert).toHaveBeenCalledWith(
      '',
      i18n.t('groupsMembers:invited', { orgName: organization.name }),
    );
    expect(removeGroupInviteInfo).toHaveBeenCalled();
  });

  it('renderHeader match snapshot', () => {
    const instance = renderShallow(component, store).instance();
    const header = instance.renderHeader();
    expect(header).toMatchSnapshot();
  });
});

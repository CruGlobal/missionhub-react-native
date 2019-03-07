/* eslint max-lines-per-function: 0 */

import React from 'react';
import { Alert, Share } from 'react-native';
import i18n from 'i18next';

import Members from '../Members';
import {
  renderShallow,
  createThunkStore,
  testSnapshotShallow,
} from '../../../../testUtils';
import { navToPersonScreen } from '../../../actions/person';
import * as common from '../../../utils/common';
import {
  getOrganizationMembers,
  getOrganizationMembersNextPage,
  refreshCommunity,
} from '../../../actions/organizations';
import { trackActionWithoutData } from '../../../actions/analytics';
import { ORG_PERMISSIONS, ACTIONS } from '../../../constants';
import { removeGroupInviteInfo } from '../../../actions/swipe';

jest.mock('../../../actions/organizations');
jest.mock('../../../actions/person');
jest.mock('../../../actions/swipe');
jest.mock('../../../actions/analytics');
common.refresh = jest.fn();
Alert.alert = jest.fn();

const members = [
  { id: '1', full_name: 'Test User 1', contact_assignments: [] },
  { id: '2', full_name: 'Test User 2', contact_assignments: [] },
  { id: '3', full_name: 'Test User 3', contact_assignments: [] },
];

const orgId = '1';
const myId = '111';

const organization = { id: orgId, name: 'Test Org' };
const store = createThunkStore({
  organizations: {
    all: [
      {
        ...organization,
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

trackActionWithoutData.mockReturnValue({ type: 'tracked action without data' });
removeGroupInviteInfo.mockReturnValue({ type: 'removed group invite info' });
navToPersonScreen.mockReturnValue({ type: 'navigated to person screen' });
getOrganizationMembersNextPage.mockReturnValue({
  type: 'got org members next page',
});
getOrganizationMembers.mockReturnValue({
  type: 'got org members',
});
refreshCommunity.mockReturnValue({ type: 'refreshed community' });

describe('Members', () => {
  const component = <Members organization={organization} />;

  it('should render correctly', () => {
    testSnapshotShallow(component, store);
  });

  it('should mount correctly', () => {
    const store2 = createThunkStore({
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
    expect(refreshCommunity).toHaveBeenCalledWith(orgId);
    expect(getOrganizationMembers).toHaveBeenCalledWith(orgId);
  });

  it('should not render load more correctly', () => {
    const store2 = createThunkStore({
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
    expect(refreshCommunity).not.toHaveBeenCalled();
    expect(getOrganizationMembers).not.toHaveBeenCalled();
  });

  it('should handleSelect correctly', () => {
    const member = members[0];
    const screen = renderShallow(component, store);
    const listItem = screen
      .childAt(0)
      .props()
      .renderItem({ item: member });

    listItem.props.onSelect(member);

    expect(navToPersonScreen).toHaveBeenCalledWith(member, {
      ...organization,
      members,
    });
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

  it('calls invite and shows alert', async () => {
    const url = '123';
    const code = 'ABCDEF';
    const store2 = createThunkStore({
      organizations: {
        all: [
          {
            ...organization,
            community_url: url,
            community_code: code,
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
      message: i18n.t('groupsMembers:sendInviteMessage', { url, code }),
    });
    expect(Alert.alert).toHaveBeenCalledWith(
      '',
      i18n.t('groupsMembers:invited', { orgName: organization.name }),
    );
    expect(removeGroupInviteInfo).toHaveBeenCalled();
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.SEND_COMMUNITY_INVITE,
    );
  });

  it('calls invite and does not show alert', async () => {
    const url = '123';
    const code = 'ABCDEF';
    const store2 = createThunkStore({
      organizations: {
        all: [
          {
            ...organization,
            community_url: url,
            community_code: code,
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
      swipe: { groupInviteInfo: false },
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
      message: i18n.t('groupsMembers:sendInviteMessage', { url, code }),
    });
    expect(Alert.alert).not.toHaveBeenCalled();
    expect(removeGroupInviteInfo).not.toHaveBeenCalled();
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.SEND_COMMUNITY_INVITE,
    );
  });

  it('renderHeader match snapshot', () => {
    const instance = renderShallow(component, store).instance();
    const header = instance.renderHeader();
    expect(header).toMatchSnapshot();
  });
});

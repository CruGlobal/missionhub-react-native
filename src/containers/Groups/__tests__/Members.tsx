/* eslint-disable max-lines */
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
import { navigatePush } from '../../../actions/navigation';
import { ADD_PERSON_THEN_COMMUNITY_MEMBERS_FLOW } from '../../../routes/constants';

jest.mock('../../../actions/organizations');
jest.mock('../../../actions/person');
jest.mock('../../../actions/swipe');
jest.mock('../../../actions/analytics');
jest.mock('../../../actions/navigation');
common.refresh = jest.fn();
Alert.alert = jest.fn();

const members = [
  { id: '1', full_name: 'Test User 1', contact_assignments: [] },
  { id: '2', full_name: 'Test User 2', contact_assignments: [] },
  { id: '3', full_name: 'Test User 3', contact_assignments: [] },
];

const orgId = '1';
const myId = '111';

const organization = { id: orgId, name: 'Test Org', user_created: true };
const state = {
  organizations: {
    all: [{ ...organization, members }],
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
};

let store;

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
  const component = <Members orgId={orgId} />;

  beforeEach(() => {
    store = createThunkStore(state);
  });

  it('should render correctly', () => {
    testSnapshotShallow(component, store);
  });

  it('should mount correctly', () => {
    store = createThunkStore({
      ...state,
      organizations: {
        all: [{ ...organization, members: [] }],
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

    const instance = renderShallow(component, store).instance();
    instance.componentDidMount();
    expect(refreshCommunity).toHaveBeenCalledWith(orgId);
    expect(getOrganizationMembers).toHaveBeenCalledWith(orgId);
  });

  it('should not render load more correctly', () => {
    store = createThunkStore({
      ...state,
      organizations: {
        all: [{ ...organization, members }],
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

    const instance = renderShallow(component, store).instance();
    instance.componentDidMount();
    expect(refreshCommunity).not.toHaveBeenCalled();
    expect(getOrganizationMembers).not.toHaveBeenCalled();
  });

  it('should handleSelect correctly', () => {
    const member = members[0];
    const screen = renderShallow(component, store);
    const listItem = screen
      .childAt(1)
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

  it('calls render item', () => {
    const instance = renderShallow(component, store).instance();
    const renderedItem = instance.renderItem({ item: members[0] });
    expect(renderedItem).toMatchSnapshot();
  });

  describe('invite button', () => {
    describe('user_created', () => {
      it('should call invite and show alert', async () => {
        const url = '123';
        const code = 'ABCDEF';
        store = createThunkStore({
          ...state,
          organizations: {
            ...state.organizations,
            all: [
              {
                ...organization,
                community_url: url,
                community_code: code,
                members,
              },
            ],
          },
          auth: {
            person: {
              ...state.auth.person,
              organizational_permissions: [
                {
                  organization_id: orgId,
                  permission_id: ORG_PERMISSIONS.ADMIN,
                },
              ],
            },
          },
        });
        const component = renderShallow(<Members orgId={orgId} />, store);
        Share.share = jest.fn(() => ({ action: Share.sharedAction }));
        common.getCommunityUrl = jest.fn(() => url);
        await component
          .childAt(2)
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

      it('should call invite and not show alert', async () => {
        const url = '123';
        const code = 'ABCDEF';
        store = createThunkStore({
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
        const component = renderShallow(<Members orgId={orgId} />, store);
        Share.share = jest.fn(() => ({ action: Share.sharedAction }));
        common.getCommunityUrl = jest.fn(() => url);
        await component
          .childAt(2)
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
    });
    describe('non user_created', () => {
      it('should navigate to ADD_PERSON_THEN_COMMUNITY_MEMBERS_FLOW', async () => {
        navigatePush.mockReturnValue({ type: 'navigatePush' });
        const nonUserCreatedOrg = {
          ...organization,
          user_created: false,
        };
        store = createThunkStore({
          organizations: {
            all: [nonUserCreatedOrg],
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
        const component = renderShallow(<Members orgId={orgId} />, store);
        await component
          .childAt(2)
          .props()
          .onPress();

        expect(navigatePush).toHaveBeenCalledWith(
          ADD_PERSON_THEN_COMMUNITY_MEMBERS_FLOW,
          { organization: nonUserCreatedOrg },
        );
      });
    });
  });

  it('renderHeader match snapshot', () => {
    const instance = renderShallow(component, store).instance();
    const header = instance.renderHeader();
    expect(header).toMatchSnapshot();
  });
});

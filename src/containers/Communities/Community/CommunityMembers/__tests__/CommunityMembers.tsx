/* eslint-disable max-lines */

import React from 'react';
import { Alert, Share } from 'react-native';
import { flushMicrotasksQueue, fireEvent } from 'react-native-testing-library';
import i18n from 'i18next';
import * as apolloHooks from '@apollo/react-hooks';

import { PermissionEnum } from '../../../../../../__generated__/globalTypes';
import { renderWithContext } from '../../../../../../testUtils';
import { navToPersonScreen } from '../../../../../actions/person';
import * as common from '../../../../../utils/common';
import {
  trackActionWithoutData,
  trackScreenChange,
} from '../../../../../actions/analytics';
import { removeGroupInviteInfo } from '../../../../../actions/swipe';
import { navigateBack, navigatePush } from '../../../../../actions/navigation';
import CommunityMembers from '../CommunityMembers';
import { ACTIONS } from '../../../../../constants';
import { organizationSelector } from '../../../../../selectors/organizations';

jest.mock('../../../../../actions/navigation', () => ({
  navigateBack: jest.fn(() => ({ type: 'back' })),
  navigatePush: jest.fn(() => ({ type: 'navigatePush' })),
}));
jest.mock('../../../../../actions/organizations');
jest.mock('../../../../../selectors/organizations');
jest.mock('../../../../../actions/person');
jest.mock('../../../../../actions/swipe');
jest.mock('../../../../../actions/analytics');
jest.mock('../../../../../utils/common');

// @ts-ignore
common.refresh = jest.fn();
Alert.alert = jest.fn();

const orgId = '1';

const testurl = 'testurl';
const testcode = 'testcode';
const organization = {
  id: orgId,
  name: 'Test Org',
  user_created: true,
  community_url: testurl,
  community_code: testcode,
};

// @ts-ignore
trackScreenChange.mockReturnValue({ type: 'tracked screen change' });
// @ts-ignore
trackActionWithoutData.mockReturnValue({ type: 'tracked action without data' });
// @ts-ignore
removeGroupInviteInfo.mockReturnValue({ type: 'removed group invite info' });
// @ts-ignore
navToPersonScreen.mockReturnValue({ type: 'navigated to person screen' });

const communityId = '123';

const initialState = {
  auth: { person: { id: '123' } },
  organizations: { all: [organization] },
  swipe: { groupInviteInfo: true },
  drawer: { isOpen: false },
};

beforeEach(() => {
  ((organizationSelector as unknown) as jest.Mock).mockReturnValue(
    organization,
  );
});

describe('CommunityMembers', () => {
  it('should render loading state', () => {
    renderWithContext(<CommunityMembers />, {
      initialState,
      navParams: { communityId },
    }).snapshot();
  });

  it('renders with content', async () => {
    const { snapshot } = renderWithContext(<CommunityMembers />, {
      initialState,
      navParams: { communityId },
      mocks: {
        Query: () => ({
          community: () => ({
            userCreated: () => true,
            people: () => ({
              edges: () => [
                {
                  communityPermission: () => ({
                    permission: PermissionEnum.user,
                  }),
                },
              ],
              nodes: () => [
                {
                  id: 'person1',
                  firstName: 'First',
                  lastName: 'Last',
                  picture: null,
                  createdAt: '2020-04-15T12:00:00.000',
                  communityPermissions: () => ({
                    nodes: () => [
                      { id: 'perm1', permission: PermissionEnum.admin },
                    ],
                  }),
                },
              ],
            }),
          }),
        }),
      },
    });

    await flushMicrotasksQueue();

    snapshot();
  });

  it('should press back button', async () => {
    const { getByTestId } = renderWithContext(<CommunityMembers />, {
      initialState,
      navParams: { communityId },
    });
    await flushMicrotasksQueue();
    fireEvent.press(getByTestId('CloseButton'));

    expect(navigateBack).toHaveBeenCalled();
  });

  it('should press invite button user created', async () => {
    // @ts-ignore
    Share.share = jest.fn(() => ({ action: Share.sharedAction }));
    // @ts-ignore
    common.getCommunityUrl = jest.fn(() => testurl);
    const { getByTestId } = renderWithContext(<CommunityMembers />, {
      initialState,
      navParams: { communityId },
    });
    await flushMicrotasksQueue();
    await fireEvent.press(getByTestId('CommunityMemberInviteButton'));

    expect(Share.share).toHaveBeenCalledWith({
      message: i18n.t('groupsMembers:sendInviteMessage', {
        url: testurl,
        code: testcode,
      }),
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

  it('should press invite button not user created', async () => {
    const { getByTestId } = renderWithContext(<CommunityMembers />, {
      initialState,
      navParams: { communityId },
      mocks: {
        Query: () => ({ community: () => ({ userCreated: () => false }) }),
      },
    });
    await flushMicrotasksQueue();
    await fireEvent.press(getByTestId('CommunityMemberInviteButton'));

    expect(navigatePush).toHaveBeenCalled();
  });

  it('should load next page', async () => {
    const fetchMore = jest.fn();
    const apolloHooksActual = jest.requireActual('@apollo/react-hooks');
    // @ts-ignore
    apolloHooks.useQuery = jest.fn((...args) => ({
      ...apolloHooksActual.useQuery(...args),
      fetchMore,
    }));
    const { getByTestId } = renderWithContext(<CommunityMembers />, {
      initialState,
      navParams: { communityId },
      mocks: {
        Query: () => ({
          community: () => ({
            userCreated: () => true,
            people: () => ({
              pageInfo: () => ({ endCursor: '1', hasNextPage: true }),
            }),
          }),
        }),
      },
    });
    await flushMicrotasksQueue();
    await getByTestId(
      'CommunityMemberList',
    ).props.ListFooterComponent.props.onPress();

    expect(fetchMore).toHaveBeenCalledWith({
      updateQuery: expect.any(Function),
      variables: { after: '1' },
    });

    // expect(navigatePush).toHaveBeenCalled();
  });
});

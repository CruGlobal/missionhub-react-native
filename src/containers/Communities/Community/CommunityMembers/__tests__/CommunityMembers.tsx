/* eslint-disable max-lines */

import React from 'react';
import { Alert, Share } from 'react-native';
import { flushMicrotasksQueue, fireEvent } from 'react-native-testing-library';
import i18n from 'i18next';

import { PermissionEnum } from '../../../../../../__generated__/globalTypes';
import { renderWithContext } from '../../../../../../testUtils';
import { navToPersonScreen } from '../../../../../actions/person';
import * as common from '../../../../../utils/common';
import { useAnalytics } from '../../../../../utils/hooks/useAnalytics';
import {
  trackActionWithoutData,
  trackScreenChange,
} from '../../../../../actions/analytics';
import { removeGroupInviteInfo } from '../../../../../actions/swipe';
import { navigateBack } from '../../../../../actions/navigation';
import { CommunityMembers } from '../CommunityMembers';
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
jest.mock('../../../../../utils/hooks/useAnalytics');

// @ts-ignore
common.refresh = jest.fn();
Alert.alert = jest.fn();

const orgId = '1';

const testurl = 'testurl';
const testcode = 'testcode';
const organization = {
  id: orgId,
  name: 'Test Org',
  community_url: testurl,
  community_code: testcode,
};

(trackScreenChange as jest.Mock).mockReturnValue({
  type: 'tracked screen change',
});
(trackActionWithoutData as jest.Mock).mockReturnValue({
  type: 'tracked action without data',
});
(removeGroupInviteInfo as jest.Mock).mockReturnValue({
  type: 'removed group invite info',
});
(navToPersonScreen as jest.Mock).mockReturnValue({
  type: 'navigated to person screen',
});

const communityId = '123';

const initialState = {
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

    expect(useAnalytics).toHaveBeenCalledWith(['community', 'members']);
  });

  it('should render empty state', () => {
    renderWithContext(<CommunityMembers />, {
      initialState,
      mocks: {
        Query: () => ({
          community: () => ({ people: () => ({ edges: () => [] }) }),
        }),
      },
      navParams: { communityId },
    }).snapshot();

    expect(useAnalytics).toHaveBeenCalledWith(['community', 'members']);
  });

  it('renders with content', async () => {
    const { snapshot } = renderWithContext(<CommunityMembers />, {
      initialState,
      navParams: { communityId },
      mocks: {
        Query: () => ({
          community: () => ({
            people: () => ({
              edges: () => [
                {
                  communityPermission: () => ({
                    permission: PermissionEnum.user,
                  }),
                },
              ],
            }),
          }),
        }),
      },
    });

    expect(useAnalytics).toHaveBeenCalledWith(['community', 'members']);

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

  it('should press invite button', async () => {
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

  it('should load next page', async () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <CommunityMembers />,
      {
        initialState,
        navParams: { communityId },
        mocks: {
          BasePageInfo: () => ({
            endCursor: 'MQ',
            hasNextPage: true,
          }),
        },
      },
    );
    await flushMicrotasksQueue();
    recordSnapshot();

    fireEvent(getByTestId('CommunityMemberList'), 'onEndReached');

    await flushMicrotasksQueue();
    diffSnapshot();
  });
});

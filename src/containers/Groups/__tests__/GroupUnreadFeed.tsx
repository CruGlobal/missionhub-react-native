import React from 'react';
import MockDate from 'mockdate';
import { fireEvent } from 'react-native-testing-library';

import GroupUnreadFeed from '../GroupUnreadFeed';
import { ORG_PERMISSIONS, ANALYTICS_PERMISSION_TYPE } from '../../../constants';
import { renderWithContext } from '../../../../testUtils';
import { navigateBack } from '../../../actions/navigation';
import { organizationSelector } from '../../../selectors/organizations';
import {
  markCommentsRead,
  markCommentRead,
} from '../../../actions/unreadComments';
import { refreshCommunity } from '../../../actions/organizations';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';

jest.mock('../../../actions/celebration');
jest.mock('../../../actions/unreadComments');
jest.mock('../../../actions/navigation');
jest.mock('../../../selectors/organizations');
jest.mock('../../../actions/organizations');
jest.mock('../../../utils/hooks/useAnalytics');
jest.mock('../../CelebrateFeed', () => ({
  CelebrateFeed: 'CelebrateFeed',
}));

MockDate.set('2017-06-18');

const myId = '4';
const communityId = '1';
const organization = { id: communityId };
const orgPermission = {
  organization_id: communityId,
  permission_id: ORG_PERMISSIONS.OWNER,
};

const initialState = {
  auth: { person: { id: myId, organizational_permissions: [orgPermission] } },
  organizations: {
    all: [organization],
  },
};

beforeEach(() => {
  (navigateBack as jest.Mock).mockReturnValue({ type: 'navigateBack' });
  (markCommentsRead as jest.Mock).mockReturnValue({ type: 'markCommentsRead' });
  (markCommentRead as jest.Mock).mockReturnValue({ type: 'markCommentRead' });
  (refreshCommunity as jest.Mock).mockReturnValue({ type: 'refreshCommunity' });
  ((organizationSelector as unknown) as jest.Mock).mockReturnValue(
    organization,
  );
});

it('should render items correctly', () => {
  renderWithContext(<GroupUnreadFeed />, {
    initialState,
    navParams: { communityId },
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(
    ['celebrate', 'new comment items'],
    {
      screenContext: { [ANALYTICS_PERMISSION_TYPE]: 'owner' },
    },
  );
});

it('should call mark comments read and go back', async () => {
  const { getByTestId } = renderWithContext(<GroupUnreadFeed />, {
    initialState,
    navParams: { communityId },
  });

  await fireEvent.press(getByTestId('MarkAllButton'));

  expect(markCommentsRead).toHaveBeenCalledWith(communityId);
  expect(navigateBack).toHaveBeenCalled();
});

it('should call mark specific celebration item comments as read and go back', () => {
  const { getByTestId } = renderWithContext(<GroupUnreadFeed />, {
    initialState,
    navParams: { communityId },
  });

  const event = { id: '1' };

  fireEvent(getByTestId('CelebrateFeed'), 'onClearNotification', event);

  expect(markCommentRead).toHaveBeenCalledWith(event.id, communityId);
});

it('should refetch correctly', () => {
  const { getByTestId } = renderWithContext(<GroupUnreadFeed />, {
    initialState,
    navParams: { communityId },
  });

  fireEvent(getByTestId('CelebrateFeed'), 'onRefetch');

  expect(refreshCommunity).toHaveBeenCalledWith(communityId);
});

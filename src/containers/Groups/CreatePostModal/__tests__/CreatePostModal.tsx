import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../../testUtils';
import { ANALYTICS_PERMISSION_TYPE } from '../../../../constants';
import { PostTypeEnum } from '../../../../../__generated__/globalTypes';
import { getAnalyticsPermissionType } from '../../../../utils/analytics';
import { useAnalytics } from '../../../../utils/hooks/useAnalytics';
import { navigatePush } from '../../../../actions/navigation';
import { CREATE_POST_SCREEN } from '../../CreatePostScreen';
import { PermissionEnum } from '../../../../../__generated__/globalTypes';
import { getMyCommunityPermission_community } from '../../CreatePostButton/__generated__/getMyCommunityPermission';

import CreatePostModal from '..';

jest.mock('../../../../actions/navigation');
jest.mock('../../../../utils/hooks/useAnalytics');
jest.mock('../../../../utils/analytics');
jest.mock('../../../../selectors/people');

const closeModal = jest.fn();
const refreshItems = jest.fn();
const mockCommunityId = '1';
const mockCommunity = (
  permission: PermissionEnum,
): getMyCommunityPermission_community => ({
  __typename: 'Community',
  id: mockCommunityId,
  people: {
    __typename: 'CommunityPersonConnection',
    edges: [
      {
        __typename: 'CommunityPersonEdge',
        communityPermission: { __typename: 'CommunityPermission', permission },
      },
    ],
  },
});

const props = {
  refreshItems,
  community: mockCommunity(PermissionEnum.user),
  closeModal,
};
const initialState = {
  auth: { person: { id: '1' } },
};
const navigatePushResults = { type: 'navigate push' };

beforeEach(() => {
  (getAnalyticsPermissionType as jest.Mock).mockReturnValue('member');
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResults);
});

it('renders correctly', async () => {
  const { snapshot } = renderWithContext(<CreatePostModal {...props} />, {
    initialState,
  });
  await flushMicrotasksQueue();
  snapshot();
  expect(useAnalytics).toHaveBeenLastCalledWith(['post', 'choose type'], {
    screenContext: {
      [ANALYTICS_PERMISSION_TYPE]: 'member',
    },
  });
});

it('renders correctly for admin', async () => {
  (getAnalyticsPermissionType as jest.Mock).mockReturnValue('admin');
  const { snapshot } = renderWithContext(
    <CreatePostModal
      {...props}
      community={mockCommunity(PermissionEnum.admin)}
    />,
    { initialState },
  );
  await flushMicrotasksQueue();
  snapshot();
  expect(useAnalytics).toHaveBeenLastCalledWith(['post', 'choose type'], {
    screenContext: {
      [ANALYTICS_PERMISSION_TYPE]: 'admin',
    },
  });
});

it('renders correctly for owner', async () => {
  (getAnalyticsPermissionType as jest.Mock).mockReturnValue('owner');
  const { snapshot } = renderWithContext(
    <CreatePostModal
      {...props}
      community={mockCommunity(PermissionEnum.owner)}
    />,
    { initialState },
  );
  await flushMicrotasksQueue();
  snapshot();
  expect(useAnalytics).toHaveBeenLastCalledWith(['post', 'choose type'], {
    screenContext: {
      [ANALYTICS_PERMISSION_TYPE]: 'owner',
    },
  });
});

it('fires onPress and navigates | member', async () => {
  const { getByTestId } = renderWithContext(<CreatePostModal {...props} />, {
    initialState,
  });
  await flushMicrotasksQueue();

  fireEvent.press(getByTestId('STORYButton'));
  expect(closeModal).toHaveBeenCalledWith();
  expect(navigatePush).toHaveBeenLastCalledWith(CREATE_POST_SCREEN, {
    onComplete: refreshItems,
    communityId: mockCommunityId,
    postType: PostTypeEnum.story,
  });
  expect(useAnalytics).toHaveBeenLastCalledWith(['post', 'choose type'], {
    screenContext: {
      [ANALYTICS_PERMISSION_TYPE]: 'member',
    },
  });
});

it('fires onPress and navigates | owner', async () => {
  (getAnalyticsPermissionType as jest.Mock).mockReturnValue('owner');
  const { getByTestId } = renderWithContext(
    <CreatePostModal
      {...props}
      community={mockCommunity(PermissionEnum.owner)}
    />,
    { initialState },
  );
  await flushMicrotasksQueue();

  fireEvent.press(getByTestId('ANNOUNCEMENTButton'));
  expect(closeModal).toHaveBeenCalledWith();
  expect(navigatePush).toHaveBeenLastCalledWith(CREATE_POST_SCREEN, {
    onComplete: refreshItems,
    communityId: mockCommunityId,
    postType: PostTypeEnum.announcement,
  });
  expect(useAnalytics).toHaveBeenLastCalledWith(['post', 'choose type'], {
    screenContext: {
      [ANALYTICS_PERMISSION_TYPE]: 'owner',
    },
  });
});

it('closes modal when close button is pressed', async () => {
  const { getByTestId } = renderWithContext(<CreatePostModal {...props} />, {
    initialState,
  });
  await flushMicrotasksQueue();

  fireEvent.press(getByTestId('CloseButton'));
  expect(closeModal).toHaveBeenCalledWith();
  expect(useAnalytics).toHaveBeenLastCalledWith(['post', 'choose type'], {
    screenContext: {
      [ANALYTICS_PERMISSION_TYPE]: 'member',
    },
  });
});

import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { useQuery } from '@apollo/react-hooks';

import { renderWithContext } from '../../../../../testUtils';
import { ANALYTICS_PERMISSION_TYPE } from '../../../../constants';
import { PostTypeEnum } from '../../../../components/PostTypeLabel';
import { getAnalyticsPermissionType } from '../../../../utils/analytics';
import { useAnalytics } from '../../../../utils/hooks/useAnalytics';
import { navigatePush } from '../../../../actions/navigation';
import { CREATE_POST_SCREEN } from '../../CreatePostScreen';
import { PermissionEnum } from '../../../../../__generated__/globalTypes';
import { GET_MY_COMMUNITY_PERMISSION_QUERY } from '../queries';

import CreatePostModal from '..';

jest.mock('../../../../actions/navigation');
jest.mock('../../../../utils/hooks/useAnalytics');
jest.mock('../../../../utils/analytics');
jest.mock('../../../../selectors/people');

const closeModal = jest.fn();
const refreshItems = jest.fn();
const mockCommunityId = '1';
const props = {
  refreshItems,
  communityId: mockCommunityId,
  closeModal,
};
const initialState = {
  auth: {
    person: {
      id: '1',
    },
  },
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
  expect(useQuery).toHaveBeenCalledWith(GET_MY_COMMUNITY_PERMISSION_QUERY, {
    variables: {
      id: props.communityId,
      myId: '1',
    },
  });
  expect(useAnalytics).toHaveBeenLastCalledWith(['post', 'choose type'], {
    screenContext: {
      [ANALYTICS_PERMISSION_TYPE]: 'member',
    },
  });
});

it('renders correctly for admin', async () => {
  (getAnalyticsPermissionType as jest.Mock).mockReturnValue('admin');
  const { snapshot } = renderWithContext(<CreatePostModal {...props} />, {
    initialState,
    mocks: {
      CommunityPermission: () => ({ permission: PermissionEnum.admin }),
    },
  });
  await flushMicrotasksQueue();
  snapshot();
  expect(useQuery).toHaveBeenCalledWith(GET_MY_COMMUNITY_PERMISSION_QUERY, {
    variables: {
      id: props.communityId,
      myId: '1',
    },
  });
  expect(useAnalytics).toHaveBeenLastCalledWith(['post', 'choose type'], {
    screenContext: {
      [ANALYTICS_PERMISSION_TYPE]: 'admin',
    },
  });
});

it('renders correctly for owner', async () => {
  (getAnalyticsPermissionType as jest.Mock).mockReturnValue('owner');
  const { snapshot } = renderWithContext(<CreatePostModal {...props} />, {
    initialState,
    mocks: {
      CommunityPermission: () => ({ permission: PermissionEnum.owner }),
    },
  });
  await flushMicrotasksQueue();
  snapshot();
  expect(useQuery).toHaveBeenCalledWith(GET_MY_COMMUNITY_PERMISSION_QUERY, {
    variables: {
      id: props.communityId,
      myId: '1',
    },
  });
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

  fireEvent.press(getByTestId('godStoryButton'));
  expect(useQuery).toHaveBeenCalledWith(GET_MY_COMMUNITY_PERMISSION_QUERY, {
    variables: {
      id: props.communityId,
      myId: '1',
    },
  });
  expect(closeModal).toHaveBeenCalledWith();
  expect(navigatePush).toHaveBeenLastCalledWith(CREATE_POST_SCREEN, {
    refreshItems,
    communityId: mockCommunityId,
    type: PostTypeEnum.godStory,
  });
  expect(useAnalytics).toHaveBeenLastCalledWith(['post', 'choose type'], {
    screenContext: {
      [ANALYTICS_PERMISSION_TYPE]: 'member',
    },
  });
});

it('fires onPress and navigates | owner', async () => {
  (getAnalyticsPermissionType as jest.Mock).mockReturnValue('owner');
  const { getByTestId } = renderWithContext(<CreatePostModal {...props} />, {
    initialState,
    mocks: {
      CommunityPermission: () => ({ permission: PermissionEnum.owner }),
    },
  });
  await flushMicrotasksQueue();

  fireEvent.press(getByTestId('announcementButton'));
  expect(useQuery).toHaveBeenCalledWith(GET_MY_COMMUNITY_PERMISSION_QUERY, {
    variables: {
      id: props.communityId,
      myId: '1',
    },
  });
  expect(closeModal).toHaveBeenCalledWith();
  expect(navigatePush).toHaveBeenLastCalledWith(CREATE_POST_SCREEN, {
    refreshItems,
    communityId: mockCommunityId,
    type: PostTypeEnum.announcement,
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
  expect(useQuery).toHaveBeenCalledWith(GET_MY_COMMUNITY_PERMISSION_QUERY, {
    variables: {
      id: props.communityId,
      myId: '1',
    },
  });
  expect(closeModal).toHaveBeenCalledWith();
  expect(useAnalytics).toHaveBeenLastCalledWith(['post', 'choose type'], {
    screenContext: {
      [ANALYTICS_PERMISSION_TYPE]: 'member',
    },
  });
});

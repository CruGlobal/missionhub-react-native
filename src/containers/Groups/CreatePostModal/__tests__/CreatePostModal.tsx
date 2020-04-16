import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../../testUtils';
import {
  ORG_PERMISSIONS,
  ANALYTICS_PERMISSION_TYPE,
} from '../../../../constants';
import { PostTypeEnum } from '../../../../components/PostTypeLabel';
import { orgPermissionSelector } from '../../../../selectors/people';
import { getAnalyticsPermissionType } from '../../../../utils/analytics';
import { useAnalytics } from '../../../../utils/hooks/useAnalytics';
import { navigatePush } from '../../../../actions/navigation';
import { CELEBRATE_SHARE_STORY_SCREEN } from '../../ShareStoryScreen';
import { PermissionEnum } from '../../../../../__generated__/globalTypes';
import { getMyCommunityPermission_community as CommunityType } from '../../CreatePostInput/__generated__/getMyCommunityPermission';

import CreatePostModal from '..';

jest.mock('../../../../actions/navigation');
jest.mock('../../../../utils/hooks/useAnalytics');
jest.mock('../../../../utils/analytics');
jest.mock('../../../../selectors/people');

const orgPermission = {
  people: {
    edges: [{ communityPermissions: ORG_PERMISSIONS.USER }],
  },
};

const adminPermissions = {
  ...orgPermission,
  people: {
    edges: [{ communityPermissions: ORG_PERMISSIONS.ADMIN }],
  },
};
const ownerPermissions = {
  ...orgPermission,
  people: {
    edges: [{ communityPermissions: ORG_PERMISSIONS.OWNER }],
  },
};
const mockCommunity: CommunityType = {
  id: '1234',
  __typename: 'Community',
  people: {
    __typename: 'CommunityPersonConnection',
    edges: [
      {
        communityPermission: {
          __typename: 'CommunityPermission',
          permission: PermissionEnum.user,
        },
        __typename: 'CommunityPersonEdge',
      },
    ],
  },
};

const ownerMockCommunity: CommunityType = {
  ...mockCommunity,
  people: {
    __typename: 'CommunityPersonConnection',
    edges: [
      {
        communityPermission: {
          __typename: 'CommunityPermission',
          permission: PermissionEnum.owner,
        },
        __typename: 'CommunityPersonEdge',
      },
    ],
  },
};

const adminMockCommunity: CommunityType = {
  ...mockCommunity,
  people: {
    __typename: 'CommunityPersonConnection',
    edges: [
      {
        communityPermission: {
          __typename: 'CommunityPermission',
          permission: PermissionEnum.admin,
        },
        __typename: 'CommunityPersonEdge',
      },
    ],
  },
};
const closeModal = jest.fn();

const props = {
  community: mockCommunity,
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

it('renders correctly', () => {
  renderWithContext(<CreatePostModal {...props} />, {
    initialState,
  }).snapshot();
  expect(useAnalytics).toHaveBeenLastCalledWith(['post', 'choose type'], {
    screenContext: {
      [ANALYTICS_PERMISSION_TYPE]: 'member',
    },
  });
});

it('renders correctly for admin', () => {
  (getAnalyticsPermissionType as jest.Mock).mockReturnValue('admin');
  renderWithContext(
    <CreatePostModal {...props} community={adminMockCommunity} />,
    {
      initialState,
    },
  ).snapshot();
  expect(useAnalytics).toHaveBeenLastCalledWith(['post', 'choose type'], {
    screenContext: {
      [ANALYTICS_PERMISSION_TYPE]: 'admin',
    },
  });
});

it('renders correctly for owner', () => {
  (getAnalyticsPermissionType as jest.Mock).mockReturnValue('owner');
  renderWithContext(
    <CreatePostModal {...props} community={ownerMockCommunity} />,
    {
      initialState,
    },
  ).snapshot();
  expect(useAnalytics).toHaveBeenLastCalledWith(['post', 'choose type'], {
    screenContext: {
      [ANALYTICS_PERMISSION_TYPE]: 'owner',
    },
  });
});

it('fires onPress and navigates | member', () => {
  const { getByTestId } = renderWithContext(<CreatePostModal {...props} />, {
    initialState,
  });

  fireEvent.press(getByTestId('godStoryButton'));
  expect(closeModal).toHaveBeenCalledWith();
  expect(navigatePush).toHaveBeenLastCalledWith(CELEBRATE_SHARE_STORY_SCREEN, {
    community: mockCommunity,
    type: PostTypeEnum.godStory,
  });
  expect(useAnalytics).toHaveBeenLastCalledWith(['post', 'choose type'], {
    screenContext: {
      [ANALYTICS_PERMISSION_TYPE]: 'member',
    },
  });
});

it('fires onPress and navigates | owner', () => {
  (getAnalyticsPermissionType as jest.Mock).mockReturnValue('owner');
  const { getByTestId } = renderWithContext(
    <CreatePostModal {...props} community={ownerMockCommunity} />,
    {
      initialState,
    },
  );

  fireEvent.press(getByTestId('announcementButton'));
  expect(closeModal).toHaveBeenCalledWith();
  expect(navigatePush).toHaveBeenLastCalledWith(CELEBRATE_SHARE_STORY_SCREEN, {
    community: ownerMockCommunity,
    type: PostTypeEnum.announcement,
  });
  expect(useAnalytics).toHaveBeenLastCalledWith(['post', 'choose type'], {
    screenContext: {
      [ANALYTICS_PERMISSION_TYPE]: 'owner',
    },
  });
});

it('closes modal when close button is pressed', () => {
  const { getByTestId } = renderWithContext(<CreatePostModal {...props} />, {
    initialState,
  });
  fireEvent.press(getByTestId('CloseButton'));

  expect(closeModal).toHaveBeenCalledWith();
  expect(useAnalytics).toHaveBeenLastCalledWith(['post', 'choose type'], {
    screenContext: {
      [ANALYTICS_PERMISSION_TYPE]: 'member',
    },
  });
});

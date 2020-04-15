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

import CreatePostModal from '..';

jest.mock('../../../../actions/navigation');
jest.mock('../../../../utils/hooks/useAnalytics');
jest.mock('../../../../utils/analytics');
jest.mock('../../../../selectors/people');

const orgPermission = { id: '111' };
const memberPermissions = {
  ...orgPermission,
  permission_id: ORG_PERMISSIONS.USER,
};
const adminPermissions = {
  ...orgPermission,
  permission_id: ORG_PERMISSIONS.ADMIN,
};
const ownerPermissions = {
  ...orgPermission,
  permission_id: ORG_PERMISSIONS.OWNER,
};
const mockOrganization = {
  id: '1234',
};
const closeModal = jest.fn();

const props = {
  organization: mockOrganization,
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
  ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue(
    memberPermissions,
  );
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
  ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue(
    adminPermissions,
  );
  (getAnalyticsPermissionType as jest.Mock).mockReturnValue('admin');
  renderWithContext(<CreatePostModal {...props} />, {
    initialState,
  }).snapshot();
  expect(useAnalytics).toHaveBeenLastCalledWith(['post', 'choose type'], {
    screenContext: {
      [ANALYTICS_PERMISSION_TYPE]: 'admin',
    },
  });
});

it('renders correctly for owner', () => {
  ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue(
    ownerPermissions,
  );
  (getAnalyticsPermissionType as jest.Mock).mockReturnValue('owner');
  renderWithContext(<CreatePostModal {...props} />, {
    initialState,
  }).snapshot();
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
    organization: mockOrganization,
    type: PostTypeEnum.godStory,
  });
  expect(useAnalytics).toHaveBeenLastCalledWith(['post', 'choose type'], {
    screenContext: {
      [ANALYTICS_PERMISSION_TYPE]: 'member',
    },
  });
});

it('fires onPress and navigates | owner', () => {
  ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue(
    ownerPermissions,
  );
  (getAnalyticsPermissionType as jest.Mock).mockReturnValue('owner');
  const { getByTestId } = renderWithContext(<CreatePostModal {...props} />, {
    initialState,
  });

  fireEvent.press(getByTestId('announcementButton'));
  expect(closeModal).toHaveBeenCalledWith();
  expect(navigatePush).toHaveBeenLastCalledWith(CELEBRATE_SHARE_STORY_SCREEN, {
    organization: mockOrganization,
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

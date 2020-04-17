import React from 'react';
import { fireEvent } from 'react-native-testing-library';
import { useMutation } from '@apollo/react-hooks';

import {
  ACTIONS,
  ORG_PERMISSIONS,
  ANALYTICS_PERMISSION_TYPE,
  ANALYTICS_EDIT_MODE,
} from '../../../../constants';
import { navigatePush, navigateBack } from '../../../../actions/navigation';
import { trackActionWithoutData } from '../../../../actions/analytics';
import { renderWithContext } from '../../../../../testUtils';
import { mockFragment } from '../../../../../testUtils/apolloMockClient';
import { useAnalytics } from '../../../../utils/hooks/useAnalytics';
import * as common from '../../../../utils/common';
import { PostTypeEnum } from '../../../../../__generated__/globalTypes';
import { CelebrateItem } from '../../../../components/CelebrateItem/__generated__/CelebrateItem';
import { CELEBRATE_ITEM_FRAGMENT } from '../../../../components/CelebrateItem/queries';
import { CREATE_POST, UPDATE_POST } from '../queries';

import { CreatePostScreen } from '..';

jest.mock('../../../../actions/navigation');
jest.mock('../../../../actions/analytics');
jest.mock('../../../../utils/hooks/useAnalytics');

const myId = '5';
const onComplete = jest.fn();
const navigatePushResult = { type: 'navigated push' };
const navigateBackResult = { type: 'navigated back' };
const orgId = '1234';
const organization = {
  id: orgId,
};
const orgPermission = {
  organization_id: organization.id,
  permission_id: ORG_PERMISSIONS.OWNER,
};
const postType = PostTypeEnum.prayer_request;
const post = {
  ...mockFragment<CelebrateItem>(CELEBRATE_ITEM_FRAGMENT),
  celebrateableType: PostTypeEnum.prayer_request,
};

const MOCK_POST = 'This is my cool story! 📘✏️';

const initialState = {
  auth: { person: { id: myId, organizational_permissions: [orgPermission] } },
};

beforeEach(() => {
  ((common as unknown) as { isAndroid: boolean }).isAndroid = false;
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResult);
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResult);
  (trackActionWithoutData as jest.Mock).mockReturnValue(() =>
    Promise.resolve(),
  );
});

it('renders correctly for new post', () => {
  renderWithContext(<CreatePostScreen />, {
    initialState,
    navParams: { onComplete, orgId, postType },
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['post', 'prayer request'], {
    screenContext: {
      [ANALYTICS_PERMISSION_TYPE]: 'owner',
      [ANALYTICS_EDIT_MODE]: 'set',
    },
  });
});

it('renders correctly for update post', () => {
  renderWithContext(<CreatePostScreen />, {
    initialState,
    navParams: { onComplete, orgId, post },
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['post', 'prayer request'], {
    screenContext: {
      [ANALYTICS_PERMISSION_TYPE]: 'owner',
      [ANALYTICS_EDIT_MODE]: 'update',
    },
  });
});

it('renders correctly on android', () => {
  ((common as unknown) as { isAndroid: boolean }).isAndroid = true;
  renderWithContext(<CreatePostScreen />, {
    initialState,
    navParams: { onComplete, organization, post },
  }).snapshot();
});

describe('Creating a post', () => {
  it('user types a post', () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <CreatePostScreen />,
      {
        initialState,
        navParams: {
          onComplete,
          orgId,
          postType,
        },
      },
    );

    recordSnapshot();
    fireEvent.changeText(getByTestId('PostInput'), MOCK_POST);
    diffSnapshot();
  });

  it('calls saveStory function when the user clicks the share story button', async () => {
    const { getByTestId } = renderWithContext(<CreatePostScreen />, {
      initialState,
      navParams: {
        onComplete,
        orgId,
        postType,
      },
    });

    await fireEvent(getByTestId('PostInput'), 'onChangeText', MOCK_POST);
    await fireEvent.press(getByTestId('CreatePostButton'));

    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.SHARE_STORY);
    expect(onComplete).toHaveBeenCalledWith();
    expect(useMutation).toHaveBeenMutatedWith(CREATE_POST, {
      variables: {
        input: {
          content: MOCK_POST,
          communityId: orgId,
          postType: PostTypeEnum.prayer_request,
        },
      },
    });
  });
});

describe('Updating a post', () => {
  it('user types a post', () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <CreatePostScreen />,
      {
        initialState,
        navParams: {
          onComplete,
          orgId,
          post,
        },
      },
    );

    recordSnapshot();
    fireEvent.changeText(getByTestId('PostInput'), MOCK_POST);
    diffSnapshot();
  });

  it('calls saveStory function when the user clicks the share story button', async () => {
    const { getByTestId } = renderWithContext(<CreatePostScreen />, {
      initialState,
      navParams: {
        onComplete,
        orgId,
        post,
      },
    });

    await fireEvent(getByTestId('PostInput'), 'onChangeText', MOCK_POST);
    await fireEvent.press(getByTestId('CreatePostButton'));

    expect(trackActionWithoutData).not.toHaveBeenCalled();
    expect(onComplete).toHaveBeenCalledWith();
    expect(useMutation).toHaveBeenMutatedWith(UPDATE_POST, {
      variables: {
        input: {
          content: MOCK_POST,
          id: post.celebrateableId,
        },
      },
    });
  });
});

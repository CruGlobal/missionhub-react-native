import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
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
import { CommunityFeedPost } from '../../../../components/CommunityFeedItem/__generated__/CommunityFeedPost';
import { COMMUNITY_FEED_POST_FRAGMENT } from '../../../../components/CommunityFeedItem/queries';
import { CREATE_POST, UPDATE_POST } from '../queries';

import { CreatePostScreen } from '..';

jest.mock('../../../../actions/navigation');
jest.mock('../../../../actions/analytics');
jest.mock('../../../../utils/hooks/useAnalytics');
jest.mock('react-native-video', () => 'Video');

const myId = '5';
const onComplete = jest.fn();
const navigatePushResult = { type: 'navigated push' };
const navigateBackResult = { type: 'navigated back' };
const communityId = '1234';
const orgPermission = {
  organization_id: communityId,
  permission_id: ORG_PERMISSIONS.OWNER,
};
const postType = PostTypeEnum.prayer_request;
const post = mockFragment<CommunityFeedPost>(COMMUNITY_FEED_POST_FRAGMENT);

const MOCK_POST = 'This is my cool story! 📘✏️';
const MOCK_IMAGE = 'data:image/jpeg;base64,base64image.jpeg';
const MOCK_VIDEO = 'file:/video.mov';

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
    navParams: { onComplete, communityId, postType },
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['post', 'prayer request'], {
    screenContext: {
      [ANALYTICS_PERMISSION_TYPE]: 'owner',
      [ANALYTICS_EDIT_MODE]: 'set',
    },
  });
});

it('renders correctly for update post without image', () => {
  renderWithContext(<CreatePostScreen />, {
    initialState,
    navParams: {
      onComplete,
      communityId,
      post: {
        ...post,
        postType: PostTypeEnum.prayer_request,
        mediaContentType: undefined,
        mediaExpiringUrl: undefined,
      },
    },
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['post', 'prayer request'], {
    screenContext: {
      [ANALYTICS_PERMISSION_TYPE]: 'owner',
      [ANALYTICS_EDIT_MODE]: 'update',
    },
  });
});

it('renders correctly for update post with image', () => {
  renderWithContext(<CreatePostScreen />, {
    initialState,
    navParams: {
      onComplete,
      communityId,
      post: {
        ...post,
        postType: PostTypeEnum.prayer_request,
        mediaContentType: 'image/jpeg',
        mediaExpiringUrl: MOCK_IMAGE,
      },
    },
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['post', 'prayer request'], {
    screenContext: {
      [ANALYTICS_PERMISSION_TYPE]: 'owner',
      [ANALYTICS_EDIT_MODE]: 'update',
    },
  });
});

describe('renders for post types', () => {
  it('renders for story', () => {
    renderWithContext(<CreatePostScreen />, {
      initialState,
      navParams: { onComplete, communityId, postType: PostTypeEnum.story },
    }).snapshot();
  });

  it('renders for prayer request', () => {
    renderWithContext(<CreatePostScreen />, {
      initialState,
      navParams: {
        onComplete,
        communityId,
        postType: PostTypeEnum.prayer_request,
      },
    }).snapshot();
  });

  it('renders for spiritual question', () => {
    renderWithContext(<CreatePostScreen />, {
      initialState,
      navParams: { onComplete, communityId, postType: PostTypeEnum.question },
    }).snapshot();
  });

  it('renders for help request', () => {
    renderWithContext(<CreatePostScreen />, {
      initialState,
      navParams: {
        onComplete,
        communityId,
        postType: PostTypeEnum.help_request,
      },
    }).snapshot();
  });

  it('renders for thought', () => {
    renderWithContext(<CreatePostScreen />, {
      initialState,
      navParams: { onComplete, communityId, postType: PostTypeEnum.thought },
    }).snapshot();
  });

  it('renders for announcement', () => {
    renderWithContext(<CreatePostScreen />, {
      initialState,
      navParams: {
        onComplete,
        communityId,
        postType: PostTypeEnum.announcement,
      },
    }).snapshot();
  });
});

describe('Select image', () => {
  it('should select an image', async () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <CreatePostScreen />,
      {
        initialState,
        navParams: {
          onComplete,
          communityId,
          postType: PostTypeEnum.story,
        },
      },
    );
    recordSnapshot();

    await fireEvent(getByTestId('ImagePicker'), 'onSelectImage', {
      data: MOCK_IMAGE,
    });

    await flushMicrotasksQueue();

    diffSnapshot();
  });
});

describe('Select video', () => {
  it('should select a video', async () => {
    (navigatePush as jest.Mock).mockImplementation(
      (_, { onEndRecord }: { onEndRecord: (uri: string) => void }) => {
        onEndRecord(MOCK_VIDEO);
        return navigatePushResult;
      },
    );

    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <CreatePostScreen />,
      {
        initialState,
        navParams: {
          onComplete,
          communityId,
          postType: PostTypeEnum.story,
        },
      },
    );
    recordSnapshot();

    await fireEvent.press(getByTestId('VideoButton'));

    await flushMicrotasksQueue();

    diffSnapshot();
  });
});

describe('Creating a post', () => {
  it('user types a post', () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <CreatePostScreen />,
      {
        initialState,
        navParams: {
          onComplete,
          communityId,
          postType,
        },
      },
    );

    recordSnapshot();
    fireEvent.changeText(getByTestId('PostInput'), MOCK_POST);
    diffSnapshot();
  });

  it('calls savePost function when the user clicks the share post button', async () => {
    const { getByTestId } = renderWithContext(<CreatePostScreen />, {
      initialState,
      navParams: {
        onComplete,
        communityId,
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
          communityId,
          postType: PostTypeEnum.prayer_request,
          media: null,
        },
      },
    });
  });

  it('calls savePost function with image', async () => {
    const { getByTestId } = renderWithContext(<CreatePostScreen />, {
      initialState,
      navParams: {
        onComplete,
        communityId,
        postType,
      },
    });

    await fireEvent(getByTestId('PostInput'), 'onChangeText', MOCK_POST);
    await fireEvent(getByTestId('ImagePicker'), 'onSelectImage', {
      data: MOCK_IMAGE,
    });
    await fireEvent.press(getByTestId('CreatePostButton'));

    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.SHARE_STORY);
    expect(onComplete).toHaveBeenCalledWith();
    expect(useMutation).toHaveBeenMutatedWith(CREATE_POST, {
      variables: {
        input: {
          content: MOCK_POST,
          communityId,
          postType: PostTypeEnum.prayer_request,
          media: MOCK_IMAGE,
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
          communityId,
          post,
        },
      },
    );

    recordSnapshot();
    fireEvent.changeText(getByTestId('PostInput'), MOCK_POST);
    diffSnapshot();
  });

  it('calls savePost function when the user clicks the share post button', async () => {
    const { getByTestId } = renderWithContext(<CreatePostScreen />, {
      initialState,
      navParams: {
        onComplete,
        communityId,
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
          id: post.id,
          media: undefined,
        },
      },
    });
  });

  it('calls savePost function with image', async () => {
    const { getByTestId } = renderWithContext(<CreatePostScreen />, {
      initialState,
      navParams: {
        onComplete,
        communityId,
        post,
      },
    });

    await fireEvent(getByTestId('PostInput'), 'onChangeText', MOCK_POST);
    await fireEvent(getByTestId('ImagePicker'), 'onSelectImage', {
      data: MOCK_IMAGE,
    });
    await fireEvent.press(getByTestId('CreatePostButton'));

    expect(trackActionWithoutData).not.toHaveBeenCalled();
    expect(onComplete).toHaveBeenCalledWith();
    expect(useMutation).toHaveBeenMutatedWith(UPDATE_POST, {
      variables: {
        input: {
          content: MOCK_POST,
          id: post.id,
          media: MOCK_IMAGE,
        },
      },
    });
  });
});

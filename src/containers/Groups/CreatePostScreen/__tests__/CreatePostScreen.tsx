/* eslint max-lines: 0 */

import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { useMutation } from '@apollo/react-hooks';

import {
  ACTIONS,
  ORG_PERMISSIONS,
  SAVE_PENDING_POST,
  DELETE_PENDING_POST,
  PENDING_POST_RETRY,
} from '../../../../constants';
import { navigatePush, navigateBack } from '../../../../actions/navigation';
import {
  trackActionWithoutData,
  trackAction,
} from '../../../../actions/analytics';
import {
  renderWithContext,
  renderHookWithContext,
} from '../../../../../testUtils';
import { mockFragment } from '../../../../../testUtils/apolloMockClient';
import { useAnalytics } from '../../../../utils/hooks/useAnalytics';
import * as common from '../../../../utils/common';
import { PostTypeEnum } from '../../../../../__generated__/globalTypes';
import { CREATE_POST, UPDATE_POST } from '../queries';
import { COMMUNITY_FEED_ITEM_FRAGMENT } from '../../../../components/CommunityFeedItem/queries';
import {
  CommunityFeedItem,
  CommunityFeedItem_subject_Post,
} from '../../../../components/CommunityFeedItem/__generated__/CommunityFeedItem';
import { useFeatureFlags } from '../../../../utils/hooks/useFeatureFlags';
import { CreatePostScreen, useCreatePost, useUpdatePost } from '..';

jest.mock('../../../../components/VideoPlayer', () => 'VideoPlayer');
jest.mock('../../../../actions/navigation');
jest.mock('../../../../actions/analytics');
jest.mock('../../../../utils/hooks/useAnalytics');
jest.mock('../../../../utils/hooks/useFeatureFlags');

const myId = '5';
const communityId = '1234';
const orgPermission = {
  organization_id: communityId,
  permission_id: ORG_PERMISSIONS.OWNER,
};
const postType = PostTypeEnum.prayer_request;
const post = mockFragment<CommunityFeedItem>(COMMUNITY_FEED_ITEM_FRAGMENT, {
  mocks: { FeedItem: () => ({ __typename: 'Post' }) },
}).subject as CommunityFeedItem_subject_Post;
const onComplete = jest.fn();

const MOCK_POST = 'This is my cool story! 📘✏️';
const MOCK_IMAGE = 'data:image/jpeg;base64,base64image.jpeg';
const MOCK_VIDEO = 'file:/video.mov';
const VIDEO_TYPE = 'video/mp4';

const initialState = {
  auth: { person: { id: myId, organizational_permissions: [orgPermission] } },
  communityPosts: { nextId: 0, pendingPosts: {} },
};

const navigatePushResult = { type: 'navigated push' };
const navigateBackResult = { type: 'navigated back' };
const trackActionResult = { type: 'tracked action' };
const trackActionWithoutDataResult = { type: 'tracked action without data' };

beforeEach(() => {
  ((common as unknown) as { isAndroid: boolean }).isAndroid = false;
  (navigatePush as jest.Mock).mockImplementation(
    (
      _,
      {
        onEndRecord,
      }: {
        onEndRecord: ({ codec, uri }: { codec: string; uri: string }) => void;
      },
    ) => {
      onEndRecord({ codec: 'mp4', uri: MOCK_VIDEO });
      return navigatePushResult;
    },
  );
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResult);
  (trackActionWithoutData as jest.Mock).mockReturnValue(
    trackActionWithoutDataResult,
  );
  (trackAction as jest.Mock).mockReturnValue(trackActionResult);
  (useFeatureFlags as jest.Mock).mockReturnValue({ video: true });
});

it('renders correctly for new post', () => {
  renderWithContext(<CreatePostScreen />, {
    initialState,
    navParams: { communityId, postType },
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['post', 'prayer request'], {
    permissionType: { communityId },
    editMode: { isEdit: false },
  });
});

it('renders correctly for new post and feature flag false', () => {
  (useFeatureFlags as jest.Mock).mockReturnValue({ video: false });

  renderWithContext(<CreatePostScreen />, {
    initialState,
    navParams: { communityId, postType, onComplete },
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['post', 'prayer request'], {
    permissionType: { communityId },
    editMode: { isEdit: false },
  });
});

it('renders correctly for update post without media', () => {
  renderWithContext(<CreatePostScreen />, {
    initialState,
    navParams: {
      communityId,
      post: {
        ...post,
        postType: PostTypeEnum.prayer_request,
        mediaContentType: undefined,
        mediaExpiringUrl: undefined,
      },
      onComplete,
    },
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['post', 'prayer request'], {
    permissionType: { communityId },
    editMode: { isEdit: true },
  });
});

it('renders correctly for update post without media and feature flag false', () => {
  (useFeatureFlags as jest.Mock).mockReturnValue({ video: false });

  renderWithContext(<CreatePostScreen />, {
    initialState,
    navParams: {
      communityId,
      post: {
        ...post,
        postType: PostTypeEnum.prayer_request,
        mediaContentType: undefined,
        mediaExpiringUrl: undefined,
      },
      onComplete,
    },
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['post', 'prayer request'], {
    permissionType: { communityId },
    editMode: { isEdit: true },
  });
});

it('renders correctly for update post with image', () => {
  renderWithContext(<CreatePostScreen />, {
    initialState,
    navParams: {
      communityId,
      post: {
        ...post,
        postType: PostTypeEnum.prayer_request,
        mediaContentType: 'image/jpeg',
        mediaExpiringUrl: MOCK_IMAGE,
      },
      onComplete,
    },
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['post', 'prayer request'], {
    permissionType: { communityId },
    editMode: { isEdit: true },
  });
});

it('renders correctly for update post with video', () => {
  renderWithContext(<CreatePostScreen />, {
    initialState,
    navParams: {
      communityId,
      post: {
        ...post,
        postType: PostTypeEnum.prayer_request,
        mediaContentType: 'video',
        mediaExpiringUrl: MOCK_VIDEO,
      },
      onComplete,
    },
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['post', 'prayer request'], {
    permissionType: { communityId },
    editMode: { isEdit: true },
  });
});

it('renders correctly for update post without video if feature flag is false', () => {
  (useFeatureFlags as jest.Mock).mockReturnValue({ video: false });

  renderWithContext(<CreatePostScreen />, {
    initialState,
    navParams: {
      communityId,
      post: {
        ...post,
        postType: PostTypeEnum.prayer_request,
        mediaContentType: 'video',
        mediaExpiringUrl: MOCK_VIDEO,
      },
      onComplete,
    },
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['post', 'prayer request'], {
    permissionType: { communityId },
    editMode: { isEdit: true },
  });
});

describe('renders for post types', () => {
  it('renders for story', () => {
    renderWithContext(<CreatePostScreen />, {
      initialState,
      navParams: { communityId, postType: PostTypeEnum.story, onComplete },
    }).snapshot();
  });

  it('renders for prayer request', () => {
    renderWithContext(<CreatePostScreen />, {
      initialState,
      navParams: {
        communityId,
        postType: PostTypeEnum.prayer_request,
        onComplete,
      },
    }).snapshot();
  });

  it('renders for spiritual question', () => {
    renderWithContext(<CreatePostScreen />, {
      initialState,
      navParams: { communityId, postType: PostTypeEnum.question, onComplete },
    }).snapshot();
  });

  it('renders for help request', () => {
    renderWithContext(<CreatePostScreen />, {
      initialState,
      navParams: {
        communityId,
        postType: PostTypeEnum.help_request,
        onComplete,
      },
    }).snapshot();
  });

  it('renders for thought', () => {
    renderWithContext(<CreatePostScreen />, {
      initialState,
      navParams: { communityId, postType: PostTypeEnum.thought, onComplete },
    }).snapshot();
  });

  it('renders for announcement', () => {
    renderWithContext(<CreatePostScreen />, {
      initialState,
      navParams: {
        communityId,
        postType: PostTypeEnum.announcement,
        onComplete,
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
          communityId,
          postType: PostTypeEnum.story,
          onComplete,
        },
      },
    );
    recordSnapshot();

    await fireEvent(getByTestId('ImagePicker'), 'onSelectImage', {
      fileType: 'jpg',
      data: MOCK_IMAGE,
    });

    await flushMicrotasksQueue();

    diffSnapshot();
  });
});

describe('Select video', () => {
  const onComplete = jest.fn();

  it('should select a video', async () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <CreatePostScreen />,
      {
        initialState,
        navParams: {
          communityId,
          postType: PostTypeEnum.story,
          onComplete,
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
          communityId,
          postType,
          onComplete,
        },
      },
    );

    recordSnapshot();
    fireEvent.changeText(getByTestId('PostInput'), MOCK_POST);
    diffSnapshot();
  });

  it('calls savePost function when the user clicks the share post button', async () => {
    const { getByTestId, store } = renderWithContext(<CreatePostScreen />, {
      initialState,
      navParams: {
        communityId,
        postType,
        onComplete,
      },
    });

    await fireEvent(getByTestId('PostInput'), 'onChangeText', MOCK_POST);
    fireEvent.press(getByTestId('CreatePostButton'));
    await flushMicrotasksQueue();

    expect(navigateBack).toHaveBeenCalledWith();
    expect(useMutation).toHaveBeenMutatedWith(CREATE_POST, {
      variables: {
        input: {
          content: MOCK_POST,
          communityId,
          postType: PostTypeEnum.prayer_request,
          media: undefined,
        },
      },
    });
    expect(trackAction).toHaveBeenCalledWith(ACTIONS.CREATE_POST.name, {
      [ACTIONS.CREATE_POST.key]: postType,
    });
    expect(trackActionWithoutData).not.toHaveBeenCalledWith(
      ACTIONS.PHOTO_ADDED,
    );
    expect(trackActionWithoutData).not.toHaveBeenCalledWith(
      ACTIONS.VIDEO_ADDED,
    );
    expect(onComplete).toHaveBeenCalledWith();

    expect(store.getActions()).toEqual([navigateBackResult, trackActionResult]);
  });

  it('calls savePost function with image', async () => {
    const { getByTestId, store } = renderWithContext(<CreatePostScreen />, {
      initialState,
      navParams: {
        communityId,
        postType,
        onComplete,
      },
    });

    await fireEvent(getByTestId('PostInput'), 'onChangeText', MOCK_POST);
    await fireEvent(getByTestId('ImagePicker'), 'onSelectImage', {
      data: MOCK_IMAGE,
    });
    fireEvent.press(getByTestId('CreatePostButton'));
    await flushMicrotasksQueue();

    expect(navigateBack).toHaveBeenCalledWith();
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
    expect(trackAction).toHaveBeenCalledWith(ACTIONS.CREATE_POST.name, {
      [ACTIONS.CREATE_POST.key]: postType,
    });
    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.PHOTO_ADDED);
    expect(trackActionWithoutData).not.toHaveBeenCalledWith(
      ACTIONS.VIDEO_ADDED,
    );
    expect(onComplete).toHaveBeenCalledWith();

    expect(store.getActions()).toEqual([
      navigateBackResult,
      trackActionResult,
      trackActionWithoutDataResult,
    ]);
  });

  it('calls savePost function with video', async () => {
    const expectedInput = {
      content: MOCK_POST,
      communityId,
      postType: PostTypeEnum.prayer_request,
      media: {
        name: 'upload',
        type: VIDEO_TYPE,
        uri: MOCK_VIDEO,
      },
    };

    const { getByTestId, store } = renderWithContext(<CreatePostScreen />, {
      initialState,
      navParams: {
        communityId,
        postType,
        onComplete,
      },
    });

    await fireEvent(getByTestId('PostInput'), 'onChangeText', MOCK_POST);
    fireEvent.press(getByTestId('VideoButton'));
    await flushMicrotasksQueue();

    fireEvent.press(getByTestId('CreatePostButton'));
    await flushMicrotasksQueue();

    expect(navigateBack).toHaveBeenCalledWith();
    expect(useMutation).toHaveBeenMutatedWith(CREATE_POST, {
      variables: {
        input: expectedInput,
      },
    });
    expect(trackAction).toHaveBeenCalledWith(ACTIONS.CREATE_POST.name, {
      [ACTIONS.CREATE_POST.key]: postType,
    });
    expect(trackActionWithoutData).not.toHaveBeenCalledWith(
      ACTIONS.PHOTO_ADDED,
    );
    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.VIDEO_ADDED);
    expect(onComplete).toHaveBeenCalledWith();

    expect(store.getActions()).toEqual([
      navigatePushResult,
      navigateBackResult,
      { type: SAVE_PENDING_POST, post: expectedInput, storageId: '0' },
      trackActionResult,
      { type: DELETE_PENDING_POST, storageId: '0' },
      trackActionWithoutDataResult,
    ]);
  });
});

describe('Updating a post', () => {
  it('user types a post', () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <CreatePostScreen />,
      {
        initialState,
        navParams: {
          communityId,
          post,
          onComplete,
        },
      },
    );

    recordSnapshot();
    fireEvent.changeText(getByTestId('PostInput'), MOCK_POST);
    diffSnapshot();
  });

  it('calls savePost function when the user clicks the share post button', async () => {
    const { getByTestId, store } = renderWithContext(<CreatePostScreen />, {
      initialState,
      navParams: {
        communityId,
        post,
        onComplete,
      },
    });

    await fireEvent(getByTestId('PostInput'), 'onChangeText', MOCK_POST);
    fireEvent.press(getByTestId('CreatePostButton'));
    await flushMicrotasksQueue();

    expect(navigateBack).toHaveBeenCalledWith();
    expect(useMutation).toHaveBeenMutatedWith(UPDATE_POST, {
      variables: {
        input: {
          content: MOCK_POST,
          id: post.id,
          media: undefined,
        },
      },
    });
    expect(trackAction).not.toHaveBeenCalled();
    expect(trackActionWithoutData).not.toHaveBeenCalledWith(
      ACTIONS.PHOTO_ADDED,
    );
    expect(trackActionWithoutData).not.toHaveBeenCalledWith(
      ACTIONS.VIDEO_ADDED,
    );
    expect(onComplete).toHaveBeenCalledWith();

    expect(store.getActions()).toEqual([navigateBackResult]);
  });

  it('calls savePost function with image', async () => {
    const { getByTestId, store } = renderWithContext(<CreatePostScreen />, {
      initialState,
      navParams: {
        communityId,
        post,
        onComplete,
      },
    });

    await fireEvent(getByTestId('PostInput'), 'onChangeText', MOCK_POST);
    await fireEvent(getByTestId('ImagePicker'), 'onSelectImage', {
      data: MOCK_IMAGE,
    });
    fireEvent.press(getByTestId('CreatePostButton'));
    await flushMicrotasksQueue();

    expect(navigateBack).toHaveBeenCalledWith();
    expect(useMutation).toHaveBeenMutatedWith(UPDATE_POST, {
      variables: {
        input: {
          content: MOCK_POST,
          id: post.id,
          media: MOCK_IMAGE,
        },
      },
    });
    expect(trackAction).not.toHaveBeenCalled();
    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.PHOTO_ADDED);
    expect(trackActionWithoutData).not.toHaveBeenCalledWith(
      ACTIONS.VIDEO_ADDED,
    );
    expect(onComplete).toHaveBeenCalledWith();

    expect(store.getActions()).toEqual([
      navigateBackResult,
      trackActionWithoutDataResult,
    ]);
  });

  it('calls savePost function with video', async () => {
    const expectedInput = {
      id: post.id,
      content: MOCK_POST,
      communityId,
      media: {
        name: 'upload',
        type: VIDEO_TYPE,
        uri: MOCK_VIDEO,
      },
    };

    const { getByTestId, store } = renderWithContext(<CreatePostScreen />, {
      initialState,
      navParams: {
        communityId,
        post,
        onComplete,
      },
    });

    await fireEvent(getByTestId('PostInput'), 'onChangeText', MOCK_POST);
    fireEvent.press(getByTestId('VideoButton'));
    await flushMicrotasksQueue();

    fireEvent.press(getByTestId('CreatePostButton'));
    await flushMicrotasksQueue();

    expect(navigateBack).toHaveBeenCalledWith();
    expect(useMutation).toHaveBeenMutatedWith(UPDATE_POST, {
      variables: {
        input: {
          content: MOCK_POST,
          id: post.id,
          media: {
            name: 'upload',
            type: VIDEO_TYPE,
            uri: MOCK_VIDEO,
          },
        },
      },
    });
    expect(trackAction).not.toHaveBeenCalled();
    expect(trackActionWithoutData).not.toHaveBeenCalledWith(
      ACTIONS.PHOTO_ADDED,
    );
    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.VIDEO_ADDED);
    expect(onComplete).toHaveBeenCalledWith();

    expect(store.getActions()).toEqual([
      navigatePushResult,
      navigateBackResult,
      { type: SAVE_PENDING_POST, post: expectedInput, storageId: '0' },
      { type: DELETE_PENDING_POST, storageId: '0' },
      trackActionWithoutDataResult,
    ]);
  });
});

describe('useCreatePost, other functions', () => {
  const existingStorageId = '0';

  it('retries create post', async () => {
    const input = {
      content: MOCK_POST,
      communityId,
      postType,
      media: {
        name: 'upload',
        type: VIDEO_TYPE,
        uri: MOCK_VIDEO,
      },
    };

    const { result, store } = renderHookWithContext(
      () =>
        useCreatePost({
          media: MOCK_VIDEO,
          postType,
          communityId,
          mediaType: VIDEO_TYPE,
          onComplete,
          existingStorageId,
        }),
      { initialState },
    );

    result.current(input);
    await flushMicrotasksQueue();

    expect(useMutation).toHaveBeenMutatedWith(CREATE_POST, {
      variables: { input },
    });
    expect(trackAction).toHaveBeenCalledWith(ACTIONS.CREATE_POST.name, {
      [ACTIONS.CREATE_POST.key]: postType,
    });
    expect(trackActionWithoutData).not.toHaveBeenCalledWith(
      ACTIONS.PHOTO_ADDED,
    );
    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.VIDEO_ADDED);
    expect(onComplete).toHaveBeenCalledWith();

    expect(store.getActions()).toEqual([
      { type: PENDING_POST_RETRY, storageId: existingStorageId },
      trackActionResult,
      { type: DELETE_PENDING_POST, storageId: '0' },
      trackActionWithoutDataResult,
    ]);
  });
});

describe('useUpdatePost, other functions', () => {
  const existingStorageId = '0';

  it('retries update post', async () => {
    const input = {
      content: MOCK_POST,
      id: post.id,
      media: {
        name: 'upload',
        type: VIDEO_TYPE,
        uri: MOCK_VIDEO,
      },
    };

    const { result, store } = renderHookWithContext(
      () =>
        useUpdatePost({
          media: MOCK_VIDEO,
          mediaType: VIDEO_TYPE,
          onComplete,
          existingStorageId,
        }),
      { initialState },
    );

    result.current(input, communityId);
    await flushMicrotasksQueue();

    expect(useMutation).toHaveBeenMutatedWith(UPDATE_POST, {
      variables: { input },
    });
    expect(trackAction).not.toHaveBeenCalled();
    expect(trackActionWithoutData).not.toHaveBeenCalledWith(
      ACTIONS.PHOTO_ADDED,
    );
    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.VIDEO_ADDED);
    expect(onComplete).toHaveBeenCalledWith();

    expect(store.getActions()).toEqual([
      { type: PENDING_POST_RETRY, storageId: existingStorageId },
      { type: DELETE_PENDING_POST, storageId: '0' },
      trackActionWithoutDataResult,
    ]);
  });
});

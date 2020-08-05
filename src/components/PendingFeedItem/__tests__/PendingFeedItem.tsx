import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import {
  PostTypeEnum,
  CreatePostInput,
  UpdatePostInput,
} from '../../../../__generated__/globalTypes';
import {
  StoredCreatePost,
  StoredUpdatePost,
} from '../../../reducers/communityPosts';
import {
  deletePendingPost,
  useCreatePost,
  useUpdatePost,
} from '../../../containers/Groups/CreatePostScreen';
import { renderWithContext } from '../../../../testUtils';
import { PendingFeedItem } from '../';

jest.mock('react-native-video', () => 'Video');
jest.mock('../../../containers/Groups/CreatePostScreen');

const pendingItemId = '1';
const media = 'asdf.mov';
const content = 'text';
const communityId = '1234';
const postType = PostTypeEnum.story;
const postId = '2';

const onComplete = jest.fn();
const createPost = jest.fn();
const updatePost = jest.fn();

const storedCreatePost: StoredCreatePost = {
  storageId: pendingItemId,
  media,
  content,
  communityId,
  postType,
  failed: false,
};
const storedUpdatePost: StoredUpdatePost = {
  id: postId,
  storageId: pendingItemId,
  media,
  content,
  communityId,
  failed: false,
};
const createPostInput: CreatePostInput = {
  communityId,
  content,
  postType,
  media,
};
const updatePostInput: UpdatePostInput = {
  id: postId,
  content,
  media,
};

const deletePendingPostResponse = { type: 'delete post' };

beforeEach(() => {
  (useCreatePost as jest.Mock).mockReturnValue(createPost);
  (useUpdatePost as jest.Mock).mockReturnValue(updatePost);
  (deletePendingPost as jest.Mock).mockReturnValue(deletePendingPostResponse);
});

describe('PendingFeedItem', () => {
  it('renders pending post', () => {
    renderWithContext(
      <PendingFeedItem pendingItemId={pendingItemId} onComplete={onComplete} />,
      {
        initialState: {
          communityPosts: {
            pendingPosts: {
              [pendingItemId]: storedCreatePost,
            },
          },
        },
      },
    ).snapshot();
  });

  it('renders failed post', () => {
    renderWithContext(
      <PendingFeedItem pendingItemId={pendingItemId} onComplete={onComplete} />,
      {
        initialState: {
          communityPosts: {
            pendingPosts: {
              [pendingItemId]: {
                ...storedCreatePost,
                failed: true,
              },
            },
          },
        },
      },
    ).snapshot();
  });

  it('cancels post upload', () => {
    const { getByTestId } = renderWithContext(
      <PendingFeedItem pendingItemId={pendingItemId} onComplete={onComplete} />,
      {
        initialState: {
          communityPosts: {
            pendingPosts: {
              [pendingItemId]: {
                ...storedCreatePost,
                failed: true,
              },
            },
          },
        },
      },
    );

    fireEvent.press(getByTestId('CancelButton'));

    expect(deletePendingPost).toHaveBeenCalledWith(pendingItemId);
  });

  it('retries post create', () => {
    const { getByTestId } = renderWithContext(
      <PendingFeedItem pendingItemId={pendingItemId} onComplete={onComplete} />,
      {
        initialState: {
          communityPosts: {
            pendingPosts: {
              [pendingItemId]: {
                ...storedCreatePost,
                failed: true,
              },
            },
          },
        },
      },
    );

    fireEvent.press(getByTestId('RetryButton'));

    expect(createPost).toHaveBeenCalledWith(createPostInput);
  });

  it('retries post update', () => {
    const { getByTestId } = renderWithContext(
      <PendingFeedItem pendingItemId={pendingItemId} onComplete={onComplete} />,
      {
        initialState: {
          communityPosts: {
            pendingPosts: {
              [pendingItemId]: {
                ...storedUpdatePost,
                failed: true,
              },
            },
          },
        },
      },
    );

    fireEvent.press(getByTestId('RetryButton'));

    expect(updatePost).toHaveBeenCalledWith(updatePostInput, communityId);
  });
});

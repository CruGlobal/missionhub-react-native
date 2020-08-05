import communityPosts, {
  PendingCreatePost,
  PendingUpdatePost,
  StoredCreatePost,
  StoredUpdatePost,
} from '../communityPosts';
import { PostTypeEnum } from '../../../__generated__/globalTypes';
import {
  LOGOUT,
  SAVE_PENDING_POST,
  DELETE_PENDING_POST,
  PENDING_POST_FAILED,
} from '../../constants';

const pendingCreatePost: StoredCreatePost = {
  content: 'create post',
  media: 'video.mov',
  communityId: '123',
  postType: PostTypeEnum.story,
  storageId: '0',
  failed: false,
};
const pendingUpdatePost: StoredUpdatePost = {
  id: '4',
  content: 'update post',
  media: 'image.jpg',
  communityId: '321',
  storageId: '1',
  failed: false,
};

const initialState = {
  nextId: 2,
  pendingPosts: {
    [pendingCreatePost.storageId]: pendingCreatePost,
    [pendingUpdatePost.storageId]: pendingUpdatePost,
  },
};

describe('SAVE_PENDING_POST', () => {
  it('saves pending create post', () => {
    const newPost: PendingCreatePost = {
      content: 'new',
      media: 'newVideo.mov',
      communityId: '234',
      postType: PostTypeEnum.question,
    };

    expect(
      communityPosts(initialState, {
        type: SAVE_PENDING_POST,
        post: newPost,
        storageId: '2',
      }),
    ).toMatchSnapshot();
  });

  it('saves pending update post', () => {
    const newPost: PendingUpdatePost = {
      id: '5',
      content: 'new',
      media: 'newVideo.mov',
      communityId: '234',
    };

    expect(
      communityPosts(initialState, {
        type: SAVE_PENDING_POST,
        post: newPost,
        storageId: '2',
      }),
    ).toMatchSnapshot();
  });
});

describe('DELETE_PENDING_POST', () => {
  it('deletes pending create post', () => {
    expect(
      communityPosts(initialState, {
        type: DELETE_PENDING_POST,
        storageId: '0',
      }),
    ).toMatchSnapshot();
  });

  it('deletes pending update post', () => {
    expect(
      communityPosts(initialState, {
        type: DELETE_PENDING_POST,
        storageId: '1',
      }),
    ).toMatchSnapshot();
  });
});

describe('PENDING_POST_FAILED', () => {
  it('marks pending create post as failed', () => {
    expect(
      communityPosts(initialState, {
        type: PENDING_POST_FAILED,
        storageId: '0',
      }),
    ).toMatchSnapshot();
  });

  it('marks pending update post as failed', () => {
    expect(
      communityPosts(initialState, {
        type: PENDING_POST_FAILED,
        storageId: '1',
      }),
    ).toMatchSnapshot();
  });
});

describe('LOGOUT', () => {
  it('logs out', () => {
    expect(
      communityPosts(initialState, {
        type: LOGOUT,
      }),
    ).toMatchSnapshot();
  });
});

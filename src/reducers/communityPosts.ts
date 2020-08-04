import { PostTypeEnum } from '../../__generated__/globalTypes';
import {
  LOGOUT,
  SAVE_PENDING_POST,
  DELETE_PENDING_POST,
  PENDING_POST_FAILED,
  LogoutAction,
} from '../constants';

export interface PendingCreatePost {
  content: string;
  media: Upload;
  communityId: string;
  postType: PostTypeEnum;
}

export interface PendingUpdatePost {
  id: string;
  content: string;
  media: Upload;
  communityId: string;
}

export interface StoredCreatePost extends PendingCreatePost {
  storageId: string;
  failed: boolean;
}

export interface StoredUpdatePost extends PendingUpdatePost {
  storageId: string;
  failed: boolean;
}

export interface CommunityPostsState {
  nextId: number;
  pendingPosts: { [key: string]: StoredCreatePost | StoredUpdatePost };
}

export const initialState: CommunityPostsState = {
  nextId: 0,
  pendingPosts: {},
};

export interface SavePendingPostAction {
  type: typeof SAVE_PENDING_POST;
  post: PendingCreatePost | PendingUpdatePost;
  storageId: string;
}

export interface DeletePendingPostAction {
  type: typeof DELETE_PENDING_POST;
  storageId: string;
}

export interface PendingPostFailedAction {
  type: typeof PENDING_POST_FAILED;
  storageId: string;
}

const communityPostsReducer = (
  state: CommunityPostsState = initialState,
  action:
    | SavePendingPostAction
    | DeletePendingPostAction
    | PendingPostFailedAction
    | LogoutAction,
) => {
  switch (action.type) {
    case SAVE_PENDING_POST:
      return {
        ...state,
        nextId: state.nextId + 1,
        pendingPosts: {
          ...state.pendingPosts,
          [action.storageId]: {
            ...action.post,
            storageId: action.storageId,
            failed: false,
          },
        },
      };
    case DELETE_PENDING_POST:
      return {
        ...state,
        pendingPosts: Object.values(state.pendingPosts).reduce(
          (acc, post) =>
            post.storageId === action.storageId
              ? acc
              : {
                  ...acc,
                  [post.storageId]: post,
                },
          {},
        ),
      };
    case PENDING_POST_FAILED:
      return {
        ...state,
        pendingPosts: {
          ...state.pendingPosts,
          [action.storageId]: {
            ...state.pendingPosts[action.storageId],
            failed: true,
          },
        },
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default communityPostsReducer;

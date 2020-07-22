import {
  CreatePostInput,
  PostTypeEnum,
  UpdatePostInput,
} from '../../__generated__/globalTypes';
import {
  LOGOUT,
  SAVE_PENDING_CREATE_POST,
  SAVE_PENDING_UPDATE_POST,
  DELETE_PENDING_CREATE_POST,
  DELETE_PENDING_UPDATE_POST,
  LogoutAction,
  PENDING_CREATE_POST_FAILED,
  PENDING_UPDATE_POST_FAILED,
} from '../constants';

export interface PendingCreatePost {
  content: string;
  postType: PostTypeEnum;
  communityId: string;
  media: Upload;
  failed: boolean;
}

export interface PendingUpdatePost {
  id: string;
  content: string;
  media: Upload;
  failed: boolean;
}

export interface CommunityPostsState {
  pendingCreatePosts: { [key: string]: PendingCreatePost };
  pendingUpdatePosts: { [key: string]: PendingUpdatePost };
}

export const initialState: CommunityPostsState = {
  pendingCreatePosts: {},
  pendingUpdatePosts: {},
};

export interface SavePendingCreatePostAction {
  type: typeof SAVE_PENDING_CREATE_POST;
  post: CreatePostInput;
}

export interface SavePendingUpdatePostAction {
  type: typeof SAVE_PENDING_UPDATE_POST;
  post: UpdatePostInput;
}

export interface DeletePendingCreatePostAction {
  type: typeof DELETE_PENDING_CREATE_POST;
  id: string;
}

export interface DeletePendingUpdatePostAction {
  type: typeof DELETE_PENDING_UPDATE_POST;
  id: string;
}

export interface PendingCreatePostFailedAction {
  type: typeof PENDING_CREATE_POST_FAILED;
  id: string;
}

export interface PendingUpdatePostFailedAction {
  type: typeof PENDING_UPDATE_POST_FAILED;
  id: string;
}

const communityPostsReducer = (
  state: CommunityPostsState = initialState,
  action:
    | SavePendingCreatePostAction
    | SavePendingUpdatePostAction
    | DeletePendingCreatePostAction
    | DeletePendingUpdatePostAction
    | PendingCreatePostFailedAction
    | PendingUpdatePostFailedAction
    | LogoutAction,
) => {
  switch (action.type) {
    case SAVE_PENDING_CREATE_POST:
      const newId = action.post.media || '';
      return {
        ...state,
        pendingCreatePosts: {
          [newId]: {
            ...action.post,
            failed: false,
          },
        },
      };
    case SAVE_PENDING_UPDATE_POST:
      const newestId = action.post.media || '';
      return {
        ...state,
        pendingUpdatePosts: {
          [newestId]: {
            ...action.post,
            failed: false,
          },
        },
      };
    case DELETE_PENDING_CREATE_POST:
      return {
        ...state,
        pendingCreatePosts: Object.keys(state).reduce((acc, postId) => {
          if (action.id === postId) {
            return acc;
          }

          return { ...acc, [postId]: state.pendingCreatePosts[postId] };
        }, {}),
      };
    case DELETE_PENDING_UPDATE_POST:
      return {
        ...state,
        pendingUpdatePosts: Object.keys(state).reduce((acc, postId) => {
          if (action.id === postId) {
            return acc;
          }

          return { ...acc, [postId]: state.pendingUpdatePosts[postId] };
        }, {}),
      };
    case DELETE_PENDING_CREATE_POST:
      return {
        ...state,
        pendingCreatePosts: {
          ...state.pendingCreatePosts,
          [action.id]: { ...state.pendingCreatePosts[action.id], failed: true },
        },
      };
    case DELETE_PENDING_UPDATE_POST:
      return {
        ...state,
        pendingUpdatePosts: {
          ...state.pendingUpdatePosts,
          [action.id]: { ...state.pendingUpdatePosts[action.id], failed: true },
        },
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default communityPostsReducer;

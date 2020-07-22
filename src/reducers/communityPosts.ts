import {
  CreatePostInput,
  PostTypeEnum,
  UpdatePostInput,
} from '../../__generated__/globalTypes';
import {
  LOGOUT,
  SAVE_PENDING_POST,
  DELETE_PENDING_POST,
  PENDING_POST_FAILED,
  LogoutAction,
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
  nextId: number;
  pendingPosts: { [key: string]: PendingCreatePost | PendingUpdatePost };
}

export const initialState: CommunityPostsState = {
  nextId: 0,
  pendingPosts: {},
};

export interface SavePendingPostAction {
  type: typeof SAVE_PENDING_POST;
  post: CreatePostInput | UpdatePostInput;
  storageId: number;
}

export interface DeletePendingPostAction {
  type: typeof DELETE_PENDING_POST;
  storageId: number;
}

export interface PendingPostFailedAction {
  type: typeof PENDING_POST_FAILED;
  storageId: number;
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
      console.log('save');
      return {
        ...state,
        nextId: state.nextId + 1,
        pendingPosts: {
          [`${state.nextId}`]: {
            ...action.post,
            failed: false,
          },
        },
      };
    case DELETE_PENDING_POST:
      console.log('delete');
      return {
        ...state,
        pendingPosts: Object.keys(state).reduce((acc, postId) => {
          if (`${action.storageId}` === postId) {
            return acc;
          }

          return { ...acc, [postId]: state.pendingPosts[postId] };
        }, {}),
      };
    case PENDING_POST_FAILED:
      console.log('post failed');
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

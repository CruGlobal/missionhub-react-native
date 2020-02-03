import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import {
  DEFAULT_PAGE_LIMIT,
  RESET_CELEBRATE_EDITING_COMMENT,
  SET_CELEBRATE_EDITING_COMMENT,
} from '../constants';
import { celebrateCommentsSelector } from '../selectors/celebrateComments';
import { ACTIONS } from '../constants';
import { REQUESTS } from '../api/routes';
import { CelebrateCommentsState } from '../reducers/celebrateComments';

import callApi from './api';
import { trackActionWithoutData } from './analytics';

export function setCelebrateEditingComment(commentId: string) {
  return (dispatch: ThunkDispatch<{}, null, AnyAction>) => {
    dispatch(resetCelebrateEditingComment());
    dispatch({ type: SET_CELEBRATE_EDITING_COMMENT, commentId });
  };
}

export function resetCelebrateEditingComment() {
  return { type: RESET_CELEBRATE_EDITING_COMMENT };
}

export function getCelebrateCommentsNextPage(eventId: string, orgId: string) {
  return (
    dispatch: ThunkDispatch<{}, null, AnyAction>,
    getState: () => { celebrateComments: CelebrateCommentsState },
  ) => {
    const { pagination } = celebrateCommentsSelector(
      { celebrateComments: getState().celebrateComments },
      { eventId },
    );

    const { page, hasNextPage } = pagination
      ? pagination
      : { page: 0, hasNextPage: true };

    if (!hasNextPage) {
      return Promise.resolve();
    }

    return dispatch(
      getCelebrateComments(eventId, orgId, {
        limit: DEFAULT_PAGE_LIMIT,
        offset: DEFAULT_PAGE_LIMIT * page,
      }),
    );
  };
}

export function reloadCelebrateComments(eventId: string, orgId: string) {
  return (dispatch: ThunkDispatch<{}, null, AnyAction>) =>
    dispatch(getCelebrateComments(eventId, orgId));
}

function getCelebrateComments(
  eventId: string,
  orgId: string,
  page?: { limit: number; offset: number },
) {
  return (dispatch: ThunkDispatch<{}, null, AnyAction>) =>
    dispatch(
      callApi(REQUESTS.GET_CELEBRATE_COMMENTS, {
        orgId,
        eventId,
        page,
        include: 'organization_celebration_item,person',
      }),
    );
}

export function createCelebrateComment(
  eventId: string,
  orgId: string,
  content: string,
) {
  return async (dispatch: ThunkDispatch<{}, null, AnyAction>) => {
    const result = await dispatch(
      callApi(
        REQUESTS.CREATE_CELEBRATE_COMMENT,
        {
          orgId,
          eventId,
        },
        {
          data: {
            attributes: { content },
          },
        },
      ),
    );

    dispatch(trackActionWithoutData(ACTIONS.CELEBRATE_COMMENT_ADDED));
    return result;
  };
}

//eslint-disable-next-line max-params
export function updateCelebrateComment(
  eventId: string,
  orgId: string,
  commentId: string,
  content: string,
) {
  return async (dispatch: ThunkDispatch<{}, null, AnyAction>) => {
    const result = await dispatch(
      callApi(
        REQUESTS.UPDATE_CELEBRATE_COMMENT,
        {
          orgId,
          eventId,
          commentId,
        },
        { data: { attributes: { content } } },
      ),
    );

    dispatch(trackActionWithoutData(ACTIONS.CELEBRATE_COMMENT_EDITED));
    return result;
  };
}

export function deleteCelebrateComment(
  orgId: string,
  eventId: string,
  commentId: string,
) {
  return async (dispatch: ThunkDispatch<{}, null, AnyAction>) => {
    const result = await dispatch(
      callApi(REQUESTS.DELETE_CELEBRATE_COMMENT, {
        orgId,
        eventId,
        commentId,
      }),
    );

    dispatch(trackActionWithoutData(ACTIONS.CELEBRATE_COMMENT_DELETED));
    return result;
  };
}

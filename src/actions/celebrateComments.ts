import {
  DEFAULT_PAGE_LIMIT,
  RESET_CELEBRATE_EDITING_COMMENT,
  SET_CELEBRATE_EDITING_COMMENT,
} from '../constants';
import { celebrateCommentsSelector } from '../selectors/celebrateComments';
import { ACTIONS } from '../constants';
import { REQUESTS } from '../api/routes';

import callApi from './api';
import { trackActionWithoutData } from './analytics';

// @ts-ignore
export function setCelebrateEditingComment(commentId) {
  // @ts-ignore
  return dispatch => {
    dispatch(resetCelebrateEditingComment());
    dispatch({ type: SET_CELEBRATE_EDITING_COMMENT, commentId });
  };
}

export function resetCelebrateEditingComment() {
  return { type: RESET_CELEBRATE_EDITING_COMMENT };
}

// @ts-ignore
export function getCelebrateCommentsNextPage(event) {
  // @ts-ignore
  return (dispatch, getState) => {
    const { pagination } = celebrateCommentsSelector(
      { celebrateComments: getState().celebrateComments },
      { eventId: event.id },
    );

    const { page, hasNextPage } = pagination
      ? pagination
      : { page: 0, hasNextPage: true };

    if (!hasNextPage) {
      return Promise.resolve();
    }

    return dispatch(
      getCelebrateComments(event, {
        limit: DEFAULT_PAGE_LIMIT,
        offset: DEFAULT_PAGE_LIMIT * page,
      }),
    );
  };
}

// @ts-ignore
export function reloadCelebrateComments(event) {
  // @ts-ignore
  return dispatch => dispatch(getCelebrateComments(event));
}

// @ts-ignore
function getCelebrateComments(event, page) {
  // @ts-ignore
  return dispatch =>
    dispatch(
      callApi(REQUESTS.GET_CELEBRATE_COMMENTS, {
        orgId: event.organization.id,
        eventId: event.id,
        page,
        include: 'organization_celebration_item,person',
      }),
    );
}

// @ts-ignore
export function createCelebrateComment(event, content) {
  // @ts-ignore
  return async dispatch => {
    const result = await dispatch(
      callApi(
        REQUESTS.CREATE_CELEBRATE_COMMENT,
        {
          orgId: event.organization.id,
          eventId: event.id,
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

// @ts-ignore
export function updateCelebrateComment(item, content) {
  // @ts-ignore
  return async dispatch => {
    const result = await dispatch(
      callApi(
        REQUESTS.UPDATE_CELEBRATE_COMMENT,
        {
          orgId: item.organization_celebration_item.organization.id,
          eventId: item.organization_celebration_item.id,
          commentId: item.id,
        },
        { data: { attributes: { content } } },
      ),
    );

    dispatch(trackActionWithoutData(ACTIONS.CELEBRATE_COMMENT_EDITED));
    return result;
  };
}

// @ts-ignore
export function deleteCelebrateComment(orgId, event, item) {
  // @ts-ignore
  return async dispatch => {
    const result = await dispatch(
      callApi(REQUESTS.DELETE_CELEBRATE_COMMENT, {
        orgId,
        eventId: event.id,
        commentId: item.id,
      }),
    );

    dispatch(trackActionWithoutData(ACTIONS.CELEBRATE_COMMENT_DELETED));
    return result;
  };
}
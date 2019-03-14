import {
  DEFAULT_PAGE_LIMIT,
  RESET_CELEBRATE_EDITING_COMMENT,
  SET_CELEBRATE_EDITING_COMMENT,
} from '../constants';
import { celebrateCommentsSelector } from '../selectors/celebrateComments';
import { ACTIONS } from '../constants';

import callApi, { REQUESTS } from './api';
import { trackActionWithoutData } from './analytics';

export function setCelebrateEditingComment(commentId) {
  return dispatch => {
    dispatch(resetCelebrateEditingComment());
    dispatch({ type: SET_CELEBRATE_EDITING_COMMENT, commentId });
  };
}

export function resetCelebrateEditingComment() {
  return { type: RESET_CELEBRATE_EDITING_COMMENT };
}

export function getCelebrateCommentsNextPage(event) {
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

export function reloadCelebrateComments(event) {
  return dispatch => dispatch(getCelebrateComments(event));
}

function getCelebrateComments(event, page) {
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

export function createCelebrateComment(event, content) {
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

export function updateCelebrateComment(item, content) {
  return dispatch =>
    dispatch(
      callApi(
        REQUESTS.UPDATE_CELEBRATE_COMMENT,
        {
          orgId: item.organization_celebration_item.organization.id,
          eventId: item.organization_celebration_item.id,
          commentId: item.id,
        },
        {
          data: {
            attributes: { content },
          },
        },
      ),
    );
}

export function deleteCelebrateComment(event, item) {
  return dispatch =>
    dispatch(
      callApi(REQUESTS.DELETE_CELEBRATE_COMMENT, {
        orgId: event.organization.id,
        eventId: event.id,
        commentId: item.id,
      }),
    );
}

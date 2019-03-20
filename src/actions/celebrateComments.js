import {
  DEFAULT_PAGE_LIMIT,
  RESET_CELEBRATE_EDITING_COMMENT,
  SET_CELEBRATE_EDITING_COMMENT,
} from '../constants';
import { celebrateCommentsSelector } from '../selectors/celebrateComments';
import { ACTIONS } from '../constants';
import { formatApiDate } from '../utils/common';

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

export function deleteCelebrateComment(orgId, event, item) {
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

export function reportComment(orgId, item) {
  return async (dispatch, getState) => {
    const { id: myId } = getState().auth.person;
    const commentId = item.id;
    const result = await dispatch(
      callApi(
        REQUESTS.CREATE_REPORT_COMMENT,
        { orgId },
        {
          data: {
            attributes: {
              comment_id: commentId,
              person_id: myId,
            },
          },
        },
      ),
    );

    dispatch(trackActionWithoutData(ACTIONS.CELEBRATE_COMMENT_REPORTED));
    return result;
  };
}

export function ignoreReportComment(orgId, reportCommentId) {
  return dispatch =>
    dispatch(
      callApi(
        REQUESTS.UPDATE_REPORT_COMMENT,
        {
          orgId,
          reportCommentId,
        },
        {
          data: {
            attributes: { ignored_at: formatApiDate() },
          },
        },
      ),
    );
}

export function getReportedComments(orgId) {
  return dispatch =>
    dispatch(
      callApi(REQUESTS.GET_REPORTED_COMMENTS, {
        orgId,
        filters: { ignored: false },
        include: 'comment,comment.person,person',
      }),
    );
}

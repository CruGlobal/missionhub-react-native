import { DEFAULT_PAGE_LIMIT } from '../constants';
import { celebrateCommentsSelector } from '../selectors/celebrateComments';

import callApi, { REQUESTS } from './api';

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
      }),
    );
}

export function createCelebrateComment(event, content) {
  return dispatch =>
    dispatch(
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

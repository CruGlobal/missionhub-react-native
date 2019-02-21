import { DEFAULT_PAGE_LIMIT } from '../constants';
import { celebrateCommentsSelector } from '../selectors/celebrateComments';

import callApi, { REQUESTS } from './api';

export function getCelebrateComments(event) {
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
      callApi(REQUESTS.GET_CELEBRATE_COMMENTS, {
        orgId: event.organization.id,
        eventId: event.id,
        page: {
          limit: DEFAULT_PAGE_LIMIT,
          offset: DEFAULT_PAGE_LIMIT * page,
        },
      }),
    );
  };
}

//todo reuse
export function reloadCelebrateComments(event) {
  return dispatch =>
    dispatch(
      callApi(REQUESTS.GET_CELEBRATE_COMMENTS, {
        orgId: event.organization.id,
        eventId: event.id,
      }),
    );
}

import callApi, { REQUESTS } from './api';

export function getCelebrateComments(event) {
  return dispatch =>
    dispatch(
      callApi(REQUESTS.GET_CELEBRATE_COMMENTS, {
        orgId: event.organization_id,
        eventId: event.id,
      }),
    );
}

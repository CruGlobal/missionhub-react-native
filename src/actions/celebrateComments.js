import callApi, { REQUESTS } from './api';

//todo load event from redux here?
export function createCelebrateComment(event, content) {
  return dispatch =>
    dispatch(
      callApi(
        REQUESTS.CREATE_CELEBRATE_COMMENT,
        {
          orgId: event.organization_id,
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

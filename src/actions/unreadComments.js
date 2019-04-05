import callApi, { REQUESTS } from './api';

export function markCommentsRead(orgId) {
  return dispatch =>
    dispatch(
      callApi(REQUESTS.MARK_ORG_COMMENTS_AS_READ, {
        organization_id: orgId,
      }),
    );
}

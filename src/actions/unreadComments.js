import callApi, { REQUESTS } from './api';
import { getMe } from './person';

export function markCommentsRead(orgId) {
  return async dispatch => {
    await dispatch(
      callApi(REQUESTS.MARK_ORG_COMMENTS_AS_READ, {
        organization_id: orgId,
      }),
    );
    dispatch(getMe());
  };
}

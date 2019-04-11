import callApi, { REQUESTS } from './api';
import { getMe } from './person';

export function markCommentsRead(orgId) {
  return async dispatch => {
    await dispatch(
      callApi(REQUESTS.MARK_ORG_COMMENTS_AS_READ, {
        organization_id: orgId,
      }),
    );
    dispatch(checkForUnreadComments());
  };
}

export function checkForUnreadComments() {
  return dispatch => {
    const query = {
      include:
        'organizational_permissions,organizational_permissions.organization',
      'fields[person]': 'organizational_permissions,unread_comments_count',
      'fields[organizational_permissions]': 'organization',
      'fields[organization]': 'unread_comments_count',
    };

    dispatch(callApi(REQUESTS.GET_UNREAD_COMMENTS_NOTIFICATION, query));
  };
}

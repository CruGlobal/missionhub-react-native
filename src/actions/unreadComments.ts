import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { REQUESTS } from '../api/routes';

import callApi from './api';
import { getCelebrateFeed } from './celebration';

export function markCommentsRead(orgId: string) {
  return async (dispatch: ThunkDispatch<void, null, AnyAction>) => {
    await dispatch(
      callApi(REQUESTS.MARK_ORG_COMMENTS_AS_READ, {
        organization_id: orgId,
      }),
    );
    dispatch(refreshUnreadComments(orgId));
  };
}

export function markCommentRead(eventId: string, orgId: string) {
  return async (dispatch: ThunkDispatch<void, null, AnyAction>) => {
    await dispatch(
      callApi(REQUESTS.MARK_ORG_COMMENTS_AS_READ, {
        organization_celebration_item_id: eventId,
      }),
    );
    dispatch(refreshUnreadComments(orgId));
  };
}

function refreshUnreadComments(orgId: string) {
  return (dispatch: ThunkDispatch<void, null, AnyAction>) => {
    //refresh unread comments count in Redux
    dispatch(checkForUnreadComments());
    //refresh this org's celebrate feed, including the unread comments count
    getCelebrateFeed(orgId);
    //refresh this org's unread comments feed
    getCelebrateFeed(orgId, undefined, true);
  };
}

export function checkForUnreadComments() {
  return (dispatch: ThunkDispatch<void, null, AnyAction>) => {
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

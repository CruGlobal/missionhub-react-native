import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import gql from 'graphql-tag';

import { REQUESTS } from '../api/routes';
import { OrganizationsState } from '../reducers/organizations';
import { apolloClient } from '../apolloClient';

import callApi from './api';
import { getCelebrateFeed } from './celebration';
import { refreshCommunity } from './organizations';

const GET_UNREAD_COMMENTS_COUNT = gql`
  query getUnreadCommentsCount() {
    communities() {
      nodes {
        unreadCommentsCount
      }
    }
  }
`;

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
  return (
    dispatch: ThunkDispatch<
      { organizations: OrganizationsState },
      null,
      AnyAction
    >,
  ) => {
    //refresh unread comments count in Redux
    dispatch(refreshCommunity(orgId));
    //refresh this org's unread comments feed
    getCelebrateFeed(orgId, undefined, true);
  };
}

export function checkForUnreadComments() {
  apolloClient.query<getUnreadCommentsCount, getUnreadCommentsCountVariables>({
    query: GET_UNREAD_COMMENTS_COUNT,
  });
}

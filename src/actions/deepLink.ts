import dynamicLinks, {
  // eslint-disable-next-line import/named
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { isAuthenticated } from '../utils/common';
import {
  DEEP_LINK_JOIN_COMMUNITY_AUTHENTENTICATED_FLOW,
  DEEP_LINK_JOIN_COMMUNITY_UNAUTHENTENTICATED_FLOW,
} from '../routes/constants';
import { AuthState } from '../reducers/auth';

import { navigateReset } from './navigation';
import { startOnboarding } from './onboarding';

export const setupFirebaseDynamicLinks = () => (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
  getState: () => { auth: AuthState },
) => {
  dynamicLinks().onLink(onFirebaseLink(dispatch, getState));

  return dynamicLinks()
    .getInitialLink()
    .then(onFirebaseLink(dispatch, getState));
};

const joinCommunityUrlRegex = /^https:\/\/missionhub.com\/c\/([A-Za-z0-9-_]{16,})$/;

const onFirebaseLink = (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
  getState: () => { auth: AuthState },
) => (dynamicLink: FirebaseDynamicLinksTypes.DynamicLink | null) => {
  if (!dynamicLink) {
    return;
  }

  const { auth } = getState();
  const hasAuth = isAuthenticated(auth);

  handleJoinCommunityDeepLink(dispatch, dynamicLink.url, hasAuth);
};

const handleJoinCommunityDeepLink = (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
  url: string,
  hasAuth: boolean,
) => {
  const [, communityUrlCode] = joinCommunityUrlRegex.exec(url) || [];

  if (communityUrlCode) {
    if (hasAuth) {
      dispatch(
        navigateReset(DEEP_LINK_JOIN_COMMUNITY_AUTHENTENTICATED_FLOW, {
          communityUrlCode,
        }),
      );
    } else {
      dispatch(startOnboarding());
      dispatch(
        navigateReset(DEEP_LINK_JOIN_COMMUNITY_UNAUTHENTENTICATED_FLOW, {
          communityUrlCode,
        }),
      );
    }
  }
};

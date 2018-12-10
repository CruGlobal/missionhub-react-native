import firebase from 'react-native-firebase';

import { isAuthenticated } from '../utils/common';
import { DEEP_LINK_JOIN_COMMUNITY_AUTHENTENTICATED_FLOW } from '../routes/constants';

import { navigateReset } from './navigation';

export const setupFirebaseDynamicLinks = () => (dispatch, getState) => {
  firebase.links().onLink(onFirebaseLink(dispatch, getState));

  return firebase
    .links()
    .getInitialLink()
    .then(onFirebaseLink(dispatch, getState));
};

const joinCommunityUrlRegex = /^https:\/\/missionhub.com\/c\/([A-Za-z0-9-_]{16,})$/;

const onFirebaseLink = (dispatch, getState) => url => {
  if (!url) {
    return;
  }

  const { auth } = getState();
  const hasAuth = isAuthenticated(auth);

  handleJoinCommunityDeepLink(dispatch, url, hasAuth);
};

const handleJoinCommunityDeepLink = (dispatch, url, hasAuth) => {
  const [, communityUrlCode] = joinCommunityUrlRegex.exec(url) || [];

  if (communityUrlCode) {
    if (hasAuth) {
      dispatch(
        navigateReset(DEEP_LINK_JOIN_COMMUNITY_AUTHENTENTICATED_FLOW, {
          communityUrlCode,
        }),
      );
    } else {
      dispatch({ type: 'testJoinCommunityUrlNoAuthAction', communityUrlCode });
      // TODO: nav to unauthenticated join community flow  which consists of:
      // 1. nav to you were invited screen
      // 2. nav to sign in/register
      // 3. nav to name onboarding if needed (depends on previous step)
      // 4. join community
      // 5. nav to community
    }
  }
};

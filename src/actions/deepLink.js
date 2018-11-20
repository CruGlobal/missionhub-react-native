import firebase from 'react-native-firebase';

import { isAuthenticated } from '../utils/common';

export const setupFirebaseDynamicLinks = () => (dispatch, getState) => {
  firebase.links().onLink(onFirebaseLink(dispatch, getState));

  return firebase
    .links()
    .getInitialLink()
    .then(onFirebaseLink(dispatch, getState));
};

const joinCommunityUrlRegex = /^https:\/\/mhub.cc\/c\/([A-Za-z0-9-_]{16,})$/;

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
      dispatch({ type: 'testJoinCommunityUrlAuthAction', communityUrlCode });
      // TODO: nav to authenticated join community flow  which consists of:
      // 1. nav to you were invited screen
      // 2. join community
      // 3. nav to community
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

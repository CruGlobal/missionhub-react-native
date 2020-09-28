import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import {
  DEEP_LINK_JOIN_COMMUNITY_AUTHENTENTICATED_FLOW,
  DEEP_LINK_JOIN_COMMUNITY_UNAUTHENTENTICATED_FLOW,
} from '../routes/constants';
import { MAIN_TABS, COMMUNITIES_TAB } from '../constants';
import { LANDING_SCREEN } from '../containers/LandingScreen';
import { RootState } from '../reducers';
import { isAuthenticated } from '../auth/authStore';

import { navigateNestedReset } from './navigation';
import { startOnboarding } from './onboarding';

export const setupFirebaseDynamicLinks = () => (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
) => {
  dynamicLinks().onLink(onFirebaseLink(dispatch));

  return dynamicLinks()
    .getInitialLink()
    .then(onFirebaseLink(dispatch));
};

const joinCommunityUrlRegex = /^https:\/\/missionhub.com\/c\/([A-Za-z0-9-_]{16,})$/;

const onFirebaseLink = (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
) => (dynamicLink: FirebaseDynamicLinksTypes.DynamicLink | null) => {
  if (!dynamicLink) {
    return;
  }

  const hasAuth = isAuthenticated();

  handleJoinCommunityDeepLink(dispatch, dynamicLink.url, hasAuth);
};

const handleJoinCommunityDeepLink = (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
  url: string,
  hasAuth: boolean,
) => {
  const [, communityUrlCode] = joinCommunityUrlRegex.exec(url) || [];

  if (communityUrlCode) {
    if (hasAuth) {
      dispatch(
        navigateNestedReset([
          {
            routeName: MAIN_TABS,
            tabName: COMMUNITIES_TAB,
          },
          {
            routeName: DEEP_LINK_JOIN_COMMUNITY_AUTHENTENTICATED_FLOW,
            params: {
              communityUrlCode,
            },
          },
        ]),
      );
    } else {
      dispatch(startOnboarding());
      dispatch(
        navigateNestedReset([
          {
            routeName: LANDING_SCREEN,
          },
          {
            routeName: DEEP_LINK_JOIN_COMMUNITY_UNAUTHENTENTICATED_FLOW,
            params: {
              communityUrlCode,
            },
          },
        ]),
      );
    }
  }
};

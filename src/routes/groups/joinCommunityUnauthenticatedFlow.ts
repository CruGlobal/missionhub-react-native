import { createStackNavigator } from 'react-navigation-stack';

import { navigateNestedReset } from '../../actions/navigation';
import { COMMUNITIES_TAB, MAIN_TABS } from '../../constants';
import { JOIN_GROUP_SCREEN } from '../../containers/Groups/JoinGroupScreen';
import { authFlowGenerator } from '../auth/authFlowGenerator';
import { SIGNUP_TYPES } from '../../containers/Auth/SignUpScreen';

const JoinCommunityUnauthenticatedFlowScreens = authFlowGenerator({
  completeAction: navigateNestedReset([
    {
      routeName: MAIN_TABS,
      tabName: COMMUNITIES_TAB,
    },
    { routeName: JOIN_GROUP_SCREEN },
  ]),
  includeSignUp: true,
  // @ts-ignore
  signUpType: SIGNUP_TYPES.JOIN_COMMUNITY,
});

export const JoinCommunityUnauthenticatedFlowNavigator = createStackNavigator(
  JoinCommunityUnauthenticatedFlowScreens,
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);

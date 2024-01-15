import { createStackNavigator } from 'react-navigation-stack';
import { navigateNestedReset } from '../../actions/navigation';

import { COMMUNITIES_TAB, MAIN_TABS } from '../../constants';
import { authFlowGenerator } from '../auth/authFlowGenerator';
import { SIGNUP_TYPES } from '../../containers/Auth/SignUpScreen';
import { JOIN_BY_CODE_FLOW } from '../constants';

const JoinCommunityUnauthenticatedFlowScreens = authFlowGenerator({
  completeAction: navigateNestedReset([
    {
      routeName: MAIN_TABS,
      tabName: COMMUNITIES_TAB,
    },
    { routeName: JOIN_BY_CODE_FLOW },
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

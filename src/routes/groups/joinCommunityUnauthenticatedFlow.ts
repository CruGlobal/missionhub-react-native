import { createStackNavigator } from 'react-navigation-stack';
import { navigateNestedReset } from '../../actions/navigation';

import { MAIN_TABS, PEOPLE_TAB } from '../../constants';
import { authFlowGenerator } from '../auth/authFlowGenerator';
import { SIGNUP_TYPES } from '../../containers/Auth/SignUpScreen';

const JoinCommunityUnauthenticatedFlowScreens = authFlowGenerator({
  completeAction: navigateNestedReset([
    {
      routeName: MAIN_TABS,
      tabName: PEOPLE_TAB,
    },
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

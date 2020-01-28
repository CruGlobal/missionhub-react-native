import { createStackNavigator } from 'react-navigation-stack';

import { navigateNestedReset } from '../../actions/navigation';
import { MAIN_TABS } from '../../constants';
import { CREATE_GROUP_SCREEN } from '../../containers/Groups/CreateGroupScreen';
import { authFlowGenerator } from '../auth/authFlowGenerator';
import { SIGNUP_TYPES } from '../../containers/Auth/SignUpScreen';

export const CreateCommunityUnauthenticatedFlowScreens = authFlowGenerator({
  completeAction: navigateNestedReset([
    // @ts-ignore
    { routeName: MAIN_TABS },
    // @ts-ignore
    { routeName: CREATE_GROUP_SCREEN },
  ]),
  includeSignUp: true,
  // @ts-ignore
  signUpType: SIGNUP_TYPES.CREATE_COMMUNITY,
});

export const CreateCommunityUnauthenticatedFlowNavigator = createStackNavigator(
  CreateCommunityUnauthenticatedFlowScreens,
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);

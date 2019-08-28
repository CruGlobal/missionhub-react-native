import { createStackNavigator } from 'react-navigation';

import { navigateNestedReset } from '../../actions/navigation';
import { MAIN_TABS } from '../../constants';
import { CREATE_GROUP_SCREEN } from '../../containers/Groups/CreateGroupScreen';
import { authFlowGenerator } from '../auth/authFlowGenerator';
import { SIGNUP_TYPES } from '../../containers/Auth/SignUpScreen';

export const CreateCommunityUnauthenticatedFlowScreens = authFlowGenerator({
  completeAction: navigateNestedReset([
    { routeName: MAIN_TABS },
    { routeName: CREATE_GROUP_SCREEN },
  ]),
  includeSignUp: true,
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

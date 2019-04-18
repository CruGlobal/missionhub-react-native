import { createStackNavigator } from 'react-navigation';

import { navigateNestedReset } from '../../actions/navigation';
import { MAIN_TABS } from '../../constants';
import { CREATE_GROUP_SCREEN } from '../../containers/Groups/CreateGroupScreen';
import { authFlowGenerator } from '../auth/authFlowGenerator';

export const CreateCommunityUnauthenticatedFlowScreens = authFlowGenerator({
  completeAction: navigateNestedReset(MAIN_TABS, CREATE_GROUP_SCREEN),
  includeSignUp: true,
});

export const CreateCommunityUnauthenticatedFlowNavigator = createStackNavigator(
  CreateCommunityUnauthenticatedFlowScreens,
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);

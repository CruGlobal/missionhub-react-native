import { createStackNavigator } from 'react-navigation-stack';

import { navigatePush, navigateBack } from '../../actions/navigation';
import AddContactScreen, {
  ADD_CONTACT_SCREEN,
} from '../../containers/AddContactScreen';
import { buildTrackedScreen, wrapNextAction } from '../helpers';
import PersonCategoryScreen, {
  PERSON_CATEGORY_SCREEN,
} from '../../containers/PersonCategoryScreen';

export const EditPersonFlowScreens = {
  [ADD_CONTACT_SCREEN]: buildTrackedScreen(
    wrapNextAction(
      AddContactScreen,
      ({ personId, relationshipType, orgId, isMe }) => dispatch => {
        // If the person exist, navigate to the category screen. Skip if isMe since we don't need to set our own category.
        if (personId && !isMe) {
          dispatch(
            navigatePush(PERSON_CATEGORY_SCREEN, {
              personId,
              relationshipType,
              orgId,
            }),
          );
        } else {
          // User hit back button or isMe so just navigate back
          dispatch(navigateBack());
        }
      },
    ),
  ),
  [PERSON_CATEGORY_SCREEN]: buildTrackedScreen(
    wrapNextAction(PersonCategoryScreen, () => dispatch => {
      // We have to fire two navigateBack's since the screen we need to get to isn't a part of the created stack
      dispatch(navigateBack());
      dispatch(navigateBack());
    }),
  ),
};

export const EditPersonFlowNavigator = createStackNavigator(
  EditPersonFlowScreens,
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);

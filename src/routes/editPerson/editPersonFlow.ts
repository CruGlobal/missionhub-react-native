import { createStackNavigator } from 'react-navigation-stack';

import { navigatePush, navigateBack } from '../../actions/navigation';
import AddContactScreen, {
  ADD_CONTACT_SCREEN,
} from '../../containers/AddContactScreen';
import { buildTrackedScreen, wrapNextAction } from '../helpers';
import { buildTrackingObj } from '../../utils/common';
import PersonCategoryScreen, {
  PERSON_CATEGORY_SCREEN,
} from '../../containers/PersonCategoryScreen';

export const EditPersonFlowScreens = {
  [ADD_CONTACT_SCREEN]: buildTrackedScreen(
    wrapNextAction(AddContactScreen, ({ person, orgId, isMe }) => dispatch => {
      if (isMe) {
        dispatch(navigateBack());
      }
      dispatch(
        navigatePush(PERSON_CATEGORY_SCREEN, {
          person,
          orgId,
        }),
      );
    }),
  ),
  [PERSON_CATEGORY_SCREEN]: buildTrackedScreen(
    wrapNextAction(PersonCategoryScreen, () => dispatch => {
      dispatch(navigateBack());
      dispatch(navigateBack());
    }),
    // @ts-ignore
    buildTrackingObj(),
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

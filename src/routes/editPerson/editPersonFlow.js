import { createStackNavigator } from 'react-navigation';

import { navigateBack } from '../../actions/navigation';
import AddContactScreen, {
  ADD_CONTACT_SCREEN,
} from '../../containers/AddContactScreen';
import { buildTrackedScreen, wrapNextAction } from '../helpers';
import { buildTrackingObj } from '../../utils/common';

export const EditPersonFlowScreens = {
  [ADD_CONTACT_SCREEN]: buildTrackedScreen(
    wrapNextAction(AddContactScreen, () => dispatch => {
      dispatch(navigateBack());
    }),
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

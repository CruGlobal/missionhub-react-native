import { createStackNavigator, StackActions } from 'react-navigation';

import { wrapNextAction, wrapNextScreen } from '../helpers';
import { reloadJourney } from '../../actions/journey';
import SelectMyStepScreen, {
  SELECT_MY_STEP_SCREEN,
} from '../../containers/SelectMyStepScreen';
import CelebrationScreen, {
  CELEBRATION_SCREEN,
} from '../../containers/CelebrationScreen';

export const AddMyStepFlowScreens = onFlowComplete => ({
  [SELECT_MY_STEP_SCREEN]: wrapNextScreen(
    SelectMyStepScreen,
    CELEBRATION_SCREEN,
  ),
  [CELEBRATION_SCREEN]: wrapNextAction(
    CelebrationScreen,
    ({ contactId, orgId }) => dispatch => {
      dispatch(reloadJourney(contactId, orgId));
      dispatch(StackActions.popToTop());

      dispatch(StackActions.pop({ immediate: true }));
      onFlowComplete && dispatch(onFlowComplete());
    },
  ),
});

export const AddMyStepFlowNavigator = createStackNavigator(
  AddMyStepFlowScreens(),
  {
    navigationOptions: {
      header: null,
    },
  },
);

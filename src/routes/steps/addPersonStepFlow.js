import { createStackNavigator, StackActions } from 'react-navigation';

import { wrapNextAction, wrapNextScreen } from '../helpers';
import { reloadJourney } from '../../actions/journey';
import PersonSelectStepScreen, {
  PERSON_SELECT_STEP_SCREEN,
} from '../../containers/PersonSelectStepScreen';
import CelebrationScreen, {
  CELEBRATION_SCREEN,
} from '../../containers/CelebrationScreen';

export const AddPersonStepFlowScreens = onFlowComplete => ({
  [PERSON_SELECT_STEP_SCREEN]: wrapNextScreen(
    PersonSelectStepScreen,
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

export const AddPersonStepFlowNavigator = createStackNavigator(
  AddPersonStepFlowScreens(),
  {
    navigationOptions: {
      header: null,
    },
  },
);

import { createStackNavigator, StackActions } from 'react-navigation';

import { wrapNextAction, wrapNextScreen } from '../helpers';
import { reloadJourney } from '../../actions/journey';
import SelectMyStepScreen, {
  SELECT_MY_STEP_SCREEN,
} from '../../containers/SelectMyStepScreen';
import { CELEBRATION_SCREEN } from '../../containers/CelebrationScreen';
import { GifCompleteFlowScreens } from '../flowCompleted/gifCompleteFlow';

export const AddMyStepFlowScreens = {
  [SELECT_MY_STEP_SCREEN]: wrapNextScreen(
    SelectMyStepScreen,
    CELEBRATION_SCREEN,
  ),
  ...GifCompleteFlowScreens,
};

export const AddMyStepFlowNavigator = createStackNavigator(
  AddMyStepFlowScreens,
  {
    navigationOptions: {
      header: null,
    },
  },
);

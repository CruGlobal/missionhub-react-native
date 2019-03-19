import { createStackNavigator } from 'react-navigation';

import { wrapNextScreen } from '../helpers';
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

import { createStackNavigator } from 'react-navigation';

import { wrapNextScreen } from '../helpers';
import PersonSelectStepScreen, {
  PERSON_SELECT_STEP_SCREEN,
} from '../../containers/PersonSelectStepScreen';
import { CELEBRATION_SCREEN } from '../../containers/CelebrationScreen';
import { GifCompleteFlowScreens } from '../flowCompleted/gifCompleteFlow';

export const AddPersonStepFlowScreens = {
  [PERSON_SELECT_STEP_SCREEN]: wrapNextScreen(
    PersonSelectStepScreen,
    CELEBRATION_SCREEN,
  ),
  ...GifCompleteFlowScreens,
};

export const AddPersonStepFlowNavigator = createStackNavigator(
  AddPersonStepFlowScreens,
  {
    navigationOptions: {
      header: null,
    },
  },
);

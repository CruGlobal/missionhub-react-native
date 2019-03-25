import { createStackNavigator } from 'react-navigation';

import SelectMyStepScreen, {
  SELECT_MY_STEP_SCREEN,
} from '../../containers/SelectMyStepScreen';
import { GifCompleteFlowScreens } from '../flowCompleted/gifCompleteFlow';

import { selectStepFlowGenerator } from './helpers';

export const AddMyStepFlowScreens = {
  [SELECT_MY_STEP_SCREEN]: selectStepFlowGenerator(SelectMyStepScreen),
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

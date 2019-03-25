import { createStackNavigator } from 'react-navigation';

import SelectMyStepScreen, {
  SELECT_MY_STEP_SCREEN,
} from '../../containers/SelectMyStepScreen';

import { selectStepFlowGenerator } from './selectStepFlowGenerator';

export const AddMyStepFlowScreens = selectStepFlowGenerator(
  SELECT_MY_STEP_SCREEN,
  SelectMyStepScreen,
);

export const AddMyStepFlowNavigator = createStackNavigator(
  AddMyStepFlowScreens,
  {
    navigationOptions: {
      header: null,
    },
  },
);

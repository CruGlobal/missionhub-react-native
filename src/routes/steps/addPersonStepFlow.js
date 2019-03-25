import { createStackNavigator } from 'react-navigation';

import PersonSelectStepScreen, {
  PERSON_SELECT_STEP_SCREEN,
} from '../../containers/PersonSelectStepScreen';

import { selectStepFlowGenerator } from './selectStepFlowGenerator';

export const AddPersonStepFlowScreens = selectStepFlowGenerator(
  PERSON_SELECT_STEP_SCREEN,
  PersonSelectStepScreen,
);

export const AddPersonStepFlowNavigator = createStackNavigator(
  AddPersonStepFlowScreens,
  {
    navigationOptions: {
      header: null,
    },
  },
);

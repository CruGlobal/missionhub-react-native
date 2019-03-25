import { createStackNavigator } from 'react-navigation';

import PersonSelectStepScreen, {
  PERSON_SELECT_STEP_SCREEN,
} from '../../containers/PersonSelectStepScreen';
import { GifCompleteFlowScreens } from '../flowCompleted/gifCompleteFlow';

import { selectStepFlowGenerator } from './helpers';

export const AddPersonStepFlowScreens = {
  [PERSON_SELECT_STEP_SCREEN]: selectStepFlowGenerator(PersonSelectStepScreen),
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

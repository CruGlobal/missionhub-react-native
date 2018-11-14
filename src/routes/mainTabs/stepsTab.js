import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

import { buildTrackingObj } from '../../utils/common';
import StepsScreen, { STEPS_SCREEN } from '../../containers/StepsScreen';
import {
  CONTACT_PERSON_SCREEN,
  ME_PERSONAL_PERSON_SCREEN,
} from '../../containers/Groups/AssignedPersonScreen';
import { personScreens } from '../person/person';
import { CompleteStepFlowNavigator } from './flows/completeStepFlow';
import { COMPLETE_STEP_FLOW } from '../constants';

export const StepsTabScreens = {
  [STEPS_SCREEN]: {
    screen: StepsScreen,
    tracking: buildTrackingObj(['steps']),
  },
  // TODO: move personScreens into switch navigator and keep only the needed screens. Currently struggling to navigate to them with props if nested there
  ...personScreens,
  StepsScreenChildNavigators: createSwitchNavigator({
    [COMPLETE_STEP_FLOW]: CompleteStepFlowNavigator,
  }),
};

export const StepsTabNavigator = createStackNavigator(StepsTabScreens, {
  navigationOptions: {
    header: null,
  },
});

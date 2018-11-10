import { createStackNavigator } from 'react-navigation';

import { buildTrackingObj } from '../../utils/common';
import StepsScreen, { STEPS_SCREEN } from '../../containers/StepsScreen';
import {
  CONTACT_PERSON_SCREEN,
  ME_PERSONAL_PERSON_SCREEN,
} from '../../containers/Groups/AssignedPersonScreen';
import { personScreens } from '../person/person';

export const StepsTabScreens = {
  [STEPS_SCREEN]: {
    screen: StepsScreen,
    tracking: buildTrackingObj(['steps']),
  },
  [CONTACT_PERSON_SCREEN]: personScreens[CONTACT_PERSON_SCREEN],
  [ME_PERSONAL_PERSON_SCREEN]: personScreens[ME_PERSONAL_PERSON_SCREEN],
};

export const StepsTabNavigator = createStackNavigator(StepsTabScreens, {
  navigationOptions: {
    header: null,
  },
});

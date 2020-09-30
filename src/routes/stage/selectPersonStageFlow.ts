import { createStackNavigator } from 'react-navigation-stack';

import { wrapNextAction } from '../helpers';
import { navigatePush } from '../../actions/navigation';
import { getPersonDetails } from '../../actions/person';
import { reloadJourney } from '../../actions/journey';
import SelectStageScreen, {
  SelectStageScreenProps,
  SELECT_STAGE_SCREEN,
} from '../../containers/SelectStageScreen';
import { SELECT_STEP_SCREEN } from '../../containers/SelectStepScreen';
import { CELEBRATION_SCREEN } from '../../containers/CelebrationScreen';
import { AddPersonStepFlowScreens } from '../steps/addPersonStepFlow';

export const SelectPersonStageFlowScreens = {
  [SELECT_STAGE_SCREEN]: wrapNextAction(
    SelectStageScreen,
    ({
      personId,
      orgId,
      isAlreadySelected,
      skipSelectSteps,
    }: Parameters<SelectStageScreenProps['next']>[0]) => dispatch => {
      dispatch(getPersonDetails(personId));
      dispatch(reloadJourney(personId));

      dispatch(
        isAlreadySelected || skipSelectSteps
          ? navigatePush(CELEBRATION_SCREEN, { personId, orgId })
          : navigatePush(SELECT_STEP_SCREEN, {
              personId,
              orgId,
            }),
      );
    },
  ),
  ...AddPersonStepFlowScreens,
};

export const SelectPersonStageFlowNavigator = createStackNavigator(
  SelectPersonStageFlowScreens,
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);

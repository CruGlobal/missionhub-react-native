import { createStackNavigator } from 'react-navigation-stack';

import { wrapNextAction } from '../helpers';
import { navigatePush } from '../../actions/navigation';
import { updatePersonAttributes } from '../../actions/person';
import { reloadJourney } from '../../actions/journey';
import SelectStageScreen, {
  SELECT_STAGE_SCREEN,
} from '../../containers/SelectStageScreen';
import { SELECT_STEP_SCREEN } from '../../containers/SelectStepScreen';
import { CELEBRATION_SCREEN } from '../../containers/CelebrationScreen';
import { AddMyStepFlowScreens } from '../steps/addMyStepFlow';

export const SelectMyStageFlowScreens = {
  [SELECT_STAGE_SCREEN]: wrapNextAction(
    SelectStageScreen,
    ({ stage, personId, orgId, isAlreadySelected }) => dispatch => {
      dispatch(
        updatePersonAttributes(personId, {
          user: { pathway_stage_id: stage.id },
        }),
      );
      dispatch(reloadJourney(personId, orgId));

      dispatch(
        isAlreadySelected
          ? navigatePush(CELEBRATION_SCREEN, { personId, orgId })
          : navigatePush(SELECT_STEP_SCREEN, {
              personId: personId,
              organization: { id: orgId },
            }),
      );
    },
  ),
  ...AddMyStepFlowScreens,
};

export const SelectMyStageFlowNavigator = createStackNavigator(
  SelectMyStageFlowScreens,
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);

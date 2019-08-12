import { createStackNavigator } from 'react-navigation';

import { wrapNextAction } from '../helpers';
import { navigatePush } from '../../actions/navigation';
import { updatePersonAttributes } from '../../actions/person';
import { loadStepsAndJourney } from '../../actions/misc';
import SelectStageScreen, {
  SELECT_STAGE_SCREEN,
} from '../../containers/SelectStageScreen';
import { SELECT_MY_STEP_SCREEN } from '../../containers/SelectMyStepScreen';
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
      dispatch(loadStepsAndJourney(personId, orgId));

      dispatch(
        isAlreadySelected
          ? navigatePush(CELEBRATION_SCREEN, { contactId: personId, orgId })
          : navigatePush(SELECT_MY_STEP_SCREEN, {
              enableBackButton: true,
              contactStage: stage,
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

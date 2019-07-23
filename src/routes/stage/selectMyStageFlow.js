import { createStackNavigator } from 'react-navigation';

import { wrapNextAction } from '../helpers';
import { navigatePush } from '../../actions/navigation';
import { updatePersonAttributes } from '../../actions/person';
import { loadStepsAndJourney } from '../../actions/misc';
import SelectMyStageScreen, {
  SELECT_MY_STAGE_SCREEN,
} from '../../containers/SelectMyStageScreen';
import { SELECT_MY_STEP_SCREEN } from '../../containers/SelectMyStepScreen';
import { CELEBRATION_SCREEN } from '../../containers/CelebrationScreen';
import { AddMyStepFlowScreens } from '../steps/addMyStepFlow';

export const SelectMyStageFlowScreens = {
  [SELECT_MY_STAGE_SCREEN]: wrapNextAction(
    SelectMyStageScreen,
    ({ stage, contactId, orgId, isAlreadySelected }) => dispatch => {
      dispatch(
        updatePersonAttributes(contactId, {
          user: { pathway_stage_id: stage.id },
        }),
      );
      dispatch(loadStepsAndJourney(contactId, orgId));

      dispatch(
        isAlreadySelected
          ? navigatePush(CELEBRATION_SCREEN, { contactId, orgId })
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

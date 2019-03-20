import { createStackNavigator } from 'react-navigation';

import { wrapNextAction } from '../helpers';
import { navigatePush } from '../../actions/navigation';
import StageScreen, { STAGE_SCREEN } from '../../containers/StageScreen';
import { SELECT_MY_STEP_SCREEN } from '../../containers/SelectMyStepScreen';
import { CELEBRATION_SCREEN } from '../../containers/CelebrationScreen';
import { AddMyStepFlowScreens } from '../steps/addMyStepFlow';

export const SelectMyStageFlowScreens = {
  [STAGE_SCREEN]: wrapNextAction(
    StageScreen,
    ({ stage, contactId, orgId, isAlreadySelected }) => dispatch => {
      dispatch(
        isAlreadySelected
          ? navigatePush(CELEBRATION_SCREEN, { contactId, orgId })
          : navigatePush(SELECT_MY_STEP_SCREEN, {
              enableBackButton: true,
              contactId,
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
    navigationOptions: {
      header: null,
    },
  },
);

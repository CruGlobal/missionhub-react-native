import { createStackNavigator, StackActions } from 'react-navigation';

import { wrapNextAction, wrapNextScreen } from '../helpers';
import { navigatePush } from '../../actions/navigation';
import { reloadJourney } from '../../actions/journey';
import { loadStepsAndJourney } from '../../actions/misc';
import { updatePersonAttributes } from '../../actions/person';
import StageScreen, { STAGE_SCREEN } from '../../containers/StageScreen';
import SelectMyStepScreen, {
  SELECT_MY_STEP_SCREEN,
} from '../../containers/SelectMyStepScreen';
import CelebrationScreen, {
  CELEBRATION_SCREEN,
} from '../../containers/CelebrationScreen';

export const SelectMyStageFlowScreens = onFlowComplete => ({
  [STAGE_SCREEN]: wrapNextAction(
    StageScreen,
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
              contactId,
              contactStage: stage,
              organization: { id: orgId },
            }),
      );
    },
  ),
  [SELECT_MY_STEP_SCREEN]: wrapNextScreen(
    SelectMyStepScreen,
    CELEBRATION_SCREEN,
  ),
  [CELEBRATION_SCREEN]: wrapNextAction(
    CelebrationScreen,
    ({ contactId, orgId }) => dispatch => {
      dispatch(reloadJourney(contactId, orgId));
      dispatch(StackActions.popToTop());

      dispatch(StackActions.pop({ immediate: true }));
      onFlowComplete && dispatch(onFlowComplete());
    },
  ),
});

export const SelectMyStageFlowNavigator = createStackNavigator(
  SelectMyStageFlowScreens(),
  {
    navigationOptions: {
      header: null,
    },
  },
);
